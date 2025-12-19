import { baseURL } from "@/utils/env";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface AuthState {
  token: string | null;
  isAuthChecked: boolean;
  checkAuth: () => void;
  setToken: (newUser: string) => void;
  clearToken: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      isAuthChecked: false,
      checkAuth: async () => {
        const token = get().token;
        if (!token) {
          set({ token: null, isAuthChecked: true });
          return;
        }
        try {
          const res = await fetch(`${baseURL}/checkToken`, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (!res.ok) {
            throw new Error("Invalid token");
          }
          set({ isAuthChecked: true });
        } catch (err) {
          useAuthStore.persist.clearStorage();
          set({ token: null, isAuthChecked: true });
        }
      },
      // logout: () => {
      //   localStorage.removeItem("token");
      //   set({ token: null, isAuthChecked: true });
      // },
      setToken: (newToken) => set({ token: newToken }),
      clearToken: () => set(() => ({ token: null })),
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useAuthStore;
