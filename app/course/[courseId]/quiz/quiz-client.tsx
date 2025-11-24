"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle, XCircle, ArrowRight, RotateCcw, TrendingUp, TrendingDown, Zap, Clock } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useOnlineStatus } from "@/hooks/use-online-status";
import { submitAnswer } from "@/app/actions/submit-answer";

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

interface QuizClientProps {
    questions: Question[];
    courseId: string;
}

interface AnsweredQuestion {
    questionId: string;
    difficulty: number;
    isCorrect: boolean;
}

export function QuizClient({ questions, courseId }: QuizClientProps) {
    const [currentDifficulty, setCurrentDifficulty] = useState(5);
    const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
    const [selectedAnswerId, setSelectedAnswerId] = useState<string | null>(null);
    const [isAnswered, setIsAnswered] = useState(false);
    const [answeredQuestions, setAnsweredQuestions] = useState<AnsweredQuestion[]>([]);
    const [showResults, setShowResults] = useState(false);
    const [feedbackMessage, setFeedbackMessage] = useState<{
        type: "correct" | "incorrect";
        message: string;
    } | null>(null);
    const [correctAnswer, setCorrectAnswer] = useState<Answer | null>(null);
    const isOnline = useOnlineStatus();

    // Timer tracking
    const startTime = useRef<number>(Date.now());
    const [elapsedTime, setElapsedTime] = useState<number>(0);

    // Organize questions by difficulty level
    const questionsByDifficulty = useMemo(() => {
        const map = new Map<number, Question[]>();
        questions.forEach((q) => {
            const diff = q.difficulty;
            if (!map.has(diff)) {
                map.set(diff, []);
            }
            map.get(diff)!.push(q);
        });
        return map;
    }, [questions]);

    // Get next question based on difficulty level
    const getNextQuestion = (targetDifficulty: number): Question | null => {
        const answeredIds = new Set(answeredQuestions.map((aq) => aq.questionId));

        // Try exact difficulty first
        const exactMatches = questionsByDifficulty.get(targetDifficulty)?.filter(
            (q) => !answeredIds.has(q.id)
        );
        if (exactMatches && exactMatches.length > 0) {
            return exactMatches[Math.floor(Math.random() * exactMatches.length)];
        }

        // Search nearest neighbors (±1, ±2, ±3, etc.)
        for (let offset = 1; offset <= 5; offset++) {
            const lower = targetDifficulty - offset;
            const upper = targetDifficulty + offset;

            const candidates: Question[] = [];

            if (lower >= 1) {
                const lowerMatches = questionsByDifficulty.get(lower)?.filter(
                    (q) => !answeredIds.has(q.id)
                );
                if (lowerMatches) candidates.push(...lowerMatches);
            }

            if (upper <= 10) {
                const upperMatches = questionsByDifficulty.get(upper)?.filter(
                    (q) => !answeredIds.has(q.id)
                );
                if (upperMatches) candidates.push(...upperMatches);
            }

            if (candidates.length > 0) {
                return candidates[Math.floor(Math.random() * candidates.length)];
            }
        }

        return null;
    };

    // Initialize first question
    useEffect(() => {
        if (questions.length > 0 && !currentQuestion) {
            const firstQuestion = getNextQuestion(5);
            setCurrentQuestion(firstQuestion);
            startTime.current = Date.now();
        }
    }, [questions]);

    // Update timer every second
    useEffect(() => {
        if (!isAnswered && currentQuestion) {
            const interval = setInterval(() => {
                setElapsedTime(Math.floor((Date.now() - startTime.current) / 1000));
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [isAnswered, currentQuestion]);

    const handleAnswerSelect = (answerId: string) => {
        if (isAnswered) return;
        setSelectedAnswerId(answerId);
    };

    const handleSubmitAnswer = async () => {
        if (!selectedAnswerId || isAnswered || !currentQuestion) return;

        const answer = currentQuestion.answers.find((a) => a.id === selectedAnswerId);
        const isCorrect = answer?.isCorrect || false;
        const correct = currentQuestion.answers.find((a) => a.isCorrect);
        const timeTaken = (Date.now() - startTime.current) / 1000;

        setIsAnswered(true);
        setCorrectAnswer(correct || null);

        // Submit to backend
        if (isOnline) {
            try {
                const result = await submitAnswer({
                    questionId: currentQuestion.id,
                    isCorrect,
                    timeTaken,
                });

                if (result.success && result.difficultyAdjustment) {
                    // Use server-calculated difficulty adjustment
                    const nextDiff = Math.max(1, Math.min(10, currentDifficulty + result.difficultyAdjustment));
                    setCurrentDifficulty(nextDiff);
                }
            } catch (error) {
                console.error('Failed to submit answer:', error);
                toast.error('Failed to save progress');
            }
        } else {
            // Offline: Calculate difficulty adjustment locally
            let adjustment = 0;
            if (isCorrect) {
                adjustment = timeTaken < 10 ? 2 : 1;
            } else {
                adjustment = -1;
            }
            const nextDiff = Math.max(1, Math.min(10, currentDifficulty + adjustment));
            setCurrentDifficulty(nextDiff);
        }

        // Record answered question
        setAnsweredQuestions((prev) => [
            ...prev,
            {
                questionId: currentQuestion.id,
                difficulty: currentQuestion.difficulty,
                isCorrect,
            },
        ]);

        // Set feedback message with explanation
        if (isCorrect) {
            const speedText = timeTaken < 10 ? " 🔥 Flow State! +2 difficulty" : " ✅ Solid! +1 difficulty";
            setFeedbackMessage({
                type: "correct",
                message: (currentQuestion.explanation || "Excellent!") + speedText,
            });
        } else {
            setFeedbackMessage({
                type: "incorrect",
                message: currentQuestion.explanation || `The correct answer is: "${correct?.text}"`,
            });
        }
    };

    const handleNextQuestion = () => {
        if (!currentQuestion) return;

        // Get next question
        const nextQuestion = getNextQuestion(currentDifficulty);

        if (nextQuestion) {
            setCurrentQuestion(nextQuestion);
            setSelectedAnswerId(null);
            setIsAnswered(false);
            setFeedbackMessage(null);
            setCorrectAnswer(null);
            startTime.current = Date.now();
            setElapsedTime(0);
        } else {
            // No more questions available
            setShowResults(true);
        }
    };

    // Calculate weighted proficiency score
    const calculateProficiencyScore = () => {
        if (answeredQuestions.length === 0) return 0;

        const totalWeightedScore = answeredQuestions.reduce(
            (sum, aq) => sum + (aq.isCorrect ? aq.difficulty : 0),
            0
        );

        const maxPossibleScore = answeredQuestions.reduce(
            (sum, aq) => sum + aq.difficulty,
            0
        );

        return Math.round((totalWeightedScore / maxPossibleScore) * 100);
    };

    const rawScore = answeredQuestions.filter((aq) => aq.isCorrect).length;

    // Difficulty badge color based on level
    const getDifficultyBadgeVariant = (diff: number) => {
        if (diff <= 3) return "success";
        if (diff <= 6) return "info";
        if (diff <= 8) return "warning";
        return "destructive";
    };

    if (questions.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
                <h2 className="text-2xl font-bold">No questions available</h2>
                <p className="text-zinc-500">This course doesn't have any quiz questions yet.</p>
                <Link href={`/course/${courseId}`}>
                    <Button>Back to Course</Button>
                </Link>
            </div>
        );
    }

    if (showResults) {
        const proficiencyScore = calculateProficiencyScore();

        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-6 animate-in fade-in zoom-in duration-300">
                <div className="text-center space-y-2">
                    <h2 className="text-3xl font-bold">Adaptive Quiz Completed! 🎉</h2>
                    <p className="text-xl text-zinc-600 dark:text-zinc-400">
                        You answered {" "}
                        <span className="font-bold text-blue-600 dark:text-blue-400">{rawScore}</span> out of{" "}
                        <span className="font-bold">{answeredQuestions.length}</span> questions correctly
                    </p>
                </div>

                <Card className="p-6 w-full max-w-md space-y-4">
                    <div className="text-center space-y-2">
                        <div className="flex items-center justify-center gap-2">
                            <Zap className="h-6 w-6 text-yellow-500" />
                            <h3 className="text-2xl font-bold">Proficiency Score</h3>
                        </div>
                        <p className="text-5xl font-bold text-blue-600 dark:text-blue-400">
                            {proficiencyScore}%
                        </p>
                        <p className="text-sm text-zinc-500">
                            Weighted by question difficulty
                        </p>
                    </div>

                    <div className="w-full bg-zinc-100 dark:bg-zinc-800 rounded-full h-4 overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-1000 ease-out"
                            style={{ width: `${proficiencyScore}%` }}
                        />
                    </div>

                    <div className="pt-2 border-t">
                        <p className="text-sm text-zinc-600 dark:text-zinc-400 text-center">
                            <span className="font-semibold">Difficulty Range:</span>{" "}
                            {Math.min(...answeredQuestions.map((aq) => aq.difficulty))} -{" "}
                            {Math.max(...answeredQuestions.map((aq) => aq.difficulty))}
                        </p>
                    </div>
                </Card>

                <div className="flex gap-4">
                    <Link href={`/course/${courseId}`}>
                        <Button variant="outline" className="gap-2">
                            <ArrowRight className="h-4 w-4" />
                            Back to Course
                        </Button>
                    </Link>
                    <Button
                        onClick={() => window.location.reload()}
                        className="gap-2"
                    >
                        <RotateCcw className="h-4 w-4" />
                        Retake Quiz
                    </Button>
                </div>
            </div>
        );
    }

    if (!currentQuestion) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
                <h2 className="text-2xl font-bold">Loading...</h2>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto space-y-8">
            {/* Progress & Difficulty Badge */}
            <div className="space-y-3">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <span className="text-sm text-zinc-500">
                            Question {answeredQuestions.length + 1}
                        </span>
                        <Badge variant={getDifficultyBadgeVariant(currentDifficulty)} className="gap-1.5">
                            <Zap className="h-3 w-3" />
                            Difficulty: {currentDifficulty}/10
                        </Badge>
                        <Badge variant="outline" className="gap-1.5">
                            <Clock className="h-3 w-3" />
                            {elapsedTime}s
                        </Badge>
                    </div>
                    <span className="text-sm text-zinc-500">Score: {rawScore}</span>
                </div>
                <div className="w-full bg-zinc-100 dark:bg-zinc-800 rounded-full h-2">
                    <div
                        className="h-full bg-blue-600 transition-all duration-300"
                        style={{ width: `${(currentDifficulty / 10) * 100}%` }}
                    />
                </div>
            </div>

            {/* Feedback Alert */}
            {feedbackMessage && isAnswered && (
                <Alert
                    variant={feedbackMessage.type === "correct" ? "success" : "destructive"}
                    className="animate-in slide-in-from-top duration-300"
                >
                    {feedbackMessage.type === "correct" ? (
                        <TrendingUp className="h-5 w-5" />
                    ) : (
                        <TrendingDown className="h-5 w-5" />
                    )}
                    <AlertTitle>
                        {feedbackMessage.type === "correct" ? "Correct!" : "Incorrect"}
                    </AlertTitle>
                    <AlertDescription>{feedbackMessage.message}</AlertDescription>
                </Alert>
            )}

            {/* Question Card */}
            <Card className="p-6 md:p-8 space-y-6">
                <div>
                    <h2 className={cn(
                        "text-xl md:text-2xl font-semibold text-foreground",
                        currentQuestion.type === 'code' && "mb-4"
                    )}>
                        {currentQuestion.type === 'code' ? 'Code Question:' : ''}
                    </h2>
                    {currentQuestion.type === 'code' ? (
                        <pre className="p-4 rounded-lg bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 overflow-x-auto">
                            <code className="text-sm text-zinc-800 dark:text-zinc-200">
                                {currentQuestion.question}
                            </code>
                        </pre>
                    ) : (
                        <p className="text-xl md:text-2xl font-semibold text-foreground">
                            {currentQuestion.question}
                        </p>
                    )}
                </div>

                <div className="space-y-3">
                    {currentQuestion.answers.map((answer) => {
                        const isSelected = selectedAnswerId === answer.id;
                        const isCorrect = answer.isCorrect;

                        let buttonStyle = "border-zinc-200 hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-800";

                        if (isAnswered) {
                            if (isCorrect) {
                                buttonStyle = "border-green-500 bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400";
                            } else if (isSelected && !isCorrect) {
                                buttonStyle = "border-red-500 bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400";
                            } else {
                                buttonStyle = "opacity-50";
                            }
                        } else if (isSelected) {
                            buttonStyle = "border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400 ring-1 ring-blue-500";
                        }

                        return (
                            <button
                                key={answer.id}
                                onClick={() => handleAnswerSelect(answer.id)}
                                disabled={isAnswered}
                                className={cn(
                                    "w-full text-left p-4 rounded-xl border-2 transition-all duration-200 flex items-center justify-between group",
                                    buttonStyle
                                )}
                            >
                                <span className="font-medium">{answer.text}</span>
                                {isAnswered && isCorrect && (
                                    <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                                )}
                                {isAnswered && isSelected && !isCorrect && (
                                    <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                                )}
                            </button>
                        );
                    })}
                </div>

                <div className="flex justify-end pt-4">
                    {!isAnswered ? (
                        <Button
                            onClick={handleSubmitAnswer}
                            disabled={!selectedAnswerId}
                            size="lg"
                            className="w-full md:w-auto"
                        >
                            Submit Answer
                        </Button>
                    ) : (
                        <Button
                            onClick={handleNextQuestion}
                            size="lg"
                            className="w-full md:w-auto gap-2"
                        >
                            Next Question
                            <ArrowRight className="h-4 w-4" />
                        </Button>
                    )}
                </div>
            </Card>
        </div>
    );
}
