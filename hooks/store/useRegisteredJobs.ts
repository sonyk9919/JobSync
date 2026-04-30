import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { RegisteredJobs } from './types';

const useRegisteredJobs = create<RegisteredJobs>()(
    persist(
        (set, get) => ({
            registeredUrls: [],
            register: (url) =>
                set((state) => ({
                    registeredUrls: [...new Set([...state.registeredUrls, url])],
                })),
            unregister: (url) =>
                set((state) => ({
                    registeredUrls: state.registeredUrls.filter((u) => u !== url),
                })),
            isRegistered: (url) => get().registeredUrls.includes(url),
        }),
        { name: 'registered-jobs' }
    )
);

export default useRegisteredJobs;
