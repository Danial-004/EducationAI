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
import { Mail, Phone, Github } from "lucide-react";

// ⚠️ Админ почтасы
const ADMIN_EMAIL = "danialsuttibaev@gmail.com";

// ⚠️ Байланыс ақпараты
const CONTACT_INFO = {
    email: "danialsuttibaev@gmail.com",
    phone: "+7 (775) 125-52-46",
    telegram: "@torgay_admin"
};

export default async function DashboardPage() {
    const session = await auth();

    if (!session?.user || !session.user.id) {
        return redirect("/auth");
    }

    const isAdmin = session.user.email === ADMIN_EMAIL;
    const userId = session.user.id;
    const currentYear = new Date().getFullYear();

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
                {/* Header */}
                <div className="flex items-center justify-between space-y-2">
                    <DashboardHeader userName={session.user.name} />
                    {isAdmin && <CreateCourseDialog />}
                </div>

                {/* Stats */}
                <DashboardStats user={userData} />

                {/* Courses List */}
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

            {/* 👇 ЖАҢАРТЫЛҒАН FOOTER (FULL WIDTH / ТОЛЫҚ ЭКРАН) */}
            {/* Карточка емес, енді бұл толыққанды подвал */}
            <footer className="w-full mt-auto bg-slate-100 dark:bg-zinc-900 border-t border-slate-200 dark:border-zinc-800">
                <div className="container mx-auto px-6 py-8"> {/* Padding азайттым */}

                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        {/* Сол жағы: Мәтін */}
                        <div className="space-y-1">
                            <h4 className="font-bold text-lg text-slate-900 dark:text-slate-100 flex items-center gap-2">
                                📞 Байланыс орталығы
                            </h4>
                            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md">
                                Сұрақтарыңыз болса немесе курс ашылмаса, бізге хабарласыңыз.
                            </p>
                        </div>

                        {/* Оң жағы: Кнопкалар (Кішірейтілді) */}
                        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                            <a href={`mailto:${CONTACT_INFO.email}`} className="flex items-center justify-center gap-2 bg-white dark:bg-slate-800 px-4 py-2 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 hover:bg-slate-50 transition-colors">
                                <Mail className="h-4 w-4 text-blue-600" />
                                <span className="text-sm font-medium text-slate-700 dark:text-slate-200">danialsuttibaev@gmail.com</span>
                            </a>

                            <div className="flex items-center justify-center gap-2 bg-white dark:bg-slate-800 px-4 py-2 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
                                <Phone className="h-4 w-4 text-green-600" />
                                <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{CONTACT_INFO.phone}</span>
                            </div>
                        </div>
                    </div>

                    {/* Бөлгіш сызық */}
                    <div className="my-6 border-t border-slate-200 dark:border-zinc-700" />

                    {/* Ең асты: Copyright */}
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
                        <p>© {currentYear} Education AI. All rights reserved.</p>

                        <div className="flex items-center gap-6">
                            <a href="https://github.com" target="_blank" className="hover:text-slate-900 dark:hover:text-white transition-colors">
                                <Github className="h-4 w-4" />
                            </a>
                            <a href="#" className="hover:text-slate-900 dark:hover:text-white transition-colors">
                                Privacy Policy
                            </a>
                            <a href="#" className="hover:text-slate-900 dark:hover:text-white transition-colors">
                                Terms of Service
                            </a>
                        </div>
                    </div>

                </div>
            </footer>
        </div>
    );
}