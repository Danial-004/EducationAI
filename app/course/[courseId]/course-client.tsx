'use client';

// 1. useEffect импорттауды ұмытпаңыз!
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ChevronRight, PlayCircle, CheckCircle, Loader2, Globe, Sparkles } from 'lucide-react';
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
    const [content, setContent] = useState(activeMaterial?.content || "");
    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [genLanguage, setGenLanguage] = useState("Russian");

    // 🔥 ЕҢ МАҢЫЗДЫ ӨЗГЕРІС ОСЫ ЖЕРДЕ 👇
    // Бұл код: "Егер activeMaterial өзгерсе -> content-ті жаңарт" деп тұр
    useEffect(() => {
        if (activeMaterial) {
            setContent(activeMaterial.content || "");
            setError(null); // Қатені тазалау
            setIsGenerating(false); // Жүктелуді тоқтату
        }
    }, [activeMaterial]);
    // 👆 [activeMaterial] деген сөз, осы өзгерген сайын функция іске қосылады дегенді білдіреді

    const handleGenerate = async () => {
        if (!activeMaterial) return;

        setIsGenerating(true);
        setError(null);

        try {
            const result = await generateLessonContent(activeMaterial.id, genLanguage);

            if (result.success && result.content) {
                setContent(result.content);
            } else {
                setError(result.error || "Failed to generate lesson content");
            }
        } catch (err: any) {
            setError(err.message || "An error occurred");
        } finally {
            setIsGenerating(false);
        }
    };

    if (!activeMaterial) {
        return (
            <div className="flex h-full flex-col items-center justify-center text-muted-foreground">
                <div className="rounded-full bg-muted p-4 mb-4">
                    <PlayCircle className="h-8 w-8 text-muted-foreground" />
                </div>
                <p className="text-lg font-medium">{t.selectLessonToStart}</p>
            </div>
        );
    }

    return (
        <>
            <div className="mb-8 border-b border-border pb-8">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                            <span>{moduleName}</span>
                            <span>•</span>
                            <span>{activeMaterial.type === "video" ? t.videoLesson : t.readingMaterial}</span>
                        </div>
                        <h1 className="text-3xl font-bold text-foreground">
                            {t.lesson} {lessonNumber}
                        </h1>
                    </div>

                    {(!content || content.length < 50) && (
                        <div className="flex items-center gap-2 bg-muted/50 p-2 rounded-lg border">
                            <Globe className="h-4 w-4 text-muted-foreground" />
                            <select
                                className="bg-transparent text-sm font-medium focus:outline-none cursor-pointer"
                                value={genLanguage}
                                onChange={(e) => setGenLanguage(e.target.value)}
                            >
                                <option value="Kazakh">🇰🇿 Қазақша</option>
                                <option value="Russian">🇷🇺 Русский</option>
                                <option value="English">🇺🇸 English</option>
                            </select>
                        </div>
                    )}
                </div>
            </div>

            <div className="prose prose-zinc dark:prose-invert max-w-none mb-8">
                {isGenerating ? (
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <Loader2 className="h-5 w-5 animate-spin" />
                            <span>Creating lesson in {genLanguage}...</span>
                        </div>
                        <Skeleton className="h-8 w-3/4" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-5/6" />
                    </div>
                ) : error ? (
                    <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4">
                        <p className="text-destructive font-medium">{t.errorLoading}</p>
                        <p className="text-sm text-muted-foreground mt-1">{error}</p>
                        <Button variant="outline" size="sm" onClick={handleGenerate} className="mt-4">
                            Try Again
                        </Button>
                    </div>
                ) : (!content || content.length < 50) ? (
                    <div className="flex flex-col items-center justify-center py-12 border-2 border-dashed rounded-lg bg-muted/30">
                        <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-4">
                            <Sparkles className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                        </div>
                        <h3 className="text-lg font-semibold mb-2">Ready to Learn?</h3>
                        <p className="text-muted-foreground mb-6 text-center max-w-md">
                            Select your preferred language above and let AI create a personalized lesson for you.
                        </p>
                        <Button onClick={handleGenerate} size="lg" className="gap-2 bg-blue-600 hover:bg-blue-700 text-white">
                            <Sparkles className="h-4 w-4" />
                            Generate Lesson ({genLanguage})
                        </Button>
                    </div>
                ) : (
                    activeMaterial?.type === "video" ? (
                        <VideoPlayer url={content} />
                    ) : (
                        <MarkdownText content={content} />
                    )
                )}
            </div>

            {content && content.length > 50 && (
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