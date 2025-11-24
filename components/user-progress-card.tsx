"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Flame, TrendingUp } from "lucide-react";
import { getUserProgress } from "@/app/actions/update-progress";

interface UserProgressCardProps {
    userId: string;
}

export function UserProgressCard({ userId }: UserProgressCardProps) {
    const [progress, setProgress] = useState({
        level: 1,
        xpInCurrentLevel: 0,
        xpForNextLevel: 100,
        streak: 0,
        progressPercent: 0,
    });

    useEffect(() => {
        async function loadProgress() {
            const result = await getUserProgress(userId);
            if (result.success) {
                setProgress({
                    level: result.level || 1,
                    xpInCurrentLevel: result.xpInCurrentLevel || 0,
                    xpForNextLevel: result.xpForNextLevel || 100,
                    streak: result.streak || 0,
                    progressPercent: result.progress || 0,
                });
            }
        }

        loadProgress();
    }, [userId]);

    return (
        <Card className="p-4 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
            <div className="space-y-3">
                {/* Level Badge */}
                <div className="flex items-center justify-between">
                    <Badge variant="default" className="gap-1.5 px-3 py-1">
                        <TrendingUp className="h-3.5 w-3.5" />
                        Level {progress.level}
                    </Badge>

                    {/* Streak */}
                    {progress.streak > 0 && (
                        <div className="flex items-center gap-1 text-orange-500">
                            <Flame className="h-4 w-4 fill-orange-500" />
                            <span className="text-sm font-bold">{progress.streak}</span>
                        </div>
                    )}
                </div>

                {/* XP Progress */}
                <div className="space-y-2">
                    <div className="flex justify-between text-xs text-muted-foreground">
                        <span>{progress.xpInCurrentLevel} XP</span>
                        <span>{progress.xpForNextLevel} XP</span>
                    </div>
                    <Progress value={progress.progressPercent} className="h-2" />
                </div>

                <p className="text-xs text-muted-foreground text-center">
                    {100 - progress.xpInCurrentLevel} XP to Level {progress.level + 1}
                </p>
            </div>
        </Card>
    );
}
