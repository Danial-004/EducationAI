"use client"; // 👈 Бұл серверде қате шығармау үшін керек

import { Mail, Phone, Github } from "lucide-react";
import { useLanguage } from "@/contexts/language-context"; // 👈 Тілді осы жерде шақырамыз
import { translations } from "@/lib/translations";

export const Footer = () => {
    const { language } = useLanguage();
    const t = translations[language];
    const currentYear = new Date().getFullYear();

    const CONTACT_INFO = {
        email: "danialsuttibaev@gmail.com",
        phone: "+7 (775) 125-52-46",
    };

    return (
        <footer className="w-full mt-auto bg-slate-100 dark:bg-zinc-900 border-t border-slate-200 dark:border-zinc-800 transition-colors duration-300">
            <div className="container mx-auto px-6 py-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div className="space-y-1">
                        <h4 className="font-bold text-lg text-slate-900 dark:text-slate-100 flex items-center gap-2">
                            📞 {t.contactTitle}
                        </h4>
                        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md">
                            {t.contactDesc}
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                        <a href={`mailto:${CONTACT_INFO.email}`} className="flex items-center justify-center gap-2 bg-white dark:bg-slate-800 px-4 py-2 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 hover:bg-slate-50 transition-colors">
                            <Mail className="h-4 w-4 text-blue-600" />
                            <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{CONTACT_INFO.email}</span>
                        </a>

                        <div className="flex items-center justify-center gap-2 bg-white dark:bg-slate-800 px-4 py-2 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
                            <Phone className="h-4 w-4 text-green-600" />
                            <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{CONTACT_INFO.phone}</span>
                        </div>
                    </div>
                </div>

                <div className="my-6 border-t border-slate-200 dark:border-zinc-700" />

                <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
                    <p>© {currentYear} Education AI. {t.rightsReserved}.</p>

                    <div className="flex items-center gap-6">
                        <a href="https://github.com" target="_blank" className="hover:text-slate-900 dark:hover:text-white transition-colors">
                            <Github className="h-4 w-4" />
                        </a>
                        <a href="#" className="hover:text-slate-900 dark:hover:text-white transition-colors">
                            {t.privacyPolicy}
                        </a>
                        <a href="#" className="hover:text-slate-900 dark:hover:text-white transition-colors">
                            {t.termsOfService}
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
};