import { Stack, Redirect } from 'expo-router';
import React from 'react';
import { useDriverAuth } from '@/contexts/DriverAuthContext';
import { ActivityIndicator, View } from 'react-native';

export default function DriverStackLayout() {
  const { isAuthenticated, isLoading } = useDriverAuth();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#1a6b2e" />
      </View>
    );
  }

  if (!isAuthenticated) {
    return <Redirect href="/auth/driver-login" />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="my-trips" />
      <Stack.Screen name="profile" />
      <Stack.Screen name="reviews" />
    </Stack>
  );
}
