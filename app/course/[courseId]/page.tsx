import { auth } from "@/auth";
import { redirect, notFound } from "next/navigation";
import { db } from "@/lib/db";
import { courses, modules, materials } from "@/lib/db/schema";
import { eq, asc } from "drizzle-orm";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Menu } from "lucide-react";

// Импорттар
import { CourseSidebarClient } from "./course-sidebar-client";
import { CoursePageClient } from "./course-client";
import { AiTutor } from "@/components/ai-tutor";
import {
    Sheet,
    SheetContent,
    SheetTrigger,
    SheetTitle,
} from "@/components/ui/sheet";

// Next.js 15 типтері
interface PageProps {
    params: Promise<{ courseId: string }>;
    searchParams: Promise<{ materialId?: string }>;
}

export default async function CoursePage(props: PageProps) {
    // 1. Параметрлерді күтіп аламыз (Next.js 15 fix)
    const params = await props.params;
    const searchParams = await props.searchParams;

    const session = await auth();
    if (!session?.user) return redirect("/auth");

    // 2. Курсты алу
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

    // 3. Активті сабақты табу логикасы
    let activeMaterial = null;
    const allMaterials = course.modules.flatMap((m) => m.materials);

    if (searchParams.materialId) {
        activeMaterial = allMaterials.find((m) => m.id === searchParams.materialId);
    }
    // Егер URL бос болса -> бірінші сабақты ашамыз
    if (!activeMaterial && allMaterials.length > 0) {
        activeMaterial = allMaterials[0];
    }

    // Келесі сабақты табу
    let nextMaterial = null;
    let moduleName = "";
    let lessonNumber = 1;

    if (activeMaterial) {
        const currentIndex = allMaterials.findIndex((m) => m.id === activeMaterial?.id);
        if (currentIndex !== -1 && currentIndex < allMaterials.length - 1) {
            nextMaterial = allMaterials[currentIndex + 1];
        }

        // Модуль аты мен сабақ нөмірін табу
        const activeModule = course.modules.find(m => m.id === activeMaterial?.moduleId);
        moduleName = activeModule?.title || "";
        lessonNumber = (activeModule?.materials.findIndex(m => m.id === activeMaterial?.id) ?? 0) + 1;
    }

    return (
        <div className="flex h-screen flex-col md:flex-row overflow-hidden">

            {/* -------------------------------------------------- */}
            {/* 1. DESKTOP SIDEBAR (Тек компьютерде көрінеді)      */}
            {/* -------------------------------------------------- */}
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
                    <CourseSidebarClient
                        course={course}
                        progressCount={0}
                    />
                </div>
            </div>

            {/* -------------------------------------------------- */}
            {/* 2. MOBILE HEADER (Тек телефонда көрінеді)          */}
            {/* -------------------------------------------------- */}
            <div className="md:hidden flex items-center justify-between p-4 border-b bg-background h-16 sticky top-0 z-40">
                <div className="flex items-center gap-2 overflow-hidden">
                    <Link href="/dashboard">
                        <ArrowLeft className="h-5 w-5 text-muted-foreground" />
                    </Link>
                    <span className="font-semibold truncate max-w-[200px]">{course.title}</span>
                </div>

                {/* БУРГЕР МЕНЮ */}
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
                            <CourseSidebarClient
                                course={course}
                                progressCount={0}
                            />
                        </div>
                    </SheetContent>
                </Sheet>
            </div>

            {/* -------------------------------------------------- */}
            {/* 3. MAIN CONTENT (Негізгі экран)                    */}
            {/* -------------------------------------------------- */}
            <main className="flex-1 md:pl-80 h-full overflow-y-auto bg-slate-50 dark:bg-zinc-900/50">
                {/* AI Tutor Floating Button */}
                <AiTutor courseTitle={course.title} />

                <div className="p-6 max-w-4xl mx-auto pb-20">
                    <CoursePageClient
                        courseId={course.id}
                        // activeMaterial-ды дұрыстап жібереміз
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