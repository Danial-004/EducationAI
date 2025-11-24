import { startFinalExam } from "@/app/actions/exam";
import { ExamClient } from "./exam-client";
import { redirect } from "next/navigation";
import { auth } from "@/auth";

// 1. Update the Props Interface to use Promise
interface PageProps {
    params: Promise<{ courseId: string }>;
}

export default async function ExamPage(props: PageProps) {
    // 2. Await the params before accessing properties
    const params = await props.params;
    const { courseId } = params;

    const session = await auth();
    if (!session?.user) return redirect("/");

    console.log("🔵 [ExamPage] Requesting exam for course:", courseId);

    try {
        // 3. Pass the unwrapped courseId
        const examData = await startFinalExam(courseId);

        if (!examData || !examData.questions) {
            console.error("🔴 [ExamPage] Invalid Data:", examData);
            return (
                <div className="p-10 text-center text-red-500">
                    Error: Exam data could not be generated.
                </div>
            );
        }

        return (
            <ExamClient
                examId={examData.id}
                questions={examData.questions}
                courseId={courseId}
            />
        );

    } catch (error: any) {
        console.error("🔥 [ExamPage] CRASH:", error);
        return (
            <div className="p-10 text-center">
                <h1 className="text-xl font-bold">Error Loading Exam</h1>
                <p>{error.message}</p>
            </div>
        );
    }
}
