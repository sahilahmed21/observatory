'use client';

import { useEffect, useState } from 'react'; // 1. Import useState
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/app/store/auth.store';

const withAuth = <P extends object>(WrappedComponent: React.ComponentType<P>) => {
    const Wrapper = (props: P) => {
        const router = useRouter();
        const { isAuthenticated } = useAuthStore();
        const [isClient, setIsClient] = useState(false); // 2. Add client-side check state

        useEffect(() => {
            setIsClient(true); // 3. Set to true once the component mounts in the browser
        }, []);

        useEffect(() => {
            // 4. Only run the auth check after we know we are on the client
            if (isClient && !isAuthenticated) {
                router.replace('/login');
            }
        }, [isClient, isAuthenticated, router]);

        // 5. Don't render anything until we are on the client and authenticated
        if (!isClient || !isAuthenticated) {
            return null; // Or a loading spinner
        }

        // Render the wrapped component if authenticated
        return <WrappedComponent {...props} />;
    };

    return Wrapper;
};

export default withAuth;