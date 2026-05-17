"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface ArticleTabsProps {
    slug: string;
}

export default function ArticleTabs({ slug }: ArticleTabsProps) {
    const pathname = usePathname();

    // Функція для визначення стилів активної вкладки
    const getTabClass = (path: string) => {
        const isActive = pathname === path;
        return `px-4 py-1 border-x border-t transition-colors ${
            isActive
                ? "bg-white border-dark-color-bar/20 text-main-text font-bold"
                : "bg-brand-border/20 border-transparent text-website-links hover:text-website-name"
        }`;
    };

    return (
        <div className="flex justify-between items-end w-full border-b border-dark-color-bar/20 mb-4 font-serif text-sm">
            {/* ЛІВА ГРУПА: Стаття та Обговорення */}
            <div className="flex gap-1">
                <Link href={`/article/${slug}`} className={getTabClass(`/article/${slug}`)}>
                    Стаття
                </Link>
                <Link href={`/article/${slug}/discussion`} className={getTabClass(`/article/${slug}/discussion`)}>
                    Обговорення
                </Link>
            </div>

            {/* ПРАВА ГРУПА: Читати, Редагувати, Історія + ДОВІДКА */}
            <div className="flex gap-1">
                <Link href={`/article/${slug}`} className={getTabClass(`/article/${slug}`)}>
                    Читати
                </Link>
                <Link href={`/article/${slug}/edit`} className={getTabClass(`/article/${slug}/edit`)}>
                    Редагувати
                </Link>
                <Link href={`/article/${slug}/history`} className={getTabClass(`/article/${slug}/history`)}>
                    Переглянути історію
                </Link>

                {/* Окрема кнопка ДОпомоги/Довідки */}
                <Link
                    href="/guide"
                    className="ml-4 px-4 py-1 text-website-links hover:underline flex items-center gap-1 italic"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Довідка
                </Link>
            </div>
        </div>
    );
}