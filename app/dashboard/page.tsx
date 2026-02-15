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

            {/* 👇 ЖАҢАРТЫЛҒАН FOOTER (БАРЛЫҒЫ БІР БЛОКТА) */}
            <div className="mt-auto w-full border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
                <div className="container mx-auto px-6 py-10">

                    {/* КӨК КАРТОЧКА */}
                    <div className="bg-blue-50 dark:bg-slate-900 rounded-2xl border border-blue-100 dark:border-slate-800 p-8">

                        {/* Жоғарғы жағы: Контактылар */}
                        <div className="flex flex-col md:flex-row justify-between gap-8 mb-8">
                            <div className="space-y-2">
                                <h4 className="font-bold text-xl text-blue-900 dark:text-blue-100 flex items-center gap-2">
                                    📞 Курсқа қатысты сұрақтар бойынша
                                </h4>
                                <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm">
                                    Курс ашылмай жатса немесе сұрақтарыңыз болса, бізге жазыңыз.
                                </p>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4">
                                <a href={`mailto:${CONTACT_INFO.email}`} className="flex items-center gap-3 bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 hover:shadow-md transition-all">
                                    <div className="bg-blue-100 p-2 rounded-full text-blue-600">
                                        <Mail className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] uppercase text-slate-400 font-bold tracking-wider">Email</p>
                                        <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{CONTACT_INFO.email}</p>
                                    </div>
                                </a>

                                <div className="flex items-center gap-3 bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700">
                                    <div className="bg-green-100 p-2 rounded-full text-green-600">
                                        <Phone className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] uppercase text-slate-400 font-bold tracking-wider">WhatsApp</p>
                                        <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{CONTACT_INFO.phone}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Астыңғы жағы: Copyright (Сызықпен бөлінген) */}
                        <div className="pt-6 border-t border-blue-200 dark:border-slate-700 flex flex-col md:flex-row items-center justify-between gap-4">
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                © {currentYear} Education AI. All rights reserved.
                            </p>

                            <div className="flex items-center gap-6">
                                <a href="https://github.com" target="_blank" className="text-slate-400 hover:text-blue-600 transition-colors">
                                    <Github className="h-5 w-5" />
                                </a>
                                <span className="text-slate-300">|</span>
                                <a href="#" className="text-sm text-slate-500 hover:text-blue-600 transition-colors">
                                    Privacy Policy
                                </a>
                                <a href="#" className="text-sm text-slate-500 hover:text-blue-600 transition-colors">
                                    Terms of Service
                                </a>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}