// components/site-header.tsx
"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Menu } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ProfileDropdown } from "./profiledropdown";

const nav = [
    { href: "/", label: "Home" },
    { href: "/articles", label: "Articles" },
    { href: "/poems", label: "Poems" },
    { href: "/gallery", label: "Gallery" },
    { href: "/news", label: "News" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
];

export function SiteHeader() {
    const pathname = usePathname();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <header className="border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                {/* Logo - Left */}
                <Link href="/" className="flex items-center gap-3" aria-label="Apodartho Home">
                    <div className="size-9 rounded-md bg-primary text-primary-foreground grid place-items-center font-bold">
                        AP
                    </div>
                    <span className="font-semibold text-lg tracking-tight">Apodartho</span>
                </Link>

                {/* Desktop Navigation - Center */}
                <nav aria-label="Primary" className="hidden md:flex items-center gap-1">
                    {nav.map(item => {
                        const active = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "px-3 py-2 rounded-md text-sm font-medium transition-colors",
                                    active
                                        ? "bg-secondary text-secondary-foreground"
                                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                                )}
                            >
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                {/* Right Side - Contribute + Profile (Always Visible) */}
                <div className="flex items-center gap-3">
                    <Button asChild className="hidden sm:inline-flex" size="sm">
                        <Link href="/contribute">Contribute</Link>
                    </Button>

                    {/* Profile Dropdown - Always at top-right */}
                    <ProfileDropdown />

                    {/* Mobile Menu Toggle */}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="md:hidden"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        aria-label="Toggle menu"
                    >
                        <Menu className="h-5 w-5" />
                    </Button>
                </div>
            </div>

            {/* Mobile Navigation */}
            {mobileMenuOpen && (
                <div className="md:hidden border-t">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col gap-2">
                        {nav.map(item => {
                            const active =
                                pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className={cn(
                                        "px-3 py-2 rounded-md text-sm font-medium transition-colors",
                                        active
                                            ? "bg-secondary text-secondary-foreground"
                                            : "text-muted-foreground hover:text-foreground hover:bg-muted"
                                    )}
                                >
                                    {item.label}
                                </Link>
                            );
                        })}
                        <Button asChild size="sm" className="sm:hidden mt-2">
                            <Link href="/contribute">Contribute</Link>
                        </Button>
                    </div>
                </div>
            )}
        </header>
    );
}
