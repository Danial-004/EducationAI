import Link from 'next/link';
import { auth } from '@/auth';
import { AuthButton } from '@/components/auth-button';
import { Button } from '@/components/ui/button';
import { GraduationCap, LogIn } from 'lucide-react';
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
                        Education
                    </span>
                </Link>

                {/* Navigation Links */}
                <div className="flex items-center gap-4">
                    <LanguageSelector />
                    <ModeToggle />
                    {session?.user ? (
                        <div className="flex items-center gap-3">
                            {/* User Avatar */}
                            <div className="flex items-center gap-2">
                                {session.user.image ? (
                                    <img
                                        src={session.user.image}
                                        alt={session.user.name || 'User'}
                                        className="h-8 w-8 rounded-full border-2 border-zinc-200 dark:border-zinc-800"
                                    />
                                ) : (
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-500 text-sm font-semibold text-white">
                                        {session.user.name?.charAt(0).toUpperCase() ||
                                            session.user.email?.charAt(0).toUpperCase() || 'U'}
                                    </div>
                                )}
                                <span className="hidden text-sm font-medium sm:inline-block">
                                    {session.user.name || session.user.email}
                                </span>
                            </div>
                            <AuthButton />
                        </div>
                    ) : (
                        <NavbarClient session={null} />
                    )}
                </div>
            </div>
        </nav>
    );
}
