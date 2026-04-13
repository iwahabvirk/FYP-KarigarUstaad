import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { colors } from '@/constants/colors';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { getCurrentUser, logoutUser, UserPayload } from '@/src/services/authService';

export default function EmployerProfileScreen() {
  const [user, setUser] = useState<UserPayload | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    loadCompanyProfile();
  }, []);

  const loadCompanyProfile = async () => {
    try {
      setLoading(true);
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    } catch (error: any) {
      Alert.alert('Error', error?.message || 'Unable to load profile.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logoutUser();
    router.replace('/(auth)/login');
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading company profile...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Company Profile</Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backButton}>✕</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Card style={styles.companyCard}>
          <View style={styles.companyHeader}>
            <View style={styles.logo}>
              <Text style={styles.logoText}>HR</Text>
            </View>
            <View style={styles.companyInfo}>
              <Text style={styles.companyName}>{user?.name || 'Home Repairs Co'}</Text>
              <Text style={styles.companyRole}>Employer</Text>
              <View style={styles.ratingContainer}>
                <Text style={styles.ratingStars}>★★★★★</Text>
                <Text style={styles.rating}>4.8 (520 reviews)</Text>
              </View>
            </View>
          </View>
        </Card>

        <Card>
          <Text style={styles.sectionTitle}>About Company</Text>
          <Text style={styles.sectionValue}>
            Professional home repair and maintenance company with 15+ years of
            experience. Committed to connecting skilled workers with quality
            projects and ensuring customer satisfaction.
          </Text>
        </Card>

        <Card>
          <Text style={styles.sectionTitle}>Company Statistics</Text>
          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statNumber}>245</Text>
              <Text style={styles.statLabel}>Jobs Posted</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statNumber}>890</Text>
              <Text style={styles.statLabel}>Total Hired</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statNumber}>2.5K</Text>
              <Text style={styles.statLabel}>Total Spent</Text>
            </View>
          </View>
        </Card>

        <Card>
          <Text style={styles.sectionTitle}>Contact Information</Text>
          <View style={styles.contactItem}>
            <Text style={styles.contactLabel}>Email</Text>
            <Text style={styles.contactValue}>{user?.email || 'info@homerepairco.com'}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.contactItem}>
            <Text style={styles.contactLabel}>Phone</Text>
            <Text style={styles.contactValue}>+1 (555) 123-4567</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.contactItem}>
            <Text style={styles.contactLabel}>Location</Text>
            <Text style={styles.contactValue}>New York, USA</Text>
          </View>
        </Card>

        <Card>
          <Text style={styles.sectionTitle}>Verification</Text>
          <View style={styles.verificationItem}>
            <Text style={styles.checkmark}>✓</Text>
            <Text style={styles.verificationText}>Business License Verified</Text>
          </View>
          <View style={styles.verificationItem}>
            <Text style={styles.checkmark}>✓</Text>
            <Text style={styles.verificationText}>Identity Verified</Text>
          </View>
          <View style={styles.verificationItem}>
            <Text style={styles.checkmark}>✓</Text>
            <Text style={styles.verificationText}>Email Verified</Text>
          </View>
        </Card>

        <View style={styles.buttonContainer}>
          <Button
            label="Edit Profile"
            onPress={() => {}}
            variant="primary"
            size="large"
          />
          <Button
            label="Logout"
            onPress={handleLogout}
            variant="outline"
            size="large"
          />
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
  },
  backButton: {
    fontSize: 24,
    color: colors.text,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  companyCard: {
    marginBottom: 16,
  },
  companyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  logoText: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.white,
  },
  companyInfo: {
    flex: 1,
  },
  companyName: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  companyRole: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  ratingStars: {
    fontSize: 14,
    marginRight: 6,
  },
  rating: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  sectionValue: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  statBox: {
    flex: 1,
    backgroundColor: colors.gray,
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  contactItem: {
    paddingVertical: 8,
  },
  contactLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  contactValue: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 8,
  },
  verificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  checkmark: {
    fontSize: 18,
    color: colors.success,
    marginRight: 8,
  },
  verificationText: {
    fontSize: 14,
    color: colors.text,
    flex: 1,
  },
  buttonContainer: {
    marginTop: 16,
    marginBottom: 24,
    gap: 12,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 12,
    color: colors.textSecondary,
  },
});
