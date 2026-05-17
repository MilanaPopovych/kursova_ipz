"use client";

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import ArticleTabs from '@/components/ArticleTabs';
// імітація бд
const MOCK_TOPICS = [
    "Проблема з джерелами у розділі Історія",
    "Пропозиція додати нове зображення",
    "Помилка в датах",
];

export default function DiscussionPage() {
    const params = useParams();
    const slug = params.slug as string;
    const articleTitle = slug ? decodeURIComponent(slug).replace(/-/g, ' ') : "Назва статті";

    const [topicSearch, setTopicSearch] = useState("");
    const [filteredTopics, setFilteredTopics] = useState<string[]>([]);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [comment, setComment] = useState("");
    // логіка пошуку тем "на льоту"
    useEffect(() => {
        if (topicSearch.trim().length > 0) {
            const results = MOCK_TOPICS.filter(t =>
                t.toLowerCase().includes(topicSearch.toLowerCase())
            );
            setFilteredTopics(results);
            setIsDropdownOpen(true);
        } else {
            setFilteredTopics([]);
            setIsDropdownOpen(false);
        }
    }, [topicSearch]);

    return (
        <div className="min-h-screen bg-white flex flex-col font-serif">
            <Header />
            <div className="flex flex-row flex-grow w-full max-w-[1400px] mx-auto">
                <Sidebar />
                <main className="flex-grow p-4 md:p-8">
                    <ArticleTabs slug={slug} />

                    <div className="bg-search-button px-6 py-2 mb-6 shadow-sm">
                        <h1 className="text-white text-xl md:text-2xl font-bold italic">
                            Обговорення статті "{articleTitle}"
                        </h1>
                    </div>

                    <div className="space-y-6">
                        {/* ПОЛЕ ВВОДУ ПІДЗАГОЛОВКА З ПОШУКОМ */}
                        <div className="relative border border-dark-color-bar/20 rounded-sm overflow-hidden">
                            <div className="bg-dark-color-bar px-4 py-2 text-white font-bold italic">
                                Введіть підзаголовок (Назва теми обговорення)
                            </div>
                            <div className="p-4 bg-brand-border/20">
                                <input
                                    type="text"
                                    value={topicSearch}
                                    onChange={(e) => setTopicSearch(e.target.value)}
                                    placeholder="Почніть вводити назву теми..."
                                    className="w-full p-2 bg-light-color-bar border border-dark-color-bar/10 outline-none italic"
                                />

                                {/* Випадаючий список результатів пошуку */}
                                {isDropdownOpen && (
                                    <div className="absolute left-4 right-4 mt-1 bg-white border border-dark-color-bar/20 shadow-lg z-10 max-h-48 overflow-y-auto">
                                        {filteredTopics.length > 0 ? (
                                            filteredTopics.map((topic, index) => (
                                                <div
                                                    key={index}
                                                    onClick={() => { setTopicSearch(topic); setIsDropdownOpen(false); }}
                                                    className="p-2 hover:bg-brand-border/30 cursor-pointer border-b border-gray-100 last:border-none"
                                                >
                                                    🔍 {topic}
                                                </div>
                                            ))
                                        ) : (
                                            <div
                                                className="p-2 text-website-links font-bold cursor-pointer hover:bg-brand-border/30"
                                                onClick={() => setIsDropdownOpen(false)}
                                            >
                                                Створіть нове обговорення: "{topicSearch}"
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* ТЕКСТОВИЙ РЕДАКТОР КОМЕНТАРЯ */}
                        <div className="border border-dark-color-bar/20 rounded-sm overflow-hidden">
                            <div className="bg-dark-color-bar px-4 py-2 text-white font-bold italic">
                                Введіть повідомлення
                            </div>
                            <textarea
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                className="w-full h-48 p-4 bg-white outline-none resize-none"
                                placeholder="Ваш коментар..."
                            />
                        </div>

                        <div className="flex gap-4">
                            <button className="bg-search-button hover:bg-website-name text-white px-8 py-2 font-bold transition-colors">
                                Додати тему
                            </button>
                            <button className="bg-search-button hover:bg-website-name text-white px-8 py-2 font-bold transition-colors">
                                Попередній перегляд
                            </button>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}