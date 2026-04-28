import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link, useLocalSearchParams, useRouter } from 'expo-router';
import { colors } from '@/constants/colors';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';
import { registerUser } from '@/src/services/authService';

type RegisterParams = {
  role?: 'worker' | 'customer';
  name?: string;
  email?: string;
  password?: string;
};

export default function RegisterScreen() {
  const params = useLocalSearchParams<RegisterParams>();
  const router = useRouter();

  const [name, setName] = useState(params.name || '');
  const [email, setEmail] = useState(params.email || '');
  const [password, setPassword] = useState(params.password || '');
  const [role, setRole] = useState<'worker' | 'customer'>(
    params.role === 'customer' ? 'customer' : 'worker',
  );
  const [skills, setSkills] = useState('');
  const [bio, setBio] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!name || !email || !password || !role) {
      Alert.alert('Validation', 'Please complete all fields and choose a role.');
      return;
    }

    // For workers, require skills
    if (role === 'worker' && !skills.trim()) {
      Alert.alert('Validation', 'Please enter your skills.');
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Validation', 'Please enter a valid email address');
      return;
    }

    // Validate password length
    if (password.length < 6) {
      Alert.alert('Validation', 'Password must be at least 6 characters');
      return;
    }

    try {
      setLoading(true);
      console.log('📝 RegisterScreen: Creating account for', email, 'with role:', role);
      
      const registerData = {
        name,
        email,
        password,
        role,
        skills: role === 'worker' ? skills.split(',').map(s => s.trim()) : [],
        bio: bio.trim() || '',
      };
      
      const response = await registerUser(registerData);
      console.log('✅ RegisterScreen: Registration successful');
      
      Alert.alert('Success', response.message || 'Account created successfully');

      // Navigate based on role
      if (response.user.role === 'customer') {
        router.replace('/(customer)/home');
      } else {
        router.replace('/(worker)/dashboard');
      }
    } catch (error: any) {
      console.error('❌ RegisterScreen: Registration failed:', error);
      Alert.alert('Registration failed', error?.message || 'Unable to create account.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Image
            source={require('@/assets/images/logo.png')}
            style={styles.logoImage}
            resizeMode="contain"
          />
          <Text style={styles.appName}>Karigar Ustaad</Text>
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
                👷 Worker
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.roleOption,
                role === 'customer' && styles.roleOptionActive,
              ]}
              onPress={() => setRole('customer')}
            >
              <Text
                style={[
                  styles.roleOptionText,
                  role === 'customer' && styles.roleOptionTextActive,
                ]}
              >
                💼 Customer
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
            placeholder="Password (minimum 6 characters)"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          {role === 'worker' && (
            <>
              <Input
                placeholder="Skills (comma separated, e.g., plumbing, electrical)"
                value={skills}
                onChangeText={setSkills}
              />

              <Input
                placeholder="Bio (tell us about yourself)"
                value={bio}
                onChangeText={setBio}
                multiline
                numberOfLines={3}
              />
            </>
          )}

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
  logoImage: {
    width: 80,
    height: 80,
    marginBottom: 12,
  },
  appName: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
    textAlign: 'center',
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
