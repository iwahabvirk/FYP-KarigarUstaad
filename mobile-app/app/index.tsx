import React, { useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { colors } from '@/constants/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getCurrentUser } from '@/src/services/authService';

export default function SplashScreen() {
  const router = useRouter();

  useEffect(() => {
    checkAuthStatus();
  }, [router]);

  const checkAuthStatus = async () => {
    try {
      const token = await AsyncStorage.getItem('karigarAuthToken');
      if (token) {
        // Validate token by fetching current user
        const user = await getCurrentUser();
        // Navigate based on role
        if (user.role === 'employer') {
          router.replace('/(employer)/dashboard');
        } else {
          router.replace('/(worker)/home');
        }
      } else {
        // No token, go to login
        router.replace('/(auth)/login');
      }
    } catch (error) {
      // Token invalid or error, go to login
      await AsyncStorage.removeItem('karigarAuthToken');
      router.replace('/(auth)/login');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.logo}>KarigarUstaad</Text>
        <Text style={styles.subtitle}>Job Marketplace</Text>
        <View style={styles.loaderContainer}>
          <View style={styles.loader} />
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    fontSize: 48,
    fontWeight: '700',
    color: colors.white,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.white,
    marginBottom: 40,
    opacity: 0.9,
  },
  loaderContainer: {
    alignItems: 'center',
  },
  loader: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: colors.white,
    borderTopColor: 'transparent',
    marginBottom: 12,
  },
  loadingText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '500',
  },
});