// app/(dashboard)/support/page.tsx
'use client'
import withAuth from "@/components/auth/withAuth";

const SupportPage = () => {
    return (
        <div>
            <h1 className="text-3xl font-bold">Support</h1>
            <p className="text-muted-foreground mt-2">
                For help, please contact us at support@Axon.com.
            </p>
        </div>
    );
};

export default withAuth(SupportPage);