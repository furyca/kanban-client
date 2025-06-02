import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface UserProps {
  username: string;
  id: string;
  email: string;
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
