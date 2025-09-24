
'use client';

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/app/store/auth.store";
import {
    Navbar, NavBody, MobileNav, NavbarButton,
    MobileNavHeader, MobileNavToggle, MobileNavMenu,
} from "@/components/ui/resizable-navbar";
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel,
    DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

export const SiteNavbar = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { isAuthenticated, user, logout } = useAuthStore();
    const router = useRouter();
    const pathname = usePathname();

    const handleLogout = () => {
        logout();
        router.push('/login');
    };

    const publicNavItems = [
        { name: "Home", link: "/" },
        { name: "Features", link: "/features" },

    ];

    const privateNavItems = [
        { name: "Projects", link: "/dashboard" },
        { name: "Alert Rules", link: "/settings" },
    ];

    const navItems = isAuthenticated ? [...publicNavItems, ...privateNavItems] : publicNavItems;

    return (
        <Navbar>
            <NavBody>
                <Link href="/" className="flex items-center gap-2 mr-10">
                    <Image src="/icon.png" alt="Axon Logo" width={28} height={28} />
                    <h1 className="text-xl font-bold text-white">Axon</h1>
                </Link>

                {/* Desktop Nav Items */}
                <div className="hidden md:flex items-center gap-6">
                    {navItems.map((item) => (
                        <Link key={item.name} href={item.link} className={cn(
                            "text-sm font-medium transition-colors hover:text-white",
                            pathname === item.link ? "text-white" : "text-neutral-400"
                        )}>
                            {item.name}
                        </Link>
                    ))}
                </div>

                <div className="flex items-center gap-4 ml-auto">
                    {isAuthenticated ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <span className="relative h-9 w-9 rounded-full inline-flex items-center justify-center cursor-pointer">
                                    <Avatar className="h-9 w-9">
                                        <AvatarFallback>{user?.email?.[0].toUpperCase()}</AvatarFallback>
                                    </Avatar>
                                </span>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56" align="end" forceMount>
                                <DropdownMenuLabel className="font-normal">
                                    <p className="text-xs text-muted-foreground">Signed in as</p>
                                    <p className="text-sm font-medium">{user?.email}</p>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                                    Log out
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <>
                            <NavbarButton variant="secondary" >
                                <Link href="/login">Login</Link>
                            </NavbarButton>
                            <NavbarButton variant="primary" >
                                <Link href="/register">Get Started</Link>
                            </NavbarButton>
                        </>
                    )}
                </div>
            </NavBody>
            <MobileNav>
                <MobileNavHeader>
                    <Link href="/" className="flex items-center gap-2">
                        <Image src="/icon.png" alt="Axon Logo" width={24} height={24} />
                        <h1 className="text-lg font-bold text-white">Axon</h1>
                    </Link>
                    <MobileNavToggle
                        isOpen={isMobileMenuOpen}
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    />
                </MobileNavHeader>
            </MobileNav>
        </Navbar>
    );
};