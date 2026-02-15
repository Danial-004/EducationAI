"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner"; // Немесе useToast қолдансаңыз
import { grantAccess } from "@/app/actions/admin"; // Жаңа ғана жасаған action
import { Loader2, UserPlus } from "lucide-react";

interface EnrollFormProps {
    courseId: string;
}

export const EnrollForm = ({ courseId }: EnrollFormProps) => {
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const onSubmit = async () => {
        if (!email) return;

        try {
            setIsLoading(true);

            // Сервердегі функцияны шақырамыз
            const result = await grantAccess(email, courseId);

            if (result.error) {
                toast.error(result.error); // Қате шықса (қызыл)
            } else {
                toast.success(result.success); // Сәтті өтсе (жасыл)
                setEmail(""); // Поляны тазалаймыз
            }
        } catch {
            toast.error("Белгісіз қате шықты");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="mt-6 border bg-slate-100 rounded-md p-4 dark:bg-slate-900">
            <div className="font-medium flex items-center gap-x-2 mb-4">
                <UserPlus className="h-4 w-4" />
                Студентке доступ беру
            </div>

            <div className="flex items-center gap-x-2">
                <Input
                    disabled={isLoading}
                    placeholder="Студенттің email-ын жазыңыз..."
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-white dark:bg-slate-800"
                />
                <Button
                    onClick={onSubmit}
                    disabled={isLoading || !email}
                    size="sm"
                >
                    {isLoading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                    Қосу
                </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
                * Студент сайтқа тіркелген болуы керек.
            </p>
        </div>
    );
};