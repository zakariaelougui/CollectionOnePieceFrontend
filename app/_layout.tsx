import React, { useEffect } from 'react';
import { Slot } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider as PaperProvider } from 'react-native-paper';
import { useAuthStore } from '../src/store/auth.store';

export default function RootLayout() {
  const { hydrate, bootstrapping } = useAuthStore();

  useEffect(() => {
    hydrate();
  }, []);

  if (bootstrapping) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <PaperProvider>
        <Slot />
      </PaperProvider>
    </SafeAreaProvider>
  );
}
