import { Stack } from 'expo-router';
import { colors } from '@/constants/colors';

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen name="splash" options={{ headerShown: false }} />
      <Stack.Screen name="onboarding" options={{ headerShown: false }} />
      <Stack.Screen
        name="(auth)"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="(customer)"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="(worker)"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen name="edit-profile" />
    </Stack>
  );
}