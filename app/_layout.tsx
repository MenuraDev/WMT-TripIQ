import { AuthProvider } from '@/contexts/AuthContext';
import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack screenOptions={{ headerShown: false }}>
        {/* Main tabs (Home, Vehicles, Book Trip, Profile) */}
        <Stack.Screen name="(tabs)" />

        {/* Auth screens */}
        <Stack.Screen name="auth/login" options={{ headerShown: true, title: "Login" }} />
        <Stack.Screen name="auth/register" options={{ headerShown: true, title: "Create Account" }} />
      </Stack>
    </AuthProvider>
  );
}