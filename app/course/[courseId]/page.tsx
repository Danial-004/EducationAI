import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { courses, modules, materials } from "@/lib/db/schema";
import { eq, asc } from "drizzle-orm";

// Импорттар (осы файлдар бар екеніне көз жеткізіңіз)
import { CourseSidebarClient } from "./course-sidebar-client";
import { CoursePageClient } from "./course-client";

// 👇 Next.js 15 үшін типтерді дұрыстау (Promise қылу керек)
interface PageProps {
    params: Promise<{ courseId: string }>;
    searchParams: Promise<{ materialId?: string }>;
}

export default async function CoursePage(props: PageProps) {
    // 1. Параметрлерді "күтіп" алу (await)
    const params = await props.params;
    const searchParams = await props.searchParams;

    const session = await auth();

    if (!session?.user) {
        return redirect("/auth");
    }

    // 2. Курсты базадан алу
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

    if (!course) {
        return redirect("/dashboard");
    }

    // 3. Қазіргі сабақты (Active Material) табу
    let activeMaterial = null;
    let moduleName = "";
    let lessonNumber = 1;

    // Егер URL-да ?materialId=... болса
    if (searchParams.materialId) {
        for (const module of course.modules) {
            const found = module.materials.find((m) => m.id === searchParams.materialId);
            if (found) {
                activeMaterial = found;
                moduleName = module.title;
                // Сабақтың реттік нөмірін табу
                const allMaterialsInModule = module.materials;
                lessonNumber = allMaterialsInModule.indexOf(found) + 1;
                break;
            }
        }
    }
    // Егер URL бос болса (курсты енді ашса), бірінші сабақты береміз
    else if (course.modules.length > 0 && course.modules[0].materials.length > 0) {
        activeMaterial = course.modules[0].materials[0];
        moduleName = course.modules[0].title;
        lessonNumber = 1;
    }

    // 4. "Келесі сабақ" батырмасы үшін логика
    let nextMaterial = null;

    // Барлық сабақтарды бір тізімге жинау (flat map)
    const allMaterials = course.modules.flatMap((m) => m.materials);

    if (activeMaterial) {
        const currentIndex = allMaterials.findIndex((m) => m.id === activeMaterial?.id);
        // Егер тізімнің соңы болмаса, келесі сабақты аламыз
        if (currentIndex !== -1 && currentIndex < allMaterials.length - 1) {
            nextMaterial = allMaterials[currentIndex + 1];
        }
    }

    return (
        <div className="flex h-full">
            {/* СОЛ ЖАҚ МЕНЮ (SIDEBAR) */}
            <div className="hidden md:flex h-full w-80 flex-col fixed inset-y-0 z-50 border-r bg-background">
                <CourseSidebarClient
                    course={course}
                    progressCount={0} // Әзірге 0, кейін қосамыз
                />
            </div>

            {/* ОҢ ЖАҚ НЕГІЗГІ БЕТ */}
            <main className="md:pl-80 h-full w-full overflow-y-auto">
                <div className="p-6 max-w-4xl mx-auto">
                    <CoursePageClient
                        courseId={course.id}
                        // activeMaterial null болса да қате шықпас үшін тексеру
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