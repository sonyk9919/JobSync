import { create } from 'zustand';
import { CalendarEditModal } from './types';

const useCalendarEditModal = create<CalendarEditModal>((set) => ({
    event: null,
    setEvent: (event) => set({ event }),
}));

export default useCalendarEditModal;
