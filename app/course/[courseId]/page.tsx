import { auth } from "@/auth";
import { db } from "@/lib/db";
import { courses, modules, materials } from "@/lib/db/schema";
import { eq, asc } from "drizzle-orm";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { VideoPlayer } from "@/components/video-player";
import { MarkdownText } from "@/components/markdown-text";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { AiTutor } from "@/components/ai-tutor";
import { CourseSidebarClient } from "./course-sidebar-client";
import { CoursePageClient } from "./course-client";

interface PageProps {
    params: Promise<{ courseId: string }>;
    searchParams: Promise<{ materialId?: string }>;
}

export default async function CoursePage({ params, searchParams }: PageProps) {
    const session = await auth();
    if (!session) {
        redirect("/api/auth/signin");
    }

    const { courseId } = await params;
    const { materialId } = await searchParams;

    // Fetch course with modules and materials
    const course = await db.query.courses.findFirst({
        where: eq(courses.id, courseId),
        with: {
            modules: {
                orderBy: [asc(modules.order)],
                with: {
                    materials: true,
                },
            },
        },
    });

    if (!course) {
        notFound();
    }

    // Flatten materials to find the active one and calculate progress
    const allMaterials = course.modules.flatMap((m) => m.materials);

    let activeMaterial = null;
    if (materialId) {
        activeMaterial = allMaterials.find((m) => m.id === materialId);
    }

    // Default to first material if no active material found or specified
    if (!activeMaterial && allMaterials.length > 0) {
        activeMaterial = allMaterials[0];
    }

    // Calculate next lesson
    const activeIndex = allMaterials.findIndex((m) => m.id === activeMaterial?.id);
    const nextMaterial = activeIndex >= 0 && activeIndex < allMaterials.length - 1 ? allMaterials[activeIndex + 1] : null;

    // Find module name and lesson number for active material
    const activeModule = course.modules.find(m => m.id === activeMaterial?.moduleId);
    const moduleName = activeModule?.title || '';
    const lessonNumber = activeModule?.materials.findIndex(m => m.id === activeMaterial?.id)! + 1 || 0;

    return (
        <div className="flex h-[calc(100vh-4rem)] flex-col md:flex-row relative">
            {/* AI Tutor */}
            <AiTutor courseTitle={course.title} />

            {/* Sidebar */}
            <div className="w-full md:w-80 h-auto md:h-full max-h-[30vh] md:max-h-none border-b md:border-r border-border bg-muted/30 overflow-y-auto">
                <div className="p-4 border-b border-border flex items-center gap-2">
                    <Link href="/dashboard">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <h2 className="font-semibold text-foreground truncate" title={course.title}>
                        {course.title}
                    </h2>
                </div>
                <CourseSidebarClient
                    modules={course.modules}
                    courseId={courseId}
                    activeMaterialId={activeMaterial?.id}
                />
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-y-auto bg-background">
                {activeMaterial ? (
                    <div className="mx-auto max-w-4xl p-6 md:p-12">
                        <CoursePageClient
                            courseId={courseId}
                            activeMaterial={activeMaterial}
                            moduleName={moduleName}
                            lessonNumber={lessonNumber}
                            nextMaterial={nextMaterial}
                        />

                        <div className="mb-12">
                            {activeMaterial.type === "video" ? (
                                <VideoPlayer url={activeMaterial.content} />
                            ) : (
                                <MarkdownText content={activeMaterial.content} />
                            )}

                            <div className="my-8 h-px bg-border" />

                            {/* NEW QUIZ SECTION */}
                            <div className="bg-muted/30 p-6 rounded-xl border flex flex-col items-center text-center space-y-4">
                                <h3 className="text-xl font-semibold">Закрепите знания</h3>
                                <p className="text-muted-foreground">Пройдите короткий тест из 5 вопросов по теме урока.</p>

                                <Link href={`/course/${courseId}/quiz/${activeMaterial.id}`}>
                                    <Button size="lg" className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg hover:scale-105 transition-transform">
                                        🧠 Пройти тест (Start Quiz)
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                ) : (
                    <CoursePageClient
                        courseId={courseId}
                        activeMaterial={null}
                        moduleName=""
                        lessonNumber={0}
                        nextMaterial={null}
                    />
                )}
            </div>
        </div>
    );
}
