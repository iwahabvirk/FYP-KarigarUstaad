import { Stack } from 'expo-router';

export default function CustomerLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="home" />
      <Stack.Screen name="category" />
      <Stack.Screen name="service-details" />
      <Stack.Screen name="address-selector" />
      <Stack.Screen name="ai-match" />
      <Stack.Screen name="booking-summary" />
      <Stack.Screen name="payment" />
      <Stack.Screen name="live-tracking" />
      <Stack.Screen name="rate-worker" />
    </Stack>
  );
}
