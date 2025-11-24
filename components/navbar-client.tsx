'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { LogIn } from 'lucide-react';
import { useLanguage } from '@/contexts/language-context';

interface NavbarClientProps {
    session: any;
}

export function NavbarClient({ session }: NavbarClientProps) {
    const { t } = useLanguage();

    if (session?.user) {
        return (
            <Link href="/dashboard">
                <Button variant="ghost" size="sm">
                    {t.dashboard}
                </Button>
            </Link>
        );
    }

    return (
        <Link href="/auth">
            <Button variant="primary" size="sm">
                <LogIn className="h-4 w-4" />
                {t.signIn}
            </Button>
        </Link>
    );
}
