"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";
import { db } from "@/lib/db";
import { materials } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

/**
 * Generate lesson content on-demand
 * userLanguage параметрі қосылды (таңдалған тіл)
 */
export async function generateLessonContent(materialId: string, userLanguage?: string) {
    try {
        // 1. Fetch lesson info from database
        const lesson = await db.query.materials.findFirst({
            where: eq(materials.id, materialId),
            with: {
                module: {
                    with: {
                        course: true,
                    },
                },
            },
        });

        if (!lesson) {
            throw new Error("Lesson not found");
        }

        // 2. Check if content already exists
        // Ескерту: Егер қолданушы "Generate" батырмасын басса, демек ол жаңасын жасағысы келеді.
        // Бірақ әзірге "егер бос болса ғана жаса" деген логиканы қалдырамыз.
        if (lesson.content && lesson.content.length > 50) {
            console.log("Content already exists, returning cached version");
            return { success: true, content: lesson.content };
        }

        // 3. Language Logic (Ең маңызды жері осы)
        let language = userLanguage;

        // Егер клиент жақтан тіл таңдалмаса, ескі логика бойынша автоматты анықтаймыз
        if (!language) {
            const courseTitle = lesson.module.course.title;
            const hasKazakh = /[ӘәІіҢңҒғҮүҰұҚқӨө]/.test(courseTitle);
            const hasCyrillic = /[а-яА-ЯёЁ]/.test(courseTitle);
            language = hasKazakh ? 'Kazakh' : (hasCyrillic ? 'Russian' : 'English');
        }

        if (!process.env.GEMINI_API_KEY) {
            throw new Error("Missing GEMINI_API_KEY");
        }

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        // Ескерту: "gemini-2.5-flash" әлі шықпаған болуы мүмкін, қазіргі стандарт "gemini-1.5-flash"
        const model = genAI.getGenerativeModel({ model: "gemini-3.0-pro" });

        // 4. Generate content with Gemini - ENFORCED ACADEMIC STRUCTURE
        const moduleTitle = lesson.module.title;
        const lessonTopic = lesson.title || moduleTitle;
        const courseTitle = lesson.module.course.title;

        // Сенің дайын күшті промптың, тек тіл (language) айнымалысы дұрыс келеді
        const prompt = `
You are an expert academic tutor. Create a comprehensive lesson content for the topic: "${lessonTopic}".
Context: This is part of a course on "${courseTitle}".

STRICT REQUIREMENTS:
1. Language: **STRICTLY output in ${language}**. (If ${language} is Kazakh, use Cyrillic Kazakh).
2. Format: Clean Markdown.
3. Length: Detailed (approx. 600-800 words).
4. Tone: Professional, engaging, educational.

MANDATORY STRUCTURE (Translate these headers to ${language}):
# ${lessonTopic}

## 1. [Terminology]
- Define 3-5 key terms relevant to the topic.

## 2. [Theory & Concepts]
- Deep dive into the topic. Explain the "Why" and "How".

## 3. [Practical Examples]
- Real-world cases or code snippets (if technical).

## 4. [Common Mistakes]
- What beginners typically get wrong about this.

## 5. [Summary]
- Brief conclusion and key takeaways.

DO NOT wrap in \`\`\`markdown. Return raw text.
`;

        console.log(`Generating lesson content for: ${lessonTopic} in ${language}`);

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const generatedContent = response.text();

        // 5. Save to database
        await db
            .update(materials)
            .set({ content: generatedContent })
            .where(eq(materials.id, materialId));

        console.log("Lesson content generated and saved successfully");
        return { success: true, content: generatedContent };

    } catch (error: any) {
        console.error("Error generating lesson content:", error);
        return {
            success: false,
            error: error.message || "Failed to generate lesson content"
        };
    }
}