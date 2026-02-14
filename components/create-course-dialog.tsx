"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Sparkles, Loader2, BookOpen, Clock } from "lucide-react";
// назар аударыңыз, generateCourse енді екі параметр қабылдайды
import { generateCourse } from "@/app/actions/generate-course";
import { toast } from "sonner";
import { useOnlineStatus } from "@/hooks/use-online-status";
import { useLanguage } from "@/contexts/language-context";

export function CreateCourseDialog() {
    const [isOpen, setIsOpen] = useState(false);
    const [topic, setTopic] = useState("");

    // 👇 Тіл таңдауға арналған State
    const [selectedLanguage, setSelectedLanguage] = useState("Russian");

    const [isLoading, setIsLoading] = useState(false);
    const [cooldown, setCooldown] = useState(0);
    const router = useRouter();
    const isOnline = useOnlineStatus();
    const { t } = useLanguage();

    useEffect(() => {
        if (cooldown > 0) {
            const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [cooldown]);

    const handleGenerate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!topic.trim() || cooldown > 0) return;

        if (!isOnline) {
            toast.error("Офлайн-режим", { description: "Интернетке қосылыңыз." });
            return;
        }

        setIsLoading(true);
        try {
            // 👇 ТАҢДАЛҒАН ТІЛДІ ҚОСА ЖІБЕРЕМІЗ
            const result = await generateCourse(topic, selectedLanguage);

            if (result.success && result.courseId) {
                toast.success("Course created!", { description: "Курс дайын." });
                setIsOpen(false);
                setTopic("");
                router.push(`/course/${result.courseId}`);
                router.refresh();
            } else {
                toast.error("Error", { description: result.error || "Failed" });
            }
        } catch (error: any) {
            console.error(error);
            toast.error("Error", { description: "Something went wrong" });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <Button onClick={() => setIsOpen(true)} disabled={cooldown > 0} className="gap-2 bg-blue-600 text-white hover:bg-blue-700">
                <Sparkles className="h-4 w-4" />
                {t.generateCourseButton || "Курс қосу"}
            </Button>

            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-xl p-6 shadow-2xl border">
                        <h2 className="text-xl font-bold mb-4">Жаңа курс құру</h2>

                        <form onSubmit={handleGenerate} className="space-y-4">
                            {/* 1. Тақырып жазу */}
                            <div>
                                <label className="text-sm font-medium mb-1 block">Тақырып</label>
                                <input
                                    value={topic}
                                    onChange={(e) => setTopic(e.target.value)}
                                    placeholder="Курс тақырыбын енгізіңіз"
                                    className="w-full px-3 py-2 border rounded-md bg-background"
                                    autoFocus
                                />
                            </div>

                            {/* 2. Тіл таңдау (Қарапайым Select) */}
                            <div>
                                <label className="text-sm font-medium mb-1 block">Оқыту тілі</label>
                                <select
                                    className="w-full px-3 py-2 border rounded-md bg-background"
                                    value={selectedLanguage}
                                    onChange={(e) => setSelectedLanguage(e.target.value)}
                                >
                                    <option value="Kazakh">Қазақша (Kazakh)</option>
                                    <option value="Russian">Русский (Russian)</option>
                                    <option value="English">English</option>
                                </select>
                            </div>

                            <div className="flex gap-2 pt-2">
                                <Button type="button" variant="outline" onClick={() => setIsOpen(false)} className="flex-1">
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={isLoading} className="flex-1 bg-blue-600 text-white">
                                    {isLoading ? <Loader2 className="animate-spin" /> : "Generate"}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}