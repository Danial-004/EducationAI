"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Sparkles, Loader2, BookOpen, Clock } from "lucide-react";
import { generateCourse } from "@/app/actions/generate-course";
import { toast } from "sonner";
import { useOnlineStatus } from "@/hooks/use-online-status";
import { useLanguage } from "@/contexts/language-context";

export function CreateCourseDialog() {
    const [isOpen, setIsOpen] = useState(false);
    const [topic, setTopic] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [cooldown, setCooldown] = useState(0);
    const router = useRouter();
    const isOnline = useOnlineStatus();
    const { language, t } = useLanguage();

    // Cooldown timer effect
    useEffect(() => {
        if (cooldown > 0) {
            const timer = setTimeout(() => {
                setCooldown(cooldown - 1);
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [cooldown]);

    const handleGenerate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!topic.trim() || cooldown > 0) return;

        // Check if user is online before attempting AI generation
        if (!isOnline) {
            toast.error("Офлайн-режим", {
                description: "AI-мозг доступен только онлайн. Пожалуйста, подключитесь к интернету.",
            });
            return;
        }

        setIsLoading(true);
        try {
            const result = await generateCourse(topic, language);
            if (result.success && result.courseId) {
                toast.success("Course created successfully!", {
                    description: `"${topic}" is ready to explore.`,
                });
                setIsOpen(false);
                setTopic("");
                router.push(`/course/${result.courseId}`);
                router.refresh();
            } else {
                // Check for rate limit error
                const errorMessage = result.error || "";
                if (errorMessage.includes("429") || errorMessage.toLowerCase().includes("resource has been exhausted")) {
                    toast.error("AI is cooling down", {
                        description: "Please wait 60 seconds before creating a new course.",
                        duration: 5000,
                    });
                    setCooldown(60);
                } else {
                    toast.error("Failed to generate course", {
                        description: errorMessage || "Please try again.",
                    });
                }
            }
        } catch (error: any) {
            console.error("Error:", error);

            // Check if it's a rate limit error
            const errorMessage = error.message || error.toString();
            if (errorMessage.includes("429") || errorMessage.toLowerCase().includes("quota") || errorMessage.toLowerCase().includes("resource has been exhausted")) {
                toast.error("AI is cooling down", {
                    description: "Please wait 60 seconds before creating a new course.",
                    duration: 5000,
                });
                setCooldown(60);
            } else {
                toast.error("An error occurred", {
                    description: "Please check your connection and try again.",
                });
            }
        } finally {
            setIsLoading(false);
        }
    };

    const isDisabled = isLoading || cooldown > 0 || !topic.trim();

    if (!isOpen) {
        return (
            <Button
                onClick={() => setIsOpen(true)}
                disabled={cooldown > 0}
                className="gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-md hover:shadow-lg transition-all"
            >
                {cooldown > 0 ? (
                    <>
                        <Clock className="h-4 w-4" />
                        Cooldown ({cooldown}s)
                    </>
                ) : (
                    <>
                        <Sparkles className="h-4 w-4" />
                        {t.generateCourseButton}
                    </>
                )}
            </Button>
        );
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-xl shadow-2xl border border-zinc-200 dark:border-zinc-800 p-6 animate-in zoom-in-95 duration-200">
                <div className="mb-6 text-center">
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
                        <Sparkles className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
                        Create AI Course
                    </h2>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-2">
                        Enter a topic and let our AI build a complete course for you in seconds.
                    </p>
                </div>

                <form onSubmit={handleGenerate} className="space-y-4">
                    <div>
                        <label htmlFor="topic" className="sr-only">Topic</label>
                        <input
                            id="topic"
                            type="text"
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                            placeholder="e.g., Quantum Physics, Python for Beginners..."
                            className="w-full px-4 py-3 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                            disabled={isLoading || cooldown > 0}
                            autoFocus
                        />
                    </div>

                    {cooldown > 0 && (
                        <div className="flex items-center gap-2 text-sm text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 px-3 py-2 rounded-lg">
                            <Clock className="h-4 w-4" />
                            <span>Cooldown active: {cooldown} seconds remaining</span>
                        </div>
                    )}

                    <div className="flex gap-3">
                        <Button
                            type="button"
                            variant="outline"
                            className="flex-1"
                            onClick={() => setIsOpen(false)}
                            disabled={isLoading}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            className="flex-1 gap-2 bg-blue-600 hover:bg-blue-700 text-white"
                            disabled={isDisabled}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Generating...
                                </>
                            ) : cooldown > 0 ? (
                                <>
                                    <Clock className="h-4 w-4" />
                                    Wait {cooldown}s
                                </>
                            ) : (
                                <>
                                    <BookOpen className="h-4 w-4" />
                                    Generate Course
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
