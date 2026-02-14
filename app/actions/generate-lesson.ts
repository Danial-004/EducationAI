"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";
import { db } from "@/lib/db";
import { materials } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function generateLessonContent(materialId: string) {
    try {
        // 1. Сабақты табамыз
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

        if (!lesson) throw new Error("Lesson not found");

        // 🔥 ҚАТАҢ ТЕКСЕРУ: 
        // Егер базада 50 әріптен көп мәтін болса -> СОНЫ ҚАЙТАРАМЫЗ.
        // AI-ға запрос жібермейміз. Ешқандай қайталану болмайды.
        if (lesson.content && lesson.content.length > 50) {
            return { success: true, content: lesson.content };
        }

        // Тек база БОС болғанда ғана төменге түсеміз
        const apiKey = process.env.GEMINI_API_KEY;
        const genAI = new GoogleGenerativeAI(apiKey!);
        const model = genAI.getGenerativeModel({ model: "gemini-3.0-flash" });

        const targetLanguage = lesson.module.course.language || "Russian";

        const prompt = `
            You are an expert tutor.
            Topic: "${lesson.title}"
            Context: Module "${lesson.module.title}" of the course "${lesson.module.course.title}".

            ⚠️ STRICT REQUIREMENT: Write the ENTIRE lesson content in **${targetLanguage}** language only.
            
            Structure:
            # ${lesson.title}
            1. Introduction / Terminology
            2. Core Theory
            3. Examples
            4. Summary
            
            

            Format: Markdown. 
            Length: 600-800 words.
        `;

        const result = await model.generateContent(prompt);
        const generatedContent = result.response.text();

        // Базаға ЖАҢАРТЫП жазамыз (Append емес, Replace)
        await db
            .update(materials)
            .set({ content: generatedContent })
            .where(eq(materials.id, materialId));

        return { success: true, content: generatedContent };

    } catch (error: any) {
        console.error("Error:", error);
        return { success: false, error: error.message };
    }
}