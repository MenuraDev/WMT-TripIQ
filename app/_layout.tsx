import { Stack } from "expo-router";
import { DriverAuthProvider } from "@/contexts/DriverAuthContext";

export default function RootLayout() {
  return (
    <DriverAuthProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="auth/driver-login" options={{ presentation: 'modal' }} />
        <Stack.Screen name="auth/driver-register" options={{ presentation: 'modal' }} />
      </Stack>
    </DriverAuthProvider>
  );
}
