import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { Link, useLocalSearchParams, useRouter } from 'expo-router';
import { colors } from '@/constants/colors';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';
import { registerUser } from '@/src/services/authService';

type RegisterParams = {
  role?: 'worker' | 'employer';
};

export default function RegisterScreen() {
  const params = useLocalSearchParams<RegisterParams>();
  const router = useRouter();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'worker' | 'employer'>(
    params.role === 'employer' ? 'employer' : 'worker',
  );
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!name || !email || !password || !role) {
      Alert.alert('Validation', 'Please complete all fields and choose a role.');
      return;
    }

    try {
      setLoading(true);
      const response = await registerUser({ name, email, password, role });
      Alert.alert('Success', response.message || 'Account created successfully');

      if (response.user.role === 'employer') {
        router.replace('/(employer)/dashboard');
      } else {
        router.replace('/(worker)/home');
      }
    } catch (error: any) {
      Alert.alert('Registration failed', error?.message || 'Unable to create account.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.logo}>KarigarUstaad</Text>
          <Text style={styles.subtitle}>Job Marketplace</Text>
        </View>

        <View style={styles.formContainer}>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.description}>
            Join our community of workers and employers
          </Text>

          <View style={styles.roleSelectorContainer}>
            <TouchableOpacity
              style={[
                styles.roleOption,
                role === 'worker' && styles.roleOptionActive,
              ]}
              onPress={() => setRole('worker')}
            >
              <Text
                style={[
                  styles.roleOptionText,
                  role === 'worker' && styles.roleOptionTextActive,
                ]}
              >
                Worker
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.roleOption,
                role === 'employer' && styles.roleOptionActive,
              ]}
              onPress={() => setRole('employer')}
            >
              <Text
                style={[
                  styles.roleOptionText,
                  role === 'employer' && styles.roleOptionTextActive,
                ]}
              >
                Employer
              </Text>
            </TouchableOpacity>
          </View>

          <Input
            placeholder="Full Name"
            value={name}
            onChangeText={setName}
          />

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
            label={loading ? 'Creating account...' : 'Create Account'}
            onPress={handleRegister}
            size="large"
            style={styles.registerButton}
            disabled={loading}
          />

          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <Link href="/(auth)/login" asChild>
              <Text style={styles.link}>Sign in</Text>
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
    marginBottom: 40,
  },
  logo: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  formContainer: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 24,
  },
  roleSelectorContainer: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  roleOption: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
    alignItems: 'center',
  },
  roleOptionActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  roleOptionText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  roleOptionTextActive: {
    color: colors.white,
  },
  registerButton: {
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
