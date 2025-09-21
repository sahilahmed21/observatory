// app/(dashboard)/layout.tsx
'use client';

import Link from 'next/link';
import { useAuthStore } from '@/app/store/auth.store';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { BarChart, Settings, LifeBuoy } from 'lucide-react';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user, logout } = useAuthStore();

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
                    <Button variant="ghost" className="w-full justify-start">
                        <BarChart className="mr-2 h-4 w-4" />
                        Projects
                    </Button>
                    <Button variant="ghost" className="w-full justify-start">
                        <Settings className="mr-2 h-4 w-4" />
                        Settings
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
                    <div className="flex items-center gap-4">
                        <Avatar>
                            <AvatarFallback>{user?.email?.[0].toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <Button variant="outline" onClick={logout}>Logout</Button>
                    </div>
                </header>
                <main className="flex-1 p-4 sm:p-6 lg:p-8 bg-muted/40">
                    {children}
                </main>
            </div>
        </div>
    );
}