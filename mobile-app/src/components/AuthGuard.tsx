import React, { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/src/contexts/AuthContext';
import { colors } from '@/constants/colors';

interface AuthGuardProps {
  children: React.ReactNode;
  requiredRole?: 'customer' | 'worker' | 'employer';
}

export const AuthGuard: React.FC<AuthGuardProps> = ({ children, requiredRole }) => {
  const { isAuthenticated, user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        // Not authenticated, redirect to login
        router.replace('/signin');
        return;
      }

      if (requiredRole && user && user.role !== requiredRole) {
        // Wrong role, redirect to appropriate dashboard
        switch (user.role) {
          case 'customer':
            router.replace('/(customer)/home');
            break;
          case 'worker':
            router.replace('/(worker)/dashboard');
            break;
          case 'employer':
            router.replace('/(employer)/dashboard');
            break;
          default:
            router.replace('/signin');
        }
        return;
      }
    }
  }, [isAuthenticated, user, isLoading, requiredRole, router]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect
  }

  if (requiredRole && user?.role !== requiredRole) {
    return null; // Will redirect
  }

  return <>{children}</>;
};