'use client';

import Link from 'next/link';
import { PlayCircle, FileText, GraduationCap } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/language-context';

interface CourseSidebarClientProps {
    modules: Array<{
        id: string;
        title: string;
        materials: Array<{
            id: string;
            type: string;
        }>;
    }>;
    courseId: string;
    activeMaterialId?: string;
}

export function CourseSidebarClient({
    modules,
    courseId,
    activeMaterialId
}: CourseSidebarClientProps) {
    const { t } = useLanguage();

    return (
        <div className="p-4 space-y-6">
            {modules.map((module, moduleIndex) => (
                <div key={module.id}>
                    <h3 className="mb-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        {t.module} {moduleIndex + 1}: {module.title}
                    </h3>
                    <div className="space-y-1">
                        {module.materials.map((material, materialIndex) => {
                            const isActive = activeMaterialId === material.id;
                            return (
                                <Link
                                    key={material.id}
                                    href={`/course/${courseId}?materialId=${material.id}`}
                                    className={cn(
                                        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                                        isActive
                                            ? "bg-primary/10 text-primary font-medium"
                                            : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                                    )}
                                >
                                    {material.type === "video" ? (
                                        <PlayCircle className={cn("h-4 w-4 flex-shrink-0", isActive ? "text-primary" : "text-muted-foreground")} />
                                    ) : (
                                        <FileText className={cn("h-4 w-4 flex-shrink-0", isActive ? "text-primary" : "text-muted-foreground")} />
                                    )}
                                    <span className="truncate">
                                        {t.lesson} {materialIndex + 1}
                                    </span>
                                    {isActive && <div className="ml-auto h-1.5 w-1.5 rounded-full bg-primary" />}
                                </Link>
                            );
                        })}
                    </div>
                </div>
            ))}

            {/* Final Exam Link - "Boss Level" */}
            <div className="pt-4 border-t">
                <Link
                    href={`/course/${courseId}/exam`}
                    className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-semibold transition-all bg-gradient-to-r from-yellow-500/20 to-orange-500/20 hover:from-yellow-500/30 hover:to-orange-500/30 border-2 border-yellow-500/30 hover:border-yellow-500/50 text-yellow-700 dark:text-yellow-400"
                >
                    <GraduationCap className="h-5 w-5 flex-shrink-0 text-yellow-600 dark:text-yellow-400 animate-pulse" />
                    <span>Final Exam</span>
                    <div className="ml-auto text-xs bg-yellow-500 text-white px-2 py-0.5 rounded-full">
                        BOSS
                    </div>
                </Link>
            </div>
        </div>
    );
}
