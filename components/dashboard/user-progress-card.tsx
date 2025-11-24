import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Trophy, Flame, Star } from "lucide-react";

export function UserProgressCard({ userProgressData }: { userProgressData: any[] }) {
    // Logic to calculate stats
    const totalXP = userProgressData.reduce((acc, curr) => acc + (curr.score ? curr.score * 10 : 0), 0);
    const level = Math.floor(totalXP / 100) + 1;
    const nextLevelXP = level * 100;
    const progressPercent = ((totalXP % 100) / 100) * 100;
    const streak = 1; // Placeholder until DB logic is fully connected

    return (
        <Card className="border-none bg-gradient-to-br from-violet-600 to-indigo-600 text-white shadow-xl overflow-hidden relative">
            {/* Decorative background blob */}
            <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>

            <CardHeader className="flex flex-row items-center justify-between pb-2 relative z-10">
                <CardTitle className="text-lg font-medium text-white/90">Your Level</CardTitle>
                <Trophy className="h-6 w-6 text-yellow-300 animate-pulse" />
            </CardHeader>
            <CardContent className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                    <span className="text-4xl font-bold">{level}</span>
                    <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full border border-white/10">
                        <Flame className="h-4 w-4 fill-orange-400 text-orange-400" />
                        <span className="text-sm font-semibold">{streak} Day Streak</span>
                    </div>
                </div>

                <div className="space-y-2">
                    <div className="flex justify-between text-xs text-indigo-100 font-medium">
                        <span>{totalXP} XP</span>
                        <span>{nextLevelXP} XP</span>
                    </div>
                    {/* Custom styled progress bar */}
                    <div className="h-3 w-full bg-black/20 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 transition-all duration-500"
                            style={{ width: `${progressPercent}%` }}
                        />
                    </div>
                    <p className="text-xs text-indigo-100 text-right">
                        {100 - (totalXP % 100)} XP to Level {level + 1}
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}
