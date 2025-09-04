import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
  isAuthenticated: boolean;
  needsConsent: boolean;
  setToken: (token: string) => void;
  setNeedsConsent: (needs: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      needsConsent: false,
      setToken: (token: string) => {
        localStorage.setItem("authToken", token);
        set({ isAuthenticated: true });
      },
      setNeedsConsent: (needs: boolean) => set({ needsConsent: needs }),
      logout: () => {
        localStorage.removeItem("authToken");
        set({ isAuthenticated: false, needsConsent: false });
      },
    }),
    {
      name: "auth-storage",
    }
  )
);
