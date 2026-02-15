import Link from "next/link";
import Image from "next/image"; // Image импортын қалдырамыз, керек болса қолдану үшін
import { BookOpen, PlayCircle } from "lucide-react"; // Play icon қостым
import { EnrollStudentDialog } from "@/components/enroll-student-dialog";

interface CourseCardProps {
    id: string;
    title: string;
    imageUrl: string | null;
    chaptersLength: number;
    price: number;
    progress: number | null;
    category: string | null;
    description: string | null;
    isAdmin?: boolean;
}

// Түстер палитрасы (Фон + 1-ші шар + 2-ші шар)
const themes = [
    { bg: "bg-slate-900", blob1: "bg-blue-600", blob2: "bg-purple-600" }, // Kök-Külgin
    { bg: "bg-zinc-900", blob1: "bg-emerald-500", blob2: "bg-cyan-500" }, // Jasyl-Kök
    { bg: "bg-neutral-900", blob1: "bg-rose-600", blob2: "bg-orange-500" }, // Qyzyl-Sary
    { bg: "bg-slate-950", blob1: "bg-indigo-500", blob2: "bg-blue-400" }, // Indigo
    { bg: "bg-gray-900", blob1: "bg-amber-500", blob2: "bg-red-500" }, // Sary-Qyzyl
];

export const CourseCard = ({
    id,
    title,
    imageUrl,
    chaptersLength,
    price,
    progress,
    category,
    description,
    isAdmin = false
}: CourseCardProps) => {

    // Курс атына қарай бір теманы таңдаймыз
    const theme = themes[title.length % themes.length];

    return (
        <div className="group hover:-translate-y-1 transition-all duration-300 border border-slate-200 dark:border-zinc-800 rounded-2xl p-3 h-full flex flex-col bg-white dark:bg-zinc-950 hover:shadow-xl">

            <Link href={`/course/${id}`} className="flex-1 flex flex-col cursor-pointer">

                {/* СУРЕТ / MESH БӨЛІГІ */}
                <div className={`relative w-full aspect-video rounded-xl overflow-hidden ${theme.bg}`}>
                    {imageUrl ? (
                        <Image
                            fill
                            className="object-cover"
                            alt={title}
                            src={imageUrl}
                        />
                    ) : (
                        // 👇 MESH GRADIENT MAGIC
                        <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
                            {/* 1-ші жанып тұрған шар */}
                            <div className={`absolute top-[-20%] left-[-20%] w-[70%] h-[70%] rounded-full mix-blend-screen filter blur-[60px] opacity-60 animate-pulse ${theme.blob1}`} />
                            {/* 2-ші жанып тұрған шар */}
                            <div className={`absolute bottom-[-20%] right-[-20%] w-[70%] h-[70%] rounded-full mix-blend-screen filter blur-[60px] opacity-60 animate-pulse delay-1000 ${theme.blob2}`} />

                            {/* Ортасындағы әріп */}
                            <div className="relative z-10 flex flex-col items-center">
                                <span className="text-white font-black text-5xl tracking-tighter drop-shadow-2xl">
                                    {title.charAt(0).toUpperCase()}
                                </span>
                                {/* Кішкентай сәндік сызық */}
                                <div className="w-8 h-1 bg-white/50 rounded-full mt-3" />
                            </div>

                            {/* Үстінен түсетін тор (Grid pattern) - әдемілік үшін */}
                            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
                        </div>
                    )}
                </div>

                {/* Мәтін бөлігі */}
                <div className="flex flex-col pt-4 px-2 flex-grow">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 dark:bg-blue-900/30 dark:text-blue-300 px-2 py-1 rounded-md">
                            {category || "Course"}
                        </span>
                    </div>

                    <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 transition-colors line-clamp-2">
                        {title}
                    </h3>

                    {/* Footer like stats */}
                    <div className="mt-auto pt-4 flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                        <div className="flex items-center gap-1.5">
                            <BookOpen className="h-4 w-4" />
                            <span className="text-xs font-medium">{chaptersLength} Modules</span>
                        </div>
                    </div>
                </div>
            </Link>

            {isAdmin && (
                <div className="mt-3 pt-3 border-t border-dashed border-slate-200 dark:border-slate-800 flex justify-end">
                    <EnrollStudentDialog courseId={id} courseTitle={title} />
                </div>
            )}
        </div>
    );
};