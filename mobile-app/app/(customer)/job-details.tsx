import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { colors } from '@/constants/colors';
import { Card } from '@/components/Card';
import { getCategoryLabel } from '@/constants/jobCategories';
import { Button } from '@/components/Button';
import { getJobById } from '@/src/services/jobService';

export default function CustomerJobDetailsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const jobId = params.jobId as string;
  const [loading, setLoading] = useState(true);
  const [job, setJob] = useState<any>(null);

  React.useEffect(() => {
    loadJobDetails();
  }, [jobId]);

  const loadJobDetails = async () => {
    try {
      if (!jobId) {
        Alert.alert('Error', 'No job ID provided');
        setLoading(false);
        return;
      }

      const jobData = await getJobById(jobId);
      setJob(jobData);
    } catch (error: any) {
      console.error('Failed to load job', error);
      Alert.alert('Error', error?.message || 'Failed to load job details');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading job details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!job) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>Job not found</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Job Details</Text>
        <View />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Card style={styles.headerCard}>
          <Text style={styles.jobTitle}>{job.title}</Text>
          <Text style={styles.jobCategory}>{getCategoryLabel(job.category)}</Text>
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
            <Text style={styles.detailLabel}>Status</Text>
            <Text style={styles.detailValue}>{job.status}</Text>
          </View>
        </Card>

        {job.assignedWorker && (
          <Card>
            <Text style={styles.sectionTitle}>Assigned Worker</Text>
            <View style={styles.workerInfo}>
              <View style={styles.workerAvatar}>
                <Text style={styles.workerAvatarText}>
                  {job.assignedWorker?.name?.split(' ').map((n: string) => n[0]).join('').toUpperCase() || 'WK'}
                </Text>
              </View>
              <View style={styles.workerDetails}>
                <Text style={styles.workerName}>{job.assignedWorker?.name || 'Worker'}</Text>
                <Text style={styles.workerRating}>⭐ {job.assignedWorker?.rating?.toFixed(1) || '0.0'} rating</Text>
                <Text style={styles.workerPhone}>Phone: {job.assignedWorker?.phone || 'Not provided'}</Text>
              </View>
            </View>
          </Card>
        )}
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
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: colors.textSecondary,
  },
  errorText: {
    fontSize: 18,
    color: colors.error,
    textAlign: 'center',
    marginTop: 50,
  },
  headerCard: {
    marginBottom: 16,
  },
  jobTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  jobCategory: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: '600',
    marginBottom: 12,
  },
  budgetContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  budgetLabel: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  budgetAmount: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.primary,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: colors.textSecondary,
    lineHeight: 24,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  detailLabel: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  detailValue: {
    fontSize: 16,
    color: colors.text,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: colors.grayLight,
    marginVertical: 4,
  },
  workerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  workerAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  workerAvatarText: {
    fontSize: 20,
    color: colors.white,
    fontWeight: '700',
  },
  workerDetails: {
    flex: 1,
  },
  workerName: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  workerRating: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  workerPhone: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '500',
  },
});