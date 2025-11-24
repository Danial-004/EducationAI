import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Trophy, Medal } from "lucide-react";
import Link from "next/link";

export function ExamResult({ result, courseId }: any) {
    const isPass = result.score >= 50;

    return (
        <div className="max-w-2xl mx-auto py-10 space-y-6">
            <Card className={`text-center border-t-8 ${isPass ? 'border-green-500' : 'border-red-500'} shadow-2xl`}>
                <CardHeader>
                    <div className="mx-auto bg-muted p-4 rounded-full mb-4 w-fit">
                        {isPass ? <Trophy className="h-12 w-12 text-yellow-500" /> : <XCircle className="h-12 w-12 text-red-500" />}
                    </div>
                    <CardTitle className="text-3xl font-bold">{isPass ? "Exam Passed!" : "Exam Failed"}</CardTitle>
                    <p className="text-muted-foreground">
                        {isPass ? `You have earned the ${result.grade} Certificate` : "Don't give up! Review the material and try again."}
                    </p>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="text-6xl font-black tracking-tighter">
                        {result.score}%
                    </div>

                    {isPass && (
                        <div className="bg-yellow-500/10 border border-yellow-500/20 p-4 rounded-lg">
                            <p className="font-semibold text-yellow-700 dark:text-yellow-400 flex items-center justify-center gap-2">
                                <Medal className="h-5 w-5" /> Official Grade: {result.grade}
                            </p>
                        </div>
                    )}

                    {result.xpAwarded && result.xpAwarded > 0 && (
                        <div className="bg-purple-500/10 border border-purple-500/20 p-4 rounded-lg">
                            <p className="font-semibold text-purple-700 dark:text-purple-400">
                                +{result.xpAwarded} XP Earned! 🎉
                            </p>
                        </div>
                    )}

                    <div className="flex gap-4 justify-center">
                        <Link href={`/course/${courseId}`}>
                            <Button variant="outline">Back to Course</Button>
                        </Link>
                        {!isPass && (
                            <Button onClick={() => window.location.reload()}>Retake Exam</Button>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
