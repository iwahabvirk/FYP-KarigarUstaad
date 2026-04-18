import { Stack } from 'expo-router';

export default function WorkerLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="dashboard" />
      <Stack.Screen name="available-jobs" />
      <Stack.Screen name="job-details" />
      <Stack.Screen name="in-progress" />
      <Stack.Screen name="profile" />
      <Stack.Screen name="edit-profile" />
    </Stack>
  );
}
