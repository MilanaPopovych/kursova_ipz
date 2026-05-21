"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import Link from "next/link";

export default function SearchPage() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const urlQuery = searchParams.get("q") || "";
    const urlType = searchParams.get("type") || "articles";

    const [query, setQuery] = useState(urlQuery);
    const [searchType, setSearchType] = useState(urlType);
    const [results, setResults] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const executeBackendSearch = async (searchQuery: string, dataType: string) => {
        setLoading(true);
        setError(null);

        const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8081';

        try {
            const response = await fetch(
                `${baseUrl}/api/search?q=${encodeURIComponent(searchQuery)}&type=${dataType}`,
                {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' }
                }
            );

            if (!response.ok) {
                throw new Error('Помилка сервера під час обробки пошукового запиту.');
            }

            const data = await response.json();
            setResults(data || []);
        } catch (err: any) {
            console.error("Глобальна помилка пошуку:", err);
            setError("Помилка Spring Boot додатка.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setQuery(urlQuery);
        setSearchType(urlType);

        if (urlQuery.trim()) {
            executeBackendSearch(urlQuery, urlType);
        } else {
            setResults([]);
        }
    }, [searchParams]);

    const handleMainSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            router.push(`/search?q=${encodeURIComponent(query.trim())}&type=${searchType}`);
        }
    };

    const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedType = e.target.value;
        setSearchType(selectedType);
        if (query.trim()) {
            router.push(`/search?q=${encodeURIComponent(query.trim())}&type=${selectedType}`);
        }
    };

    return (
        <div className="min-h-screen bg-white flex flex-col font-serif overflow-hidden">
            <Header />

            <div className="flex flex-row flex-grow w-full max-w-[1400px] mx-auto overflow-hidden">
                <Sidebar />

                <main className="flex-grow p-6 md:p-10 w-full max-w-4xl overflow-hidden">
                    {/* Заголовок */}
                    <div className="bg-dark-color-bar px-6 py-3 mb-6 flex items-center shadow-sm">
                        <h1 className="text-white text-xl md:text-2xl font-bold italic">
                            Пошук
                        </h1>
                    </div>

                    {/* Форма пошуку */}
                    <div className="space-y-4 mb-10 pl-2">
                        <form onSubmit={handleMainSearch} className="flex h-12 max-w-2xl shadow-sm border border-dark-color-bar/10">
                            <input
                                type="text"
                                value={query}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
                                placeholder="Введіть тему чи ключові слова для пошуку..."
                                className="flex-grow px-5 bg-light-color-bar text-main-text placeholder:text-main-text/40 italic outline-none text-lg border-none"
                            />
                            <button
                                type="submit"
                                disabled={loading}
                                className="bg-search-button hover:bg-website-name transition-colors w-16 flex items-center justify-center flex-shrink-0 disabled:opacity-50 cursor-pointer"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentColor" className="w-6 h-6 text-white">
                                    <path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z"/>
                                </svg>
                            </button>
                        </form>

                        <div className="flex h-12 max-w-2xl shadow-sm border border-dark-color-bar/10">
                            <select
                                value={searchType}
                                onChange={handleTypeChange}
                                className="flex-grow px-4 bg-light-color-bar text-main-text italic outline-none text-lg border-none appearance-none cursor-pointer"
                            >
                                <option value="articles">Статті енциклопедії</option>
                                <option value="categories">Категорії знань</option>
                            </select>

                            <div className="bg-search-button w-16 flex items-center justify-center flex-shrink-0 pointer-events-none">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-7 h-7 text-white">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0m-9.75 0h9.75" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* Стан без пошуку */}
                    {!urlQuery && (
                        <div className="mt-8 p-6 border border-dashed border-dark-color-bar/20 rounded-sm bg-brand-border/5 text-main-text/60 italic text-lg text-center">
                            <p>Використовуйте форму вище для глобального пошуку інформації в базі даних</p>
                        </div>
                    )}

                    {/* Завантаження */}
                    {loading && (
                        <div className="mt-8 text-center font-serif italic text-main-text animate-pulse">
                            Виконується індексація та пошук у базі даних PostgreSQL...
                        </div>
                    )}

                    {/* Помилка */}
                    {!loading && error && (
                        <div className="mt-8 bg-[#FDF2F2] border-l-4 border-[#A01E36] p-4 text-sm font-serif italic text-[#A01E36]">
                            {error}
                        </div>
                    )}

                    {/* Результати */}
                    {!loading && !error && urlQuery && (
                        <div className="space-y-6 mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <p className="text-gray-600 italic text-sm">
                                Результати пошуку за запитом: <span className="font-bold text-website-name">"{urlQuery}"</span>
                                <span className="text-gray-400"> (знайдено об'єктів: {results.length})</span>
                            </p>

                            {results.length === 0 ? (
                                <div className="py-12 text-center border border-dashed border-dark-color-bar/20 rounded-sm bg-brand-border/5">
                                    <p className="text-main-text font-serif text-lg italic">
                                        За запитом "{urlQuery}" нічого не знайдено. <br />
                                        Спробуйте змінити критерії пошуку чи перевірте орфографію.
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {results.map((item: any) => {
                                        let destinationUrl = `/article/${item.slug}`;
                                        if (urlType === 'categories') destinationUrl = `/category/${item.id}`;

                                        return (
                                            <div
                                                key={item.id}
                                                className="border-b border-dark-color-bar/10 pb-4 last:border-b-0 group"
                                            >
                                                <Link href={destinationUrl}>
                                                    <h3 className="text-xl text-website-links font-bold hover:underline cursor-pointer mb-1 group-hover:text-website-name transition-colors">
                                                        {item.title || item.name}
                                                    </h3>
                                                </Link>
                                                <p className="text-sm text-gray-700 leading-relaxed italic line-clamp-3">
                                                    {item.snippet || item.description || "Довідкова інформація відсутня."}
                                                </p>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}