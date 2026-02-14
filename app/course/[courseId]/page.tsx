"use client";

import { cn } from "@/lib/utils";
import { useRouter, usePathname } from "next/navigation";
import { Lock, PlayCircle, CheckCircle } from "lucide-react";

// Типтер (қате шықпас үшін any қолданамыз, бірақ дұрысы нақты тип болуы керек)
interface CourseSidebarClientProps {
    course: any;
    progressCount: number;
}

// 👇 ЕҢ МАҢЫЗДЫСЫ: "export function" деп жазылуы керек (default емес!)
export function CourseSidebarClient({
    course,
    progressCount,
}: CourseSidebarClientProps) {
    const router = useRouter();
    const pathname = usePathname();

    return (
        <div className="h-full border-r flex flex-col overflow-y-auto shadow-sm bg-white dark:bg-zinc-900">
            <div className="p-6 flex flex-col border-b">
                <h1 className="font-semibold text-md">{course.title}</h1>
                {/* Прогресс бар */}
                <div className="mt-4">
                    <div className="h-2 w-full bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-emerald-500 transition-all duration-300"
                            style={{ width: `${progressCount}%` }}
                        />
                    </div>
                    <p className="text-xs text-muted-foreground mt-2 font-medium">
                        {Math.round(progressCount)}% аяқталды
                    </p>
                </div>
            </div>

            <div className="flex flex-col w-full">
                {course.modules?.map((module: any) => (
                    <div key={module.id} className="flex flex-col">
                        <div className="px-4 py-3 bg-slate-50 dark:bg-zinc-800/50 font-medium text-sm text-slate-600 dark:text-slate-300 border-y">
                            {module.title}
                        </div>
                        {module.materials?.map((lesson: any) => {
                            const isActive = pathname?.includes(lesson.id);
                            // Логика: Егер алдыңғы сабақ бітпесе, келесісі жабық болуы мүмкін (әзірге ашық)
                            const isLocked = false;

                            return (
                                <button
                                    key={lesson.id}
                                    onClick={() => router.push(`/course/${course.id}?materialId=${lesson.id}`)}
                                    className={cn(
                                        "flex items-center gap-x-2 text-slate-500 text-sm font-[500] pl-6 transition-all hover:text-slate-600 hover:bg-slate-300/20 py-4",
                                        isActive && "text-emerald-700 bg-emerald-100/20 hover:bg-emerald-100/20 hover:text-emerald-700 dark:text-emerald-400 dark:bg-emerald-900/10 border-r-2 border-emerald-500",
                                        isLocked && "opacity-50 pointer-events-none"
                                    )}
                                >
                                    {isLocked ? (
                                        <Lock className="h-4 w-4" />
                                    ) : isActive ? (
                                        <PlayCircle className="h-4 w-4 text-emerald-600" />
                                    ) : (
                                        <CheckCircle className="h-4 w-4 text-slate-400" />
                                    )}
                                    <span className="line-clamp-1 text-left">{lesson.title}</span>
                                </button>
                            )
                        })}
                    </div>
                ))}
            </div>
        </div>
    );
}