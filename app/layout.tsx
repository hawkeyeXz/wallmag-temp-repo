import { SiteHeader } from "@/components/site-header";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/contexts/AuthContext";
import type { Metadata } from "next";
import { Inter, Roboto_Mono } from "next/font/google";
import React, { Suspense } from "react";
import "./globals.css";

const sans = Inter({
    subsets: ["latin"],
    variable: "--font-sans",
});

const mono = Roboto_Mono({
    subsets: ["latin"],
    variable: "--font-mono",
});

export const metadata: Metadata = {
    title: "Apodartho: eWall Magazine of Physics, College Surendranath College",
    description:
        "Apodartho is the yearly e-wall magazine from the Department of Physics, College Srendranath College — showcasing articles, poems, artwork, and news.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <AuthProvider>
            <html lang="en" className={`${sans.variable} ${mono.variable}`}>
                <body className="font-sans">
                    <Suspense fallback={<div>Loading...</div>}>
                        <SiteHeader />
                        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">{children}</main>
                    </Suspense>
                    <Toaster position="bottom-right" />
                </body>
            </html>
            {/* <DebugAuth /> */}
        </AuthProvider>
    );
}
