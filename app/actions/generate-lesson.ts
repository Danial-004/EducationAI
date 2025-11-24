"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";
import { db } from "@/lib/db";
import { materials } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

/**
 * Generate lesson content on-demand when user opens an empty lesson
 */
export async function generateLessonContent(materialId: string) {
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

        // 2. Check if content already exists (avoid regeneration)
        if (lesson.content && lesson.content.length > 50) {
            console.log("Content already exists, returning cached version");
            return { success: true, content: lesson.content };
        }

        // 3. Detect language from course/module title
        const courseTitle = lesson.module.course.title;
        const moduleTitle = lesson.module.title;

        // Simple language detection based on Cyrillic characters
        const hasCyrillic = /[а-яА-ЯёЁ]/.test(courseTitle);
        const hasKazakh = /[ӘәІіҢңҒғҮүҰұҚқӨө]/.test(courseTitle);
        const language = hasKazakh ? 'Kazakh' : (hasCyrillic ? 'Russian' : 'English');

        if (!process.env.GEMINI_API_KEY) {
            throw new Error("Missing GEMINI_API_KEY");
        }

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        // 4. Generate content with Gemini - ENFORCED ACADEMIC STRUCTURE
        const lessonTopic = lesson.title || moduleTitle; // Use lesson title if available

        const prompt = `
You are an expert academic tutor. Create a comprehensive lesson content for the topic: "${lessonTopic}".
Context: This is part of a course on "${courseTitle}".

STRICT REQUIREMENTS:
1. Language: **STRICTLY output in ${language}**. (If ${language} is Kazakh, use Cyrillic Kazakh).
2. Format: Clean Markdown.
3. Length: Detailed (approx. 800 words).
4. Tone: Professional, engaging.

MANDATORY STRUCTURE (Translate these headers to ${language}):
# ${lessonTopic}

## 1. [Terminology]
- Define 3-5 key terms.

## 2. [Theory & Concepts]
- Deep dive into the topic.

## 3. [Practical Examples]
- Real-world cases or code snippets.

## 4. [Common Mistakes]
- What beginners get wrong.

## 5. [Summary]
- Brief conclusion.

DO NOT wrap in \`\`\`markdown. Return raw text.
`;

        console.log(`Generating lesson content for: ${moduleTitle}`);
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
