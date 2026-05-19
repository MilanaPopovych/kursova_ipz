"use client";

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import Link from 'next/link';
import ArticleTabs from '@/components/ArticleTabs';
import { articleService } from '@/services/api';

export default function ArticlePage() {
    const params = useParams();
    const slug = params.slug as string;

    const [article, setArticle] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fallbackTitle = slug ? decodeURIComponent(slug).replace(/-/g, ' ') : "Завантаження...";

    useEffect(() => {
        if (!slug) return;

        setLoading(true);
        setError(null);

        articleService.getArticleBySlug(slug)
            .then((data: any) => {
                setArticle(data);
            })
            .catch((err: any) => {
                console.error("Помилка завантаження статті:", err);
                setError("Статтю не знайдено або бекенд-сервер вашого напарника не відповідає.");
            })
            .finally(() => {
                setLoading(false);
            });
    }, [slug]);

    // АРХІТЕКТУРНА ПЕРЕВІРКА: Чи є хоч якісь дані для правої колонки
    const hasMetadata = article && (article.version || article.author || article.comment || article.mainImage);

    return (
        <div className="min-h-screen bg-white flex flex-col font-serif overflow-hidden">
            <Header />

            <div className="flex flex-row flex-grow w-full max-w-[1400px] mx-auto overflow-hidden">
                <Sidebar />

                <main className="flex-grow p-4 md:p-8 overflow-hidden">
                    <ArticleTabs slug={slug || "new-article"} />

                    {/* Поле для заголовку статті */}
                    <div className="bg-search-button px-6 py-2 mb-6 shadow-sm">
                        <h1 className="text-white text-2xl md:text-3xl font-bold italic">
                            {loading ? fallbackTitle : (article?.title || fallbackTitle)}
                        </h1>
                    </div>

                    {/* Скелетон завантаження */}
                    {loading && (
                        <div className="space-y-4 animate-pulse bg-brand-border/10 p-6 border border-dark-color-bar/10 min-h-[500px]">
                            <div className="h-6 bg-dark-color-bar/20 w-1/4 rounded-xs"></div>
                            <div className="h-4 bg-dark-color-bar/10 w-full rounded-xs"></div>
                            <div className="h-4 bg-dark-color-bar/10 w-5/6 rounded-xs"></div>
                        </div>
                    )}

                    {/* вікно помилки */}
                    {!loading && error && (
                        <div className="bg-[#FDF2F2] border-l-4 border-[#A01E36] p-6 font-serif rounded-sm min-h-[400px] flex flex-col justify-center items-center text-center">
                            <span className="text-3xl mb-2">⚠️</span>
                            <h3 className="text-[#A01E36] font-bold text-lg mb-1 italic">Помилка завантаження матеріалу</h3>
                            <p className="text-main-text/80 text-sm max-w-md italic">{error}</p>
                            <Link href="/profile" className="mt-6 text-xs text-website-links hover:underline font-bold uppercase tracking-wider">
                                Повернутися до особистого кабінету
                            </Link>
                        </div>
                    )}

                    {/* Відображення статті */}
                    {!loading && !error && article && (
                        <div className="flex flex-col lg:flex-row gap-8">

                            {/* ЛІВА ЧАСТИНА: Текст статті (Автоматично займає 100% ширини, якщо немає метаданих) */}
                            <div className="flex-grow bg-brand-border/10 p-6 border border-dark-color-bar/10 rounded-sm min-h-[500px] w-full max-w-full overflow-hidden">
                                <div
                                    className="wiki-preview-content text-main-text leading-relaxed"
                                    dangerouslySetInnerHTML={{ __html: article.content }}
                                />
                            </div>

                            {/* ПРАВА ЧАСТИНА: Рендериться ТІЛЬКИ якщо є реальні дані (без пустих рамок) */}
                            {hasMetadata && (
                                <aside className="w-full lg:w-80 flex flex-col gap-6 shrink-0">

                                    {/* Блок зображення з'явиться лише якщо воно передано з БД */}
                                    {article.mainImage && (
                                        <div className="border-4 border-brand-border rounded-sm overflow-hidden shadow-sm bg-white">
                                            <div className="bg-light-color-bar h-64 flex items-center justify-center p-4">
                                                <img
                                                    src={article.mainImage}
                                                    alt={article.title}
                                                    className="max-h-56 mx-auto object-contain"
                                                />
                                            </div>
                                            {article.imageCaption && (
                                                <div className="bg-brand-border p-2 text-[10px] text-center border-t border-dark-color-bar/20 italic text-main-text/70">
                                                    {article.imageCaption}
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* Таблиця характеристик (показує лише заповнені рядки) */}
                                    {(article.version || article.author || article.comment) && (
                                        <div className="border-2 border-brand-border rounded-sm overflow-hidden shadow-sm bg-white">
                                            <div className="bg-brand-border p-2 text-center font-bold text-xs uppercase tracking-wide text-website-name border-b border-dark-color-bar/20">
                                                Метадані ревізії
                                            </div>
                                            <table className="w-full text-xs font-serif border-collapse">
                                                <tbody>
                                                {article.version && (
                                                    <tr className="border-b border-dark-color-bar/10">
                                                        <td className="p-2 bg-light-color-bar font-bold w-1/3 border-r border-dark-color-bar/10 italic">Версія</td>
                                                        <td className="p-2 bg-white italic text-main-text font-bold">v{article.version}</td>
                                                    </tr>
                                                )}
                                                {article.author && (
                                                    <tr className="border-b border-dark-color-bar/10">
                                                        <td className="p-2 bg-light-color-bar font-bold border-r border-dark-color-bar/10 italic">Автор правок</td>
                                                        <td className="p-2 bg-white italic text-website-links font-bold">
                                                            @{article.author}
                                                        </td>
                                                    </tr>
                                                )}
                                                {article.comment && (
                                                    <tr>
                                                        <td className="p-2 bg-light-color-bar font-bold border-r border-dark-color-bar/10 italic">Лог змін</td>
                                                        <td className="p-2 bg-white text-gray-500 italic text-[11px] leading-snug">
                                                            "{article.comment}"
                                                        </td>
                                                    </tr>
                                                )}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                </aside>
                            )}
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}