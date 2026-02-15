"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { UserPlus, Loader2 } from "lucide-react";
import { grantAccess } from "@/app/actions/admin"; // Импорт жолын тексеріңіз

interface EnrollStudentDialogProps {
    courseId: string;
    courseTitle: string;
}

export const EnrollStudentDialog = ({
    courseId,
    courseTitle,
}: EnrollStudentDialogProps) => {
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    const onSubmit = async () => {
        try {
            setIsLoading(true);
            const result = await grantAccess(email, courseId);

            if (result.error) {
                toast.error(result.error);
            } else {
                toast.success(result.success);
                setIsOpen(false);
                setEmail("");
            }
        } catch {
            toast.error("Қате шықты");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                {/* Бұл - Курс картасында тұратын батырма */}
                <Button variant="outline" size="sm" className="ml-auto flex gap-2 border-indigo-500 text-indigo-600 hover:bg-indigo-50">
                    <UserPlus className="h-4 w-4" />
                    Қосу
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Студент қосу</DialogTitle>
                    <DialogDescription>
                        "{courseTitle}" курсына доступ ашу.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Input
                            placeholder="Студенттің email-ы (mysal@gmail.com)"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <Button onClick={onSubmit} disabled={isLoading || !email} className="w-full">
                        {isLoading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                        Доступ беру
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};