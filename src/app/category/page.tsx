"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";

export default function CategoryPage() {
    const params = useParams();
    const categoryName = params.id ? decodeURIComponent(params.id as string) : "Усі категорії";

    const [searchTerm, setSearchTerm] = useState("");
    const [contentType, setContentType] = useState("");

    // новий стан: чи був виконаний пошук
    const [isSearchPerformed, setIsSearchPerformed] = useState(false);

    const handleSearchTrigger = (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        // активуємо відображення результатів
        setIsSearchPerformed(true);
        // місце для запиту до бази PostgreSQL
    };

    return (
        <div className="min-h-screen bg-white flex flex-col font-serif">
            <Header />

            <div className="flex flex-row flex-grow w-full max-w-[1400px] mx-auto">
                <Sidebar />

                <main className="flex-grow p-6 md:p-10 w-full max-w-4xl">
                    {/* заголовок категорії */}
                    <div className="bg-dark-color-bar px-6 py-3 mb-6 flex items-center shadow-sm">
                        <h1 className="text-white text-xl md:text-2xl font-bold italic
                        uppercase tracking-wide">
                            Категорія: {categoryName}
                        </h1>
                    </div>
                    {/* блок фільтрації */}
                    <div className="space-y-4 mb-10 pl-2">
                        {/* пошук */}
                        <form onSubmit={handleSearchTrigger} className="flex h-12 max-w-2xl shadow-sm border
                        border-dark-color-bar/10">
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Пошук у цій категорії..."
                                className="flex-grow px-5 bg-light-color-bar text-main-text
                                placeholder:text-main-text/40 italic outline-none text-lg border-none"
                            />
                            <button
                                type="submit"
                                className="bg-search-button hover:bg-website-name transition-colors
                                w-16 flex items-center justify-center flex-shrink-0 text-white"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg"
                                     viewBox="0 0 512 512"
                                     fill="currentColor"
                                     className="w-6 h-6">
                                    <path d="M36.4 353.2c4.1-14.6 11.8-27.9 22.6-38.7l181.2-181.2 33.9-33.9c16.6 16.6 51.3 51.3 104 104l33.9 33.9-33.9 33.9-181.2 181.2c-10.7 10.7-24.1 18.5-38.7 22.6L30.4 510.6c-8.3 2.3-17.3 0-23.4-6.2S-1.4 489.3 .9 481L36.4 353.2zm55.6-3.7c-4.4 4.7-7.6 10.4-9.3 16.6l-24.1 86.9 86.9-24.1c6.4-1.8 12.2-5.1 17-9.7L91.9 349.5zm354-146.1c-16.6-16.6-51.3-51.3-104-104L308 65.5C334.5 39 349.4 24.1 352.9 20.6 366.4 7 384.8-.6 404-.6S441.6 7 455.1 20.6l35.7 35.7C504.4 69.9 512 88.3 512 107.4s-7.6 37.6-21.2 51.1c-3.5 3.5-18.4 18.4-44.9 44.9z"/>
                                </svg>
                            </button>
                        </form>
                        {/* вибір типу контенту */}
                        <div className="flex h-12 max-w-2xl shadow-sm border border-dark-color-bar/10">
                            <select
                                value={contentType}
                                onChange={(e) => {
                                    setContentType(e.target.value);
                                    setIsSearchPerformed(true); // активуємо при зміні типу
                                }}
                                className="flex-grow px-4 bg-light-color-bar text-main-text italic
                                outline-none text-lg border-none appearance-none cursor-pointer"
                            >
                                <option value="" disabled> Перегляд контенту в категорії... </option>
                                <option value="articles"> Статті цієї категорії </option>
                                <option value="authors"> Автори </option>
                                <option value="subcategories"> Підкатегорії </option>
                            </select>
                            <div className="bg-search-button w-16 flex items-center justify-center
                            flex-shrink-0 pointer-events-none text-white">
                                <svg xmlns="http://www.w3.org/2000/svg"
                                     fill="none" viewBox="0 0 24 24"
                                     strokeWidth={2.5} stroke="currentColor"
                                     className="w-7 h-7">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0m-9.75 0h9.75" />
                                </svg>
                            </div>
                        </div>
                    </div>
                    {/* контроль відображення результатів */}
                    {!isSearchPerformed ? (
                        // стан до пошуку: коротке пояснення
                        <div className="mt-12 p-8 border border-dashed border-dark-color-bar/20
                        rounded-sm bg-brand-border/5">
                            <p className="text-main-text/60 italic text-center text-lg">
                                Оберіть параметри вище, щоб переглянути вміст категорії <br/>
                                або знайти конкретну інформацію.
                            </p>
                        </div>
                    ) : (
                        // cтан після пошуку: заголовок та результати
                        <div className="mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <h2 className="text-website-name text-lg font-bold italic border-b
                            border-dark-color-bar/20 pb-2 uppercase mb-6">
                                Список знайдених результатів:
                            </h2>
                            {/* якщо результатів реально немає (масив порожній) */}
                            {searchTerm === "немає" ? ( // Тимчасова умова для тесту
                                <div className="py-10 text-center border border-dashed
                                border-dark-color-bar/20 rounded-sm bg-brand-border/10">
                                    <p className="text-main-text font-serif text-xl italic">
                                        Результатів не знайдено
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div className="p-4 bg-brand-border/20 border-l-4
                                    border-search-button hover:bg-brand-border/40
                                    transition-colors cursor-pointer">
                                        <h3 className="text-website-links font-bold text-xl mb-1">
                                            Приклад знайденої статті</h3>
                                        <p className="text-sm text-gray-600">
                                            Результат, який з'явився лише після кліку на пошук.</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}