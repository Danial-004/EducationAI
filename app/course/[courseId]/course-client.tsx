'use client';

import { useEffect, useState } from 'react';
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
    const [content, setContent] = useState(activeMaterial?.content || "");
    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Generate content on-demand if empty
    useEffect(() => {
        async function loadContent() {
            if (activeMaterial && (!activeMaterial.content || activeMaterial.content.length < 50)) {
                setIsGenerating(true);
                setError(null);

                try {
                    const result = await generateLessonContent(activeMaterial.id);

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
            } else if (activeMaterial?.content) {
                setContent(activeMaterial.content);
            }
        }

        loadContent();
    }, [activeMaterial?.id]);

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
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                    <span>{moduleName}</span>
                    <span>•</span>
                    <span>{activeMaterial.type === "video" ? t.videoLesson : t.readingMaterial}</span>
                </div>
                <h1 className="text-3xl font-bold text-foreground">
                    {t.lesson} {lessonNumber}
                </h1>
            </div>

            {/* Content Area with Loading State */}
            <div className="prose prose-zinc dark:prose-invert max-w-none mb-8">
                {isGenerating ? (
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <Loader2 className="h-5 w-5 animate-spin" />
                            <span>Generating lesson content with AI...</span>
                        </div>
                        <Skeleton className="h-8 w-3/4" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-5/6" />
                        <Skeleton className="h-8 w-2/3 mt-6" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-4/5" />
                    </div>
                ) : error ? (
                    <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4">
                        <p className="text-destructive font-medium">Error loading lesson</p>
                        <p className="text-sm text-muted-foreground mt-1">{error}</p>
                    </div>
                ) : activeMaterial?.type === "video" ? (
                    <VideoPlayer url={content} />
                ) : (
                    <MarkdownText content={content} />
                )}
            </div>

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
        </>
    );
}
