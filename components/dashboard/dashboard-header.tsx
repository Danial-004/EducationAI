import { User } from "lucide-react";

export function DashboardHeader({ userName, userEmail }: { userName?: string | null, userEmail?: string | null }) {
    return (
        <div className="flex items-center justify-between">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                <p className="text-muted-foreground">Welcome back, {userName || 'Student'}!</p>
            </div>
        </div>
    );
}
