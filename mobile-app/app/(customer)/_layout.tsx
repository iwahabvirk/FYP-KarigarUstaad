import { Stack, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { colors } from '@/constants/colors';
import { getCurrentUser, getStoredToken } from '@/src/services/authService';

export default function CustomerLayout() {
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

        if (user.role !== 'customer') {
          if (user.role === 'employer') {
            router.replace('/(employer)/dashboard');
          } else {
            router.replace('/(worker)/dashboard');
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
      <Stack.Screen name="home" />
      <Stack.Screen name="category" />
      <Stack.Screen name="service-details" />
      <Stack.Screen name="address-selector" />
      <Stack.Screen name="ai-match" />
      <Stack.Screen name="booking-summary" />
      <Stack.Screen name="payment" />
      <Stack.Screen name="live-tracking" />
      <Stack.Screen name="rate-worker" />
      <Stack.Screen name="post-job" />
      <Stack.Screen name="my-jobs" />
      <Stack.Screen name="profile" />
      <Stack.Screen name="edit-profile" />
    </Stack>
  );
}
