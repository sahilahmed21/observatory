import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface AuthState {
    token: string | null;
    user: { id: string; email: string } | null;
    isAuthenticated: boolean;
    setToken: (token: string, user: { id: string; email: string }) => void;
    logout: () => void;
}

export const useAuthStore = create(
    persist<AuthState>(
        (set) => ({
            token: null,
            user: null,
            isAuthenticated: false,
            setToken: (token, user) => {
                set({ token, user, isAuthenticated: true });
            },
            logout: () => {
                set({ token: null, user: null, isAuthenticated: false });
            },
        }),
        {
            name: 'auth-storage',
            storage: createJSONStorage(() => localStorage),
        }
    )
);
