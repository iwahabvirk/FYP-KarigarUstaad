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
import { useRouter, useLocalSearchParams } from 'expo-router';
import { colors } from '@/constants/colors';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { getApplicants, ApplicantItem, updateApplicationStatus } from '@/src/services/applicationService';

type Params = {
  jobId?: string;
  jobTitle?: string;
};

export default function ApplicantsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<Params>();
  const jobId = params.jobId as string | undefined;
  const jobTitle = params.jobTitle || 'Job';
  const [applicants, setApplicants] = useState<ApplicantItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (jobId) {
      fetchApplicants(jobId);
    }
  }, [jobId]);

  const fetchApplicants = async (selectedJobId: string) => {
    try {
      setLoading(true);
      const data = await getApplicants(selectedJobId);
      setApplicants(data);
    } catch (error: any) {
      Alert.alert('Error', error?.message || 'Unable to load applicants.');
    } finally {
      setLoading(false);
    }
  };

  const handleHire = async (applicationId: string, workerName: string) => {
    try {
      await updateApplicationStatus(applicationId, 'accepted');
      Alert.alert('Success!', `You hired ${workerName}!`, [{ text: 'OK' }]);
      // Refresh applicants
      if (jobId) {
        fetchApplicants(jobId);
      }
    } catch (error: any) {
      Alert.alert('Error', error?.message || 'Unable to hire worker.');
    }
  };

  const handleViewProfile = (workerId: string) => {
    router.push({
      pathname: '/(employer)/worker-profile',
      params: { workerId },
    });
  };

  const renderApplicant = ({ item }: { item: ApplicantItem }) => (
    <Card>
      <View style={styles.applicantHeader}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {item.worker.name
                .split(' ')
                .map((n: string) => n[0])
                .join('')}
            </Text>
          </View>
        </View>
        <View style={styles.applicantInfo}>
          <Text style={styles.applicantName}>{item.worker.name}</Text>
          <Text style={styles.applicantTitle}>Worker</Text>
          <View style={styles.ratingContainer}>
            <Text style={styles.stars}>
              {'★'.repeat(Math.floor(item.worker.rating || 0)) + '☆'.repeat(5 - Math.floor(item.worker.rating || 0))}
            </Text>
            <Text style={styles.rating}>
              {item.worker.rating?.toFixed(1) || '0.0'}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.skillsContainer}>
        <Text style={styles.skillsTitle}>Skills:</Text>
        <Text style={styles.skillsText}>
          {item.worker.skills?.join(', ') || 'No skills listed'}
        </Text>
      </View>

      <View style={styles.buttonContainer}>
        <Button
          label="Hire"
          onPress={() => handleHire(item.id, item.worker.name)}
          variant="primary"
          size="small"
          style={styles.hireButton}
        />
        <Button
          label="View Profile"
          onPress={() => handleViewProfile(item.worker.id)}
          variant="outline"
          size="small"
          style={styles.viewButton}
        />
      </View>
    </Card>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Applicants</Text>
          <Text style={styles.jobTitle}>{jobTitle}</Text>
        </View>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backButton}>✕</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.filterContainer}>
        <View style={styles.filterBadge}>
          <Text style={styles.filterText}>{applicants.length} Total</Text>
        </View>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading applicants...</Text>
        </View>
      ) : (
        <FlatList
          data={applicants}
          keyExtractor={(item) => item.id}
          renderItem={renderApplicant}
          contentContainerStyle={styles.listContent}
          scrollIndicatorInsets={{ right: 1 }}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No applicants found.</Text>
            </View>
          }
        />
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
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
  },
  jobTitle: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
  backButton: {
    fontSize: 24,
    color: colors.text,
  },
  filterContainer: {
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  filterBadge: {
    backgroundColor: colors.accent,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  filterText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.white,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  applicantHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarContainer: {
    marginRight: 12,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.white,
  },
  applicantInfo: {
    flex: 1,
  },
  applicantName: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
  },
  applicantTitle: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  stars: {
    fontSize: 12,
    marginRight: 6,
  },
  rating: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.border,
    marginBottom: 12,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 11,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  statValue: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  dividerVertical: {
    width: 1,
    backgroundColor: colors.border,
  },
  skillsContainer: {
    marginTop: 8,
  },
  skillsTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 4,
  },
  skillsText: {
    fontSize: 12,
    color: colors.text,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  hireButton: {
    flex: 1,
  },
  viewButton: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
  },
  loadingText: {
    marginTop: 12,
    color: colors.textSecondary,
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 40,
  },
  emptyText: {
    color: colors.textSecondary,
  },
});
