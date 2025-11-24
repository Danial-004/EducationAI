import { generateQuiz } from "@/app/actions/generate-quiz";
import { QuizClient } from "@/components/course/quiz-client";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

interface PageProps {
    params: Promise<{ courseId: string; lessonId: string }>;
}

export default async function QuizPage(props: PageProps) {
    const session = await auth();
    if (!session) return redirect("/");

    const params = await props.params;
    const { courseId, lessonId } = params;

    console.log(`🧠 Generating Quiz for lesson: ${lessonId}`);

    // Call the AI generator
    const quizResult = await generateQuiz(lessonId, courseId);

    if (!quizResult || !quizResult.success || !quizResult.questions) {
        return <div>Error loading quiz. Please try again.</div>;
    }

    return (
        <QuizClient
            questions={quizResult.questions}
            courseId={courseId}
            lessonId={lessonId}
        />
    );
}
