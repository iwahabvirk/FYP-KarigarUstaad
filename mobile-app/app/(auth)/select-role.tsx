import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { colors } from '@/constants/colors';
import { Button } from '@/components/Button';

type SelectRoleParams = {
  name?: string;
  email?: string;
  password?: string;
};

export default function SelectRoleScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<SelectRoleParams>();

  const handleWorkerSelect = () => {
    router.push({
      pathname: '/(auth)/register',
      params: {
        role: 'worker',
        name: params.name || '',
        email: params.email || '',
        password: params.password || '',
      },
    });
  };

  const handleEmployerSelect = () => {
    router.push({
      pathname: '/(auth)/register',
      params: {
        role: 'employer',
        name: params.name || '',
        email: params.email || '',
        password: params.password || '',
      },
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Choose Your Role</Text>
          <Text style={styles.subtitle}>
            Are you a worker looking for jobs or an employer hiring?
          </Text>
        </View>

        <View style={styles.optionsContainer}>
          <View style={styles.optionCard}>
            <View style={[styles.iconBox, { backgroundColor: '#E3F2FD' }]}>
              <Text style={styles.icon}>👷</Text>
            </View>
            <Text style={styles.optionTitle}>Worker (Karigar)</Text>
            <Text style={styles.optionDescription}>
              Browse and apply for jobs
            </Text>
            <Button
              label="Continue as Worker"
              onPress={handleWorkerSelect}
              variant="primary"
              size="large"
              style={styles.button}
            />
          </View>

          <View style={styles.optionCard}>
            <View style={[styles.iconBox, { backgroundColor: '#FFF3E0' }]}>
              <Text style={styles.icon}>💼</Text>
            </View>
            <Text style={styles.optionTitle}>Employer (Ustaad)</Text>
            <Text style={styles.optionDescription}>
              Post jobs and hire workers
            </Text>
            <Button
              label="Continue as Employer"
              onPress={handleEmployerSelect}
              variant="secondary"
              size="large"
              style={styles.button}
            />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  header: {
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  optionsContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  optionCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 24,
    marginBottom: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  iconBox: {
    width: 80,
    height: 80,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  icon: {
    fontSize: 48,
  },
  optionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  optionDescription: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 20,
    textAlign: 'center',
  },
  button: {
    width: '100%',
  },
});
