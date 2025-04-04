import { create } from "zustand";

type SidebarStore = {
  isOpen: boolean;
  setOpen: (newState: boolean) => void;
  toggleOpen: () => void;
};
const useSidebarStore = create<SidebarStore>((set) => ({
  isOpen: true,
  setOpen: (newState: boolean) =>
    set({
      isOpen: newState,
    }),
  toggleOpen: () =>
    set((state) => ({
      isOpen: !state.isOpen,
    })),
}));

export { useSidebarStore };
