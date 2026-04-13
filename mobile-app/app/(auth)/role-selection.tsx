import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { colors } from '@/constants/colors';
import { Button } from '@/components/Button';

export default function RoleSelectionScreen() {
  const router = useRouter();

  const handleCustomer = () => {
    router.replace('/(customer)/home');
  };

  const handleWorker = () => {
    router.replace('/(worker)/dashboard');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Choose Your Role</Text>
          <Text style={styles.subtitle}>
            Are you looking for services or offering your skills?
          </Text>
        </View>

        <View style={styles.optionsContainer}>
          <TouchableOpacity style={styles.optionCard} onPress={handleCustomer}>
            <View style={[styles.iconBox, { backgroundColor: '#E3F2FD' }]}>
              <Text style={styles.icon}>👤</Text>
            </View>
            <Text style={styles.optionTitle}>Customer</Text>
            <Text style={styles.optionDescription}>
              Find and book trusted workers for your needs
            </Text>
            <View style={styles.spacer} />
            <Button
              label="Continue as Customer"
              onPress={handleCustomer}
              variant="primary"
              size="large"
              style={styles.button}
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.optionCard} onPress={handleWorker}>
            <View style={[styles.iconBox, { backgroundColor: '#FFF3E0' }]}>
              <Text style={styles.icon}>🔨</Text>
            </View>
            <Text style={styles.optionTitle}>Service Provider</Text>
            <Text style={styles.optionDescription}>
              Offer your skills and earn money
            </Text>
            <View style={styles.spacer} />
            <Button
              label="Continue as Service Provider"
              onPress={handleWorker}
              variant="secondary"
              size="large"
              style={styles.button}
            />
          </TouchableOpacity>
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
    gap: 20,
  },
  optionCard: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 24,
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
    fontSize: 40,
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
    textAlign: 'center',
    marginBottom: 12,
  },
  spacer: {
    flex: 1,
  },
  button: {
    width: '100%',
  },
});
