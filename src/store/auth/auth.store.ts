import { create } from "zustand";
import { apiFetch } from "@/utils/apiClient";
import { CredentialResponse } from "@react-oauth/google";
import { baseURL } from "@/utils/env";
import { LoginInputs, User } from "./type";

interface AuthState {
  accessToken: string | null;
  user: User | null;
  isAuthenticated: boolean;
  isAuthChecked: boolean;
  signedUp: boolean;
  setSignedUp: (value: boolean) => void;

  loadingAuth: boolean;

  login: (data: LoginInputs) => Promise<void>;
  googleLogin: (credentialResponse: CredentialResponse) => Promise<void>;
  signup: (data: LoginInputs) => Promise<void>;
  logout: () => Promise<void>;
  refreshAccessToken: () => Promise<boolean>;
  fetchUser: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

const useAuthStore = create<AuthState>((set, get) => ({
  accessToken: null,
  user: null,
  isAuthenticated: false,
  isAuthChecked: false,
  signedUp: false,
  setSignedUp: (value: boolean) => set({ signedUp: value }),

  loadingAuth: false,

  login: async (data) => {
    set({ loadingAuth: true });
    const response = await apiFetch(
      "/login",
      {
        method: "POST",
        body: JSON.stringify(data),
      },
      false,
    );

    if (!response) {
      set({ loadingAuth: false });
      return;
    }

    set({
      accessToken: response.accessToken,
      user: response.user,
      isAuthenticated: true,
      loadingAuth: false,
    });
  },

  googleLogin: async (token) => {
    set({ loadingAuth: true });
    const response = await apiFetch(
      "/googleAuth",
      {
        method: "POST",
        body: JSON.stringify({ token: token.credential }),
      },
      false,
    );

    if (!response) {
      set({ loadingAuth: false });
      return;
    }
    set({
      accessToken: response.accessToken,
      user: response.user,
      isAuthenticated: true,
      loadingAuth: false,
    });
  },

  signup: async (data) => {
    set({ loadingAuth: true });
    const response = await apiFetch(
      "/signup",
      {
        method: "POST",
        body: JSON.stringify(data),
      },
      false,
    );

    if (!response) {
      set({ loadingAuth: false });
      return;
    }

    set({ loadingAuth: false, signedUp: true });

    // set({
    //   accessToken: response.accessToken,
    //   user: response.user,
    //   isAuthenticated: true,
    //   loadingAuth: false,
    // });
  },

  logout: async () => {
    set({ loadingAuth: true });

    await apiFetch("/logout", {
      method: "POST",
      credentials: "include",
    });

    set({
      accessToken: null,
      user: null,
      isAuthenticated: false,
      loadingAuth: false,
    });
  },

  refreshAccessToken: async () => {
    try {
      const res = await fetch(`${baseURL}/refresh-token`, {
        method: "POST",
        credentials: "include",
      });

      const data = await res.json();

      if (!data.user || !data.accessToken) return false;

      set({
        accessToken: data.accessToken,
        isAuthenticated: true,
      });

      return true;
    } catch (error) {
      return false;
    }
  },

  fetchUser: async () => {
    try {
      const json = await apiFetch("/me");

      const data = json;

      set({ user: data.user });
    } catch {
      set({ user: null });
    }
  },

  checkAuth: async () => {
    set({ loadingAuth: true });
    const ok = await get().refreshAccessToken();

    if (ok) {
      set({ isAuthenticated: true, isAuthChecked: true, loadingAuth: false });
      await get().fetchUser();
      return;
    }
    set({
      accessToken: null,
      user: null,
      isAuthenticated: false,
      isAuthChecked: true,
      loadingAuth: false,
    });
  },
}));

export default useAuthStore;
