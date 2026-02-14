'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ChevronRight, CheckCircle, Loader2 } from 'lucide-react';
import { useLanguage } from '@/contexts/language-context';
import { MarkdownText } from '@/components/markdown-text';
import { VideoPlayer } from '@/components/video-player';
import { generateLessonContent } from '@/app/actions/generate-lesson';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from "sonner";

interface CoursePageClientProps {
    courseId: string;
    activeMaterial: {
        id: string;
        type: string;
        content: string;
        moduleId: string;
    } | null;
    moduleName: string;
    lessonNumber: number;
    nextMaterial: { id: string } | null;
}

export function CoursePageClient({
    courseId,
    activeMaterial,
    moduleName,
    lessonNumber,
    nextMaterial
}: CoursePageClientProps) {
    const { t } = useLanguage();

    const [content, setContent] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    // САБАҚ АУЫСҚАНДА
    useEffect(() => {
        if (!activeMaterial) return;

        // 1. ЭКРАНДЫ ТАЗАЛАЙМЫЗ (Ескі мәтін қалмауы үшін)
        setContent("");
        setIsLoading(false);

        // 2. БАЗАДА БАР МА?
        if (activeMaterial.content && activeMaterial.content.length > 50) {
            // Бар болса, серверден қайта сұрамаймыз, бірден көрсетеміз
            setContent(activeMaterial.content);
        } else {
            // Жоқ болса, генерация жасаймыз
            loadNewLesson(activeMaterial.id);
        }

    }, [activeMaterial?.id]);

    const loadNewLesson = async (id: string) => {
        setIsLoading(true);
        try {
            const result = await generateLessonContent(id);
            if (result.success && result.content) {
                setContent(result.content);
            }
        } catch (error) {
            toast.error("Қате орын алды.");
        } finally {
            setIsLoading(false);
        }
    };

    if (!activeMaterial) {
        return (
            <div className="flex h-full items-center justify-center text-muted-foreground">
                <p>{t.selectLessonToStart}</p>
            </div>
        );
    }

    return (
        <>
            <div className="mb-6 border-b border-border pb-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                    <span>{moduleName}</span>
                    <span>•</span>
                    <span>{t.readingMaterial}</span>
                </div>
                <h1 className="text-2xl font-bold text-foreground">
                    {t.lesson} {lessonNumber}
                </h1>
            </div>

            <div className="prose prose-zinc dark:prose-invert max-w-none mb-8 min-h-[400px]">
                {isLoading ? (
                    <div className="space-y-6 py-10 animate-pulse">
                        <div className="flex items-center gap-3 text-blue-600 font-medium">
                            <Loader2 className="h-5 w-5 animate-spin" />
                            <span>AI мұғалім сабақты жазуда... (Күте тұрыңыз)</span>
                        </div>
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-5/6" />
                        <Skeleton className="h-32 w-full rounded-lg" />
                    </div>
                ) : (
                    <MarkdownText content={content} />
                )}
            </div>

            {!isLoading && content.length > 50 && (
                <div className="flex justify-end pt-8 border-t border-border">
                    {nextMaterial ? (
                        <Link href={`/course/${courseId}?materialId=${nextMaterial.id}`}>
                            <Button size="lg" className="gap-2">
                                {t.nextLesson}
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </Link>
                    ) : (
                        <Link href={`/course/${courseId}/quiz`}>
                            <Button size="lg" className="gap-2 bg-green-600 hover:bg-green-700 text-white">
                                {t.takeQuiz}
                                <CheckCircle className="h-4 w-4" />
                            </Button>
                        </Link>
                    )}
                </div>
            )}
        </>
    );
}