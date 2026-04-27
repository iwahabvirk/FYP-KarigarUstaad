import React, { useEffect, useState } from 'react';
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
import { Button } from '@/components/Button';
import { getWorkerProfile, WorkerProfile } from '@/src/services/userService';

type Params = {
  workerId?: string;
};

export default function EmployerWorkerProfileScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<Params>();
  const workerId = params.workerId as string | undefined;
  const [worker, setWorker] = useState<WorkerProfile | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (workerId) {
      loadWorkerProfile();
    }
  }, [workerId]);

  const loadWorkerProfile = async () => {
    try {
      setLoading(true);
      const data = await getWorkerProfile(workerId!);
      setWorker(data);
    } catch (error: any) {
      Alert.alert('Error', error?.message || 'Unable to load worker profile.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading worker profile...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!worker) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>Worker not found</Text>
          <Button
            label="Go Back"
            onPress={() => router.back()}
            variant="primary"
            size="medium"
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Worker Profile</Text>
        <View style={{ width: 50 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Card>
          <View style={styles.profileHeader}>
            <View style={styles.avatarContainer}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {worker.name
                    .split(' ')
                    .map((n: string) => n[0])
                    .join('')}
                </Text>
              </View>
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.name}>{worker.name}</Text>
              <Text style={styles.role}>Worker</Text>
              <View style={styles.ratingContainer}>
                <Text style={styles.ratingStars}>
                  {'★'.repeat(Math.floor(worker.rating || 0)) + '☆'.repeat(5 - Math.floor(worker.rating || 0))}
                </Text>
                <Text style={styles.rating}>
                  {worker.rating?.toFixed(1) || '0.0'} ({worker.totalReviews || 0} reviews)
                </Text>
              </View>
            </View>
          </View>
        </Card>

        <Card>
          <Text style={styles.sectionTitle}>About</Text>
          <Text style={styles.sectionValue}>
            {worker.experience || 'No experience information available.'}
          </Text>
        </Card>

        <Card>
          <Text style={styles.sectionTitle}>Skills</Text>
          <View style={styles.skillsContainer}>
            {worker.skills?.map((skill, index) => (
              <View key={index} style={styles.skillTag}>
                <Text style={styles.skillText}>{skill}</Text>
              </View>
            )) || <Text style={styles.sectionValue}>No skills listed</Text>}
          </View>
        </Card>

        <Card>
          <Text style={styles.sectionTitle}>Completed Jobs</Text>
          <Text style={styles.statsNumber}>{worker.completedJobs || 0}</Text>
        </Card>

        {worker.reviews && worker.reviews.length > 0 && (
          <Card>
            <Text style={styles.sectionTitle}>Reviews</Text>
            {worker.reviews.map((review, index) => (
              <View key={index} style={styles.reviewItem}>
                <View style={styles.reviewHeader}>
                  <Text style={styles.reviewAuthor}>{review.customer.name}</Text>
                  <Text style={styles.reviewRating}>
                    {'★'.repeat(review.rating) + '☆'.repeat(5 - review.rating)}
                  </Text>
                </View>
                <Text style={styles.reviewJob}>{review.job.title}</Text>
                <Text style={styles.reviewComment}>{review.comment}</Text>
                <Text style={styles.reviewDate}>
                  {new Date(review.createdAt).toLocaleDateString()}
                </Text>
              </View>
            ))}
          </Card>
        )}

        <View style={styles.buttonContainer}>
          <Button
            label="Contact Worker"
            onPress={() => {}}
            variant="primary"
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
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: '500',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  scrollContent: {
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: colors.textSecondary,
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 20,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    marginRight: 16,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.white,
  },
  profileInfo: {
    flex: 1,
  },
  name: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  role: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingStars: {
    fontSize: 14,
    color: colors.success,
    marginRight: 8,
  },
  rating: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  sectionValue: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  skillTag: {
    backgroundColor: colors.accent,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  skillText: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.white,
  },
  statsNumber: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.primary,
  },
  reviewItem: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  reviewAuthor: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  reviewRating: {
    fontSize: 12,
    color: colors.success,
  },
  reviewJob: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  reviewComment: {
    fontSize: 14,
    color: colors.text,
    marginBottom: 4,
  },
  reviewDate: {
    fontSize: 12,
    color: colors.grayDark,
  },
  buttonContainer: {
    marginTop: 16,
    marginBottom: 24,
  },
});