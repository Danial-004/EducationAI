"use client";

import * as React from "react";
import { Globe } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import type { Language } from "@/lib/translations";

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function LanguageSelector() {
    const { language, setLanguage } = useLanguage();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                    <Globe className="h-[1.2rem] w-[1.2rem]" />
                    <span className="sr-only">Select language</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setLanguage('en' as Language)}>
                    <span className="mr-2">🇺🇸</span> English
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLanguage('ru' as Language)}>
                    <span className="mr-2">🇷🇺</span> Русский
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLanguage('kz' as Language)}>
                    <span className="mr-2">🇰🇿</span> Қазақша
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
