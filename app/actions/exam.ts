'use server';

import { db } from "@/lib/db";
import { courseExams, materials, courses } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { auth } from "@/auth";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { redirect } from "next/navigation";

// ⚠️ SECURITY WARNING: THIS IS A TEMPORARY HARDCODE FOR MVP DEMO.
// DO NOT COMMIT THIS FILE TO PUBLIC REPO WITH THE KEY.
const EMERGENCY_API_KEY = "AIzaSyBnRZO--ZF71Fztk9W8EiDI2b4vGKqtwVQ";

// --- ROBUST PARSER HELPER ---
function cleanAndParseJSON(text: string) {
    try {
        const firstBrace = text.indexOf('{');
        const firstBracket = text.indexOf('[');
        let startIdx = -1;

        if (firstBrace !== -1 && (firstBracket === -1 || firstBrace < firstBracket)) startIdx = firstBrace;
        else if (firstBracket !== -1) startIdx = firstBracket;

        if (startIdx === -1) throw new Error("No JSON start found");

        let balance = 0;
        let insideString = false;
        let escaped = false;
        let endIdx = -1;
        const rootChar = text[startIdx];
        const endChar = rootChar === '{' ? '}' : ']';

        for (let i = startIdx; i < text.length; i++) {
            const char = text[i];
            if (insideString) {
                if (escaped) escaped = false;
                else if (char === '\\') escaped = true;
                else if (char === '"') insideString = false;
                continue;
            }
            if (char === '"') { insideString = true; continue; }
            if (char === rootChar) balance++;
            else if (char === endChar) {
                balance--;
                if (balance === 0) { endIdx = i; break; }
            }
        }

        if (endIdx === -1) throw new Error("No closing brace found");
        return JSON.parse(text.substring(startIdx, endIdx + 1));
    } catch (error) {
        console.error("JSON PARSE ERROR Raw Text:", text);
        throw error;
    }
}

export async function startFinalExam(courseId: string) {
    console.log("🚀 [StartFinalExam] Using EMERGENCY HARDCODED KEY");

    // 1. Auth Check
    const session = await auth();
    if (!session?.user?.id) redirect("/");

    // Direct initialization bypassing process.env
    const genAI = new GoogleGenerativeAI(EMERGENCY_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    console.log("✅ AI Model Initialized with hardcoded key.");

    // 4. Check for existing active exam
    const existingExam = await db.query.courseExams.findFirst({
        where: and(
            eq(courseExams.courseId, courseId),
            eq(courseExams.userId, session.user.id),
            eq(courseExams.status, "in_progress")
        )
    });

    if (existingExam) {
        return {
            id: existingExam.id,
            questions: existingExam.questions as any[]
        };
    }

    // 5. Fetch Course Context
    const course = await db.query.courses.findFirst({ where: eq(courses.id, courseId) });
    if (!course) throw new Error("Course not found");

    // 6. Generate Questions (Reduced to 5 for debugging)
    const prompt = `
    Create a Final Exam for the course.
    Context: "${courseId}" (Use DB context if available).
    
    TASK: Generate **30 multiple-choice questions**.
    
    DIFFICULTY MIX:
    - 10 Easy (Basic definitions)
    - 10 Medium (Conceptual understanding)
    - 10 Hard (Application/Scenarios)

    OUTPUT JSON:
    {
      "questions": [
        {
          "question": "Question text here",
          "options": ["A", "B", "C", "D"],
          "correctAnswer": 0,
          "explanation": "Why this answer is correct"
        }
      ]
    }
    
    CRITICAL Rules:
    1. Language: Detect from title (Russian/Kazakh/English).
    2. Output ONLY valid JSON array - NO markdown, NO code blocks.
    3. Generate exactly 30 questions.
  `;

    console.log("⏳ Sending prompt to Gemini...");

    try {
        const result = await model.generateContent(prompt);
        const rawText = result.response.text();

        console.log("📥 RAW AI RESPONSE:", rawText.substring(0, 200) + "..."); // Log first 200 chars

        // Safety check for empty response
        if (!rawText) throw new Error("AI returned empty response");

        const cleanedText = cleanJson(rawText);
        const questionsData = JSON.parse(cleanedText);

        console.log("✅ JSON Parsed Successfully. Questions count:", questionsData?.length);

        // 7. Save to DB
        const [newExam] = await db.insert(courseExams).values({
            userId: session.user.id,
            courseId: courseId,
            questions: questionsData,
            status: "in_progress",
            score: 0
        }).returning();

        console.log("💾 Exam saved to DB with ID:", newExam.id);
        return {
            id: newExam.id,
            questions: questionsData
        };
    } catch (error: any) {
        console.error("🔥 GENERATION OR PARSING FAILED:", error);
        console.error("Error stack:", error.stack);
        throw new Error(`AI Generation Failed: ${error.message}`);
    }
}

export async function submitExam(examId: string, userAnswers: Record<number, number>) {
    console.log("📝 [SubmitExam] Grading started for:", examId);

    try {
        // 1. Fetch the exam from DB
        const examRecord = await db.query.courseExams.findFirst({
            where: eq(courseExams.id, examId),
        });

        if (!examRecord) {
            throw new Error("Exam not found");
        }

        const questions = examRecord.questions as any[]; // JSON structure
        let correctCount = 0;

        // 2. Calculate Score
        questions.forEach((q: any, index: number) => {
            const userAnswer = userAnswers[index];

            // DEBUG LOG
            console.log(`Q${index}: User answer index: ${userAnswer}, Correct index: ${q.correctAnswer}`);

            // Compare answer indices directly
            if (userAnswer === q.correctAnswer) {
                correctCount++;
            }
        });

        const score = Math.round((correctCount / questions.length) * 100);
        const passed = score >= 50;

        let grade = "FAIL";
        if (score >= 90) grade = "MASTER";
        else if (score >= 50) grade = "PASS";

        console.log(`📊 Exam Result: ${score}% (${grade}) - ${correctCount}/${questions.length} correct`);

        // 3. Update DB (Save result)
        await db.update(courseExams)
            .set({
                score: score,
                status: passed ? 'completed' : 'failed',
                finishedAt: new Date()
            })
            .where(eq(courseExams.id, examId));

        // 4. Return to UI
        return {
            score,
            grade,
            passed,
            totalQuestions: questions.length,
            correctCount
        };

    } catch (error: any) {
        console.error("🔥 GRADING ERROR:", error);
        return {
            score: 0,
            grade: "ERROR",
            passed: false,
            totalQuestions: 0,
            correctCount: 0
        };
    }
}

// --- SIMPLE JSON CLEANER HELPER ---
function cleanJson(text: string): string {
    // Removes markdown code blocks like ```json ... ```
    return text.replace(/```json/g, "").replace(/```/g, "").trim();
}
