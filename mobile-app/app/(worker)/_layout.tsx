import { Stack, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { colors } from '@/constants/colors';
import { getCurrentUser, getStoredToken } from '@/src/services/authService';

export default function WorkerLayout() {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await getStoredToken();

        if (!token) {
          router.replace('/signin');
          return;
        }

        const user = await getCurrentUser();

        if (user.role !== 'worker') {
          if (user.role === 'employer') {
            router.replace('/(employer)/dashboard');
          } else {
            router.replace('/(customer)/home');
          }
          return;
        }
      } catch {
        router.replace('/signin');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="dashboard" />
      <Stack.Screen name="post-service" />
      <Stack.Screen name="manage-services" />
      <Stack.Screen name="active-jobs" />
      <Stack.Screen name="available-jobs" />
      <Stack.Screen name="job-details" />
      <Stack.Screen name="in-progress" />
      <Stack.Screen name="job-completed" />
      <Stack.Screen name="profile" />
      <Stack.Screen name="edit-profile" />
    </Stack>
  );
}
