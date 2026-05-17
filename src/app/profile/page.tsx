"use client";

import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import Link from 'next/link';
// імітація даних користувача та його активності
const USER_INFO = {
    username: "milana_popovych",  // unique
    fullName: "Попович Мілана Олександрівна",
    email: "popovych.m.o.-io46@edu.kpi.ua",
    role: "Адмін",
    createdAt: "10.05.2026"
};

const MOCK_RECENT_PUBLICATIONS = [
    { id: 1, title: "Алгоритми повнотекстового пошуку в PostgreSQL", date: "2026-05-10", type: "Створення" },
    { id: 2, title: "Архітектура MVC у сучасних вебфреймворках", date: "2026-05-14", type: "Редагування" },
    { id: 3, title: "Основи гідратації в React 19 та Next.js", date: "2026-05-01", type: "Редагування" },
    { id: 4, title: "Бази даних ACID: теорія та практика", date: "2026-05-15", type: "Створення" }
];

const MOCK_SAVED_ARTICLES = [
    { id: 10, title: "UML-діаграми класів у проєктуванні", savedAt: "2026-05-16 14:20" },
    { id: 11, title: "Порівняльний аналіз онлайн-енциклопедій", savedAt: "2026-05-15 09:15" },
    { id: 12, title: "Розробка Frontend складової для вікі-систем", savedAt: "2026-05-10 18:40" }
];

export default function ProfilePage() {
    const [isMounted, setIsMounted] = useState(false);
    // стейти для блоку нещодавніх публікацій
    const [pubSearch, setPubSearch] = useState("");
    const [pubSortOrder, setPubSortOrder] = useState("date-desc"); // за замовчуванням нові перші

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) return null;

    // статус розробника
    const isPrivileged = USER_INFO.role === "Адміністратор" || USER_INFO.role === "Модератор";
    const cabinetSubtitle = isPrivileged
        ? "Особистий кабінет розробника WiKPIdia"
        : "Особистий кабінет користувача WiKPIdia";

    // логіка фільтрації та сортування для нещодавніх публікацій
    const getFilteredAndSortedPublications = () => {
        let items = MOCK_RECENT_PUBLICATIONS.filter(pub =>
            pub.title.toLowerCase().includes(pubSearch.toLowerCase())
        );

        return items.sort((a, b) => {
            if (pubSortOrder === "alpha-asc") return a.title.localeCompare(b.title);
            if (pubSortOrder === "alpha-desc") return b.title.localeCompare(a.title);
            if (pubSortOrder === "date-asc") return new Date(a.date).getTime() - new Date(b.date).getTime();
            return new Date(b.date).getTime() - new Date(a.date).getTime(); // date-desc
        });
    };

    return (
        <div className="min-h-screen bg-white flex flex-col font-serif">
            <Header />
            <div className="flex flex-row flex-grow w-full max-w-[1400px] mx-auto">
                <Sidebar />
                <main className="flex-grow p-4 md:p-8 space-y-8">

                    {/* головний заголовок кабінету */}
                    <div className="bg-search-button px-6 py-4 shadow-sm flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="bg-white text-search-button p-2 rounded-full font-bold text-xl w-10 h-10 flex items-center justify-center uppercase">
                                {USER_INFO.username[0]}
                            </div>
                            <div>
                                <h1 className="text-white text-2xl font-bold italic">{USER_INFO.username}</h1>
                                <p className="text-white/80 text-xs italic">{cabinetSubtitle}</p>
                            </div>
                        </div>
                        <div className="bg-dark-color-bar text-white text-xs px-3 py-1 uppercase tracking-wider font-bold">
                            {USER_INFO.role}
                        </div>
                    </div>

                    {/* основна сітка */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* лч (профіль, коментарі) */}
                        <div className="space-y-6 lg:col-span-1">
                            {/* Картка інформації */}
                            <div className="border border-dark-color-bar/20 rounded-sm overflow-hidden bg-brand-border/5">
                                <div className="bg-dark-color-bar px-4 py-2 text-white font-bold italic">Інформація користувача</div>
                                <div className="p-4 space-y-3 text-sm text-main-text">
                                    <div><span className="font-bold italic">ПІБ:</span> {USER_INFO.fullName}</div>
                                    <div><span className="font-bold italic">Ел. адреса:</span> {USER_INFO.email}</div>
                                    <div><span className="font-bold italic">Дата реєстрації:</span> {USER_INFO.createdAt}</div>
                                </div>
                            </div>
                            {/* картка переходу до коментарів */}
                            <div className="border border-dark-color-bar/20 rounded-sm overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow">
                                <div className="bg-dark-color-bar px-4 py-2 text-white font-bold italic">Коментарі</div>
                                <div className="p-6 text-center space-y-4">
                                    <p className="text-sm italic text-gray-600">Всі ваші коментарі, запитання та відповіді до статей перенесено у розділ</p>
                                    <Link
                                        href="/profile/discussions"
                                        className="inline-block w-full text-center bg-search-button hover:bg-website-name text-white font-bold py-2 transition-colors shadow-sm uppercase tracking-wide text-sm"
                                    >
                                        Мої обговорення
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* пч (публікації та збережене) */}
                        <div className="lg:col-span-2 space-y-8">
                            {/* с1 нещодавні публікації */}
                            <div className="border border-dark-color-bar/20 rounded-sm overflow-hidden bg-white shadow-sm">
                                <div className="bg-dark-color-bar px-4 py-2 text-white font-bold italic flex flex-wrap justify-between items-center gap-2">
                                    <span>Нещодавні публікації (мої статті та правки)</span>
                                    {/* сортування */}
                                    <select
                                        value={pubSortOrder}
                                        onChange={(e) => setPubSortOrder(e.target.value)}
                                        className="bg-light-color-bar text-main-text text-sm p-1 font-serif italic outline-none border border-dark-color-bar/20 cursor-pointer"
                                    >
                                        <option value="date-desc">Від нових до старих</option>
                                        <option value="date-asc">Від старих до нових</option>
                                        <option value="alpha-asc">За алфавітом (А-Я)</option>
                                        <option value="alpha-desc">За алфавітом (Я-А)</option>
                                    </select>
                                </div>

                                <div className="p-4 space-y-4">
                                    {/* внутрішній пошук */}
                                    <input
                                        type="text"
                                        value={pubSearch}
                                        onChange={(e) => setPubSearch(e.target.value)}
                                        placeholder="Шукати..."
                                        className="w-full p-2 bg-light-color-bar border border-dark-color-bar/10 outline-none text-sm italic placeholder:text-main-text/70"
                                    />
                                    {/* список відсортованих публікацій */}
                                    <div className="space-y-2 max-h-60 overflow-y-auto">
                                        {getFilteredAndSortedPublications().length > 0 ? (
                                            getFilteredAndSortedPublications().map(pub => (
                                                <div key={pub.id} className="flex justify-between items-center p-2 bg-brand-border/10 border-l-2 border-search-button text-xs italic">
                                                    <span className="font-bold text-main-text line-clamp-1">{pub.title}</span>
                                                    <div className="flex gap-4 text-gray-500 shrink-0">
                                                        <span>{pub.type}</span>
                                                        <span>{pub.date}</span>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-center text-xs text-gray-400 py-4 italic">Нічого не знайдено за цим запитом.</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                            {/* с2 збережені статті */}
                            <div className="border border-dark-color-bar/20 rounded-sm overflow-hidden bg-white shadow-sm">
                                {/* заголовок секції */}
                                <div className="bg-dark-color-bar px-4 py-2 text-white font-bold italic flex items-center gap-2">
                                    {/* іконка */}
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 640 640"
                                        className="w-6 h-6 shrink-0 text-white"
                                        fill="currentColor"
                                        aria-hidden="true"
                                    >
                                        <path d="M192 64C156.7 64 128 92.7 128 128L128 544C128 555.5 134.2 566.2 144.2 571.8C154.2 577.4 166.5 577.3 176.4 571.4L320 485.3L463.5 571.4C473.4 577.3 485.7 577.5 495.7 571.8C505.7 566.1 512 555.5 512 544L512 128C512 92.7 483.3 64 448 64L192 64z"/>
                                    </svg>
                                    <span>Збережені статті (від нових до давніших)</span>
                                </div>

                                <div className="p-4 bg-brand-border/5">
                                    <div className="space-y-2">
                                        {MOCK_SAVED_ARTICLES.map(saved => (
                                            <div key={saved.id} className="p-3 bg-white border border-dark-color-bar/10 flex justify-between items-center text-m shadow-2xs italic">
                    <span className="text-website-links font-bold hover:underline cursor-pointer">
                        {saved.title}
                    </span>
                                                <span className="text-gray-400 text-[14px] shrink-0">
                        Збережено: {saved.savedAt}
                    </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}