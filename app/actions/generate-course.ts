'use server';

import { GoogleGenerativeAI } from "@google/generative-ai";
import { db } from "@/lib/db";
import { courses, modules, materials } from "@/lib/db/schema";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

const apiKey = process.env.GEMINI_API_KEY;

export async function generateCourse(topic: string, language: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");
  if (!apiKey) throw new Error("API Key not found");

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  console.log(`🤖 Creating course: "${topic}" in language: "${language}"`);

  const prompt = `
    ROLE: You are an expert Academic Course Architect.
    TASK: Create a comprehensive course outline for the topic: "${topic}".
    
    ⚠️ CRITICAL REQUIREMENT: 
    The ENTIRE Output MUST BE IN **${language}** language.
    
    Structure:
    - 4-6 Modules.
    - 2-4 Lessons per Module.

    OUTPUT JSON FORMAT ONLY:
    {
      "course": {
        "title": "Course Title",
        "description": "Description",
        "modules": [
          {
            "title": "Module 1 Title",
            "lessons": [
              { "title": "Lesson 1.1 Title" },
              { "title": "Lesson 1.2 Title" }
            ]
          }
        ]
      }
    }
  `;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text().replace(/```json|```/g, "").trim();
    const data = JSON.parse(text);
    const courseData = data.course;

    // 1. Курсты сақтау
    const [newCourse] = await db.insert(courses).values({
      userId: session.user.id,
      title: courseData.title,
      description: courseData.description,
      language: language,
    }).returning();

    // 2. Модульдер мен сабақтарды сақтау (ORDER ҚОСЫЛДЫ)
    // Біз for емес, map қолданамыз, себебі index (i) керек
    await Promise.all(courseData.modules.map(async (modData: any, index: number) => {

      const [newModule] = await db.insert(modules).values({
        courseId: newCourse.id,
        title: modData.title,
        order: index + 1, // 👈 ТҮЗЕТУ: Рет санын қостық (1, 2, 3...)
      }).returning();

      if (modData.lessons) {
        await Promise.all(modData.lessons.map(async (lesson: any, lessonIndex: number) => {
          await db.insert(materials).values({
            moduleId: newModule.id,
            title: lesson.title,
            type: "text",
            content: "",
            order: lessonIndex + 1, // 👈 ТҮЗЕТУ: Сабақтың рет саны
          });
        }));
      }
    }));

    revalidatePath("/dashboard");
    return { success: true, courseId: newCourse.id };

  } catch (error: any) {
    console.error("Course Generation Error:", error);
    return { success: false, error: error.message };
  }
}