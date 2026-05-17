"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";

export default function SearchPage() {
    const searchParams = useSearchParams();
    const router = useRouter();

    // cтани для зберігання значень з полів
    const initialQuery = searchParams.get("q") || "";
    const [query, setQuery] = useState(initialQuery);
    const [searchType, setSearchType] = useState("");

    // оновлюємо поле, якщо запит змінився в URL (наприклад, пошук з Header)
    useEffect(() => {
        setQuery(searchParams.get("q") || "");
    }, [searchParams]);

    // обробник для головної кнопки пошуку
    const handleMainSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            // тут можна додати type у URL, якщо потрібно: ?q=...&type=...
            router.push(`/search?q=${encodeURIComponent(query.trim())}`);
        }
    };

    return (
        <div className="min-h-screen bg-white flex flex-col font-serif">
            <Header />

            <div className="flex flex-row flex-grow w-full max-w-[1400px] mx-auto">
                <Sidebar />

                {/* основна частина */}
                <main className="flex-grow p-6 md:p-10 w-full max-w-4xl">

                    {/* заголовок сторінки у синьому блоці (як на макеті) */}
                    <div className="bg-dark-color-bar px-6 py-3 mb-6 flex items-center">
                        <h1 className="text-white text-xl md:text-2xl font-bold italic">
                            Пошук
                        </h1>
                    </div>

                    {/* блок з полями вводу */}
                    <div className="space-y-4 mb-10 pl-2">
                        {/* поле "Введіть тему для пошуку" */}
                        <form onSubmit={handleMainSearch} className="flex h-12 max-w-2xl shadow-sm">
                            <input
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Введіть тему для пошуку..."
                                className="flex-grow px-5 bg-light-color-bar
                                text-main-text placeholder:text-main-text/60 italic
                                outline-none text-lg border-none"
                            />
                            <button
                                type="submit"
                                className="bg-search-button hover:bg-website-name transition-colors
                                w-16 flex items-center justify-center flex-shrink-0"
                            >
                                {/* іконка олівця */}
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 512 512"
                                    fill="currentColor"
                                    className="w-6 h-6 text-white"
                                >
                                    <path d="M36.4 353.2c4.1-14.6 11.8-27.9 22.6-38.7l181.2-181.2 33.9-33.9c16.6 16.6 51.3 51.3 104 104l33.9 33.9-33.9 33.9-181.2 181.2c-10.7 10.7-24.1 18.5-38.7 22.6L30.4 510.6c-8.3 2.3-17.3 0-23.4-6.2S-1.4 489.3 .9 481L36.4 353.2zm55.6-3.7c-4.4 4.7-7.6 10.4-9.3 16.6l-24.1 86.9 86.9-24.1c6.4-1.8 12.2-5.1 17-9.7L91.9 349.5zm354-146.1c-16.6-16.6-51.3-51.3-104-104L308 65.5C334.5 39 349.4 24.1 352.9 20.6 366.4 7 384.8-.6 404-.6S441.6 7 455.1 20.6l35.7 35.7C504.4 69.9 512 88.3 512 107.4s-7.6 37.6-21.2 51.1c-3.5 3.5-18.4 18.4-44.9 44.9z"/>
                                </svg>
                            </button>
                        </form>

                        {/* поле "Шукати за типом" (select or input) */}
                        <div className="flex h-12 max-w-2xl shadow-sm">
                            <select
                                value={searchType}
                                onChange={(e) => setSearchType(e.target.value)}
                                className="flex-grow px-4 bg-light-color-bar text-main-text italic
                                outline-none text-lg border-none appearance-none cursor-pointer"
                            >
                                <option value="" disabled> Шукати за типом... </option>
                                <option value="articles"> Статті </option>
                                <option value="authors"> Автори </option>
                                <option value="categories"> Категорії </option>
                            </select>

                            <div className="bg-search-button w-16 flex items-center justify-center
                            flex-shrink-0 pointer-events-none">
                                {/* іконка фільтра */}
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={2.5}
                                    stroke="currentColor"
                                    className="w-7 h-7 text-white"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0m-9.75 0h9.75" />
                                </svg>
                            </div>
                        </div>

                    </div>

                    {/* відображення результатів */}
                    {!query ? (
                        <div className="mt-8 p-6 text-main-text italic text-lg">
                            <p>Використовуйте форму вище для пошуку інформації в базі даних.</p>
                        </div>
                    ) : (
                        <div className="space-y-6 mt-8">
                            <p className="text-gray-600">
                                Результати пошуку для <span className="font-bold text-website-name">"{query}"</span>
                                {searchType && <span> (Тип {searchType})</span>}
                                    </p>

                                {/* Заглушка для результатів */}
                                <div className="border-b border-gray-200 pb-4">
                                    <h3 className="text-xl text-website-links font-bold hover:underline
                                    cursor-pointer mb-2">
                                        Приклад результату з бази даних
                                    </h3>
                                    <p className="text-sm text-gray-700 leading-relaxed">
                                        Тут буде відображатися короткий опис статті або інформація про знайденого автора. Пошук підтримує фільтрацію за обраним типом даних.
                                    </p>
                                </div>
                        </div>
                    )}

                </main>
            </div>
        </div>
    );
}