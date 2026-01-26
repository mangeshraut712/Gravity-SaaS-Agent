import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "GravityBot | Autonomous AI Agent Platform",
    description: "The million-dollar autonomous agent platform for the future of work.",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
            <body>{children}</body>
        </html>
    );
}
