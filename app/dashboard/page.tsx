import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { courses, userProgress, users } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { DashboardStats } from "@/components/dashboard/stats-cards";
import { ProgressChart } from "@/components/dashboard/progress-chart";
import { CoursesSection } from "@/components/dashboard/courses-section";
import { CourseCard } from "@/components/dashboard/course-card";
import { UserProgressCard } from "@/components/dashboard/user-progress-card";
import { CreateCourseDialog } from "@/components/create-course-dialog"; // CHECK PATH: Might be components/dashboard/create-course-dialog too. Use the correct one.

export default async function DashboardPage() {
    const session = await auth();

    if (!session?.user?.id) {
        redirect("/");
    }
    const userId = session.user.id;

    // Fetch Data
    const [currentUser] = await db.select().from(users).where(eq(users.id, userId));
    const publishedCourses = await db.query.courses.findMany({
        orderBy: [desc(courses.createdAt)],
        with: {
            modules: true,
        }
    });
    const userProgressData = await db.select().from(userProgress).where(eq(userProgress.userId, userId));

    // Stats
    const totalCourses = publishedCourses.length;
    const coursesStarted = new Set(userProgressData.map((p) => p.targetId)).size;
    const questionsAnswered = userProgressData.length;
    const totalScore = userProgressData.reduce((acc, curr) => acc + (curr.score || 0), 0);
    const averageScore = questionsAnswered > 0 ? Math.round((totalScore / questionsAnswered) * 100) : 0;

    // Mock Data
    const chartData = [
        { name: "Mon", total: 10 }, { name: "Tue", total: 20 }, { name: "Wed", total: 15 },
        { name: "Thu", total: 30 }, { name: "Fri", total: 25 }, { name: "Sat", total: 40 }, { name: "Sun", total: 10 }
    ];

    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto px-4 py-8 space-y-8">
                {/* Header with Button */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <DashboardHeader userName={session.user.name} userEmail={session.user.email} />
                </div>

                {/* Stats */}
                <DashboardStats user={currentUser} />

                {/* Courses */}
                <CoursesSection hasPublishedCourses={publishedCourses.length > 0}>
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {publishedCourses.map((course) => (
                            <CourseCard key={course.id} id={course.id} title={course.title} description={course.description} moduleCount={course.modules?.length || 0} />
                        ))}
                    </div>
                </CoursesSection>
            </div>
        </div>
    );
}
