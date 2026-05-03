'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/utils/css/tailwind';

const NAV_ITEMS = [
    { label: '일정', href: '/' },
    { label: '공고 등록', href: '/upload' },
    { label: '이용약관', href: '/privacy' },
];

const Header = () => {
    const pathname = usePathname();

    return (
        <header className="sticky top-0 z-10 bg-white border-b border-gray-100">
            <div className="flex items-center gap-6 w-310 max-w-full px-4 mx-auto h-12">
                <span className="text-sm font-semibold text-blue-400">JobSync</span>
                <nav className="flex items-center gap-1 h-full">
                    {NAV_ITEMS.map(({ label, href }) => {
                        const isActive = pathname === href;
                        return (
                            <Link
                                key={href}
                                href={href}
                                className={cn(
                                    'relative flex items-center h-full px-3 text-sm duration-150',
                                    isActive
                                        ? 'text-blue-400 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-blue-400'
                                        : 'text-gray-400 hover:text-gray-600'
                                )}
                            >
                                {label}
                            </Link>
                        );
                    })}
                </nav>
            </div>
        </header>
    );
};

export default Header;
