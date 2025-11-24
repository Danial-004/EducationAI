'use client';

import { useState } from 'react';
import { signOut } from 'next-auth/react';
import { LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/language-context';

export function AuthButton() {
    const [isLoading, setIsLoading] = useState(false);
    const { t } = useLanguage();

    const handleSignOut = async () => {
        setIsLoading(true);
        try {
            await signOut({ callbackUrl: '/' });
        } catch (error) {
            console.error('Sign out error:', error);
            setIsLoading(false);
        }
    };

    return (
        <Button
            variant="ghost"
            size="sm"
            onClick={handleSignOut}
            disabled={isLoading}
        >
            <LogOut className="h-4 w-4" />
            {isLoading ? `${t.signOut}...` : t.signOut}
        </Button>
    );
}
