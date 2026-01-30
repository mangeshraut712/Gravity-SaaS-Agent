import './globals.css';
import type { Metadata } from 'next';
import { Sora } from 'next/font/google';
import React from 'react';
import { ErrorBoundary } from '../components/ErrorBoundary';

const sora = Sora({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: 'AgentFlow – Launch AI Agents in 5 Minutes',
  description:
    'AgentFlow is the fastest way to launch production-ready AI agents for your business. Deploy to WhatsApp, web, or API in minutes.',
  keywords: ['AI', 'agent', 'chatbot', 'SaaS', 'automation', 'WhatsApp'],
  authors: [{ name: 'AgentFlow' }],
  openGraph: {
    title: 'AgentFlow – Launch AI Agents in 5 Minutes',
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
      <body className={`${sora.variable} ${sora.className}`} suppressHydrationWarning>
        <ErrorBoundary>{children}</ErrorBoundary>
      </body>
    </html>
  );
}
