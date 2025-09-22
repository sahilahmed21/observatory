// app/(dashboard)/layout.tsx
'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation'; // 1. Import hooks for navigation
import { useAuthStore } from '@/app/store/auth.store';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { BarChart, Settings, LifeBuoy } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user, logout } = useAuthStore();
    const pathname = usePathname(); // 2. Get the current URL path
    const router = useRouter();

    const handleLogout = () => {
        logout();
        router.push('/login'); // Redirect to login page after logout
    };

    // Helper to determine if a link is active
    const isActive = (path: string) => pathname === path;

    return (
        <div className="min-h-screen w-full flex">
            {/* Sidebar */}
            <aside className="hidden md:flex flex-col w-64 border-r bg-background">
                <div className="p-4 border-b">
                    <Link href="/dashboard" className="flex items-center gap-2">
                        <BarChart className="h-6 w-6 text-primary" />
                        <h1 className="text-xl font-bold">Observatory</h1>
                    </Link>
                </div>
                <nav className="flex-1 p-4 space-y-2">
                    {/* 3. Sidebar links are now functional with active state styling */}
                    <Button asChild variant={isActive('/dashboard') ? 'secondary' : 'ghost'} className="w-full justify-start">
                        <Link href="/dashboard">
                            <BarChart className="mr-2 h-4 w-4" />
                            Projects
                        </Link>
                    </Button>
                    <Button asChild variant={isActive('/settings') ? 'secondary' : 'ghost'} className="w-full justify-start">
                        <Link href="/settings">
                            <Settings className="mr-2 h-4 w-4" />
                            Settings
                        </Link>
                    </Button>
                </nav>
                <div className="p-4 border-t">
                    <Button variant="ghost" className="w-full justify-start">
                        <LifeBuoy className="mr-2 h-4 w-4" />
                        Support
                    </Button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col">
                <header className="flex items-center justify-end p-4 border-b h-16">
                    {/* 4. The user avatar is now a dropdown menu trigger */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                                <Avatar className="h-8 w-8">
                                    <AvatarFallback>{user?.email?.[0].toUpperCase()}</AvatarFallback>
                                </Avatar>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56" align="end" forceMount>
                            <DropdownMenuLabel className="font-normal">
                                <div className="flex flex-col space-y-1">
                                    <p className="text-sm font-medium leading-none">Logged In As</p>
                                    <p className="text-xs leading-none text-muted-foreground">
                                        {user?.email}
                                    </p>
                                </div>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                                Log out
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </header>
                <main className="flex-1 p-4 sm:p-6 lg:p-8 bg-muted/40">
                    {children}
                </main>
            </div>
        </div>
    );
}