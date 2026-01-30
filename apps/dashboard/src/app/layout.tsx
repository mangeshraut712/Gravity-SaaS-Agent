import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import React from 'react';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { AuthProvider } from '../hooks/useAuth';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: 'Gravity – Launch AI Agents in 5 Minutes',
  description:
    'Gravity is the fastest way to launch production-ready AI agents for your business. Deploy to WhatsApp, web, or API in minutes.',
  keywords: ['AI', 'agent', 'chatbot', 'SaaS', 'automation', 'WhatsApp'],
  authors: [{ name: 'Gravity' }],
  openGraph: {
    title: 'Gravity – Launch AI Agents in 5 Minutes',
    description: 'Deploy production-ready AI agents for your business',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${inter.className}`} suppressHydrationWarning>
        <AuthProvider>
          <ErrorBoundary>{children}</ErrorBoundary>
        </AuthProvider>
      </body>
    </html>
  );
}
