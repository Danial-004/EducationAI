"use client";

import { useEffect, useState } from "react";
import { QuizClient } from "./quiz-client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Loader2, PlayCircle } from "lucide-react";
import { generateQuiz } from "@/app/actions/generate-quiz";
import { useRouter } from "next/navigation";

interface Answer {
    id: string;
    text: string;
    isCorrect: boolean;
}

interface Question {
    id: string;
    question: string;
    answers: Answer[];
    difficulty: number;
    explanation?: string;
    type: string;
}

interface QuizStartClientProps {
    questions: Question[];
    courseId: string;
    moduleId: string;
}

export function QuizStartClient({ questions, courseId, moduleId }: QuizStartClientProps) {
    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [quizReady, setQuizReady] = useState(questions.length > 0);
    const router = useRouter();

    const handleStartQuiz = async () => {
        if (questions.length > 0) {
            setQuizReady(true);
            return;
        }

        // Generate quiz questions
        setIsGenerating(true);
        setError(null);

        try {
            const result = await generateQuiz(moduleId);

            if (result.success) {
                // Refresh the page to load the new questions
                router.refresh();
                setQuizReady(true);
            } else {
                setError(result.error || "Failed to generate quiz");
            }
        } catch (err: any) {
            setError(err.message || "An error occurred");
        } finally {
            setIsGenerating(false);
        }
    };

    // If questions exist or quiz is ready, show quiz
    if (quizReady && questions.length > 0) {
        return <QuizClient questions={questions} courseId={courseId} />;
    }

    // Show start screen
    return (
        <Card className="p-8 text-center">
            <div className="flex flex-col items-center gap-6">
                <div className="rounded-full bg-primary/10 p-6">
                    <PlayCircle className="h-12 w-12 text-primary" />
                </div>

                <div>
                    <h2 className="text-2xl font-bold mb-2">Ready to Test Your Knowledge?</h2>
                    <p className="text-muted-foreground">
                        {questions.length > 0
                            ? "Start the adaptive quiz and track your progress"
                            : "We'll generate personalized questions based on your lessons"}
                    </p>
                </div>

                {error && (
                    <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 w-full">
                        <p className="text-destructive font-medium">Error</p>
                        <p className="text-sm text-muted-foreground mt-1">{error}</p>
                    </div>
                )}

                <Button
                    size="lg"
                    onClick={handleStartQuiz}
                    disabled={isGenerating}
                    className="gap-2"
                >
                    {isGenerating ? (
                        <>
                            <Loader2 className="h-5 w-5 animate-spin" />
                            Generating unique questions...
                        </>
                    ) : (
                        <>
                            <PlayCircle className="h-5 w-5" />
                            Start Quiz
                        </>
                    )}
                </Button>
            </div>
        </Card>
    );
}
