'use server';

import { GoogleGenerativeAI } from "@google/generative-ai";
import { db } from "@/lib/db";
import { courses, modules, materials } from "@/lib/db/schema";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

// ==========================================
// 🔐 CONFIGURATION
// ==========================================
const EMERGENCY_API_KEY = "AIzaSyBnRZO--ZF71Fztk9W8EiDI2b4vGKqtwVQ"; // Твой ключ

// === 🟧 PHASE 2.1: GLOBAL AI POLICY ===
const SYSTEM_POLICY = `
ROLE: You are SmartTutor AI, a strict Academic Course Architect.
GOAL: Create a comprehensive, university-grade curriculum.
POLICY:
1. NO "lazy" generation. Courses must be deep and detailed.
2. Structure must be logical (Chronological for History, Progressive for Coding).
3. Titles must be professional and descriptive.
`;

function cleanJson(text: string) {
  return text.replace(/```json/g, "").replace(/```/g, "").trim();
}

export async function generateCourse(topic: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const genAI = new GoogleGenerativeAI(EMERGENCY_API_KEY);
  // 🔥 UPDATED TO GEMINI 2.5 FLASH AS REQUESTED
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  console.log(`🤖 [SmartArchitect 2.5] Analyzing topic: ${topic}`);

  // 1. Language Detection (Object wrap for Cyrillic safety)
  const langPrompt = `Detect language: "${topic}". Return code ONLY (ru, en, kk).`;
  const langRes = await model.generateContent([{ text: langPrompt }]);
  const detectedLang = langRes.response.text().trim().toLowerCase().slice(0, 2);

  const languageMap: Record<string, string> = {
    'en': 'English', 'ru': 'Russian', 'kk': 'Kazakh', 'kz': 'Kazakh'
  };
  const targetLang = languageMap[detectedLang] || 'English';

  // 2. ARCHITECT PROMPT (DETAILED & STRICT)
  const prompt = `
    ${SYSTEM_POLICY}
    
    TASK: Create a full course structure for: "${topic}".
    LANGUAGE: ${targetLang}.

    🛑 HARD CONSTRAINTS (Follow or Fail):
    1. **Modules**: Generate between **4 and 8 Modules**. (Less than 4 is forbidden).
    2. **Lessons**: Generate **3 to 5 Lessons** per Module.
    3. **Flow**: Intro -> Core Concepts -> Deep Dive -> Advanced Cases -> Conclusion.

    OUTPUT JSON FORMAT ONLY:
    {
      "course": {
        "title": "Academic Title of the Course",
        "description": "2-3 sentences summary (max 30 words).",
        "modules": [
          {
            "title": "Module 1: [Name]",
            "lessons": [
              { "title": "1.1 [Lesson Name]" },
              { "title": "1.2 [Lesson Name]" },
              { "title": "1.3 [Lesson Name]" }
            ]
          }
        ]
      }
    }
  `;

  try {
    const result = await model.generateContent([{ text: prompt }]);
    const rawText = result.response.text();
    console.log(`📥 AI Architect Response (${rawText.length} chars)`);

    const cleanedText = cleanJson(rawText);
    const data = JSON.parse(cleanedText);
    const courseData = data.course;

    // VALIDATION: Fail if AI was lazy
    if (courseData.modules.length < 3) {
      throw new Error("AI generated a lazy course (less than 3 modules). Quality Control Failed.");
    }

    // 3. Save Course
    const [newCourse] = await db.insert(courses).values({
      userId: session.user.id,
      title: courseData.title,
      description: courseData.description,
      // category: "AI Generated", // Field does not exist in schema
      // level: "Adaptive" // Field does not exist in schema
    }).returning();

    // 4. Save Modules & Lessons
    for (let i = 0; i < courseData.modules.length; i++) {
      const modData = courseData.modules[i];

      const [newModule] = await db.insert(modules).values({
        courseId: newCourse.id,
        title: modData.title,
        order: i + 1
      }).returning();

      if (modData.lessons) {
        for (let j = 0; j < modData.lessons.length; j++) {
          await db.insert(materials).values({
            moduleId: newModule.id,
            title: modData.lessons[j].title,
            order: j + 1,
            content: "",     // Lazy Generation
            type: "text",
            // Removed 'order' column reference if it wasn't added, 
            // BUT user confirmed adding it. Assuming schema has 'order'.
            // If schema wasn't updated, this will fail. 
            // ENSURE schema.ts HAS 'order' IN materials TABLE.
          });
        }
      }
    }

    console.log(`✅ Course Created: ${newCourse.id} | Modules: ${courseData.modules.length}`);
    revalidatePath("/dashboard");
    return { success: true, courseId: newCourse.id };

  } catch (error: any) {
    console.error("🔥 ARCHITECT FAILED:", error);
    throw new Error("Failed to generate course. " + error.message);
  }
}
