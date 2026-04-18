import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { colors } from '@/constants/colors';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { dummyJobs } from '@/src/data';

export default function WorkerDashboardScreen() {
  const router = useRouter();
  const pendingJobs = dummyJobs.filter((j) => j.status === 'pending');

  const handleViewJobs = () => {
    router.push('/(worker)/available-jobs');
  };

  const handleViewProfile = () => {
    router.push('/(worker)/profile');
  };

  const handleViewEarnings = () => {
    // Navigate to earnings screen or show earnings modal
    Alert.alert('Earnings', 'Earnings feature coming soon!');
  };

  const handleViewReviews = () => {
    // Navigate to reviews screen
    Alert.alert('Reviews', 'Reviews feature coming soon!');
  };

  const handleContactSupport = () => {
    // Navigate to support screen or open support chat
    Alert.alert('Support', 'Contact support at support@karigarustaad.com');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Welcome, Hamza! 👋</Text>
            <Text style={styles.subtitle}>Service Provider</Text>
          </View>
          <TouchableOpacity
            style={styles.profileButton}
            onPress={handleViewProfile}
          >
            <Text style={styles.profileIcon}>👤</Text>
          </TouchableOpacity>
        </View>

        {/* Earnings Card */}
        <Card style={styles.earningsCard}>
          <View style={styles.earningsHeader}>
            <Text style={styles.earningsLabel}>Total Earnings</Text>
            <TouchableOpacity>
              <Text style={styles.earningsIcon}>📊</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.earningsAmount}>Rs. 25,000</Text>
          <Text style={styles.earningsSubtext}>This month</Text>
          <View style={styles.earningsDivider} />
          <View style={styles.earningsStats}>
            <View style={styles.earningsStat}>
              <Text style={styles.earningsStatValue}>45</Text>
              <Text style={styles.earningsStatLabel}>Jobs Done</Text>
            </View>
            <View style={styles.earningsStatDivider} />
            <View style={styles.earningsStat}>
              <Text style={styles.earningsStatValue}>Rs. 556</Text>
              <Text style={styles.earningsStatLabel}>Avg/Job</Text>
            </View>
            <View style={styles.earningsStatDivider} />
            <View style={styles.earningsStat}>
              <Text style={styles.earningsStatValue}>4.8⭐</Text>
              <Text style={styles.earningsStatLabel}>Rating</Text>
            </View>
          </View>
        </Card>

        {/* Quick Actions */}
        <View style={styles.quickActionsContainer}>
          <TouchableOpacity style={styles.quickActionButton} onPress={handleViewEarnings}>
            <Text style={styles.quickActionIcon}>📈</Text>
            <Text style={styles.quickActionText}>Earnings</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickActionButton} onPress={handleViewReviews}>
            <Text style={styles.quickActionIcon}>⭐</Text>
            <Text style={styles.quickActionText}>Reviews</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickActionButton} onPress={handleContactSupport}>
            <Text style={styles.quickActionIcon}>📞</Text>
            <Text style={styles.quickActionText}>Support</Text>
          </TouchableOpacity>
        </View>

        {/* Available Jobs Section */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Available Jobs</Text>
            <TouchableOpacity onPress={handleViewJobs}>
              <Text style={styles.seeAll}>View All</Text>
            </TouchableOpacity>
          </View>

          {pendingJobs.length > 0 ? (
            pendingJobs.slice(0, 2).map((job) => (
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
                      <Text style={styles.jobPreviewLocation}>📍 {job.location}</Text>
                    </View>
                    <Text style={styles.jobPreviewBudget}>Rs. {job.budget}</Text>
                  </View>
                </Card>
              </TouchableOpacity>
            ))
          ) : (
            <Card>
              <Text style={styles.noJobsText}>No available jobs right now</Text>
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

        {/* Skills Section */}
        <Card style={styles.skillsCard}>
          <Text style={styles.skillsTitle}>Your Skills</Text>
          <View style={styles.skillsContainer}>
            <View style={styles.skillBadge}>
              <Text style={styles.skillBadgeText}>⚡ Electrical Work</Text>
            </View>
            <View style={styles.skillBadge}>
              <Text style={styles.skillBadgeText}>🔋 Installations</Text>
            </View>
            <View style={styles.skillBadge}>
              <Text style={styles.skillBadgeText}>✓ Verified</Text>
            </View>
          </View>
        </Card>

        {/* Tips Section */}
        <Card style={styles.tipsCard}>
          <Text style={styles.tipsTitle}>💡 Pro Tips</Text>
          <Text style={styles.tipText}>• Complete jobs on time to earn bonuses</Text>
          <Text style={styles.tipText}>• Maintain high ratings for more jobs</Text>
          <Text style={styles.tipText}>• Add more skills to get better offers</Text>
        </Card>
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
  greeting: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
  },
  subtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
  profileButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  profileIcon: {
    fontSize: 20,
  },
  earningsCard: {
    marginHorizontal: 20,
    marginBottom: 20,
    backgroundColor: '#E3F2FD',
    borderWidth: 1,
    borderColor: colors.primary,
  },
  earningsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  earningsLabel: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  earningsIcon: {
    fontSize: 18,
  },
  earningsAmount: {
    fontSize: 36,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 4,
  },
  earningsSubtext: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 12,
  },
  earningsDivider: {
    height: 1,
    backgroundColor: colors.primary,
    opacity: 0.2,
    marginBottom: 12,
  },
  earningsStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  earningsStat: {
    alignItems: 'center',
  },
  earningsStatDivider: {
    width: 1,
    height: 30,
    backgroundColor: colors.primary,
    opacity: 0.2,
  },
  earningsStatValue: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primary,
  },
  earningsStatLabel: {
    fontSize: 10,
    color: colors.textSecondary,
    marginTop: 2,
  },
  quickActionsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 24,
    gap: 10,
  },
  quickActionButton: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  quickActionIcon: {
    fontSize: 24,
    marginBottom: 6,
  },
  quickActionText: {
    fontSize: 11,
    color: colors.text,
    fontWeight: '600',
  },
  sectionContainer: {
    marginHorizontal: 20,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  seeAll: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '600',
  },
  jobPreviewCard: {
    marginBottom: 10,
  },
  jobPreviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  jobPreviewContent: {
    flex: 1,
  },
  jobPreviewTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  jobPreviewLocation: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  jobPreviewBudget: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primary,
  },
  noJobsText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  viewAllButton: {
    marginTop: 8,
  },
  skillsCard: {
    marginHorizontal: 20,
    marginBottom: 16,
  },
  skillsTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 12,
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  skillBadge: {
    backgroundColor: colors.accent,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  skillBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.white,
  },
  tipsCard: {
    marginHorizontal: 20,
    marginBottom: 40,
    backgroundColor: '#FFF3E0',
  },
  tipsTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 12,
  },
  tipText: {
    fontSize: 12,
    color: colors.text,
    marginBottom: 6,
    lineHeight: 18,
  },
});
