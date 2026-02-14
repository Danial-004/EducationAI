'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { LogIn, LogOut, User } from 'lucide-react';
import { useLanguage } from '@/contexts/language-context';
import { signOut } from "next-auth/react"; // Шығу функциясы
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface NavbarClientProps {
    session: any;
}

export function NavbarClient({ session }: NavbarClientProps) {
    const { t } = useLanguage();
    const user = session?.user;

    // 1. ЕГЕР АДАМ КІРІП ТҰРСА (User бар болса)
    if (user) {
        const initials = user.name?.slice(0, 2).toUpperCase() || "U";

        return (
            <div className="flex items-center gap-4">
                {/* Dashboard батырмасы */}
                <Link href="/dashboard">
                    <Button variant="ghost" size="sm">
                        {t.dashboard}
                    </Button>
                </Link>

                {/* ПРОФИЛЬ МӘЗІРІ (User Menu) */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="relative h-10 w-10 rounded-full cursor-pointer">
                            <Avatar className="h-10 w-10">
                                <AvatarImage src={user.image || ""} alt={user.name} />
                                <AvatarFallback className="bg-blue-600 text-white font-bold">
                                    {initials}
                                </AvatarFallback>
                            </Avatar>
                        </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent className="w-56" align="end" forceMount>
                        <DropdownMenuLabel className="font-normal">
                            <div className="flex flex-col space-y-1">
                                <p className="text-sm font-medium leading-none">{user.name}</p>
                                <p className="text-xs leading-none text-muted-foreground">
                                    {user.email}
                                </p>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="cursor-pointer">
                            <User className="mr-2 h-4 w-4" />
                            <span>Профиль</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {/* ШЫҒУ БАТЫРМАСЫ */}
                        <DropdownMenuItem
                            onClick={() => signOut({ callbackUrl: "/" })}
                            className="text-red-600 cursor-pointer focus:text-red-600 focus:bg-red-50"
                        >
                            <LogOut className="mr-2 h-4 w-4" />
                            <span>Шығу</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        );
    }

    // 2. ЕГЕР АДАМ КІРМЕГЕН БОЛСА (Guest)
    return (
        <Link href="/auth">
            <Button variant="default" size="sm" className="gap-2 bg-blue-600 hover:bg-blue-700 text-white">
                <LogIn className="h-4 w-4" />
                {t.signIn}
            </Button>
        </Link>
    );
}