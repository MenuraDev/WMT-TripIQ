import { Stack } from 'expo-router';
import React from 'react';

export default function DriverStackLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="my-trips" />
      <Stack.Screen name="profile" />
      <Stack.Screen name="reviews" />
    </Stack>
  );
}
