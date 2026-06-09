import React, { useEffect } from 'react';
import { Slot } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider as PaperProvider, MD3DarkTheme, MD3LightTheme } from 'react-native-paper';
import { useAuthStore } from '../src/store/auth.store';
import { useThemeStore } from '../src/store/theme.store';

export default function RootLayout() {
  const { hydrate, bootstrapping } = useAuthStore();
  const { theme, hydrateTheme } = useThemeStore();

  useEffect(() => {
    hydrate();
    hydrateTheme();
  }, []);

  if (bootstrapping) {
    return null;
  }

  const paperTheme = theme === 'dark' ? MD3DarkTheme : MD3LightTheme;

  return (
    <SafeAreaProvider>
      <PaperProvider theme={paperTheme}>
        <Slot />
      </PaperProvider>
    </SafeAreaProvider>
  );
}
