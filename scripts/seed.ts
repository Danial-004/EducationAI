import { config } from "dotenv";

// CRITICAL: Load environment variables FIRST, before any static imports
config({ path: ".env.local" });

async function main() {
    console.log("🌱 Starting database seed...");

    // Dynamic imports - ensures dotenv runs BEFORE db connection initializes
    const { db } = await import("../lib/db");
    const schema = await import("../lib/db/schema");
    const { eq } = await import("drizzle-orm");

    if (!process.env.DATABASE_URL) {
        throw new Error("DATABASE_URL is not defined");
    }

    try {
        // 1. Clear existing data
        console.log("🗑️  Clearing existing data...");
        await db.delete(schema.userProgress);
        await db.delete(schema.answers);
        await db.delete(schema.questions);
        await db.delete(schema.materials);
        await db.delete(schema.modules);
        await db.delete(schema.courses);
        console.log("✅ Cleared existing data");

        // 2. Fetch Admin/Seed User
        console.log("👤 Fetching user...");
        const adminUser = await db.query.users.findFirst();
        if (!adminUser) {
            console.error("❌ ERROR: No user found in the database. Please register an account first via /auth.");
            process.exit(1);
        }
        const adminId = adminUser.id;
        console.log(`✅ Found user: ${adminUser.name || adminUser.email}`);

        // 3. Create Course
        console.log("📚 Creating course...");
        const [course] = await db
            .insert(schema.courses)
            .values({
                userId: adminId, // CRITICAL FIX: Adding required userId
                title: "Introduction to Python AI",
                description: "Master Python basics and learn how to build AI applications with Gemini integration.",
                published: true,
            })
            .returning();
        console.log(`✅ Created course: ${course.title}`);

        // 4. Create Modules
        console.log("📖 Creating modules...");
        const [module1] = await db
            .insert(schema.modules)
            .values({
                courseId: course.id,
                title: "Python Basics",
                order: 1,
            })
            .returning();

        const [module2] = await db
            .insert(schema.modules)
            .values({
                courseId: course.id,
                title: "Advanced Concepts",
                order: 2,
            })
            .returning();
        console.log(`✅ Created modules: ${module1.title}, ${module2.title}`);

        // 5. Create Materials
        // 5. Create Materials
        console.log("📝 Creating materials...");
        await db.insert(schema.materials).values([
            {
                moduleId: module1.id,
                type: "text",
                title: "Introduction to Python", // ҚОСЫЛДЫ
                order: 1,                       // ҚОСЫЛДЫ
                content: "# Welcome to Python\n\nPython is a high-level, interpreted programming language known for its simplicity and readability.",
            },
            {
                moduleId: module1.id,
                type: "video",
                title: "Python Tutorial Video",  // ҚОСЫЛДЫ
                order: 2,                       // ҚОСЫЛДЫ
                content: "https://www.youtube.com/embed/_uQrJ0TkZlc",
            },
            {
                moduleId: module2.id,
                type: "text",
                title: "Advanced AI Concepts",  // ҚОСЫЛДЫ
                order: 1,                       // ҚОСЫЛДЫ
                content: "# Advanced AI\n\nNow we will learn about Neural Networks and LLMs.",
            },
        ]);
        console.log("✅ Created materials");

        // 6. Create Questions
        // 6. Create Questions
        console.log("❓ Creating questions...");
        const [q1] = await db
            .insert(schema.questions)
            .values([ // Мұнда массив жақшасы [ қосылуы керек
                {
                    moduleId: module1.id,
                    question: "What is Python primarily known for?",
                    difficulty: 1,
                    type: "multiple-choice", // "choice" дегенді "multiple-choice"-қа ауыстырдық
                    order: 1, // Егер схемада міндетті болса, мұны да қосыңыз
                }
            ])
            .returning();

        await db.insert(schema.answers).values([
            { questionId: q1.id, text: "Readability and Si  mplicity", isCorrect: true },
            { questionId: q1.id, text: "Complex Syntax", isCorrect: false },
            { questionId: q1.id, text: "Manual Memory Management", isCorrect: false },
        ]);
        console.log("✅ Created questions and answers");

        console.log("\n🎉 Database seeding completed successfully!");
    } catch (error) {
        console.error("❌ Error seeding database:", error);
        process.exit(1);
    } finally {
        process.exit(0);
    }
}

main();