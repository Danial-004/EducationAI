import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { courses, modules, materials } from "@/lib/db/schema";
import { eq, asc } from "drizzle-orm";

// 👇 Бұл жерде біз экспорттамаймыз, тек ИМПОРТТАЙМЫЗ
import { CourseSidebarClient } from "./course-sidebar-client";
import { CoursePageClient } from "./course-client"; // Егер файл аты course-client.tsx болса

export default async function CoursePage({
    params,
    searchParams,
}: {
    params: { courseId: string };
    searchParams: { materialId?: string };
}) {
    const session = await auth();

    if (!session?.user) {
        return redirect("/auth");
    }

    // 1. Курсты, модульдерді және сабақтарды ретімен алу
    const course = await db.query.courses.findFirst({
        where: eq(courses.id, params.courseId),
        with: {
            modules: {
                orderBy: asc(modules.order), // Модульдер ретімен
                with: {
                    materials: {
                        orderBy: asc(materials.order), // Сабақтар ретімен
                    },
                },
            },
        },
    });

    if (!course) {
        return redirect("/dashboard");
    }

    // 2. Қазіргі ашылып тұрған сабақты табу
    let activeMaterial = null;
    let moduleName = "";
    let lessonNumber = 1;

    // Егер URL-да ?materialId=... болса, соны аламыз
    if (searchParams.materialId) {
        // Барлық сабақты аралап шығамыз
        for (const module of course.modules) {
            const found = module.materials.find((m) => m.id === searchParams.materialId);
            if (found) {
                activeMaterial = found;
                moduleName = module.title;
                // Сабақ нөмірін табу (шамамен)
                lessonNumber = module.materials.indexOf(found) + 1;
                break;
            }
        }
    }
    // Егер URL бос болса, ең бірінші сабақты ашамыз
    else if (course.modules.length > 0 && course.modules[0].materials.length > 0) {
        activeMaterial = course.modules[0].materials[0];
        moduleName = course.modules[0].title;
        lessonNumber = 1;
    }

    // 3. Келесі сабақты табу (Next Button үшін)
    let nextMaterial = null;
    if (activeMaterial) {
        const allMaterials = course.modules.flatMap((m) => m.materials);
        const currentIndex = allMaterials.findIndex((m) => m.id === activeMaterial?.id);
        if (currentIndex !== -1 && currentIndex < allMaterials.length - 1) {
            nextMaterial = allMaterials[currentIndex + 1];
        }
    }

    // Прогресс есептеу (әзірге 0%)
    const progressCount = 0;

    return (
        <div className="flex h-full">
            {/* СОЛ ЖАҚ МЕНЮ (SIDEBAR) */}
            <div className="hidden md:flex h-full w-80 flex-col fixed inset-y-0 z-50">
                <CourseSidebarClient
                    course={course}
                    progressCount={progressCount}
                />
            </div>

            {/* ОҢ ЖАҚ НЕГІЗГІ БЕТ */}
            <main className="md:pl-80 h-full w-full">
                <div className="p-6 max-w-4xl mx-auto">
                    <CoursePageClient
                        courseId={course.id}
                        activeMaterial={activeMaterial ? {
                            ...activeMaterial,
                            moduleId: activeMaterial.moduleId // Тип сәйкестігі үшін
                        } : null}
                        moduleName={moduleName}
                        lessonNumber={lessonNumber}
                        nextMaterial={nextMaterial}
                    />
                </div>
            </main>
        </div>
    );
}