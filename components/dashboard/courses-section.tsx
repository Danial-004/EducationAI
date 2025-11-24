import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function CoursesSection({ children, hasPublishedCourses }: { children: React.ReactNode, hasPublishedCourses: boolean }) {
    return (
        <div className="space-y-4">
            <h2 className="text-2xl font-bold tracking-tight">Your Courses</h2>
            {children}
        </div>
    );
}
