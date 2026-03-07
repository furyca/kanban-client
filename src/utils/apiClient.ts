import useAuthStore from "@/store/auth/auth.store";
import { baseURL } from "./env";

export async function apiFetch(path: string, options: RequestInit = {}, authRequired = true) {
  const { isAuthChecked, accessToken } = useAuthStore.getState();

  if (!isAuthChecked && authRequired) throw new Error("WAIT_AUTH");

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (authRequired && accessToken) {
    headers.Authorization = `Bearer ${accessToken}`;
  }

  const res = await fetch(`${baseURL}${path}`, {
    ...options,
    headers,
    credentials: "include",
  });

  const data = await res.json();

  if (data?.reason === "TOKEN_EXPIRED") {
    // infinite retry guard
    if ((options as any)._retry) {
      useAuthStore.getState().logout();
      throw new Error("AUTH_LOOP");
    }

    (options as any)._retry = true;
    const ok = await useAuthStore.getState().refreshAccessToken();

    if (ok) {
      return apiFetch(path, options);
    } else {
      useAuthStore.getState().logout();
      return Promise.reject();
    }
  }

  if (!res.ok) {
    throw new Error(data?.message || `HTTP ${res.status}`);
  }

  return data;
}
