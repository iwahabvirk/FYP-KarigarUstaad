import { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { useRouter } from 'expo-router';
import { colors } from '@/constants/colors';
import { getCurrentUser, getStoredToken } from '@/src/services/authService';

export default function DashboardAliasScreen() {
  const router = useRouter();

  useEffect(() => {
    const routeByRole = async () => {
      const token = await getStoredToken();

      if (!token) {
        router.replace('/signin');
        return;
      }

      try {
        const user = await getCurrentUser();

        if (user.role === 'worker') {
          router.replace('/(worker)/dashboard');
        } else if (user.role === 'employer') {
          router.replace('/(employer)/dashboard');
        } else {
          router.replace('/(customer)/home');
        }
      } catch {
        router.replace('/signin');
      }
    };

    routeByRole();
  }, [router]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
      <ActivityIndicator size="large" color={colors.primary} />
    </View>
  );
}
