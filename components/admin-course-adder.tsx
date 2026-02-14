'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { generateCourse } from '@/app/actions/generate-course'; // Сіздің файлыңыздың аты
import { Loader2, PlusCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function AdminCourseAdder() {
    const [loading, setLoading] = useState<string | null>(null);
    const router = useRouter();

    const coursesToAdd = [
        "General Chemistry: Atoms and Molecules",
        "English for Beginners: Grammar and Vocabulary",
        "Physics: Mechanics and Newton's Laws",
        "World History: Ancient Civilizations",
        "Python Programming: From Zero to Hero"
    ];

    const handleAddCourse = async (topic: string) => {
        setLoading(topic);
        try {
            await generateCourse(topic, "Kazakh"); // Сіздің дайын кодыңызды қолданады
            router.refresh();
        } catch (error) {
            console.error(error);
            alert("Қате шықты! Console қараңыз.");
        } finally {
            setLoading(null);
        }
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8 p-6 border-2 border-dashed rounded-xl bg-muted/20">
            <div className="col-span-full mb-2">
                <h3 className="font-bold text-lg">Админ панель (Курстарды жылдам қосу)</h3>
                <p className="text-sm text-muted-foreground">Курстар қосылып болған соң, бұл блокты кодтан өшіріп тастауға болады.</p>
            </div>

            {coursesToAdd.map((topic) => (
                <Button
                    key={topic}
                    onClick={() => handleAddCourse(topic)}
                    disabled={!!loading}
                    variant="outline"
                    className="h-auto py-4 justify-start text-left"
                >
                    {loading === topic ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                        <PlusCircle className="mr-2 h-4 w-4 text-green-600" />
                    )}
                    <div>
                        <div className="font-semibold">{topic.split(':')[0]}</div>
                        <div className="text-xs text-muted-foreground truncate max-w-[200px]">
                            {topic.split(':')[1] || topic}
                        </div>
                    </div>
                </Button>
            ))}
        </div>
    );
}