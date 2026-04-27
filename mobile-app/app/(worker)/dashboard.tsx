import React, { useState } from 'react';
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
import { useRouter, useFocusEffect } from 'expo-router';
import { colors } from '@/constants/colors';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { getAllJobs, JobItem } from '@/src/services/jobService';
import { getMe, UserProfile } from '@/src/services/userService';

export default function WorkerDashboardScreen() {
  const router = useRouter();
  const [jobs, setJobs] = useState<JobItem[]>([]);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useFocusEffect(
    React.useCallback(() => {
      loadDashboardData();
    }, [])
  );

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const userData = await getMe();
      setUser(userData);

      const jobsData = await getAllJobs();
      const pendingJobs = jobsData.filter((j) => j.status === 'pending');
      setJobs(pendingJobs);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to load dashboard';
      setError(errorMessage);
      console.error('❌ Dashboard Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleViewJobs = () => router.push('/(worker)/available-jobs');
  const handleViewProfile = () => router.push('/(worker)/profile');

  const handleViewEarnings = () =>
    Alert.alert('Earnings', 'Earnings feature coming soon!');
  const handleViewReviews = () =>
    Alert.alert('Reviews', 'Reviews feature coming soon!');
  const handleContactSupport = () =>
    Alert.alert('Support', 'Contact support at support@karigarustaad.com');

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading dashboard...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>
              Welcome, {user?.name || 'Worker'}! 👋
            </Text>
            <Text style={styles.subtitle}>Service Provider</Text>
          </View>
          <TouchableOpacity
            style={styles.profileButton}
            onPress={handleViewProfile}
          >
            <Text style={styles.profileIcon}>👤</Text>
          </TouchableOpacity>
        </View>

        {/* Error */}
        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {/* Earnings Card */}
        <Card style={styles.earningsCard}>
          <View style={styles.earningsHeader}>
            <Text style={styles.earningsLabel}>Total Earnings</Text>
            <Text style={styles.earningsIcon}>📊</Text>
          </View>

          <Text style={styles.earningsAmount}>
            Rs. {user?.wallet?.balance || 0}
          </Text>
          <Text style={styles.earningsSubtext}>Available Balance</Text>

          <View style={styles.earningsDivider} />

          <View style={styles.earningsStats}>
            <View style={styles.earningsStat}>
              <Text style={styles.earningsStatValue}>
                {user?.completedJobs || 0}
              </Text>
              <Text style={styles.earningsStatLabel}>Jobs Done</Text>
            </View>

            <View style={styles.earningsStatDivider} />

            <View style={styles.earningsStat}>
              <Text style={styles.earningsStatValue}>
                {user?.wallet?.pending || 0}
              </Text>
              <Text style={styles.earningsStatLabel}>Pending</Text>
            </View>

            <View style={styles.earningsStatDivider} />

            <View style={styles.earningsStat}>
              <Text style={styles.earningsStatValue}>
                {user?.rating ? user.rating.toFixed(1) : '0.0'}⭐
              </Text>
              <Text style={styles.earningsStatLabel}>Rating</Text>
            </View>
          </View>
        </Card>

        {/* Quick Actions */}
        <View style={styles.quickActionsContainer}>
          <TouchableOpacity
            style={styles.quickActionButton}
            onPress={handleViewEarnings}
          >
            <Text style={styles.quickActionIcon}>📈</Text>
            <Text style={styles.quickActionText}>Earnings</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.quickActionButton}
            onPress={handleViewReviews}
          >
            <Text style={styles.quickActionIcon}>⭐</Text>
            <Text style={styles.quickActionText}>Reviews</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.quickActionButton}
            onPress={handleContactSupport}
          >
            <Text style={styles.quickActionIcon}>📞</Text>
            <Text style={styles.quickActionText}>Support</Text>
          </TouchableOpacity>
        </View>

        {/* Jobs */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              Available Jobs ({jobs.length})
            </Text>
            <TouchableOpacity onPress={handleViewJobs}>
              <Text style={styles.seeAll}>View All</Text>
            </TouchableOpacity>
          </View>

          {jobs.length > 0 ? (
            jobs.slice(0, 2).map((job) => (
              <TouchableOpacity
                key={job.id}
                onPress={() =>
                  router.push({
                    pathname: '/(worker)/job-details',
                    params: { jobId: job.id },
                  })
                }
              >
                <Card style={styles.jobPreviewCard}>
                  <View style={styles.jobPreviewHeader}>
                    <View style={styles.jobPreviewContent}>
                      <Text style={styles.jobPreviewTitle}>{job.title}</Text>
                      <Text style={styles.jobPreviewLocation}>
                        📍 {job.location}
                      </Text>
                    </View>
                    <Text style={styles.jobPreviewBudget}>
                      Rs. {job.budget}
                    </Text>
                  </View>
                </Card>
              </TouchableOpacity>
            ))
          ) : (
            <Card>
              <Text style={styles.noJobsText}>
                No available jobs right now
              </Text>
            </Card>
          )}

          <Button
            label="View All Jobs"
            onPress={handleViewJobs}
            variant="primary"
            size="large"
            style={styles.viewAllButton}
          />
        </View>

        {/* Skills */}
        {user?.skills?.length ? (
          <Card style={styles.skillsCard}>
            <Text style={styles.skillsTitle}>Your Skills</Text>
            <View style={styles.skillsContainer}>
              {user.skills.slice(0, 3).map((skill, idx) => (
                <View key={idx} style={styles.skillBadge}>
                  <Text style={styles.skillBadgeText}>{skill}</Text>
                </View>
              ))}
            </View>
          </Card>
        ) : null}

        {/* Tips */}
        <Card style={styles.tipsCard}>
          <Text style={styles.tipsTitle}>💡 Pro Tips</Text>
          <Text style={styles.tipText}>
            • Complete jobs on time to earn bonuses
          </Text>
          <Text style={styles.tipText}>
            • Maintain high ratings for more jobs
          </Text>
          <Text style={styles.tipText}>
            • Add more skills to get better offers
          </Text>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },

  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 10, color: colors.textSecondary },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
  },

  greeting: { fontSize: 24, fontWeight: '700', color: colors.text },
  subtitle: { fontSize: 13, color: colors.textSecondary },

  profileButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
  },

  profileIcon: { fontSize: 20 },

  earningsCard: {
    margin: 20,
    backgroundColor: '#E3F2FD',
    borderWidth: 1,
    borderColor: colors.primary,
  },

  earningsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  earningsLabel: { fontSize: 13, color: colors.textSecondary },
  earningsIcon: { fontSize: 18 },
  earningsAmount: { fontSize: 36, fontWeight: '700', color: colors.primary },

  earningsSubtext: { fontSize: 12, color: colors.textSecondary },

  earningsDivider: {
    height: 1,
    backgroundColor: colors.primary,
    opacity: 0.2,
    marginVertical: 10,
  },

  earningsStats: { flexDirection: 'row', justifyContent: 'space-around' },

  earningsStat: { alignItems: 'center' },
  earningsStatDivider: { width: 1, backgroundColor: colors.primary },

  earningsStatValue: { fontWeight: '700', color: colors.primary },
  earningsStatLabel: { fontSize: 10, color: colors.textSecondary },

  quickActionsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 10,
  },

  quickActionButton: {
    flex: 1,
    backgroundColor: colors.white,
    padding: 16,
    alignItems: 'center',
    borderRadius: 12,
  },

  quickActionIcon: { fontSize: 24 },
  quickActionText: { fontSize: 11, fontWeight: '600' },

  sectionContainer: { margin: 20 },

  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  sectionTitle: { fontSize: 18, fontWeight: '700' },
  seeAll: { color: colors.primary },

  jobPreviewCard: { marginBottom: 10 },

  jobPreviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  jobPreviewTitle: { fontWeight: '600' },
  jobPreviewLocation: { fontSize: 12, color: colors.textSecondary },
  jobPreviewBudget: { fontWeight: '700', color: colors.primary },

  noJobsText: { textAlign: 'center', color: colors.textSecondary },

  viewAllButton: { marginTop: 10 },

  skillsCard: { margin: 20 },
  skillsTitle: { fontWeight: '700' },

  skillsContainer: { flexDirection: 'row', gap: 8 },
  skillBadge: {
    backgroundColor: colors.accent,
    padding: 6,
    borderRadius: 6,
  },

  skillBadgeText: { color: colors.white },

  tipsCard: { margin: 20, backgroundColor: '#FFF3E0' },
  tipsTitle: { fontWeight: '700' },
  tipText: { fontSize: 12 },
});