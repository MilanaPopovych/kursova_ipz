import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function Sidebar() {
    const params = useParams();
    const slug = params.slug as string;
    const menuItems = [
        { name: 'Головна сторінка', href: '/' },
        { name: 'Про проєкт', href: '/about' },
        { name: 'Усі категорії', href: '/category' },
        { name: 'Випадкова стаття', href: '/random' },
    ];

    return (
        <aside className="w-64 flex-shrink-0 bg-brand-border/30 border-r border-dark-color-bar/10 min-h-screen p-6 hidden md:block">
            <nav className="space-y-6">
                <div>
                    <h3 className="text-website-name font-serif font-bold mb-3 text-sm uppercase tracking-wider">Навігація</h3>
                    <ul className="space-y-2">
                        {menuItems.map((item) => (
                            <li key={item.name}>
                                <Link href={item.href} className="text-website-links hover:underline text-sm font-serif">
                                    {item.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* НОВИЙ БЛОК: з'являється лише якщо ми на сторінці статті */}
                {slug && (
                    <div className="animate-in fade-in duration-500">
                        <h3 className="text-website-name font-serif font-bold mb-3 text-sm uppercase">Взаємодія</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link
                                    href={`/article/${slug}/discussion`}
                                    className="text-website-links hover:underline text-sm font-bold flex items-center gap-2"
                                >
                                    <span className="w-2 h-2 bg-search-button rounded-full"></span>
                                    Перейти до обговорення
                                </Link>
                            </li>
                        </ul>
                    </div>
                )}

                <div>
                    <h3 className="text-website-name font-serif font-bold mb-3 text-sm uppercase tracking-wider">Інструменти</h3>
                    <ul className="space-y-2 text-sm font-serif text-gray-500">
                        <li>Посилання сюди</li>
                        <li>Спеціальні сторінки</li>
                    </ul>
                </div>
            </nav>
        </aside>
    );
}