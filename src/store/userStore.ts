import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface UserProps {
  id: string;
  email: string;
  avatar: string;
  created_at: string;
}

interface UserState {
  user: UserProps | null;
  setUser: (newUser: UserProps) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      setUser: (newUser) => set({ user: newUser }),
      clearUser: () => set(() => ({ user: null })),
    }),
    {
      name: "user-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useUserStore;
