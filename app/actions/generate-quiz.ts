'use server';

import { GoogleGenerativeAI } from "@google/generative-ai";
import { db } from "@/lib/db";
import { materials } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

// 🔐 CONFIGURATION
const EMERGENCY_API_KEY = "AIzaSyBnRZO--ZF71Fztk9W8EiDI2b4vGKqtwVQ";

function cleanJson(text: string) {
    return text.replace(/```json/g, "").replace(/```/g, "").trim();
}

export async function generateQuiz(lessonId: string, courseId: string) {
    // 1. Setup AI
    if (!EMERGENCY_API_KEY) throw new Error("API Key missing");
    const genAI = new GoogleGenerativeAI(EMERGENCY_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    console.log(`🧠 Generating Quiz for Lesson ID: ${lessonId}`);

    try {
        // 2. Fetch Lesson Content (Material)
        // We need the text content to generate questions about it
        const lesson = await db.query.materials.findFirst({
            where: eq(materials.id, lessonId),
        });

        if (!lesson) {
            throw new Error("Lesson not found in database");
        }

        const contentContext = lesson.content
            ? lesson.content.slice(0, 5000)
            : `Title: ${lesson.title} (Content generation pending)`;

        // 3. Generate Questions
        const prompt = `
      You are a strict Quiz Generator.
      Based **ONLY** on the following lesson text, generate a 5-question multiple-choice quiz.
      
      LESSON TEXT:
      """
      ${contentContext}
      """

      DIFFICULTY MIX:
      - 2 Easy (Facts)
      - 2 Medium (Concepts)
      - 1 Hard (Application)

      OUTPUT JSON ONLY:
      {
        "questions": [
          {
            "text": "Question string",
            "options": ["Option A", "Option B", "Option C", "Option D"],
            "correctAnswer": 0,
            "explanation": "Why this is correct"
          }
        ]
      }
    `;

        const result = await model.generateContent([{ text: prompt }]);
        const rawText = result.response.text();
        const cleanedText = cleanJson(rawText);
        const quizData = JSON.parse(cleanedText);

        console.log(`✅ Quiz Generated: ${quizData.questions.length} questions`);

        // Return data to Frontend (Client Component will handle state)
        return {
            success: true,
            questions: quizData.questions
        };

    } catch (error: any) {
        console.error("🔥 QUIZ GENERATION FAILED:", error);
        // Return fallback error structure to prevent UI crash
        return { success: false, questions: null };
    }
}
