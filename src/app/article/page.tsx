"use client";

import { useParams } from 'next/navigation';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import Link from 'next/link';
import ArticleTabs from '@/components/ArticleTabs';

export default function ArticlePage() {
    const params = useParams();
    const slug = params.slug as string;

    // Декодування назви статті для відображення
    const articleTitle = slug ? decodeURIComponent(slug).replace(/-/g, ' ') : "Назва статті";

    return (
        <div className="min-h-screen bg-white flex flex-col font-serif">
            {/* 1. Спільний Header */}
            <Header />
            <div className="flex flex-row flex-grow w-full max-w-[1400px] mx-auto">
                {/* 2. Спільне бічне меню */}
                <Sidebar />
                {/* 3. ОСНОВНА ЧАСТИНА */}
                <main className="flex-grow p-4 md:p-8">

                    {/* ІНТЕГРАЦІЯ ВКЛАДОК (Стаття, Обговорення, Редагувати тощо) */}
                    <ArticleTabs slug={slug || "new-article"} />

                    {/* Синє поле для заголовку статті */}
                    <div className="bg-search-button px-6 py-2 mb-6 shadow-sm">
                        <h1 className="text-white text-2xl md:text-3xl font-bold italic">
                            {articleTitle}
                        </h1>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* ЛІВА ЧАСТИНА: Основний текст */}
                        <div className="flex-grow bg-brand-border/10 p-6 border border-dark-color-bar/10 rounded-sm min-h-[500px]">
                            <h2 className="text-website-name text-2xl font-bold mb-4 border-b border-dark-color-bar/20 pb-1">
                                Заголовок
                            </h2>
                            <div className="text-main-text leading-relaxed space-y-4">
                                <p>
                                    Тут буде розміщено основний зміст статті. Ви можете використовувати
                                    стандартне форматування тексту для вашої енциклопедії WiKPIdia.
                                </p>
                                <p>
                                    Для студента КПІ Мілани Попович (група ІО-46) цей шаблон дозволяє
                                    структуровано подавати навчальні матеріали або результати досліджень.
                                </p>
                            </div>
                        </div>

                        {/* ПРАВА ЧАСТИНА: Інформаційний блок (Інфобокс) */}
                        <aside className="w-full lg:w-80 flex flex-col gap-6">

                            {/* Блок із зображенням */}
                            <div className="border-4 border-brand-border rounded-sm overflow-hidden shadow-sm">
                                <div className="bg-light-color-bar h-64 flex items-center justify-center p-4">
                                    <div className="text-center">
                                        <p className="text-main-text/50 font-bold text-xl mb-2">Зображення</p>
                                        <img
                                            src="/api/placeholder/300/300"
                                            alt="Ілюстрація до статті"
                                            className="max-h-40 mx-auto object-contain opacity-50"
                                        />
                                    </div>
                                </div>
                                <div className="bg-brand-border p-2 text-xs text-center border-t border-dark-color-bar/20 italic">
                                    Текст. <Link href="#" className="text-website-links hover:underline">Посилання</Link>
                                </div>
                            </div>

                            {/* Таблиця характеристик */}
                            <div className="border-2 border-brand-border rounded-sm overflow-hidden shadow-sm">
                                <div className="bg-brand-border p-2 text-center font-bold text-website-name border-b border-dark-color-bar/20">
                                    Заголовок
                                </div>
                                <table className="w-full text-sm font-serif border-collapse">
                                    <tbody>
                                    <tr className="border-b border-dark-color-bar/10">
                                        <td className="p-2 bg-light-color-bar font-bold w-1/3 border-r border-dark-color-bar/10">Назва</td>
                                        <td className="p-2 bg-white">Текст</td>
                                    </tr>
                                    <tr className="border-b border-dark-color-bar/10">
                                        <td className="p-2 bg-light-color-bar font-bold border-r border-dark-color-bar/10">Назва</td>
                                        <td className="p-2 bg-white">
                                            <Link href="#" className="text-website-links hover:underline italic">Посилання</Link>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="p-2 bg-light-color-bar font-bold border-r border-dark-color-bar/10">Назва</td>
                                        <td className="p-2 bg-white">
                                            <div className="flex items-center gap-2 italic">
                                                <span className="w-3 h-3 bg-search-button rounded-full"></span>
                                                Іконки, текст
                                            </div>
                                        </td>
                                    </tr>
                                    </tbody>
                                </table>
                            </div>
                        </aside>
                    </div>
                </main>
            </div>
        </div>
    );
}