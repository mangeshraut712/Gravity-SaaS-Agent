import React from 'react';
import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'GravityBot Dashboard',
    description: 'Next-Generation AI Assistant Control Plane',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body suppressHydrationWarning>{children}</body>
        </html>
    );
}
