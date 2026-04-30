import { create } from 'zustand';
import { JobCalendarModal } from './types';

const useJobCalendarModal = create<JobCalendarModal>((set) => ({
    job: null,
    setJob: (job) => set({ job }),
}));

export default useJobCalendarModal;
