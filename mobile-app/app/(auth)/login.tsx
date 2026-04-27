import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link, useRouter } from 'expo-router';
import { colors } from '@/constants/colors';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';
import { loginUser } from '@/src/services/authService';

export default function LoginScreen() {
  const [email, setEmail] = useState('ali.raza@example.com');
  const [password, setPassword] = useState('password123');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Validation', 'Please enter email and password');
      return;
    }

    try {
      setLoading(true);
      console.log('🔑 LoginScreen: Attempting login with email:', email);
      
      const response = await loginUser({ email, password });
      
      console.log('✅ LoginScreen: Login successful for user:', response.user.name, 'Role:', response.user.role);
      
      // Navigate based on user role
      if (response.user.role === 'worker') {
        router.replace('/(worker)/dashboard');
      } else if (response.user.role === 'employer') {
        router.replace('/(employer)/dashboard');
      } else {
        // customer
        router.replace('/(customer)/home');
      }
    } catch (error: any) {
      console.error('❌ LoginScreen: Login failed:', error);
      const errorMessage = error?.message || 'Unable to login. Please check your credentials.';
      Alert.alert('Login failed', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.logo}>🔨</Text>
          <Text style={styles.title}>KarigarUstaad</Text>
          <Text style={styles.subtitle}>Find Trusted Workers</Text>
        </View>

        <View style={styles.formContainer}>
          <Text style={styles.headingText}>Welcome Back</Text>
          <Text style={styles.descriptionText}>
            Sign in to your account to find trusted workers
          </Text>

          <Input
            placeholder="Email Address"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />

          <Input
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <Button
            label={loading ? 'Signing in...' : 'Login'}
            onPress={handleLogin}
            size="large"
            disabled={loading}
            style={styles.loginButton}
          />

          <View style={styles.footer}>
            <Text style={styles.footerText}>Don't have an account? </Text>
            <Link href="/(auth)/signup" asChild>
              <Text style={styles.link}>Sign up</Text>
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  header: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 60,
  },
  logo: {
    fontSize: 64,
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  formContainer: {
    flex: 1,
  },
  headingText: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 24,
  },
  loginButton: {
    marginTop: 24,
    marginBottom: 20,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  footerText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  link: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '600',
  },
});
