"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, ChevronLeft, ChevronRight } from "lucide-react";
import { submitExam } from "@/app/actions/exam";
import { ExamResult } from "@/components/course/exam-result";
import { cn } from "@/lib/utils";

interface Question {
    question: string;
    options: string[];
    correctAnswer: number;
    difficulty: number;
    explanation: string;
}

interface ExamClientProps {
    examId: string;
    questions: Question[];
    courseId: string;
}

export function ExamClient({ examId, questions, courseId }: ExamClientProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answers, setAnswers] = useState<Map<number, number>>(new Map());
    const [timeLeft, setTimeLeft] = useState(45 * 60); // 45 minutes in seconds
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [result, setResult] = useState<any>(null);

    // Countdown timer
    useEffect(() => {
        if (timeLeft <= 0 || result) return;

        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    handleSubmit(); // Auto-submit when time runs out
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft, result]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const handleAnswer = (optionIndex: number) => {
        console.log("👉 Option clicked - Question:", currentIndex, "Option:", optionIndex);
        const newAnswers = new Map(answers);
        newAnswers.set(currentIndex, optionIndex);
        setAnswers(newAnswers);
        console.log("✅ Answer updated:", Array.from(newAnswers.entries()));
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);

        // Convert answers Map to Record<number, number>
        const answerRecord: Record<number, number> = {};
        answers.forEach((value, key) => {
            answerRecord[key] = value;
        });

        const response = await submitExam(examId, answerRecord);

        // Response contains: { score, grade, passed, totalQuestions, correctCount }
        setResult(response);

        setIsSubmitting(false);
    };

    // Show result screen after submission
    if (result) {
        return <ExamResult result={result} courseId={courseId} />;
    }

    const currentQuestion = questions[currentIndex];
    const answeredCount = answers.size;
    const isSelected = (optionIndex: number) => answers.get(currentIndex) === optionIndex;

    return (
        <div className="min-h-screen bg-background">
            {/* Sticky Timer Header */}
            <div className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                    <h1 className="text-xl font-bold">Final Exam</h1>
                    <Badge variant={timeLeft < 300 ? "destructive" : "default"} className="text-lg px-4 py-2">
                        <Clock className="h-4 w-4 mr-2" />
                        {formatTime(timeLeft)}
                    </Badge>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Question Navigation Sidebar (Desktop) */}
                    <div className="hidden lg:block">
                        <Card className="p-4 sticky top-24">
                            <h3 className="font-semibold mb-4">Questions</h3>
                            <div className="grid grid-cols-5 gap-2">
                                {questions.map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setCurrentIndex(index)}
                                        className={cn(
                                            "h-8 w-8 rounded-md text-sm font-medium transition-colors",
                                            currentIndex === index
                                                ? "ring-2 ring-primary border-primary bg-background"
                                                : answers.get(index) !== undefined
                                                    ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                                                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                                        )}
                                    >
                                        {index + 1}
                                    </button>
                                ))}
                            </div>

                            <div className="mt-6 space-y-2 text-sm text-muted-foreground">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full ring-2 ring-primary border-primary bg-background" />
                                    <span>Current</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-green-100 dark:bg-green-900/30" />
                                    <span>Answered</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-muted" />
                                    <span>Unanswered</span>
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* Main Question Area */}
                    <div className="lg:col-span-3 space-y-6">
                        <Card className="p-6">
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <Badge variant="outline">Question {currentIndex + 1} of {questions.length}</Badge>
                                    <Badge>Difficulty {currentQuestion.difficulty}</Badge>
                                </div>

                                <h2 className="text-2xl font-semibold">{currentQuestion.question}</h2>

                                <div className="space-y-3 mt-6">
                                    {currentQuestion.options.map((option, index) => (
                                        <div
                                            key={index}
                                            onClick={() => handleAnswer(index)}
                                            className={`
                                                relative flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all duration-200
                                                ${isSelected(index)
                                                    ? "border-blue-500 bg-blue-50/50 dark:bg-blue-900/20 shadow-sm"
                                                    : "border-border hover:border-blue-300 hover:bg-accent/50"
                                                }
                                            `}
                                        >
                                            {/* Circle Indicator */}
                                            <div className={`
                                                w-6 h-6 rounded-full border-2 mr-4 flex items-center justify-center flex-shrink-0 transition-colors
                                                ${isSelected(index) ? "border-blue-500 bg-blue-500 text-white" : "border-muted-foreground/30"}
                                            `}>
                                                {isSelected(index) && <div className="w-2 h-2 bg-white rounded-full" />}
                                            </div>

                                            {/* Option Text */}
                                            <span className={`text-base ${isSelected(index) ? "font-medium text-blue-700 dark:text-blue-300" : "text-foreground"}`}>
                                                {option}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </Card>

                        {/* Navigation Buttons */}
                        <div className="flex items-center justify-between">
                            <Button
                                variant="outline"
                                onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
                                disabled={currentIndex === 0}
                            >
                                <ChevronLeft className="h-4 w-4 mr-2" />
                                Previous
                            </Button>

                            {currentIndex === questions.length - 1 ? (
                                <Button
                                    onClick={handleSubmit}
                                    disabled={isSubmitting || answeredCount < questions.length}
                                    size="lg"
                                    className="bg-green-600 hover:bg-green-700"
                                >
                                    {isSubmitting ? "Submitting..." : "Submit Exam"}
                                </Button>
                            ) : (
                                <Button
                                    onClick={() => setCurrentIndex(prev => Math.min(questions.length - 1, prev + 1))}
                                >
                                    Next
                                    <ChevronRight className="h-4 w-4 ml-2" />
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
