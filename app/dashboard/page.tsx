import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { DashboardStats } from "@/components/dashboard/stats-cards";
import { CoursesSection } from "@/components/dashboard/courses-section";
import { CreateCourseDialog } from "@/components/create-course-dialog";
import { db } from "@/lib/db";
import { courses } from "@/lib/db/schema"; // eq импорты керек емес болса алып тастаңыз
import { CourseCard } from "@/components/course-card";

// ⚠️ МАҢЫЗДЫ: Мына жерге өзіңіздің Google почтаңызды жазыңыз!
const ADMIN_EMAIL = "danialsuttibaev@gmail.com";

export default async function DashboardPage() {
    const session = await auth();

    // 1. Егер адам кірмеген болса, Login-ге лақтырамыз
    if (!session?.user || !session.user.id) {
        return redirect("/auth");
    }

    // 👇 ЖАҢА ҚОСЫЛҒАН ЖЕР: Админ бе, жоқ па тексереміз
    const isAdmin = session.user.email === ADMIN_EMAIL;

    // 2. Базадан курстарды аламыз
    const userCourses = await db.query.courses.findMany({
        with: {
            modules: {
                with: {
                    materials: true,
                }
            }
        },
        orderBy: (courses, { desc }) => [desc(courses.createdAt)],
    });

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
                {isAdmin && (
                    <CreateCourseDialog />
                )}
            </div>

            <DashboardStats user={userData} />

            <CoursesSection hasPublishedCourses={userCourses.length > 0}>
                {userCourses.length > 0 ? (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {userCourses.map((course) => (
                            <CourseCard
                                key={course.id}
                                id={course.id}
                                title={course.title}
                                description={course.description}
                                chaptersLength={course.modules.length}
                                price={0}
                                progress={null}
                                category="General"
                                imageUrl={null}
                                // 👇 ЖАҢА ҚОСЫЛҒАН ЖЕР: Карточкаға "Сен админсің" деп айтамыз
                                isAdmin={isAdmin}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-10">
                        <p className="text-muted-foreground">
                            {isAdmin
                                ? "Курстар жоқ. Жоғарыдағы батырманы басып, сататын курстарыңызды жасаңыз!"
                                : "Әзірге курстар жоқ."}
                        </p>
                    </div>
                )}
            </CoursesSection>
        </div>
    );
}