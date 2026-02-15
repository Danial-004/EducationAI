import { auth } from "@/auth";
import { redirect, notFound } from "next/navigation";
import { db } from "@/lib/db";
import { courses, modules, materials, purchases } from "@/lib/db/schema";
import { eq, asc, and } from "drizzle-orm";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Menu, Lock } from "lucide-react";

import { CourseSidebarClient } from "./course-sidebar-client";
import { CoursePageClient } from "./course-client";
import { AiTutor } from "@/components/ai-tutor";
import {
    Sheet,
    SheetContent,
    SheetTrigger,
    SheetTitle,
} from "@/components/ui/sheet";

// 👇 ФОРМАНЫ ИМПОРТТАУ (Жолы қате болса, өзіңіз түзеп жібересіз)
import { EnrollForm } from "@/app/dashboard/_components/enroll-form";

interface PageProps {
    params: Promise<{ courseId: string }>;
    searchParams: Promise<{ materialId?: string }>;
}

export default async function CoursePage(props: PageProps) {
    const params = await props.params;
    const searchParams = await props.searchParams;

    const session = await auth();

    // ✅ ID жоқ болса да лақтырып жібереміз. Сонда төмендегі код "ID нақты бар" деп сенімді болады.
    if (!session?.user || !session.user.id) {
        return redirect("/auth");
    }

    // -------------------------------------------------------------
    // 1. АДМИНДІ ТЕКСЕРУ (Осында өз почтаңызды жазыңыз)
    // -------------------------------------------------------------
    const myEmail = "danialsuttibaev@gmail.com";
    const isAdmin = session.user.email === myEmail;
    // -------------------------------------------------------------

    // 2. КУРСТЫ ТАБУ
    const course = await db.query.courses.findFirst({
        where: eq(courses.id, params.courseId),
        with: {
            modules: {
                orderBy: asc(modules.order),
                with: {
                    materials: {
                        orderBy: asc(materials.order),
                    },
                },
            },
        },
    });

    if (!course) return notFound();

    // 3. "САТЫП АЛДЫ МА?" ДЕП ТЕКСЕРУ
    const purchase = await db.query.purchases.findFirst({
        where: and(
            eq(purchases.userId, session.user.id),
            eq(purchases.courseId, params.courseId)
        ),
    });

    // ⛔ БЛОКТАУ: Егер сатып алмаса ЖӘНЕ Админ болмаса -> Dashboard-қа лақтыр
    if (!purchase && !isAdmin) {
        return redirect("/dashboard");
    }

    // 4. САБАҚТАРДЫ РЕТТЕУ (Сіздің ескі логикаңыз)
    let activeMaterial = null;
    const allMaterials = course.modules.flatMap((m) => m.materials);

    if (searchParams.materialId) {
        activeMaterial = allMaterials.find((m) => m.id === searchParams.materialId);
    }
    // Егер ID жоқ болса, бірінші сабақты ашамыз
    if (!activeMaterial && allMaterials.length > 0) {
        activeMaterial = allMaterials[0];
    }

    let nextMaterial = null;
    let moduleName = "";
    let lessonNumber = 1;

    if (activeMaterial) {
        const currentIndex = allMaterials.findIndex((m) => m.id === activeMaterial?.id);
        if (currentIndex !== -1 && currentIndex < allMaterials.length - 1) {
            nextMaterial = allMaterials[currentIndex + 1];
        }
        const activeModule = course.modules.find(m => m.id === activeMaterial?.moduleId);
        moduleName = activeModule?.title || "";
        lessonNumber = (activeModule?.materials.findIndex(m => m.id === activeMaterial?.id) ?? 0) + 1;
    }

    return (
        <div className="flex h-screen flex-col md:flex-row overflow-hidden">

            {/* ----------------- SIDEBAR DESKTOP ----------------- */}
            <div className="hidden md:flex w-80 flex-col border-r bg-background h-full fixed inset-y-0 z-50">
                <div className="p-4 border-b flex items-center gap-2 h-16">
                    <Link href="/dashboard">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <span className="font-semibold truncate" title={course.title}>
                        {course.title}
                    </span>
                </div>
                <div className="flex-1 overflow-y-auto">
                    <CourseSidebarClient course={course} progressCount={0} />
                </div>
            </div>

            {/* ----------------- MOBILE HEADER ----------------- */}
            <div className="md:hidden flex items-center justify-between p-4 border-b bg-background h-16 sticky top-0 z-40">
                <div className="flex items-center gap-2 overflow-hidden">
                    <Link href="/dashboard">
                        <ArrowLeft className="h-5 w-5 text-muted-foreground" />
                    </Link>
                    <span className="font-semibold truncate max-w-[200px]">{course.title}</span>
                </div>
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="outline" size="icon">
                            <Menu className="h-5 w-5" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-80 p-0">
                        <div className="p-4 border-b h-16 flex items-center">
                            <SheetTitle className="font-semibold truncate">{course.title}</SheetTitle>
                        </div>
                        <div className="h-[calc(100vh-4rem)] overflow-y-auto">
                            <CourseSidebarClient course={course} progressCount={0} />
                        </div>
                    </SheetContent>
                </Sheet>
            </div>

            {/* ----------------- MAIN CONTENT ----------------- */}
            <main className="flex-1 md:pl-80 h-full overflow-y-auto bg-slate-50 dark:bg-zinc-900/50">

                {/* 👇 ТЕК АДМИНГЕ КӨРІНЕТІН "СТУДЕНТ ҚОСУ" ПАНЕЛІ */}
                {isAdmin && (
                    <div className="m-6 p-4 border border-indigo-200 bg-indigo-50 dark:bg-indigo-950/30 rounded-lg shadow-sm">
                        <div className="flex items-center gap-2 text-indigo-800 dark:text-indigo-300 font-semibold mb-2">
                            <Lock className="h-4 w-4" />
                            Админ панелі (Қолмен қосу)
                        </div>
                        <EnrollForm courseId={course.id} />
                    </div>
                )}

                <AiTutor courseTitle={course.title} />

                <div className="p-6 max-w-4xl mx-auto pb-20">
                    <CoursePageClient
                        courseId={course.id}
                        activeMaterial={activeMaterial ? {
                            id: activeMaterial.id,
                            type: activeMaterial.type,
                            content: activeMaterial.content || "",
                            moduleId: activeMaterial.moduleId
                        } : null}
                        moduleName={moduleName}
                        lessonNumber={lessonNumber}
                        nextMaterial={nextMaterial ? { id: nextMaterial.id } : null}
                    />
                </div>
            </main>
        </div>
    );
}