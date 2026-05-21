"use client";

import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function MyDiscussionsPage() {
    const [discussions, setDiscussions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [totalElements, setTotalElements] = useState(0);

    const { token } = useAuth();
    const router = useRouter();

    useEffect(() => {
        const activeToken = token || localStorage.getItem('wikpidia_token');
        if (!activeToken) {
            setError("Ви не авторизовані. Будь ласка, увійдіть в акаунт.");
            setLoading(false);
            return;
        }

        const fetchMyDiscussions = async () => {
            setLoading(true);
            const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8081';

            try {
                const res = await fetch(`${baseUrl}/api/discussions/my?page=${currentPage}&size=5`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${activeToken}`
                    }
                });

                if (res.status === 401 || res.status === 403) {
                    setError("Доступ заборонено або сесія застаріла.");
                    return;
                }

                if (!res.ok) throw new Error("Помилка при отриманні обговорень.");

                const data = await res.json();

                setDiscussions(data.content || []);
                setTotalPages(data.totalPages || 1);
                setTotalElements(data.totalElements || 0);

            } catch (err: any) {
                console.error("Fetch error:", err);
                setError("Не вдалося підключитися до сервера.");
            } finally {
                setLoading(false);
            }
        };

        fetchMyDiscussions();
    }, [token, currentPage]);

    const handleNextPage = () => {
        if (currentPage < totalPages - 1) setCurrentPage(prev => prev + 1);
    };
    const handlePrevPage = () => {
        if (currentPage > 0) setCurrentPage(prev => prev - 1);
    };

    return (
        <div className="min-h-screen bg-white flex flex-col font-serif overflow-hidden">
            <Header />
            <div className="flex flex-row flex-grow w-full max-w-[1400px] mx-auto overflow-hidden">
                <Sidebar />

                <main className="flex-grow p-4 md:p-8 space-y-6 overflow-hidden">
                    <div className="bg-search-button px-6 py-4 shadow-sm flex items-center justify-between">
                        <h1 className="text-white text-2xl font-bold italic">Мої обговорення</h1>
                        <Link href="/profile" className="text-white/80 text-sm hover:underline cursor-pointer">
                            ← Повернутися до кабінету
                        </Link>
                    </div>

                    <div className="border border-dark-color-bar/20 rounded-sm bg-white shadow-sm p-6 min-h-[400px] flex flex-col">

                        {loading && discussions.length === 0 ? (
                            <div className="text-center py-10 text-gray-500 italic animate-pulse">
                                Завантаження історії ваших коментарів з бази даних...
                            </div>
                        ) : error ? (
                            <div className="bg-[#FDF2F2] border-l-4 border-[#A01E36] p-6 text-center">
                                <p className="text-[#A01E36] font-bold italic">{error}</p>
                            </div>
                        ) : discussions.length === 0 ? (
                            <div className="text-center py-16">
                                <span className="text-4xl mb-4 block">💬</span>
                                <p className="text-lg italic text-gray-500 mb-2">Ви ще не залишили жодного коментаря.</p>
                            </div>
                        ) : (
                            <div className="space-y-4 flex-grow">
                                <p className="text-sm italic text-gray-500 border-b border-gray-100 pb-2 mb-4">
                                    Всього знайдено коментарів: {totalElements}
                                </p>

                                {discussions.map((discussion) => (
                                    <div key={discussion.id} className="border border-brand-border/50 p-4 bg-[#F8FAFC] rounded-sm hover:shadow-sm transition-shadow">
                                        <div className="flex justify-between items-start mb-2">
                                            <div className="font-bold text-sm text-gray-800 flex items-center gap-2">
                                                <span className="bg-dark-color-bar text-white px-2 py-0.5 text-[10px] uppercase tracking-wider">
                                                    Коментар
                                                </span>
                                            </div>
                                            <span className="text-xs text-gray-400 italic">
                                                {discussion.createdAt
                                                    ? new Date(discussion.createdAt).toLocaleString('uk-UA', {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })
                                                    : "Невідома дата"}
                                            </span>
                                        </div>

                                        <p className="text-main-text text-sm mb-3 italic leading-relaxed border-l-2 border-search-button pl-3 bg-white p-2">
                                            "{discussion.content || discussion.text}"
                                        </p>

                                        <div className="text-xs">
                                            <span className="text-gray-500 mr-2">До статті:</span>
                                            <Link
                                                href={`/article/${discussion.articleSlug}/discussion#comment-${discussion.id}`}
                                                className="text-website-links font-bold hover:underline"
                                            >
                                                Перейти до обговорення →
                                            </Link>
                                        </div>
                                    </div>
                                ))}

                                {totalPages > 1 && (
                                    <div className="flex items-center justify-between mt-8 pt-4 border-t border-gray-100">
                                        <button
                                            onClick={handlePrevPage}
                                            disabled={currentPage === 0 || loading}
                                            className="px-4 py-2 bg-gray-100 text-gray-700 font-bold text-xs uppercase tracking-wider disabled:opacity-50 hover:bg-gray-200 transition-colors cursor-pointer"
                                        >
                                            ← Попередні
                                        </button>

                                        <span className="text-sm italic text-gray-500">
                                            Сторінка {currentPage + 1} з {totalPages}
                                        </span>

                                        <button
                                            onClick={handleNextPage}
                                            disabled={currentPage >= totalPages - 1 || loading}
                                            className="px-4 py-2 bg-search-button text-white font-bold text-xs uppercase tracking-wider disabled:opacity-50 hover:bg-website-name transition-colors cursor-pointer"
                                        >
                                            Наступні →
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
}