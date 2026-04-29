import { Stack } from "expo-router";
import React from "react";

export default function TabLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="edit-store" options={{ headerShown: false }} />
    </Stack>
  );
}
