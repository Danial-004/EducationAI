import Link from "next/link";
import Image from "next/image";
import { BookOpen } from "lucide-react";
import { EnrollStudentDialog } from "@/components/enroll-student-dialog"; // 👈 Жаңа импорт

interface CourseCardProps {
    id: string;
    title: string;
    imageUrl: string | null;
    chaptersLength: number;
    price: number;
    progress: number | null;
    category: string | null;
    description: string | null;
    isAdmin?: boolean; // 👈 Жаңа пропс (міндетті емес)
}

export const CourseCard = ({
    id,
    title,
    imageUrl,
    chaptersLength,
    price,
    progress,
    category,
    description,
    isAdmin = false // Default мәні false
}: CourseCardProps) => {
    return (
        <div className="group hover:shadow-sm transition overflow-hidden border rounded-lg p-3 h-full flex flex-col bg-white dark:bg-zinc-900">
            {/* 1. Бөлек Link: Тек басатын жерлер үшін */}
            <Link href={`/course/${id}`} className="flex-1 flex flex-col cursor-pointer">
                <div className="relative w-full aspect-video rounded-md overflow-hidden bg-slate-200 dark:bg-slate-800">
                    {imageUrl ? (
                        <Image
                            fill
                            className="object-cover"
                            alt={title}
                            src={imageUrl}
                        />
                    ) : (
                        <div className="flex items-center justify-center h-full w-full bg-gradient-to-r from-blue-500 to-purple-600">
                            <span className="text-white font-bold text-2xl">
                                {title.charAt(0).toUpperCase()}
                            </span>
                        </div>
                    )}
                </div>

                <div className="flex flex-col pt-2">
                    <div className="text-lg md:text-base font-medium group-hover:text-sky-700 transition line-clamp-2">
                        {title}
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                        {category}
                    </p>
                    <div className="my-3 flex items-center gap-x-2 text-sm md:text-xs">
                        <div className="flex items-center gap-x-1 text-slate-500">
                            <BookOpen className="h-4 w-4" />
                            <span>
                                {chaptersLength} {chaptersLength === 1 ? "Module" : "Modules"}
                            </span>
                        </div>
                    </div>
                </div>
            </Link>

            {/* 2. Админ батырмасы: Link-тің СЫРТЫНДА тұруы керек */}
            {isAdmin && (
                <div className="mt-auto pt-2 border-t flex justify-end">
                    {/* z-index мәселесі болмас үшін осылай бөлек қоямыз */}
                    <EnrollStudentDialog courseId={id} courseTitle={title} />
                </div>
            )}
        </div>
    );
};