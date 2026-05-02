import { create } from 'zustand';
import { CalendarSetUpModal } from './types';

const useCalendarSetUpModal = create<CalendarSetUpModal>((set) => ({
    isOpen: false,
    setOpen: (open) => set({ isOpen: open }),
}));

export default useCalendarSetUpModal;
