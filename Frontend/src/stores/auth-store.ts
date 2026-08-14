import { create } from "zustand";
import type { CurrentUserResponse, LoginRequest } from "@/types/auth";
import * as authApi from "@/lib/api/auth";
import { TOKEN_KEY, TOKEN_EXPIRY_KEY } from "@/lib/constants";

interface AuthState {
  user: CurrentUserResponse | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isInitialized: boolean;
}

interface AuthActions {
  login: (data: LoginRequest) => Promise<void>;
  logout: () => Promise<void>;
  fetchMe: () => Promise<void>;
  initialize: () => Promise<void>;
  reset: () => void;
}

export type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  token: null,
  isLoading: false,
  isAuthenticated: false,
  isInitialized: false,

  login: async (data: LoginRequest) => {
    set({ isLoading: true });
    try {
      const res = await authApi.login(data);
      if (typeof window !== "undefined") {
        localStorage.setItem(TOKEN_KEY, res.accessToken);
        localStorage.setItem(TOKEN_EXPIRY_KEY, res.expiresAt);
        // Also set a document cookie so server/middleware can detect auth status
        document.cookie = `auth_token=${res.accessToken}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
      }
      set({
        token: res.accessToken,
        user: res.user,
        isAuthenticated: true,
        isLoading: false,
        isInitialized: true,
      });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  logout: async () => {
    set({ isLoading: true });
    try {
      await authApi.logout().catch(() => {});
    } finally {
      if (typeof window !== "undefined") {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(TOKEN_EXPIRY_KEY);
        document.cookie = "auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      }
      set({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        isInitialized: true,
      });
    }
  },

  fetchMe: async () => {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem(TOKEN_KEY)
        : null;

    if (!token) {
      set({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        isInitialized: true,
      });
      return;
    }

    set({ isLoading: true, token });
    try {
      const user = await authApi.getMe();
      set({
        user,
        isAuthenticated: true,
        isLoading: false,
        isInitialized: true,
      });
    } catch {
      if (typeof window !== "undefined") {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(TOKEN_EXPIRY_KEY);
        document.cookie = "auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      }
      set({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        isInitialized: true,
      });
    }
  },

  initialize: async () => {
    if (get().isInitialized) return;
    await get().fetchMe();
  },

  reset: () => {
    set({
      user: null,
      token: null,
      isLoading: false,
      isAuthenticated: false,
      isInitialized: false,
    });
  },
}));
