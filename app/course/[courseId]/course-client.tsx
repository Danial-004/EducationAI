'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ChevronRight, PlayCircle, CheckCircle, Loader2 } from 'lucide-react';
import { useLanguage } from '@/contexts/language-context';
import { MarkdownText } from '@/components/markdown-text';
import { VideoPlayer } from '@/components/video-player';
import { generateLessonContent } from '@/app/actions/generate-lesson';
import { Skeleton } from '@/components/ui/skeleton';

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
    nextMaterial: {
        id: string;
    } | null;
}

export function CoursePageClient({
    courseId,
    activeMaterial,
    moduleName,
    lessonNumber,
    nextMaterial
}: CoursePageClientProps) {
    const { t } = useLanguage();

    // State
    const [content, setContent] = useState(""); // Басында бос болады
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // 1. Сабақ ауысқан сайын жұмыс істейтін логика
    useEffect(() => {
        if (!activeMaterial) return;

        // Ескі контентті тазалаймыз (Қайталану болмас үшін)
        setContent("");
        setError(null);

        // Егер базада дайын контент болса -> бірден көрсетеміз
        if (activeMaterial.content && activeMaterial.content.length > 50) {
            setContent(activeMaterial.content);
            setIsLoading(false);
        } else {
            // Егер контент ЖОҚ болса -> АВТОМАТТЫ ТҮРДЕ генерация жібереміз (Батырмасыз)
            generateAuto(activeMaterial.id);
        }
    }, [activeMaterial?.id]); // ID өзгерген сайын іске қосылады

    // Автоматты генерация функциясы
    const generateAuto = async (id: string) => {
        setIsLoading(true);
        try {
            const result = await generateLessonContent(id);
            if (result.success && result.content) {
                setContent(result.content);
            } else {
                setError("Сабақты жүктеу мүмкін болмады. Интернетті тексеріңіз.");
            }
        } catch (err) {
            setError("Қате орын алды.");
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
            <div className="mb-8 border-b border-border pb-6">
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>{moduleName}</span>
                        <span>•</span>
                        <span>{t.readingMaterial}</span>
                    </div>
                    <h1 className="text-3xl font-bold text-foreground">
                        {t.lesson} {lessonNumber}
                    </h1>
                </div>
            </div>

            <div className="prose prose-zinc dark:prose-invert max-w-none mb-8 min-h-[400px]">
                {/* 1. Егер жүктеліп жатса (AI жазып жатыр) */}
                {isLoading ? (
                    <div className="space-y-6 py-10 animate-pulse">
                        <div className="flex items-center gap-3 text-blue-600 font-medium">
                            <Loader2 className="h-5 w-5 animate-spin" />
                            <span>AI мұғалім сабақты дайындап жатыр... (Бұл 10-15 секунд алуы мүмкін)</span>
                        </div>
                        {/* Скелетон (жүктелу әсері) */}
                        <div className="space-y-3">
                            <Skeleton className="h-8 w-3/4" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-5/6" />
                        </div>
                        <div className="space-y-3 pt-4">
                            <Skeleton className="h-6 w-1/2" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-4/5" />
                        </div>
                    </div>
                ) : error ? (
                    // 2. Егер қате шықса
                    <div className="rounded-lg bg-red-50 dark:bg-red-900/20 p-4 text-red-600">
                        <p>{error}</p>
                        <Button variant="outline" onClick={() => generateAuto(activeMaterial.id)} className="mt-2">
                            Қайта көру
                        </Button>
                    </div>
                ) : (
                    // 3. Дайын контент
                    <MarkdownText content={content} />
                )}
            </div>

            {/* Төменгі навигация (тек контент дайын болғанда шығады) */}
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