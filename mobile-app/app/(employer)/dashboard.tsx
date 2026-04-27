import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { colors } from '@/constants/colors';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { getCategoryLabel } from '@/constants/jobCategories';
import { getMyJobs, JobItem, updateJobStatus } from '@/src/services/jobService';

export default function EmployerDashboardScreen() {
  const [jobs, setJobs] = useState<JobItem[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchEmployerJobs();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return '#FFF3E0';
      case 'accepted': return '#E8F5E9';
      case 'in_progress': return '#E3F2FD';
      case 'completed': return '#F3E5F5';
      case 'paid': return '#E8F5E9';
      default: return '#F5F5F5';
    }
  };

  const getStatusTextColor = (status: string) => {
    switch (status) {
      case 'pending': return '#FF9800';
      case 'accepted': return '#4CAF50';
      case 'in_progress': return '#2196F3';
      case 'completed': return '#9C27B0';
      case 'paid': return '#4CAF50';
      default: return colors.grayDark;
    }
  };

  const getStatusDisplay = (status: string) => {
    switch (status) {
      case 'pending': return '● Pending';
      case 'accepted': return '● Accepted';
      case 'in_progress': return '● In Progress';
      case 'completed': return '● Completed';
      case 'paid': return '● Paid';
      default: return '○ Unknown';
    }
  };

  const fetchEmployerJobs = async () => {
    try {
      setLoading(true);
      const data = await getMyJobs();
      setJobs(data);
    } catch (error: any) {
      Alert.alert('Error', error?.message || 'Unable to load your posted jobs.');
    } finally {
      setLoading(false);
    }
  };

  const handleViewApplicants = (jobId: string, jobTitle: string) => {
    router.push({
      pathname: '/(employer)/applicants',
      params: { jobId, jobTitle },
    });
  };

  const handleUpdateJobStatus = async (jobId: string, newStatus: 'accepted' | 'in_progress' | 'completed' | 'paid') => {
    try {
      await updateJobStatus(jobId, newStatus);
      Alert.alert('Success', 'Job status updated successfully!');
      fetchEmployerJobs(); // Refresh the list
    } catch (error: any) {
      Alert.alert('Error', error?.message || 'Unable to update job status.');
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading posted jobs...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const renderJobCard = ({ item }: { item: JobItem }) => (
    <Card>
      <View style={styles.jobHeader}>
        <View style={styles.jobTitleContainer}>
          <Text style={styles.jobTitle}>{item.title}</Text>
          <Text style={styles.jobCategory}>{getCategoryLabel(item.category)}</Text>
        </View>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: getStatusColor(item.status) },
          ]}
        >
          <Text
            style={[
              styles.statusText,
              { color: getStatusTextColor(item.status) },
            ]}
          >
            {getStatusDisplay(item.status)}
          </Text>
        </View>
      </View>

      <View style={styles.jobMeta}>
        <View style={styles.metaItem}>
          <Text style={styles.metaLabel}>Budget</Text>
          <Text style={styles.metaValue}>₹{item.budget}</Text>
        </View>
        <View style={styles.metaItem}>
          <Text style={styles.metaLabel}>Applicants</Text>
          <Text style={styles.metaValue}>{item.applicationCount ?? 0}</Text>
        </View>
        <View style={styles.metaItem}>
          <Text style={styles.metaLabel}>Status</Text>
          <Text style={styles.metaValue}>{item.status}</Text>
        </View>
      </View>

      <View style={styles.buttonContainer}>
        {item.status === 'pending' && (
          <TouchableOpacity
            style={styles.applicantsButton}
            onPress={() => handleViewApplicants(item.id, item.title)}
          >
            <Text style={styles.applicantsButtonText}>
              View {item.applicationCount ?? 0} Applicants →
            </Text>
          </TouchableOpacity>
        )}
        {item.status === 'accepted' && (
          <Button
            label="Mark as In Progress"
            onPress={() => handleUpdateJobStatus(item.id, 'in_progress')}
            variant="primary"
            size="small"
          />
        )}
        {item.status === 'in_progress' && (
          <Button
            label="Mark as Complete"
            onPress={() => handleUpdateJobStatus(item.id, 'completed')}
            variant="primary"
            size="small"
          />
        )}
        {item.status === 'completed' && (
          <Button
            label="Mark as Paid"
            onPress={() => handleUpdateJobStatus(item.id, 'paid')}
            variant="primary"
            size="small"
          />
        )}
      </View>
    </Card>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Dashboard</Text>
          <Text style={styles.subtitle}>Home Repairs Co</Text>
        </View>
        <TouchableOpacity
          style={styles.profileButton}
          onPress={() => router.push('/(employer)/profile')}
        >
          <Text style={styles.profileButtonText}>👤</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{jobs.length}</Text>
          <Text style={styles.statLabel}>Total Jobs</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>
            {jobs.reduce((sum, job) => sum + (job.applicationCount ?? 0), 0)}
          </Text>
          <Text style={styles.statLabel}>Total Applicants</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>
            {jobs.filter((j) => j.status === 'pending').length}
          </Text>
          <Text style={styles.statLabel}>Active</Text>
        </View>
      </View>

      <View style={styles.listHeader}>
        <Text style={styles.listTitle}>Posted Jobs</Text>
        <Button
          label="+ New Job"
          onPress={() => router.push('/(employer)/post-job')}
          size="small"
        />
      </View>

      <FlatList
        data={jobs}
        keyExtractor={(item) => item.id}
        renderItem={renderJobCard}
        contentContainerStyle={styles.listContent}
        scrollIndicatorInsets={{ right: 1 }}
      />
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
  subtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  profileButtonText: {
    fontSize: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  listTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  jobHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  jobTitleContainer: {
    flex: 1,
    marginRight: 8,
  },
  jobTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  jobCategory: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  jobMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.border,
    marginBottom: 12,
  },
  metaItem: {
    flex: 1,
    alignItems: 'center',
  },
  metaLabel: {
    fontSize: 11,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  metaValue: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  applicantsButton: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: colors.primary,
    borderRadius: 6,
    alignItems: 'center',
  },
  applicantsButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.white,
  },
  buttonContainer: {
    marginTop: 12,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
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
