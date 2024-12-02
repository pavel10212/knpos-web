import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useAdminStore = create(
  persist(
    (set) => ({
      isAdmin: false,
      setIsAdmin: () => set({ isAdmin: true }),
      clearAdmin: () => set({ isAdmin: false }),
    }),
    {
      name: 'admin-storage',
    }
  )
)
