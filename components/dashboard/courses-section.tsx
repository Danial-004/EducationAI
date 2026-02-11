'use client';

import { useLanguage } from "@/contexts/language-context";

export function CoursesSection({ children, hasPublishedCourses }: { children: React.ReactNode, hasPublishedCourses: boolean }) {
    const { t } = useLanguage();

    return (
        <div className="space-y-4">
            <h2 className="text-2xl font-bold tracking-tight">{t.yourCourses}</h2>
            {children}
        </div>
    );
}