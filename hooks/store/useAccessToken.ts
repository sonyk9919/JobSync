import { create } from 'zustand';
import { AccessToken } from './types';
import { persist } from 'zustand/middleware';

const useAccessToken = create<AccessToken>()(
    persist(
        (set, get) => ({
            accessToken: null,
            expiredAt: null,
            login: (accessToken, expiredAt) => set({ accessToken, expiredAt }),
            logout: () => set({ accessToken: null, expiredAt: null }),
            isLoggedIn: () => {
                const { accessToken, expiredAt } = get();
                if (!accessToken || !expiredAt) return false;
                if (Date.now() > expiredAt) {
                    set({ accessToken: null, expiredAt: null });
                    return false;
                }
                return true;
            },
        }),
        {
            name: 'access-token',
            onRehydrateStorage: () => (state) => {
                if (!state) return;
                if (!state.expiredAt || Date.now() > state.expiredAt) {
                    state.logout();
                }
            },
        }
    )
);

export default useAccessToken;
