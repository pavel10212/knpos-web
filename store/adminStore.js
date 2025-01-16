import { create } from "zustand";

export const useAdminStore = create((set) => ({
  isAdmin:
    typeof window !== "undefined"
      ? localStorage.getItem("isAdmin") === "true"
      : false,
  setIsAdmin: () => {
    localStorage.setItem("isAdmin", "true");
    set({ isAdmin: true });
  },
  clearAdmin: () => {
    localStorage.removeItem("isAdmin");
    set({ isAdmin: false });
  },
}));
