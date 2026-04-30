import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { Toaster } from 'sonner';
import Script from 'next/script';

const geistSans = Geist({
    variable: '--font-geist-sans',
    subsets: ['latin'],
});

const geistMono = Geist_Mono({
    variable: '--font-geist-mono',
    subsets: ['latin'],
});

export const metadata: Metadata = {
    title: 'JobSync',
    description: '채용공고를 캘린더로, 지원 현황을 한눈에',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html
            lang="ko"
            className={`${geistSans.variable} ${geistMono.variable} h-full antialiased bg-white`}
        >
            <body className="min-h-full flex flex-col">
                {children}
                <Toaster />
            </body>
            <Script src="https://accounts.google.com/gsi/client" async />
        </html>
    );
}
