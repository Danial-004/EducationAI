import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { DashboardStats } from "@/components/dashboard/stats-cards";
import { CoursesSection } from "@/components/dashboard/courses-section";
import { CreateCourseDialog } from "@/components/create-course-dialog";
import { db } from "@/lib/db";
import { courses, purchases } from "@/lib/db/schema";
import { eq, inArray, desc } from "drizzle-orm";
import { CourseCard } from "@/components/course-card";
import { Footer } from "@/components/footer"; // 👈 Осы компонент аудармаға жауап береді

const ADMIN_EMAIL = "danialsuttibaev@gmail.com";

export default async function DashboardPage() {
    const session = await auth();

    if (!session?.user || !session.user.id) {
        return redirect("/auth");
    }

    const isAdmin = session.user.email === ADMIN_EMAIL;
    const userId = session.user.id;

    let userCourses: any[] = [];

    // --- ЛОГИКА ---
    if (isAdmin) {
        userCourses = await db.query.courses.findMany({
            with: { modules: { with: { materials: true } } },
            orderBy: [desc(courses.createdAt)],
        });
    } else {
        const purchasedData = await db.query.purchases.findMany({
            where: eq(purchases.userId, userId),
            columns: { courseId: true }
        });
        const purchasedCourseIds = purchasedData.map((p) => p.courseId);

        if (purchasedCourseIds.length > 0) {
            userCourses = await db.query.courses.findMany({
                where: inArray(courses.id, purchasedCourseIds),
                with: { modules: { with: { materials: true } } },
                orderBy: [desc(courses.createdAt)],
            });
        }
    }

    const userData = { xp: 0, streak: 0, coursesCompleted: 0 };

    return (
        <div className="flex flex-col min-h-screen">
            <div className="flex-1 space-y-4 p-8 pt-6 pb-20">
                <div className="flex items-center justify-between space-y-2">
                    <DashboardHeader userName={session.user.name} />
                    {isAdmin && <CreateCourseDialog />}
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
                                    isAdmin={isAdmin}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-16 bg-slate-50 dark:bg-slate-900 rounded-lg border border-dashed">
                            <h3 className="text-xl font-medium text-slate-900 dark:text-slate-100 mb-2">
                                {isAdmin
                                    ? "Курстар жоқ. Жаңа курс жасаңыз!"
                                    : "Сізде әзірге қолжетімді курстар жоқ."}
                            </h3>
                            {!isAdmin && (
                                <p className="text-muted-foreground max-w-md mx-auto">
                                    Төмендегі ақпарат бойынша хабарласыңыз.
                                </p>
                            )}
                        </div>
                    )}
                </CoursesSection>
            </div>

            {/* 👇 ФУТЕР (Бөлек компонент ретінде) */}
            <Footer />
        </div>
    );
}