import { Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { useRouter } from 'expo-router';
import { colors } from '@/constants/colors';
import { getCurrentUser } from '@/src/services/authService';

export default function EmployerLayout() {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await getCurrentUser();
        if (user.role !== 'employer') {
          if (user.role === 'worker') {
            router.replace('/(worker)/home');
          } else {
            router.replace('/(auth)/login');
          }
          return;
        }
      } catch {
        router.replace('/(auth)/login');
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
      <Stack.Screen
        name="post-job"
        options={{
          presentation: 'modal',
        }}
      />
      <Stack.Screen
        name="applicants"
        options={{
          presentation: 'card',
        }}
      />
      <Stack.Screen
        name="profile"
        options={{
          presentation: 'modal',
        }}
      />
    </Stack>
  );
}
