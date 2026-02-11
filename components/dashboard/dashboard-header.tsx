'use client';

import { useLanguage } from "@/contexts/language-context";

export function DashboardHeader({ userName, userEmail }: { userName?: string | null, userEmail?: string | null }) {
    const { t } = useLanguage();

    return (
        <div className="flex items-center justify-between">
            <div>
                {/* t.dashboard қолданамыз */}
                <h1 className="text-3xl font-bold tracking-tight">{t.dashboard}</h1>
                <p className="text-muted-foreground">
                    {t.welcomeBack}, {userName || 'Student'}!
                </p>
            </div>
        </div>
    );
}