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
import { useRouter, useLocalSearchParams } from 'expo-router';
import { colors } from '@/constants/colors';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { getJobById } from '@/src/data';

export default function JobDetailsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const jobId = params.jobId as string;
  const job = getJobById(jobId);

  if (!job) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>Job not found</Text>
      </SafeAreaView>
    );
  }

  const handleAcceptJob = () => {
    Alert.alert('Job Accepted!', `You've accepted "${job.title}". You'll start earning money when you complete it.`);
    router.push({
      pathname: '/(worker)/in-progress',
      params: { jobId },
    });
  };

  const handleRejectJob = () => {
    Alert.alert('Job Rejected', 'You can find other jobs in the available jobs list.');
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Job Details</Text>
        <TouchableOpacity>
          <Text style={styles.shareIcon}>↗️</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Card style={styles.headerCard}>
          <Text style={styles.jobTitle}>{job.title}</Text>
          <Text style={styles.jobCategory}>{job.category}</Text>
          <View style={styles.budgetContainer}>
            <Text style={styles.budgetLabel}>Budget</Text>
            <Text style={styles.budgetAmount}>Rs. {job.budget}</Text>
          </View>
        </Card>

        <Card>
          <Text style={styles.sectionTitle}>About This Job</Text>
          <Text style={styles.description}>{job.description}</Text>
        </Card>

        <Card>
          <Text style={styles.sectionTitle}>Job Details</Text>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Location</Text>
            <Text style={styles.detailValue}>{job.location}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Duration</Text>
            <Text style={styles.detailValue}>1-2 hours</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Difficulty</Text>
            <Text style={styles.detailValue}>Standard</Text>
          </View>
        </Card>

        <Card>
          <Text style={styles.sectionTitle}>Customer Info</Text>
          <View style={styles.customerInfo}>
            <View style={styles.customerAvatar}>
              <Text style={styles.customerAvatarText}>JD</Text>
            </View>
            <View style={styles.customerDetails}>
              <Text style={styles.customerName}>Arooj Fatima</Text>
              <Text style={styles.customerRating}>⭐ 4.5 (23 reviews)</Text>
              <Text style={styles.customerType}>First time on platform</Text>
            </View>
          </View>
        </Card>

        <Card style={styles.benefitsCard}>
          <Text style={styles.benefitsTitle}>Why Accept This Job?</Text>
          <Text style={styles.benefitText}>✓ Good budget (Rs. {job.budget})</Text>
          <Text style={styles.benefitText}>✓ Nearby location</Text>
          <Text style={styles.benefitText}>✓ Standard difficulty</Text>
          <Text style={styles.benefitText}>✓ New customer (great review opportunity)</Text>
        </Card>

        <Card style={styles.safetyCard}>
          <Text style={styles.safetyTitle}>Safety Tips</Text>
          <Text style={styles.safetyText}>• Meet in a public location</Text>
          <Text style={styles.safetyText}>• Don't share personal details</Text>
          <Text style={styles.safetyText}>• Complete payment through app</Text>
        </Card>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          label="Accept Job"
          onPress={handleAcceptJob}
          variant="primary"
          size="large"
          style={styles.acceptButton}
        />
        <Button
          label="Decline"
          onPress={handleRejectJob}
          variant="outline"
          size="large"
        />
      </View>
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
    borderBottomWidth: 1,
    borderBottomColor: colors.grayLight,
  },
  backButton: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    flex: 1,
    textAlign: 'center',
  },
  shareIcon: {
    fontSize: 16,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerCard: {
    marginBottom: 16,
    backgroundColor: '#E3F2FD',
  },
  jobTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  jobCategory: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 16,
  },
  budgetContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  budgetLabel: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  budgetAmount: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.primary,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 12,
  },
  description: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  detailLabel: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  detailValue: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text,
  },
  divider: {
    height: 1,
    backgroundColor: colors.grayLight,
  },
  customerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  customerAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  customerAvatarText: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.white,
  },
  customerDetails: {
    flex: 1,
  },
  customerName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  customerRating: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  customerType: {
    fontSize: 11,
    color: colors.primary,
    marginTop: 2,
    fontWeight: '600',
  },
  benefitsCard: {
    backgroundColor: '#E8F5E9',
    borderWidth: 1,
    borderColor: colors.success,
  },
  benefitsTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 10,
  },
  benefitText: {
    fontSize: 12,
    color: colors.text,
    marginBottom: 6,
  },
  safetyCard: {
    backgroundColor: '#FFF3E0',
  },
  safetyTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 10,
  },
  safetyText: {
    fontSize: 12,
    color: colors.text,
    marginBottom: 6,
  },
  errorText: {
    fontSize: 16,
    color: colors.text,
    textAlign: 'center',
    marginTop: 40,
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 10,
  },
  acceptButton: {
    marginBottom: 0,
  },
});
