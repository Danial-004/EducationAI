"use client";

import { Card } from "@/components/ui/card";
import { BookOpen, TrendingUp, Activity, Award } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";

interface StatsCardsProps {
    totalCourses: number;
    averageScore: number;
    coursesStarted: number;
    questionsAnswered: number;
}

export function StatsCards({
    totalCourses,
    averageScore,
    coursesStarted,
    questionsAnswered,
}: StatsCardsProps) {
    const { t } = useLanguage();

    const stats = [
        {
            label: t.availableCourses,
            value: totalCourses,
            icon: BookOpen,
            color: "text-blue-600",
            bgColor: "bg-blue-100",
        },
        {
            label: t.coursesStarted,
            value: coursesStarted,
            icon: Activity,
            color: "text-purple-600",
            bgColor: "bg-purple-100",
        },
        {
            label: t.averageScore,
            value: `${averageScore}%`,
            icon: Award,
            color: "text-green-600",
            bgColor: "bg-green-100",
        },
        {
            label: t.questionsAnswered,
            value: questionsAnswered,
            icon: TrendingUp,
            color: "text-amber-600",
            bgColor: "bg-amber-100",
        },
    ];

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => {
                const Icon = stat.icon;
                return (
                    <Card
                        key={stat.label}
                        className="p-6 border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                                <p className="mt-2 text-3xl font-bold text-foreground">{stat.value}</p>
                            </div>
                            <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                                <Icon className={`h-6 w-6 ${stat.color}`} />
                            </div>
                        </div>
                    </Card>
                );
            })}
        </div>
    );
}
