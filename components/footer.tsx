import { Github } from 'lucide-react';

export function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="w-full border-t border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950 mt-10">
            <div className="container mx-auto px-4 py-8">
                <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
                    {/* Copyright */}
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">
                        © {currentYear} Education AI. All rights reserved.
                    </p>

                    {/* Links */}
                    <div className="flex items-center gap-6">
                        <a
                            href="https://github.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
                        >
                            <Github className="h-5 w-5" />
                            <span className="sr-only">GitHub</span>
                        </a>
                        <a
                            href="#"
                            className="text-sm text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
                        >
                            Privacy Policy
                        </a>
                        <a
                            href="#"
                            className="text-sm text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
                        >
                            Terms of Service
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}