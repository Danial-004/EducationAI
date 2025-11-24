import { auth } from "@/auth";
import { db } from "@/lib/db";
import { courses, modules } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { redirect, notFound } from "next/navigation";
import { QuizStartClient } from "./quiz-start-client";

interface PageProps {
    params: Promise<{ courseId: string }>;
}

export default async function QuizPage({ params }: PageProps) {
    const session = await auth();
    if (!session) {
        redirect("/api/auth/signin");
    }

    const { courseId } = await params;

    const course = await db.query.courses.findFirst({
        where: eq(courses.id, courseId),
        with: {
            modules: {
                with: {
                    questions: {
                        with: {
                            answers: true,
                        },
                    },
                },
            },
        },
    });

    if (!course) {
        notFound();
    }

    // Get first module ID for quiz generation
    const firstModule = course.modules[0];
    const moduleId = firstModule?.id || "";

    // Flatten questions from all modules
    const allQuestions = course.modules.flatMap((m) => m.questions);

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <div className="mb-8 text-center">
                <h1 className="text-3xl font-bold mb-2">{course.title}</h1>
                <p className="text-zinc-500">Course Quiz</p>
            </div>

            <QuizStartClient
                questions={allQuestions}
                courseId={courseId}
                moduleId={moduleId}
            />
        </div>
    );
}
