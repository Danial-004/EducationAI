import Link from 'next/link';
import { auth } from '@/auth';
import { GraduationCap } from 'lucide-react';
import { ModeToggle } from '@/components/mode-toggle';
import { LanguageSelector } from '@/components/language-selector';
import { NavbarClient } from '@/components/navbar-client';

export async function Navbar() {
    const session = await auth();

    return (
        <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 font-semibold text-xl">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-purple-600">
                        <GraduationCap className="h-5 w-5 text-white" />
                    </div>
                    <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        EducationAI
                    </span>
                </Link>

                {/* Navigation Links */}
                <div className="flex items-center gap-4">
                    <LanguageSelector />
                    <ModeToggle />

                    {/* Барлық логиканы (кірді ме, шықты ма, аватар қандай)
                        осы компонентке береміз: */}
                    <NavbarClient session={session} />
                </div>
            </div>
        </nav>
    );
}