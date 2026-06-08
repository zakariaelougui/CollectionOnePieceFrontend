import { Stack } from 'expo-router';

export default function ListsLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: '#fff' },
        headerTitleStyle: { fontWeight: '700' },
        headerTintColor: '#3b82f6',
      }}
    >
      <Stack.Screen name="index" options={{ title: 'My Lists' }} />
      <Stack.Screen name="create" options={{ title: 'New List', presentation: 'modal' }} />
      <Stack.Screen name="[id]" options={{ title: 'List' }} />
    </Stack>
  );
}
