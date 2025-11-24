"use client";

import { useLanguage } from "@/contexts/language-context";
import { GraduationCap, Sparkles } from "lucide-react";
import { CreateCourseDialog } from "@/components/create-course-dialog";

interface DashboardHeaderProps {
    userName?: string | null;
    userEmail?: string | null;
}

export function DashboardHeader({ userName, userEmail }: DashboardHeaderProps) {
    const { t } = useLanguage();

    return (
        <div className="mb-12">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-blue-100 px-4 py-2 text-sm font-medium text-blue-700">
                <Sparkles className="h-4 w-4" />
                {t.welcomeBack}
            </div>
            <h1 className="mb-2 text-4xl font-bold tracking-tight text-foreground">
                {t.hello}, {userName || userEmail?.split('@')[0]}!
            </h1>
            <p className="text-lg text-muted-foreground">
                {t.continueJourney}
            </p>
        </div>
    );
}

interface ProgressSectionProps {
    children: React.ReactNode;
}

export function ProgressSection({ children }: ProgressSectionProps) {
    const { t } = useLanguage();

    return (
        <div className="mb-12 space-y-6">
            <h2 className="text-2xl font-semibold text-foreground">{t.yourProgress}</h2>
            {children}
        </div>
    );
}

interface CoursesSectionProps {
    hasPublishedCourses: boolean;
    children: React.ReactNode;
}

export function CoursesSection({ hasPublishedCourses, children }: CoursesSectionProps) {
    const { t } = useLanguage();

    if (!hasPublishedCourses) {
        return (
            <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-white py-16">
                <GraduationCap className="mb-4 h-12 w-12 text-gray-400" />
                <h3 className="mb-2 text-xl font-semibold text-foreground">
                    {t.noCoursesYet}
                </h3>
                <p className="text-muted-foreground mb-6">
                    {t.checkBackSoon}
                </p>
                <CreateCourseDialog />
            </div>
        );
    }

    return (
        <div>
            <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <GraduationCap className="h-6 w-6 text-gray-700" />
                    <h2 className="text-2xl font-semibold text-foreground">
                        {t.availableCourses}
                    </h2>
                </div>
                <CreateCourseDialog />
            </div>
            {children}
        </div>
    );
}
