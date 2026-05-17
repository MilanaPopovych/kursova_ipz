"use client";

import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import Link from 'next/link';
// імітація БД
const MOCK_MY_DISCUSSIONS = [
    {
        id: 1,
        articleTitle: "Архітектура MVC у сучасних вебфреймворках",
        topic: "Обґрунтування вибору шаблону",
        comment: "Пропоную додати схему взаємодії між Controller та View для кращої візуалізації логіки на Frontend.",
        date: "2026-05-15 16:30"
    },
    {
        id: 2,
        articleTitle: "Алгоритми повнотекстового пошуку в PostgreSQL",
        topic: "Оптимізація індексу GIN",
        comment: "Чи тестували ви швидкодію індексу GIN на великих обсягах контенту статей енциклопедії? У мене на 10к записів працює чудово.",
        date: "2026-05-12 11:15"
    },
    {
        id: 3,
        articleTitle: "Основи гідратації в React 19 та Next.js",
        topic: "Конфлікти через символи перенесення рядка",
        comment: "Очищення переносів рядків \\r\\n всередині лапок className повністю вирішило проблему Turbopack. Дякую за довідку!",
        date: "2026-05-14 22:45"
    }
];

export default function MyDiscussionsPage() {
    const [isMounted, setIsMounted] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) return null;
    // фільтрація обговорень за текстом коментаря або назвою статті
    const filteredDiscussions = MOCK_MY_DISCUSSIONS.filter(disc =>
        disc.articleTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        disc.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
        disc.comment.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-white flex flex-col font-serif">
            <Header />

            <div className="flex flex-row flex-grow w-full max-w-[1400px] mx-auto">
                <Sidebar />

                <main className="flex-grow p-4 md:p-8 space-y-6">
                    {/* кнопка швидкого повернення до головного профілю */}
                    <div className="mb-2">
                        <Link
                            href="/profile"
                            className="text-website-name hover:text-website-links font-bold italic flex items-center gap-2 group"
                        >
                            <span className="transform group-hover:-translate-x-1 transition-transform"> ← </span>
                            Повернутися до особистого кабінету
                        </Link>
                    </div>

                    {/* ГОЛОВНИЙ ЗАГОЛОВОК СТОРІНКИ (Синя плашка) */}
                    <div className="bg-search-button px-6 py-4 shadow-sm flex items-center gap-4">
                        <div className="bg-white text-search-button p-2 rounded-full text-xl w-10 h-10 flex items-center justify-center">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 640 640"
                                className="w-6 h-6"
                                fill="currentColor"
                                aria-hidden="true"
                            >
                                <path d="M416 208C416 305.2 330 384 224 384C197.3 384 171.9 379 148.8 370L67.2 413.2C57.9 418.1 46.5 416.4 39 409C31.5 401.6 29.8 390.1 34.8 380.8L70.4 313.6C46.3 284.2 32 247.6 32 208C32 110.8 118 32 224 32C330 32 416 110.8 416 208zM416 576C321.9 576 243.6 513.9 227.2 432C347.2 430.5 451.5 345.1 463 229.3C546.3 248.5 608 317.6 608 400C608 439.6 593.7 476.2 569.6 505.6L605.2 572.8C610.1 582.1 608.4 593.5 601 601C593.6 608.5 582.1 610.2 572.8 605.2L491.2 562C468.1 571 442.7 576 416 576z"/>
                            </svg>
                        </div>
                        <div>
                            <h1 className="text-white text-2xl font-bold italic">Мої обговорення</h1>
                            <p className="text-white/80 text-sm italic">Історія ваших дискусій на WiKPIdia</p>
                        </div>
                    </div>

                    {/* ІНСТРУМЕНТ ПОШУКУ ПО КОМЕНТАРЯХ */}
                    <div className="border border-dark-color-bar/20 rounded-sm overflow-hidden bg-white shadow-2xs">
                        <div className="p-4 bg-brand-border/10">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Фільтрувати обговорення за ключовими словами або назвою статті..."
                                className="w-full p-2 bg-light-color-bar border border-dark-color-bar/10 outline-none text-sm italic placeholder:text-main-text/40"
                            />
                        </div>
                    </div>

                    {/* СТРІЧКА ОБГОВОРЕНЬ */}
                    <div className="space-y-4">
                        {filteredDiscussions.length > 0 ? (
                            filteredDiscussions.map((disc) => (
                                <div
                                    key={disc.id}
                                    className="border border-dark-color-bar/20 rounded-sm overflow-hidden bg-white shadow-2xs"
                                >
                                    {/* шапка картки */}
                                    <div className="bg-dark-color-bar px-4 py-2 text-white text-sm font-bold flex flex-wrap justify-between items-center gap-2">
                                        <div className="flex items-center gap-2">
                                            <span className="text-white">Стаття:</span>
                                            <Link
                                                href={`/article/${encodeURIComponent(disc.articleTitle.replace(/\s+/g, '-'))}`}
                                                className="text-white hover:underline italic"
                                            >
                                                {disc.articleTitle}
                                            </Link>
                                        </div>
                                        <span className="text-[14px] text-main-text font-bold shrink-0">
                                            Дата створення: {disc.date}
                                        </span>
                                    </div>

                                    {/* Вміст картки коментаря */}
                                    <div className="p-4 bg-brand-border/5 space-y-2">
                                        <div className="text-sm text-website-name font-bold italic">
                                            Тема: <span className="text-main-text not-italic font-normal">{disc.topic}</span>
                                        </div>
                                        <div className="p-3 bg-white border border-dark-color-bar/10 rounded-xs text-sm italic text-main-text leading-relaxed relative">
                                            <span className="text-2xl text-search-button/20 font-serif absolute -top-2 left-1">“</span>
                                            <p className="pl-4">{disc.comment}</p>
                                        </div>

                                        {/* Кнопка переходу безпосередньо до гілки на сайті */}
                                        <div className="text-right">
                                            <Link
                                                href={`/article/${encodeURIComponent(disc.articleTitle.replace(/\s+/g, '-'))}/discussion`}
                                                className="text-[11px] text-website-links hover:underline italic font-bold"
                                            >
                                                Перейти до повної гілки обговорення →
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-12 border border-dashed border-dark-color-bar/20 bg-brand-border/5 rounded-sm">
                                <p className="text-gray-400 text">Обговорень за вашим запитом не знайдено.</p>
                            </div>
                        )}
                    </div>

                </main>
            </div>
        </div>
    );
}