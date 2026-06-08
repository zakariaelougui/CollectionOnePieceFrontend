import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import { AuthUser } from '../types/api.types';

const KEYS = {
  accessToken: 'access_token',
  refreshToken: 'refresh_token',
  user: 'auth_user',
} as const;

interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  bootstrapping: boolean;
  hydrate: () => Promise<void>;
  login: (user: AuthUser, accessToken: string, refreshToken: string) => Promise<void>;
  logout: () => Promise<void>;
  setAccessToken: (token: string) => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  bootstrapping: true,

  hydrate: async () => {
    try {
      const [accessToken, refreshToken, userJson] = await Promise.all([
        SecureStore.getItemAsync(KEYS.accessToken),
        SecureStore.getItemAsync(KEYS.refreshToken),
        SecureStore.getItemAsync(KEYS.user),
      ]);
      if (accessToken && refreshToken && userJson) {
        const user = JSON.parse(userJson) as AuthUser;
        set({ user, accessToken, refreshToken, isAuthenticated: true });
      }
    } catch {
      // corrupt storage — treat as logged out
    } finally {
      set({ bootstrapping: false });
    }
  },

  login: async (user, accessToken, refreshToken) => {
    await Promise.all([
      SecureStore.setItemAsync(KEYS.accessToken, accessToken),
      SecureStore.setItemAsync(KEYS.refreshToken, refreshToken),
      SecureStore.setItemAsync(KEYS.user, JSON.stringify(user)),
    ]);
    set({ user, accessToken, refreshToken, isAuthenticated: true });
  },

  logout: async () => {
    await Promise.all([
      SecureStore.deleteItemAsync(KEYS.accessToken),
      SecureStore.deleteItemAsync(KEYS.refreshToken),
      SecureStore.deleteItemAsync(KEYS.user),
    ]);
    set({ user: null, accessToken: null, refreshToken: null, isAuthenticated: false });
  },

  setAccessToken: (token) => {
    SecureStore.setItemAsync(KEYS.accessToken, token).catch(() => {});
    set({ accessToken: token });
  },
}));
