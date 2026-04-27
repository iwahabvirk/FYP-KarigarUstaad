import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useFocusEffect } from 'expo-router';
import { colors } from '@/constants/colors';
import { Card } from '@/components/Card';
import { getCategoryLabel } from '@/constants/jobCategories';
import { getAllJobs, JobItem } from '@/src/services/jobService';

export default function AvailableJobsScreen() {
  const router = useRouter();
  const [jobs, setJobs] = useState<JobItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useFocusEffect(
    React.useCallback(() => {
      console.log('👀 AvailableJobsScreen: Screen focused, fetching jobs...');
      fetchAvailableJobs();
    }, [])
  );

  const fetchAvailableJobs = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllJobs();
      const availableJobs = data.filter((j) => j.status === 'pending');
      console.log(`✅ AvailableJobsScreen: Got ${availableJobs.length} available jobs`);
      setJobs(availableJobs);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load jobs';
      setError(errorMessage);
      console.error('❌ AvailableJobsScreen: Error', errorMessage);
      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleJobPress = (jobId: string) => {
    router.push({
      pathname: '/(worker)/job-details',
      params: { jobId },
    });
  };

  const renderJobCard = ({ item }: { item: JobItem }) => (
    <TouchableOpacity
      onPress={() => handleJobPress(item.id)}
      style={styles.jobCardContainer}
    >
      <Card>
        <View style={styles.jobCardHeader}>
          <View style={styles.jobTitleColumn}>
            <Text style={styles.jobTitle}>{item.title}</Text>
            <Text style={styles.jobCategory}>{getCategoryLabel(item.category)}</Text>
          </View>
          <Text style={styles.jobBudget}>Rs. {item.budget}</Text>
        </View>

        <Text style={styles.jobDescription} numberOfLines={2}>
          {item.description}
        </Text>

        <View style={styles.jobFooter}>
          <Text style={styles.jobLocation}>📍 {item.location}</Text>
          <View style={styles.difficultyBadge}>
            <Text style={styles.difficultyText}>Standard</Text>
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.backButton}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Available Jobs</Text>
          <TouchableOpacity>
            <Text style={styles.filterIcon}>⚙️</Text>
          </TouchableOpacity>
        </View>
        <View style={[styles.emptyContainer, { justifyContent: 'center' }]}>
          <ActivityIndicator size="large" color={colors.primary} />
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
        <Text style={styles.title}>Available Jobs</Text>
        <TouchableOpacity onPress={fetchAvailableJobs}>
          <Text style={styles.filterIcon}>🔄</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.filterContainer}>
        <TouchableOpacity style={styles.filterChip}>
          <Text style={styles.filterChipText}>All ({jobs.length})</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterChip}>
          <Text style={styles.filterChipText}>Near Me</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterChip}>
          <Text style={styles.filterChipText}>High Pay</Text>
        </TouchableOpacity>
      </View>

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity onPress={fetchAvailableJobs} style={styles.retryButton}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      )}

      {jobs.length > 0 ? (
        <FlatList
          data={jobs}
          keyExtractor={(item) => item.id}
          renderItem={renderJobCard}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>📭</Text>
          <Text style={styles.emptyText}>No jobs available right now</Text>
          <Text style={styles.emptySubtext}>Check back later or enable notifications</Text>
        </View>
      )}
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
  filterIcon: {
    fontSize: 18,
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 8,
  },
  filterChip: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  filterChipText: {
    fontSize: 12,
    color: colors.text,
    fontWeight: '500',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  jobCardContainer: {
    marginBottom: 12,
  },
  jobCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  jobTitleColumn: {
    flex: 1,
    marginRight: 8,
  },
  jobTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  jobCategory: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  jobBudget: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primary,
  },
  jobDescription: {
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 18,
    marginBottom: 10,
  },
  jobFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: colors.grayLight,
  },
  jobLocation: {
    fontSize: 12,
    color: colors.grayDark,
  },
  difficultyBadge: {
    backgroundColor: '#FFF3E0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  difficultyText: {
    fontSize: 11,
    color: '#FF9800',
    fontWeight: '600',
  },
  errorContainer: {
    backgroundColor: '#FFEBEE',
    borderLeftWidth: 4,
    borderLeftColor: '#D32F2F',
    paddingHorizontal: 20,
    paddingVertical: 12,
    marginHorizontal: 20,
    marginVertical: 12,
    borderRadius: 4,
  },
  errorText: {
    fontSize: 13,
    color: '#D32F2F',
    marginBottom: 8,
  },
  retryButton: {
    backgroundColor: '#D32F2F',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  retryButtonText: {
    fontSize: 12,
    color: 'white',
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 13,
    color: colors.textSecondary,
  },
});
