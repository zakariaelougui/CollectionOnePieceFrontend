import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';

export type ThemeMode = 'light' | 'dark';

const THEME_KEY = 'app_theme';

interface ThemeState {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => Promise<void>;
  hydrateTheme: () => Promise<void>;
}

export const useThemeStore = create<ThemeState>((set) => ({
  theme: 'dark',

  hydrateTheme: async () => {
    try {
      const stored = await SecureStore.getItemAsync(THEME_KEY);
      if (stored === 'light' || stored === 'dark') {
        set({ theme: stored });
      }
    } catch {}
  },

  setTheme: async (theme) => {
    await SecureStore.setItemAsync(THEME_KEY, theme);
    set({ theme });
  },
}));
