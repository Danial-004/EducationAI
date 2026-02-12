import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { DashboardStats } from "@/components/dashboard/stats-cards";
import { CoursesSection } from "@/components/dashboard/courses-section";
import { CreateCourseDialog } from "@/components/create-course-dialog"; // Батырманы импорттау
import { db } from "@/lib/db";
import { courses } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { CourseCard } from "@/components/course-card";

// ⚠️ МАҢЫЗДЫ: Мына жерге өзіңіздің Google почтаңызды жазыңыз!
const ADMIN_EMAIL = "danialsuttibaev@gmail.com";

export default async function DashboardPage() {
    const session = await auth();

    // 1. Егер адам кірмеген болса, Login-ге лақтырамыз
    if (!session?.user || !session.user.id) {
        return redirect("/auth");
    }

    // 2. Базадан курстарды аламыз
    const userCourses = await db.query.courses.findMany({
        //where: eq(courses.userId, session.user.id),
        with: {
            modules: {
                with: {
                    materials: true,
                }
            }
        },
        orderBy: (courses, { desc }) => [desc(courses.createdAt)],
    });

    // User статистикасы (әзірге жасанды деректер, кейін түзеуге болады)
    const userData = {
        xp: 0,
        streak: 0,
        coursesCompleted: 0,
    };

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <DashboardHeader userName={session.user.name} />

                {/* 👇 БАТЫРМА: Тек админ почтасымен кіргенде ғана шығады */}
                {session.user.email === ADMIN_EMAIL && (
                    <CreateCourseDialog />
                )}
            </div>

            <DashboardStats user={userData} />

            <CoursesSection hasPublishedCourses={userCourses.length > 0}>
                {userCourses.length > 0 ? (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {userCourses.map((course) => (
                            // 👇 CourseCard-қа деректерді бөлек-бөлек, дұрыс жібереміз
                            <CourseCard
                                key={course.id}
                                id={course.id}
                                title={course.title}
                                description={course.description}
                                chaptersLength={course.modules.length} // Модуль санын есептейміз
                                price={0}
                                progress={null}
                                category="General"
                                imageUrl={null}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-10">
                        <p className="text-muted-foreground">
                            {session.user.email === ADMIN_EMAIL
                                ? "Курстар жоқ. Жоғарыдағы батырманы басып, сататын курстарыңызды жасаңыз!"
                                : "Әзірге курстар жоқ."}
                        </p>
                    </div>
                )}
            </CoursesSection>
        </div>
    );
}