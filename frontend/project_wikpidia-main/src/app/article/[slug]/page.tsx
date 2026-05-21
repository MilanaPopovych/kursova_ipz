"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import Link from 'next/link';
import ArticleTabs from '@/components/ArticleTabs';
import { articleService } from '@/services/api';
import { useAuth } from '@/context/AuthContext';

interface Category {
    id: number;
    name: string;
}

interface ArticleData {
    id: number;
    title: string;
    content: string;
    mainImage?: string;
    categories?: Category[];
    version?: string;
    author?: string;
    comment?: string;
    isPublished?: boolean;
    originalArticleSlug?: string;
}

export default function ArticlePage() {
    const params = useParams();
    const router = useRouter();
    const slug = params.slug as string;
    const [revisions, setRevisions] = useState<any[]>([]);

    const { user, token } = useAuth();

    const fallbackTitle = slug ? decodeURIComponent(slug).replace(/-/g, ' ') : "Завантаження...";

    const [article, setArticle] = useState<ArticleData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const [isSaved, setIsSaved] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const [allCategories, setAllCategories] = useState<Category[]>([]);
    const [categoryError, setCategoryError] = useState<string | null>(null);
    const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);

    const loadArticleData = () => {
        if (!slug) return;
        articleService.getArticleBySlug(slug)
            .then((data: ArticleData) => setArticle(data))
            .catch((err: Error) => setError("Статтю не знайдено або сервер не відповідає."))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        loadArticleData();
    }, [slug]);

    // Перевірка чи збережена стаття
    useEffect(() => {
        if (token && slug) {
            const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8081';
            fetch(`${baseUrl}/api/users/saved/${slug}/check`, {
                headers: { 'Authorization': `Bearer ${token}` }
            })
                .then(res => res.json())
                .then(data => setIsSaved(data.isSaved))
                .catch(err => console.error("Помилка перевірки збереження:", err));
        }
    }, [slug, token]);

    // Завантаження категорій для адміна
    useEffect(() => {
        if (user && (user.role === 'Адмін' || user.role === 'Адміністратор' || user.role === 'ADMIN' || user.role === 'Головний редактор')) {
            const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8081';
            fetch(`${baseUrl}/api/categories`)
                .then(res => res.json())
                .then(data => setAllCategories(data || []))
                .catch(err => console.error("Помилка завантаження категорій:", err));
        }
    }, [user]);

    useEffect(() => {
        if (!slug) return;
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8081';
        fetch(`${baseUrl}/api/articles/${slug}/revisions`)
            .then(res => res.json())
            .then(data => setRevisions(Array.isArray(data) ? data : []))
            .catch(err => console.error("Помилка завантаження правок:", err));
    }, [slug]);

    const handleAddCategory = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const categoryId = Number(e.target.value);
        if (!categoryId || !token) return;

        try {
            await articleService.assignCategory(slug, categoryId, token);
            loadArticleData();
            setShowCategoryDropdown(false);
            setCategoryError(null);
        } catch (err: unknown) {
            setCategoryError("Не вдалося додати категорію.");
        }
    };

    const handleRemoveCategory = async (categoryId: number, categoryName: string) => {
        const confirmRemove = window.confirm(
            `Ви впевнені, що хочете вилучити статтю з категорії "${categoryName}"?`
        );
        if (!confirmRemove || !token) return;

        try {
            await articleService.removeCategory(slug, categoryId, token);
            loadArticleData();
        } catch (err: unknown) {
            setCategoryError("Не вдалося вилучити категорію.");
        }
    };

    const handleDelete = async () => {
        const confirmDelete = window.confirm(
            "УВАГА! Ви впевнені, що хочете остаточно видалити цю статтю?"
        );
        if (!confirmDelete || !token) return;

        setIsDeleting(true);
        try {
            await articleService.deleteArticle(slug, token);
            router.push('/');
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : "Сталася помилка під час видалення.";
            alert(errorMessage);
            setIsDeleting(false);
        }
    };

    const handleToggleSave = async () => {
        if (!token) {
            alert("Будь ласка, авторизуйтесь, щоб зберігати статті!");
            router.push('/login');
            return;
        }

        setIsSaving(true);
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8081';

        try {
            if (isSaved) {
                const res = await fetch(`${baseUrl}/api/users/saved/${slug}`, {
                    method: 'DELETE',
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (res.ok) setIsSaved(false);
            } else {
                const res = await fetch(`${baseUrl}/api/users/saved`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ slug: slug, title: article?.title || slug })
                });
                if (res.ok) setIsSaved(true);
            }
        } catch (err: unknown) {
            console.error("Помилка збереження статті:", err);
            alert("Не вдалося оновити статус збереження.");
        } finally {
            setIsSaving(false);
        }
    };

    const isAuthorizedToSubmoderate = user && (user.role === 'Адмін' || user.role === 'Адміністратор' || user.role === 'ADMIN' || user.role === 'Головний редактор');
    const hasMetadata = article;

    return (
        <div className="min-h-screen bg-white flex flex-col font-serif overflow-hidden">
            <Header />
            <div className="flex flex-row flex-grow w-full max-w-[1400px] mx-auto overflow-hidden">
                <Sidebar />

                <main className="flex-grow p-4 md:p-8 overflow-hidden">
                    <ArticleTabs slug={slug || "new-article"} />

                    <div className="bg-search-button px-6 py-2 mb-6 shadow-sm">
                        <h1 className="text-white text-2xl md:text-3xl font-bold italic">
                            {loading ? fallbackTitle : (article?.title || fallbackTitle)}
                        </h1>
                    </div>

                    {loading && (
                        <div className="space-y-4 animate-pulse bg-brand-border/10 p-6 border border-dark-color-bar/10 min-h-[500px]">
                            <div className="h-6 bg-dark-color-bar/20 w-1/4 rounded-xs"></div>
                            <div className="h-4 bg-dark-color-bar/10 w-full rounded-xs"></div>
                        </div>
                    )}

                    {!loading && error && (
                        <div className="bg-[#FDF2F2] border-l-4 border-[#A01E36] p-6 font-serif rounded-sm min-h-[400px] flex flex-col justify-center items-center text-center">
                            <span className="text-3xl mb-2">⚠</span>
                            <p className="text-[#A01E36] font-bold text-lg mb-1 italic">{error}</p>
                            <Link href="/profile" className="mt-6 text-xs text-website-links hover:underline font-bold uppercase tracking-wider">
                                Повернутися до особистого кабінету
                            </Link>
                        </div>
                    )}

                    {!loading && !error && article && (
                        <div className="flex flex-col lg:flex-row gap-8">
                            {/* Текст статті */}
                            <div className="flex-grow bg-brand-border/10 p-6 border border-dark-color-bar/10 rounded-sm min-h-[500px] w-full max-w-full overflow-hidden">
                                <div
                                    className="wiki-preview-content text-main-text leading-relaxed"
                                    dangerouslySetInnerHTML={{ __html: article.content }}
                                />
                            </div>

                            {/* Інструменти збоку */}
                            {hasMetadata && (
                                <aside className="w-full lg:w-80 flex flex-col gap-6 shrink-0">
                                    {/* Кнопка збереження */}
                                    <div className="border-2 border-brand-border rounded-sm overflow-hidden shadow-sm bg-white p-4">
                                        <button
                                            type="button"
                                            disabled={isSaving}
                                            onClick={handleToggleSave}
                                            className={`w-full font-serif font-bold text-xs uppercase tracking-wider py-2.5 px-4 shadow-2xs transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 ${
                                                isSaved
                                                    ? "bg-[#FDF2F2] text-[#A01E36] border border-[#A01E36] hover:bg-[#A01E36] hover:text-white"
                                                    : "bg-search-button text-white hover:bg-website-name border border-transparent"
                                            }`}
                                        >
                                            {isSaving ? "Обробка..." : (isSaved ? "★ Не зберігати статтю" : "☆ Зберегти статтю")}
                                        </button>
                                    </div>

                                    {/* Зображення */}
                                    {article.mainImage && (
                                        <div className="border-4 border-brand-border rounded-sm overflow-hidden shadow-sm bg-white">
                                            <div className="bg-light-color-bar h-64 flex items-center justify-center p-4">
                                                <img src={article.mainImage} alt={article.title} className="max-h-56 mx-auto object-contain" />
                                            </div>
                                        </div>
                                    )}

                                    {/* Категорії статті */}
                                    <div className="border-2 border-brand-border rounded-sm overflow-hidden shadow-sm bg-white">
                                        <div className="bg-brand-border p-2 text-center font-bold text-xs uppercase tracking-wide text-website-name border-b border-dark-color-bar/20">
                                            Категорії матеріалу
                                        </div>
                                        <div className="p-3 flex flex-wrap gap-2">
                                            {article.categories && article.categories.length > 0 ? (
                                                article.categories.map((cat: Category) => (
                                                    <button
                                                        key={cat.id}
                                                        disabled={!isAuthorizedToSubmoderate}
                                                        onClick={() => handleRemoveCategory(cat.id, cat.name)}
                                                        className={`text-xs font-serif italic px-2 py-1 border transition-all ${
                                                            isAuthorizedToSubmoderate
                                                                ? "bg-[#FFF5F5] hover:bg-[#FDE8E8] text-[#A01E36] border-[#A01E36]/25 hover:border-[#A01E36] cursor-pointer"
                                                                : "bg-light-color-bar text-main-text border-dark-color-bar/10 cursor-default"
                                                        }`}
                                                        title={isAuthorizedToSubmoderate ? "Натисніть, щоб вилучити статтю з цієї категорії" : ""}
                                                    >
                                                        {cat.name} {isAuthorizedToSubmoderate && "✕"}
                                                    </button>
                                                ))
                                            ) : (
                                                <p className="text-xs text-gray-400 italic p-1">Статті не присвоєно жодної категорії.</p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Керування категоріями (адмін) */}
                                    {isAuthorizedToSubmoderate && (
                                        <div className="border-2 border-brand-border rounded-sm overflow-hidden shadow-sm bg-[#F8FAFC] p-4">
                                            <div className="font-bold text-xs uppercase tracking-wide text-gray-700 flex items-center gap-1.5 border-b border-gray-200 pb-2 mb-3">
                                                Керування категоріями
                                            </div>

                                            {categoryError && (
                                                <p className="text-[11px] text-[#A01E36] italic mb-2">{categoryError}</p>
                                            )}

                                            {!showCategoryDropdown ? (
                                                <button
                                                    onClick={() => setShowCategoryDropdown(true)}
                                                    className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold text-xs uppercase tracking-wider py-2 transition-colors cursor-pointer rounded-sm"
                                                >
                                                    + Додати категорію
                                                </button>
                                            ) : (
                                                <div className="space-y-2">
                                                    <select
                                                        onChange={handleAddCategory}
                                                        defaultValue=""
                                                        className="w-full p-2 bg-white border border-dark-color-bar/40 shadow-sm outline-none text-xs font-serif italic cursor-pointer focus:border-search-button transition-colors"
                                                    >
                                                        <option value="" disabled>Оберіть категорію...</option>
                                                        {allCategories
                                                            .filter(c => !article.categories?.some((ac: Category) => ac.id === c.id))
                                                            .map(c => (
                                                                <option key={c.id} value={c.id}>{c.name}</option>
                                                            ))
                                                        }
                                                    </select>

                                                    <button
                                                        onClick={() => setShowCategoryDropdown(false)}
                                                        className="w-full bg-white hover:bg-gray-100 border border-gray-300 text-gray-600 font-bold text-xs uppercase tracking-wider py-1.5 transition-colors cursor-pointer rounded-sm"
                                                    >
                                                        Скасувати
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* видалення статті (адмін) */}
                                    {isAuthorizedToSubmoderate && (
                                        <div className="border-2 border-[#A01E36]/30 rounded-sm overflow-hidden shadow-sm bg-[#FFF5F5] p-4 mt-2">
                                            <div className="font-bold text-xs uppercase tracking-wide text-[#A01E36] flex items-center gap-1.5 border-b border-[#A01E36]/10 pb-2 mb-3">
                                                Ви впевнені, що хочете видалити статтю?
                                            </div>

                                            <button
                                                type="button"
                                                disabled={isDeleting}
                                                onClick={handleDelete}
                                                className="w-full bg-[#A01E36] hover:bg-[#84172B] disabled:bg-[#A01E36]/50 text-white font-bold text-xs uppercase tracking-wider py-2 transition-colors flex items-center justify-center gap-2 cursor-pointer"
                                            >
                                                {isDeleting ? "Видалення..." : "Видалити всю статтю"}
                                            </button>
                                        </div>
                                    )}
                                    {/* версія та автор */}
                                    {(article.version || article.author) && (
                                        <div className="border-2 border-brand-border rounded-sm overflow-hidden shadow-sm bg-white text-xs mt-2">
                                            <table className="w-full border-collapse">
                                                <tbody>
                                                {/* Статус правки */}
                                                <tr className="border-b border-dark-color-bar/10">
                                                    <td className="p-2 bg-light-color-bar font-bold w-1/3 italic">Статус</td>
                                                    <td className="p-2 bg-white italic font-bold">
                                                        {!article.isPublished
                                                            ? <span className="text-main-text">Оригінал</span>
                                                            : article.isPublished
                                                                ? <span className="text-green-600">✓ Затверджено</span>
                                                                : <span className="text-[#A01E36]">Ще не затверджено</span>
                                                        }
                                                    </td>
                                                </tr>

                                                {article.version && (
                                                    <tr className="border-b border-dark-color-bar/10">
                                                        <td className="p-2 bg-light-color-bar font-bold italic">Версія</td>
                                                        <td className="p-2 bg-white italic font-bold">v{article.version}</td>
                                                    </tr>
                                                )}
                                                {article.author && (
                                                    <tr className="border-b border-dark-color-bar/10">
                                                        <td className="p-2 bg-light-color-bar font-bold italic">Автор</td>
                                                        <td className="p-2 bg-white italic text-website-links font-bold">@{article.author}</td>
                                                    </tr>
                                                )}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}

                                    {/* Таблиця правок */}
                                    {revisions.length > 0 && (
                                        <div className="border-2 border-brand-border rounded-sm overflow-hidden shadow-sm bg-white text-xs mt-2">
                                            <div className="bg-brand-border p-2 text-center font-bold text-xs uppercase tracking-wide text-website-name border-b border-dark-color-bar/20">
                                                Правки статті ({revisions.length})
                                            </div>
                                            <div className="divide-y divide-dark-color-bar/10">
                                                {revisions.map((rev: any) => (
                                                    <div key={rev.id} className="p-2 flex justify-between items-center gap-2">
                                                        <div className="flex flex-col gap-0.5">
                                                            <span className="italic text-gray-500 text-[10px]">
                                                                @{rev.author || 'Анонім'} </span>
                                                            <span className="italic text-gray-400 text-[10px]"> {rev.createdAt || '—'} </span>
                                                            {rev.comment && (
                                                                <span className="italic text-main-text/70 text-[10px] line-clamp-1">
                                                                    {rev.comment}
                                                                </span>
                                                            )}
                                                        </div>
                                                        <Link
                                                            href={`/article/${rev.slug}`}
                                                            className="shrink-0 bg-light-color-bar hover:bg-brand-border border border-dark-color-bar/20 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-main-text transition-colors"
                                                        >
                                                            Переглянути
                                                        </Link>
                                                    </div>
                                                ))}
                                            </div>
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