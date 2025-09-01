import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
  setToken: (token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      isAuthenticated: false,
      setToken: (token: string) => {
        localStorage.setItem("authToken", token);
        set({ token, isAuthenticated: true });
      },
      logout: () => {
        localStorage.removeItem("authToken");
        set({ token: null, isAuthenticated: false });
      },
    }),
    {
      name: "auth-storage", // Name for the localStorage item
    }
  )
);
