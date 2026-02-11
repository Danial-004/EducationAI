'use client';

import { useLanguage } from "@/contexts/language-context";
import { Zap, Trophy, Target, Crown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export function DashboardStats({ user }: { user: any }) {
    const { t } = useLanguage();

    // Logic: Level 1 = 0-100 XP. Level 2 = 101-200 XP.
    const xp = user.xp || 0;
    const level = Math.floor(xp / 100) + 1;
    const nextLevelXp = level * 100;
    const currentLevelProgress = xp % 100; // 0 to 99

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8 animate-in fade-in slide-in-from-top-4 duration-500">

            {/* LEVEL CARD */}
            <Card className="border-l-4 border-l-violet-500 shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">{t.currentLevel}</CardTitle>
                    <Crown className="h-4 w-4 text-violet-500" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-violet-700 dark:text-violet-400">Lvl {level}</div>
                    <Progress value={currentLevelProgress} className="h-2 mt-2" indicatorClassName="bg-violet-500" />
                    <p className="text-xs text-muted-foreground mt-1 text-right">{xp} / {nextLevelXp} XP</p>
                </CardContent>
            </Card>

            {/* STREAK CARD */}
            <Card className="border-l-4 border-l-orange-500 shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">{t.streak}</CardTitle>
                    <Zap className="h-4 w-4 text-orange-500 fill-orange-500" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">{user.streak || 0} {t.days}</div>
                    <p className="text-xs text-muted-foreground mt-1">{t.keepItUp}</p>
                </CardContent>
            </Card>

            {/* TOTAL XP CARD */}
            <Card className="border-l-4 border-l-blue-500 shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">{t.totalXp}</CardTitle>
                    <Trophy className="h-4 w-4 text-blue-500" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{xp} XP</div>
                    <p className="text-xs text-muted-foreground mt-1">{t.topLearner}</p>
                </CardContent>
            </Card>

            {/* GOAL CARD (Mockup for now) */}
            <Card className="border-l-4 border-l-emerald-500 shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">{t.weeklyGoal}</CardTitle>
                    <Target className="h-4 w-4 text-emerald-500" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">3 / 5</div>
                    <Progress value={60} className="h-2 mt-2" indicatorClassName="bg-emerald-500" />
                    <p className="text-xs text-muted-foreground mt-1">{t.lessonsCompleted}</p>
                </CardContent>
            </Card>
        </div>
    );
}