import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Animated,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { colors } from '@/constants/colors';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { getJobById, completeJob, getWorkerJobs } from '@/src/services/jobService';

export default function InProgressScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const initialJobId = params.jobId as string | undefined;
  const [jobId, setJobId] = useState<string | null>(initialJobId || null);
  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [completing, setCompleting] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [notes, setNotes] = useState('');
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    loadJob();
    const interval = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ]),
    );
    animation.start();
    return () => animation.stop();
  }, []);

  const loadJob = async () => {
    try {
      let resolvedJobId = jobId;

      if (!resolvedJobId) {
        const workerJobs = await getWorkerJobs();
        const activeJob = workerJobs.find((item) => item.status === 'in_progress' || item.status === 'accepted');

        if (!activeJob) {
          setJob(null);
          return;
        }

        resolvedJobId = activeJob.id;
        setJobId(activeJob.id);
      }

      const jobData = await getJobById(resolvedJobId);
      setJob(jobData);
    } catch (error: any) {
      Alert.alert('Error', error?.message || 'Failed to load job details');
      router.back();
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteJob = async () => {
    if (!notes.trim()) {
      Alert.alert('Notes Required', 'Please add work notes before completing the job.');
      return;
    }

    setCompleting(true);
    try {
      const resolvedJobId = jobId || job?.id;

      if (!resolvedJobId) {
        throw new Error('No active job selected');
      }

      const result = await completeJob(resolvedJobId, notes.trim());
      setIsCompleted(true);
      // Navigate to job-completed screen after 1.5 seconds
      setTimeout(() => {
        router.replace({
          pathname: '/(worker)/job-completed',
          params: { 
            jobId: resolvedJobId,
            earnings: Math.floor(job.budget * 0.9),
          },
        });
      }, 1500);
    } catch (error: any) {
      Alert.alert('Error', error?.message || 'Failed to complete job');
      setCompleting(false);
    }
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
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
        <View style={styles.loadingContainer}>
          <Text style={styles.errorText}>No active job found</Text>
          <Button
            label="View Available Jobs"
            onPress={() => router.replace('/(worker)/available-jobs')}
            size="large"
          />
        </View>
      </SafeAreaView>
    );
  }

  if (isCompleted) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.completionContainer}>
          <Text style={styles.completionIcon}>✅</Text>
          <Text style={styles.completionTitle}>Job Completed Successfully!</Text>
          <Text style={styles.completionSubtitle}>
            Great work! Your earnings will be added to your wallet.
          </Text>
          <ActivityIndicator size="small" color={colors.primary} style={styles.completionSpinner} />
          <Text style={styles.completionNote}>Redirecting to dashboard...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>In Progress</Text>
        <Text style={styles.timerText}>{formatTime(elapsedSeconds)}</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Card style={styles.statusCard}>
          <View style={styles.statusRow}>
            <Animated.View
              style={[
                styles.pulseIndicator,
                {
                  transform: [{ scale: pulseAnim }],
                },
              ]}
            >
              <View style={styles.statusDot} />
            </Animated.View>
            <View>
              <Text style={styles.statusLabel}>Status</Text>
              <Text style={styles.statusValue}>Working on {job.title}</Text>
            </View>
          </View>
        </Card>

        <Card>
          <Text style={styles.sectionTitle}>Job Details</Text>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Title</Text>
            <Text style={styles.detailValue}>{job.title}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Category</Text>
            <Text style={styles.detailValue}>{job.category}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Budget</Text>
            <Text style={styles.detailValue}>Rs. {job.budget}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Location</Text>
            <Text style={styles.detailValue}>{job.location}</Text>
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
              <Text style={styles.customerPhone}>📞 +91 98765 43210</Text>
            </View>
          </View>
          <View style={styles.contactButtons}>
            <TouchableOpacity style={styles.contactButton}>
              <Text style={styles.contactButtonIcon}>📞</Text>
              <Text style={styles.contactButtonText}>Call</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.contactButton}>
              <Text style={styles.contactButtonIcon}>💬</Text>
              <Text style={styles.contactButtonText}>Message</Text>
            </TouchableOpacity>
          </View>
        </Card>

        <Card>
          <Text style={styles.sectionTitle}>Work Notes</Text>
          <TextInput
            style={styles.notesInput}
            placeholder="Describe the work completed..."
            placeholderTextColor={colors.textSecondary}
            value={notes}
            onChangeText={setNotes}
            multiline
            numberOfLines={4}
          />
          <Text style={styles.charCount}>
            {notes.length}/200 characters
          </Text>
        </Card>

        <Card style={styles.earningsCard}>
          <Text style={styles.sectionTitle}>Earnings</Text>
          <View style={styles.earningsRow}>
            <Text style={styles.earningsLabel}>For this job:</Text>
            <Text style={styles.earningsAmount}>Rs. {job.budget}</Text>
          </View>
          <View style={styles.earningsRow}>
            <Text style={styles.earningsLabel}>App fee (10%):</Text>
            <Text style={styles.earningsAmount}>-Rs. {Math.floor(job.budget * 0.1)}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.earningsRow}>
            <Text style={styles.earningsTotal}>You'll receive:</Text>
            <Text style={styles.earningsFinal}>Rs. {Math.floor(job.budget * 0.9)}</Text>
          </View>
        </Card>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          label={completing ? "Completing..." : "Mark as Complete"}
          onPress={handleCompleteJob}
          variant="primary"
          size="large"
          disabled={completing}
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
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.grayLight,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  timerText: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.primary,
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  statusCard: {
    marginBottom: 16,
    backgroundColor: '#E8F5E9',
    borderWidth: 1,
    borderColor: colors.success,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pulseIndicator: {
    marginRight: 12,
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.success,
  },
  statusLabel: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  statusValue: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 12,
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
    marginBottom: 16,
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
  customerPhone: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  contactButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  contactButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    gap: 6,
  },
  contactButtonIcon: {
    fontSize: 16,
  },
  contactButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.text,
  },
  notesInput: {
    borderWidth: 1,
    borderColor: colors.grayLight,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: colors.white,
    color: colors.text,
    minHeight: 100,
    textAlignVertical: 'top',
    marginBottom: 6,
  },
  charCount: {
    fontSize: 11,
    color: colors.textSecondary,
    textAlign: 'right',
  },
  earningsCard: {
    backgroundColor: '#FFF3E0',
    borderWidth: 1,
    borderColor: colors.accent,
  },
  earningsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  earningsLabel: {
    fontSize: 13,
    color: colors.text,
  },
  earningsAmount: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text,
  },
  earningsTotal: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
  },
  earningsFinal: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primary,
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  completionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  completionIcon: {
    fontSize: 60,
    marginBottom: 16,
  },
  completionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  completionSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 32,
    textAlign: 'center',
  },
  completionSpinner: {
    marginBottom: 16,
  },
  completionNote: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  completionButton: {
    width: '100%',
  },
});
