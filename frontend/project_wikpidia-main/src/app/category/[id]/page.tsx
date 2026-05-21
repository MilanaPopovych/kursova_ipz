"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function CategoryDetailPage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;
    const { user, token } = useAuth();

    const [category, setCategory] = useState<any>(null);
    const [allArticles, setAllArticles] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isAdding, setIsAdding] = useState(false);
    const [articleSearchQuery, setArticleSearchQuery] = useState("");

    const isPrivileged = user && (user.role === 'Адміністратор' || user.role === 'Адмін' || user.role === 'ADMIN' || user.role === 'Головний редактор');
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8081';

    const loadCategoryData = async () => {
        try {
            const res = await fetch(`${baseUrl}/api/categories/${id}`);
            if (!res.ok) throw new Error("Не вдалося завантажити контент категорії.");
            const data = await res.json();
            setCategory(data);
        } catch (err: any) {
            setError("Категорію не знайдено або сервер не відповідає.");
        } finally {
            setLoading(false);
        }
    };

    const loadAllArticles = async () => {
        if (!isPrivileged) return;
        try {
            const res = await fetch(`${baseUrl}/api/articles`);
            if (res.ok) {
                const data = await res.json();
                setAllArticles(data || []);
            }
        } catch (err) {
            console.error("Помилка завантаження глобальних статей:", err);
        }
    };

    useEffect(() => {
        if (id) {
            loadCategoryData();
        }
    }, [id]);

    useEffect(() => {
        if (isPrivileged && allArticles.length === 0) {
            loadAllArticles();
        }
    }, [isPrivileged, user]);

    const handleAddArticleById = async (articleId: number) => {
        if (!token) return;

        setIsAdding(true);
        try {
            const res = await fetch(`${baseUrl}/api/categories/${id}/articles/${articleId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (res.ok) {
                loadCategoryData();
                setArticleSearchQuery("");
            } else {
                alert("Не вдалося прив'язати статтю.");
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsAdding(false);
        }
    };

    const handleRemoveArticle = async (articleId: number, articleTitle: string) => {
        const confirmRemove = window.confirm(`Ви впевнені, що хочете вилучити статтю "${articleTitle}" з цієї категорії?`);
        if (!confirmRemove || !token) return;

        try {
            const res = await fetch(`${baseUrl}/api/categories/${id}/articles/${articleId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (res.ok) {
                loadCategoryData();
            } else {
                alert("Не вдалося вилучити статтю.");
            }
        } catch (err) {
            console.error("Помилка вилучення:", err);
        }
    };

    const getFilteredArticlesForAdd = () => {
        if (!allArticles || !category) return [];

        let available = allArticles.filter((art: any) =>
            !category.articles?.some((ca: any) => ca.id === art.id)
        );

        if (articleSearchQuery.trim()) {
            const query = articleSearchQuery.toLowerCase();
            available = available.filter(art =>
                art.title.toLowerCase().includes(query) ||
                art.slug.toLowerCase().includes(query)
            );
        }

        return available;
    };

    const searchResults = getFilteredArticlesForAdd();

    return (
        <div className="min-h-screen bg-white flex flex-col font-serif overflow-hidden">
            <Header />
            <div className="flex flex-row flex-grow w-full max-w-[1400px] mx-auto overflow-hidden">
                <Sidebar />

                <main className="flex-grow p-4 md:p-8 space-y-6 overflow-hidden">
                    <div className="flex justify-between items-center">
                        <Link href="/category" className="text-website-links text-sm hover:underline italic">
                            ← Назад до всіх категорій
                        </Link>
                    </div>

                    {loading ? (
                        <p className="text-center italic text-gray-500 animate-pulse py-10">
                            Завантаження структури знань з PostgreSQL...
                        </p>
                    ) : error || !category ? (
                        <div className="bg-[#FDF2F2] border-l-4 border-[#A01E36] p-6 text-center">
                            <span className="text-2xl block mb-2">⚠️</span>
                            <p className="text-[#A01E36] font-bold italic">{error || "Помилка завантаження."}</p>
                        </div>
                    ) : (
                        <>
                            {/* Шапка категорії */}
                            <div className="bg-search-button px-6 py-4 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                <div>
                                    <h1 className="text-white text-2xl md:text-3xl font-bold italic">
                                        📁 Категорія: {category.name}
                                    </h1>
                                    <p className="text-white/70 text-xs italic mt-1">ID: {category.id}</p>
                                </div>
                            </div>

                            {/* Панель адміністратора */}
                            {isPrivileged && (
                                <div className="border border-dark-color-bar/20 rounded-sm p-4 bg-[#F8FAFC] space-y-3 shadow-2xs">
                                    <div className="text-xs font-bold uppercase tracking-wider text-gray-700 flex items-center gap-2">
                                        🛡️ Інструменти модератора: Додати існуючу статтю в цю категорію
                                    </div>

                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={articleSearchQuery}
                                            onChange={(e) => setArticleSearchQuery(e.target.value)}
                                            placeholder="Почніть вводити назву або slug статті для пошуку..."
                                            className="w-full max-w-xl p-2.5 bg-white border border-dark-color-bar/20 outline-none text-sm font-serif italic focus:border-search-button shadow-sm transition-colors"
                                            disabled={isAdding}
                                        />

                                        {articleSearchQuery.trim() && (
                                            <div className="absolute z-10 w-full max-w-xl mt-1 bg-white border border-dark-color-bar/20 shadow-md max-h-60 overflow-y-auto rounded-sm">
                                                {searchResults.length > 0 ? (
                                                    searchResults.map((art: any) => (
                                                        <div
                                                            key={art.id}
                                                            className="p-3 border-b border-gray-100 last:border-0 hover:bg-brand-border/10 flex justify-between items-center transition-colors"
                                                        >
                                                            <div>
                                                                <div className="font-bold text-website-links text-sm line-clamp-1">{art.title}</div>
                                                                <div className="text-[10px] text-gray-400 mt-0.5">Slug: {art.slug}</div>
                                                            </div>
                                                            <button
                                                                onClick={() => handleAddArticleById(art.id)}
                                                                disabled={isAdding}
                                                                className="bg-search-button hover:bg-website-name text-white px-2 py-1 text-[10px] uppercase font-bold tracking-wider rounded-sm shrink-0 cursor-pointer disabled:opacity-50 transition-colors"
                                                            >
                                                                + Додати
                                                            </button>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <div className="p-4 text-center text-xs text-gray-500 italic">
                                                        Статей не знайдено або вони вже додані до цієї категорії.
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Список статей категорії */}
                            <div className="border border-dark-color-bar/10 rounded-sm bg-white p-6 shadow-2xs">
                                <h2 className="text-website-name font-bold text-lg border-b border-dark-color-bar/10 pb-2 italic mb-4">
                                    Матеріали, прив'язані до цієї категорії:
                                </h2>

                                {!category.articles || category.articles.length === 0 ? (
                                    <p className="text-center py-8 text-gray-400 italic text-sm">
                                        До цієї категорії ще не додано жодної статті.
                                    </p>
                                ) : (
                                    <div className="space-y-4">
                                        {category.articles.map((art: any) => (
                                            <div key={art.id} className="border-b border-gray-100 pb-3 last:border-b-0 flex justify-between items-center gap-4">
                                                <div>
                                                    <Link href={`/article/${art.slug}`} className="text-website-links font-bold hover:underline text-lg">
                                                        📄 {art.title}
                                                    </Link>
                                                    <p className="text-xs text-gray-400 italic mt-0.5">Автор: @{art.author || "Редакція"}</p>
                                                </div>

                                                <div className="flex items-center gap-3 shrink-0">
                                                    <span className="text-xs text-gray-400 uppercase tracking-wider bg-gray-100 px-2 py-1">
                                                        ID: {art.id}
                                                    </span>

                                                    {isPrivileged && (
                                                        <button
                                                            onClick={() => handleRemoveArticle(art.id, art.title)}
                                                            className="bg-[#FFF5F5] text-[#A01E36] border border-[#A01E36]/20 hover:bg-[#A01E36] hover:text-white px-3 py-1 text-[11px] font-bold uppercase tracking-wider transition-colors cursor-pointer rounded-sm"
                                                        >
                                                            ✕ Вилучити
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </main>
            </div>
        </div>
    );
}