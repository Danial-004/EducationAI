'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { BookOpen, PlayCircle, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/contexts/language-context';

interface CourseCardProps {
    id: string;
    title: string;
    description: string | null;
    moduleCount?: number;
}

export function CourseCard({ id, title, description, moduleCount = 0 }: CourseCardProps) {
    const { t } = useLanguage();

    return (
        <div className="group relative overflow-hidden rounded-xl border border-zinc-200 bg-white p-6 shadow-sm transition-all hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-900">
            {/* Card Header */}
            <div className="mb-4 flex items-start justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-500">
                    <BookOpen className="h-6 w-6 text-white" />
                </div>
                {moduleCount > 0 && (
                    <span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                        {moduleCount} {moduleCount === 1 ? t.module : t.modules}
                    </span>
                )}
            </div>

            {/* Card Content */}
            <div className="mb-6">
                <h3 className="mb-2 text-xl font-semibold text-foreground">
                    {title}
                </h3>
                <p className="line-clamp-3 text-sm text-muted-foreground">
                    {description || 'No description available'}
                </p>
            </div>

            {/* Card Footer */}
            <Link href={`/course/${id}`}>
                <Button variant="primary" className="w-full group-hover:shadow-md">
                    <PlayCircle className="h-4 w-4" />
                    {t.startLearning}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
            </Link>
        </div>
    );
}
