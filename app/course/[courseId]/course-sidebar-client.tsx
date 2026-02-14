'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from "next/navigation";
import { Button } from '@/components/ui/button';
import { ChevronRight, CheckCircle, Loader2, RotateCcw, Sparkles } from 'lucide-react';
import { useLanguage } from '@/contexts/language-context';
import { MarkdownText } from '@/components/markdown-text';
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
    const router = useRouter();

    // State
    const [content, setContent] = useState(activeMaterial?.content || "");
    // Егер контент жоқ болса -> Loading күйіне қоямыз
    const [isLoading, setIsLoading] = useState(!activeMaterial?.content || activeMaterial.content.length < 50);

    // 🔒 ҚҰЛЫП (Double-request prevention)
    const isRequestPending = useRef(false);

    useEffect(() => {
        if (!activeMaterial) return;

        // 1. Егер базада дайын мәтін болса
        if (activeMaterial.content && activeMaterial.content.length > 50) {
            setContent(activeMaterial.content);
            setIsLoading(false);
        } else {
            // 2. Егер база бос болса -> Генерация жасаймыз
            // Бірақ алдымен ҚҰЛЫПТЫ тексереміз
            if (!isRequestPending.current) {
                setContent("");
                setIsLoading(true);
                loadNewLesson(activeMaterial.id);
            }
        }
    }, [activeMaterial?.id]); // ID өзгергенде іске қосылады

    const loadNewLesson = async (id: string) => {
        // Құлыптаймыз
        isRequestPending.current = true;

        try {
            const result = await generateLessonContent(id);
            if (result.success && result.content) {
                setContent(result.content);
                router.refresh();
            }
        } catch (error) {
            console.error(error);
            toast.error("Қате орын алды. Қайта көріңіз.");
        } finally {
            setIsLoading(false);
            // Құлыпты ашамыз (бірақ келесі useEffect-ке дейін керек емес)
            isRequestPending.current = false;
        }
    };

    // Қате болған сабақты қолмен түзету функциясы
    const forceRegenerate = async () => {
        if (!activeMaterial) return;

        // Экранды тазалаймыз
        setContent("");
        setIsLoading(true);
        isRequestPending.current = true;

        try {
            // Серверге "ескіні елеме, жаңадан жаз" деп сұраныс жібереміз
            // (generateLessonContent функциясы update жасайтындықтан, 
            // ескі мәтін автоматты түрде өшеді)
            await loadNewLesson(activeMaterial.id);
            toast.success("Сабақ қайта жазылды!");
        } catch (e) {
            toast.error("Қате шықты");
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
            <div className="mb-6 border-b border-border pb-4 flex justify-between items-start">
                <div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                        <span>{moduleName}</span>
                        <span>•</span>
                        <span>{t.readingMaterial}</span>
                    </div>
                    <h1 className="text-2xl font-bold text-foreground">
                        {t.lesson} {lessonNumber}
                    </h1>
                </div>

                {/* Егер мәтін бұзылған болса (екі рет жазылса), осы батырманы басып түзеуге болады */}
                {!isLoading && content.length > 50 && (
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={forceRegenerate}
                        title="Сабақты қайта жазу (Егер қате болса)"
                        className="text-muted-foreground hover:text-primary"
                    >
                        <RotateCcw className="h-4 w-4" />
                    </Button>
                )}
            </div>

            <div className="prose prose-zinc dark:prose-invert max-w-none mb-8 min-h-[400px]">
                {/* 1. ЖҮКТЕЛУ КЕЗІ (SKELETON) */}
                {isLoading ? (
                    <div className="space-y-6 py-6 animate-pulse">
                        <div className="flex items-center gap-3 text-blue-600 font-medium">
                            <Loader2 className="h-5 w-5 animate-spin" />
                            <span>AI мұғалім сабақты жазуда... (Күте тұрыңыз)</span>
                        </div>
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-[90%]" />
                            <Skeleton className="h-4 w-[95%]" />
                        </div>
                        <Skeleton className="h-32 w-full rounded-lg mt-4" />
                        <div className="space-y-2 mt-4">
                            <Skeleton className="h-4 w-[92%]" />
                            <Skeleton className="h-4 w-[88%]" />
                            <Skeleton className="h-4 w-full" />
                        </div>
                    </div>
                ) : content && content.length > 50 ? (
                    // 2. ДАЙЫН МӘТІН
                    <MarkdownText content={content} />
                ) : (
                    // 3. ЕГЕР ҚАТЕ БОЛЫП, БОС ҚАЛСА
                    <div className="flex flex-col items-center justify-center py-10 border-2 border-dashed rounded-lg bg-muted/30">
                        <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                            <Sparkles className="h-6 w-6 text-blue-600" />
                        </div>
                        <p className="text-muted-foreground mb-4 text-center">
                            Сабақ мазмұны жүктелмеді.
                        </p>
                        <Button onClick={() => loadNewLesson(activeMaterial.id)} className="bg-blue-600 text-white">
                            Қайта көру
                        </Button>
                    </div>
                )}
            </div>

            {/* Навигация */}
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