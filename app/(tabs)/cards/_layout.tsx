import { Stack } from "expo-router";

export default function CardsLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: "#fff" },
        headerTitleStyle: { fontWeight: "700" },
        headerTintColor: "#3b82f6",
      }}
    />
  );
}
