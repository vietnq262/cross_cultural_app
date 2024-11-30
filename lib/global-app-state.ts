import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type GlobalAppState = {
  isAssistantOpen: boolean;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
};

export const useGlobalAppState = create<GlobalAppState>()(
  persist(
    (set, get) => ({
      isAssistantOpen: false,
      isOpen: false,
      setIsOpen: (isOpen) =>
        set({
          isAssistantOpen: isOpen,
        }),
    }),
    {
      name: 'global-assistant-state',
    },
  ),
);
