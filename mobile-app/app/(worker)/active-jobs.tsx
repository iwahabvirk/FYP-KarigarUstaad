import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { colors } from '@/constants/colors';
import { Card } from '@/components/Card';
import { getWorkerJobs, JobItem } from '@/src/services/jobService';

export default function ActiveJobsScreen() {
  const router = useRouter();
  const [jobs, setJobs] = useState<JobItem[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      loadJobs();
    }, []),
  );

  const loadJobs = async () => {
    try {
      setLoading(true);
      const data = await getWorkerJobs();
      const active = data.filter((job) => job.status === 'accepted' || job.status === 'in_progress');
      setJobs(active);
    } catch (error: any) {
      Alert.alert('Error', error?.message || 'Unable to load active jobs');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.back}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Active Jobs</Text>
        <View style={{ width: 50 }} />
      </View>

      <FlatList
        data={jobs}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<Text style={styles.empty}>No active jobs right now.</Text>}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() =>
              router.push({
                pathname: '/(worker)/in-progress',
                params: { jobId: item.id },
              })
            }
          >
            <Card style={styles.card}>
              <Text style={styles.name}>{item.title}</Text>
              <Text style={styles.meta}>{item.location}</Text>
              <Text style={styles.status}>Status: {item.status}</Text>
              <Text style={styles.price}>Rs. {item.budget}</Text>
            </Card>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  back: { color: colors.primary, fontWeight: '600', fontSize: 16 },
  title: { fontSize: 20, fontWeight: '700', color: colors.text },
  list: { paddingHorizontal: 20, paddingBottom: 20 },
  card: { marginBottom: 12 },
  name: { fontSize: 16, fontWeight: '700', color: colors.text },
  meta: { marginTop: 4, fontSize: 12, color: colors.textSecondary },
  status: { marginTop: 8, fontSize: 12, color: colors.primary, fontWeight: '600' },
  price: { marginTop: 4, fontSize: 14, fontWeight: '700', color: colors.text },
  empty: { textAlign: 'center', color: colors.textSecondary, marginTop: 40 },
});
