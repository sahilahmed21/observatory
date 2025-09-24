// app/(dashboard)/layout.tsx

'use client';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        // This container centers your content with a max-width
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children}
        </div>
    );
}


