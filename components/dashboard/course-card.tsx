import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Book } from "lucide-react";

export function CourseCard({ id, title, description, moduleCount }: any) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                <CardDescription className="line-clamp-2">{description}</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex items-center text-sm text-muted-foreground">
                    <Book className="mr-1 h-4 w-4" /> {moduleCount} Modules
                </div>
            </CardContent>
            <CardFooter>
                <Link href={`/course/${id}`} className="w-full">
                    <Button className="w-full">Continue Learning</Button>
                </Link>
            </CardFooter>
        </Card>
    );
}
