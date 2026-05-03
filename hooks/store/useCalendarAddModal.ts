import { create } from 'zustand';
import { CalendarAddModal } from './types';

const useCalendarAddModal = create<CalendarAddModal>((set) => ({
    job: null,
    setJob: (job) => set({ job }),
}));

export default useCalendarAddModal;
