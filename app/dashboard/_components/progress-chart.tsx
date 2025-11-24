"use client";

import { Card } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useLanguage } from "@/contexts/language-context";

interface ProgressChartProps {
    data: Array<{ name: string; score: number }>;
}

export function ProgressChart({ data }: ProgressChartProps) {
    const { t } = useLanguage();

    // Show placeholder if no data
    if (!data || data.length === 0) {
        return (
            <Card className="p-6 border-border bg-card shadow-sm">
                <h3 className="text-lg font-semibold text-foreground mb-4">{t.activityOverview}</h3>
                <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                    <p>{t.noActivity}</p>
                </div>
            </Card>
        );
    }

    return (
        <Card className="p-6 border-border bg-card shadow-sm">
            <h3 className="text-lg font-semibold text-foreground mb-4">{t.activityOverview}</h3>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:stroke-zinc-700" />
                    <XAxis
                        dataKey="name"
                        stroke="#6b7280"
                        className="dark:stroke-zinc-400"
                        style={{ fontSize: '12px' }}
                    />
                    <YAxis
                        stroke="#6b7280"
                        className="dark:stroke-zinc-400"
                        style={{ fontSize: '12px' }}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: 'hsl(var(--background))',
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '8px',
                            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                        }}
                        labelStyle={{ color: 'hsl(var(--foreground))', fontWeight: 600 }}
                        itemStyle={{ color: '#2563eb' }}
                    />
                    <Bar
                        dataKey="score"
                        fill="#2563eb"
                        radius={[8, 8, 0, 0]}
                    />
                </BarChart>
            </ResponsiveContainer>
        </Card>
    );
}
