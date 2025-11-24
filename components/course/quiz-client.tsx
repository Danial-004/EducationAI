'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle, XCircle, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function QuizClient({ questions, courseId, lessonId }: any) {
    const [index, setIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [isAnswered, setIsAnswered] = useState(false);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [showResult, setShowResult] = useState(false);

    const currentQ = questions[index];

    const handleSelect = (optionIndex: number) => {
        if (isAnswered) return;
        setSelectedOption(optionIndex);
        setIsAnswered(true);

        if (optionIndex === currentQ.correctAnswer) {
            setScore(score + 1);
        }
    };

    const handleNext = () => {
        if (index + 1 < questions.length) {
            setIndex(index + 1);
            setIsAnswered(false);
            setSelectedOption(null);
        } else {
            setShowResult(true);
        }
    };

    // RESULT SCREEN
    if (showResult) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
                <h2 className="text-3xl font-bold">Quiz Completed!</h2>
                <div className="text-6xl font-black text-blue-600">{Math.round((score / questions.length) * 100)}%</div>
                <p className="text-muted-foreground">You got {score} out of {questions.length} correct.</p>
                <Link href={`/course/${courseId}`}>
                    <Button size="lg">Back to Course</Button>
                </Link>
            </div>
        );
    }

    // QUESTION SCREEN
    return (
        <div className="max-w-2xl mx-auto py-8 px-4">
            <div className="mb-6 flex justify-between items-center text-sm text-muted-foreground">
                <span>Question {index + 1} of {questions.length}</span>
                <span>Score: {score}</span>
            </div>

            <h2 className="text-2xl font-bold mb-6">{currentQ.text || currentQ.question}</h2>

            <div className="space-y-3">
                {currentQ.options.map((option: string, i: number) => {
                    let style = "border-2 border-muted hover:border-blue-400";
                    if (isAnswered) {
                        if (i === currentQ.correctAnswer) style = "border-green-500 bg-green-500/10";
                        else if (i === selectedOption) style = "border-red-500 bg-red-500/10";
                        else style = "border-muted opacity-50";
                    }

                    return (
                        <div
                            key={i}
                            onClick={() => handleSelect(i)}
                            className={`p-4 rounded-xl cursor-pointer transition-all ${style}`}
                        >
                            <div className="flex items-center justify-between">
                                <span>{option}</span>
                                {isAnswered && i === currentQ.correctAnswer && <CheckCircle className="text-green-600 h-5 w-5" />}
                                {isAnswered && i === selectedOption && i !== currentQ.correctAnswer && <XCircle className="text-red-600 h-5 w-5" />}
                            </div>
                        </div>
                    )
                })}
            </div>

            {isAnswered && (
                <div className="mt-6 animate-in fade-in slide-in-from-bottom-2">
                    <div className="bg-muted p-4 rounded-lg mb-4 text-sm">
                        <span className="font-bold">Explanation: </span>
                        {currentQ.explanation}
                    </div>
                    <Button onClick={handleNext} className="w-full" size="lg">
                        {index + 1 === questions.length ? "Finish Quiz" : "Next Question"} <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                </div>
            )}
        </div>
    );
}
