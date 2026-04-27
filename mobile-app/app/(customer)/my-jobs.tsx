import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { colors } from '@/constants/colors';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { getMyJobs, JobItem } from '@/src/services/jobService';

const getStatusDisplay = (status: string) => {
  switch (status) {
    case 'pending':
      return 'Pending';
    case 'accepted':
      return 'Accepted';
    case 'in_progress':
      return 'In Progress';
    case 'completed':
      return 'Completed';
    case 'paid':
      return 'Paid';
    default:
      return 'Unknown';
  }
};

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'pending':
      return { backgroundColor: '#FFF8E1', color: '#FF9800' };
    case 'accepted':
      return { backgroundColor: '#E8F5E9', color: '#388E3C' };
    case 'in_progress':
      return { backgroundColor: '#E3F2FD', color: '#1976D2' };
    case 'completed':
      return { backgroundColor: '#F3E5F5', color: '#8E24AA' };
    case 'paid':
      return { backgroundColor: '#E8F5E9', color: '#2E7D32' };
    default:
      return { backgroundColor: colors.grayLight, color: colors.text }; 
  }
};

export default function MyJobsScreen() {
  const router = useRouter();
  const [jobs, setJobs] = useState<JobItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Refresh when screen is focused (e.g., after posting a job)
  useFocusEffect(
    React.useCallback(() => {
      console.log('👀 MyJobsScreen: Screen focused, fetching jobs...');
      fetchJobs();
    }, [])
  );

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const data = await getMyJobs();
      console.log(`✅ MyJobsScreen: Got ${data.length} jobs`);
      setJobs(data);
    } catch (error: any) {
      console.error('❌ MyJobsScreen: Failed to load jobs', error);
      Alert.alert('Error', error?.message || 'Unable to load your jobs.');
    } finally {
      setLoading(false);
    }
  };

  const pendingJobs = jobs.filter((job) => job.status === 'pending');
  const inProgressJobs = jobs.filter((job) => job.status === 'accepted' || job.status === 'in_progress');
  const completedJobs = jobs.filter((job) => job.status === 'completed' || job.status === 'paid');

  const renderJobCard = ({ item }: { item: JobItem }) => {
    const badgeStyle = getStatusBadge(item.status);

    return (
      <Card style={styles.jobCard}>
        <View style={styles.cardHeader}>
          <View style={styles.cardTitleContainer}>
            <Text style={styles.jobTitle}>{item.title}</Text>
            <Text style={styles.jobCategory}>{item.category}</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: badgeStyle.backgroundColor }]}>
            <Text style={[styles.statusBadgeText, { color: badgeStyle.color }]}> {getStatusDisplay(item.status)} </Text>
          </View>
        </View>

        <Text style={styles.jobDescription} numberOfLines={2}>{item.description}</Text>

        <View style={styles.jobMetaRow}>
          <Text style={styles.jobMetaLabel}>Location</Text>
          <Text style={styles.jobMetaValue}>{item.location}</Text>
        </View>
        <View style={styles.jobMetaRow}>
          <Text style={styles.jobMetaLabel}>Budget</Text>
          <Text style={styles.jobMetaValue}>Rs. {item.budget}</Text>
        </View>

        <View style={styles.jobMetaRow}>
          <Text style={styles.jobMetaLabel}>Applications</Text>
          <Text style={styles.jobMetaValue}>{item.applicationCount}</Text>
        </View>
      </Card>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading your jobs...</Text>
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
        <View style={styles.titleContainer}>
          <Text style={styles.title}>My Jobs</Text>
          <Text style={styles.subtitle}>Track your posted requests</Text>
        </View>
        <TouchableOpacity onPress={fetchJobs}>
          <Text style={styles.refreshText}>Refresh</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.summaryRow}>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryNumber}>{pendingJobs.length}</Text>
            <Text style={styles.summaryLabel}>Pending</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryNumber}>{inProgressJobs.length}</Text>
            <Text style={styles.summaryLabel}>In Progress</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryNumber}>{completedJobs.length}</Text>
            <Text style={styles.summaryLabel}>Completed</Text>
          </View>
        </View>

        {jobs.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>📭</Text>
            <Text style={styles.emptyText}>No jobs posted yet.</Text>
            <Text style={styles.emptySubtext}>Post a job and track it here.</Text>
          </View>
        ) : (
          <FlatList
            data={jobs}
            keyExtractor={(item) => item.id}
            renderItem={renderJobCard}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 12,
  },
  backButton: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: '600',
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
  },
  subtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  refreshText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: colors.white,
    padding: 16,
    borderRadius: 16,
    marginHorizontal: 4,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  summaryNumber: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
  },
  summaryLabel: {
    marginTop: 6,
    fontSize: 12,
    color: colors.textSecondary,
  },
  listContent: {
    paddingBottom: 20,
  },
  jobCard: {
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  cardTitleContainer: {
    flex: 1,
    marginRight: 10,
  },
  jobTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  jobCategory: {
    marginTop: 6,
    fontSize: 12,
    color: colors.textSecondary,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 14,
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  jobDescription: {
    fontSize: 13,
    lineHeight: 20,
    color: colors.textSecondary,
    marginBottom: 12,
  },
  jobMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  jobMetaLabel: {
    color: colors.textSecondary,
    fontSize: 12,
  },
  jobMetaValue: {
    color: colors.text,
    fontSize: 12,
    fontWeight: '600',
  },
  jobFooter: {
    marginTop: 14,
    alignItems: 'flex-end',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 14,
    color: colors.textSecondary,
    fontSize: 14,
  },
  emptyContainer: {
    marginTop: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyIcon: {
    fontSize: 52,
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 6,
  },
  emptySubtext: {
    color: colors.textSecondary,
    fontSize: 13,
    textAlign: 'center',
    paddingHorizontal: 30,
  },
});
