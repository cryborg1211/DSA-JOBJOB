import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
    token: string | null;
    role: 'CANDIDATE' | 'RECRUITER' | null;
    /** Set both token and role at once (used by login) */
    setAuth: (token: string, role: 'CANDIDATE' | 'RECRUITER') => void;
    /** Set role only (used by role selection step) */
    setRole: (role: 'CANDIDATE' | 'RECRUITER') => void;
    clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            token: null,
            role: null,
            setAuth: (token, role) => set({ token, role }),
            setRole: (role) => set({ role }),
            clearAuth: () => set({ token: null, role: null }),
        }),
        { name: 'jj_auth' },
    ),
);
