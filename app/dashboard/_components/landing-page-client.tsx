// components/landing-page-client.tsx
'use client';

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Brain, LineChart, Sparkles } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";

export function LandingPageClient({ isLoggedIn }: { isLoggedIn: boolean }) {
    const { t } = useLanguage();

    return (
        <div className="flex min-h-[calc(100vh-4rem)] flex-col bg-white dark:bg-background">
            {/* Hero Section */}
            <section className="relative overflow-hidden bg-white dark:bg-background">
                <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#333_1px,transparent_1px)] [background-size:16px_16px] opacity-40" />

                <div className="container relative mx-auto px-4 py-24 sm:py-32">
                    <div className="mx-auto max-w-3xl text-center">
                        <h1 className="mb-6 text-5xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl md:text-7xl">
                            {t.heroTitle}
                        </h1>
                        <p className="mb-8 text-lg text-gray-600 dark:text-gray-300 sm:text-xl">
                            {t.heroSubtitle}
                        </p>
                        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                            <Link href={isLoggedIn ? "/dashboard" : "/auth"}>
                                <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg h-auto" size="lg">
                                    {t.getStarted} <ArrowRight className="ml-2 h-5 w-5" />
                                </Button>
                            </Link>
                            {!isLoggedIn && (
                                <Link href="/auth">
                                    <Button variant="outline" size="lg" className="border-gray-300 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 px-8 py-6 text-lg h-auto">
                                        {t.signIn}
                                    </Button>
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-24 bg-gray-50 dark:bg-muted/20">
                <div className="container mx-auto px-4">
                    <div className="mx-auto max-w-5xl">
                        <h2 className="mb-12 text-center text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
                            {t.featuresTitle}
                        </h2>
                        <div className="grid gap-8 md:grid-cols-3">
                            <div className="group relative overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-card p-8 shadow-sm transition-all hover:shadow-md">
                                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-blue-600">
                                    <Sparkles className="h-6 w-6 text-white" />
                                </div>
                                <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">{t.feature1Title}</h3>
                                <p className="text-gray-600 dark:text-gray-400">{t.feature1Desc}</p>
                            </div>
                            <div className="group relative overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-card p-8 shadow-sm transition-all hover:shadow-md">
                                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-purple-600">
                                    <Brain className="h-6 w-6 text-white" />
                                </div>
                                <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">{t.feature2Title}</h3>
                                <p className="text-gray-600 dark:text-gray-400">{t.feature2Desc}</p>
                            </div>
                            <div className="group relative overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-card p-8 shadow-sm transition-all hover:shadow-md">
                                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-pink-600">
                                    <LineChart className="h-6 w-6 text-white" />
                                </div>
                                <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">{t.feature3Title}</h3>
                                <p className="text-gray-600 dark:text-gray-400">{t.feature3Desc}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}