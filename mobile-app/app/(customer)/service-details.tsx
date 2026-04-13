import React, { useMemo } from 'react';
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
import { getWorkerById } from '@/src/data';

export default function ServiceDetailsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const workerId = params.workerId as string;
  const worker = useMemo(() => getWorkerById(workerId), [workerId]);

  if (!worker) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>Worker not found</Text>
      </SafeAreaView>
    );
  }

  const handleHireWorker = () => {
    Alert.alert('Booking Confirmed', `You selected ${worker.name}. Proceeding to address selection.`);
    router.push({
      pathname: '/(customer)/address-selector',
      params: { workerId: worker.id, workerName: worker.name },
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Service Details</Text>
        <TouchableOpacity>
          <Text style={styles.moreIcon}>⋯</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Card style={styles.profileCard}>
          <View style={styles.profileHeader}>
            <View style={styles.largeAvatar}>
              <Text style={styles.avatarText}>
                {worker.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')}
              </Text>
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.workerName}>{worker.name}</Text>
              <View style={styles.ratingBadge}>
                <Text style={styles.ratingStars}>⭐ {worker.rating}</Text>
                <Text style={styles.reviewCount}>({worker.reviews} reviews)</Text>
              </View>
              <Text style={styles.location}>{worker.distance} away</Text>
            </View>
          </View>
        </Card>

        <Card>
          <Text style={styles.sectionTitle}>About</Text>
          <Text style={styles.description}>{worker.description}</Text>
        </Card>

        <Card>
          <Text style={styles.sectionTitle}>Service Details</Text>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Category:</Text>
            <Text style={styles.detailValue}>{worker.category}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Hourly Rate:</Text>
            <Text style={styles.detailValue}>₹{worker.price}/hr</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Estimated Time:</Text>
            <Text style={styles.detailValue}>1-2 hours</Text>
          </View>
        </Card>

        <Card>
          <Text style={styles.sectionTitle}>Top Skills</Text>
          <View style={styles.skillsContainer}>
            <View style={styles.skillTag}>
              <Text style={styles.skillText}>Expert</Text>
            </View>
            <View style={styles.skillTag}>
              <Text style={styles.skillText}>Verified</Text>
            </View>
            <View style={styles.skillTag}>
              <Text style={styles.skillText}>Insured</Text>
            </View>
          </View>
        </Card>

        <Card>
          <Text style={styles.sectionTitle}>Recent Work</Text>
          <Text style={styles.recentWorkText}>
            ✓ Successfully completed 156+ projects
          </Text>
          <Text style={styles.recentWorkText}>
            ✓ Average rating: 4.7/5
          </Text>
          <Text style={styles.recentWorkText}>
            ✓ Member since 2019
          </Text>
        </Card>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          label={`Hire for ₹${worker.price}`}
          onPress={handleHireWorker}
          size="large"
          style={styles.hireButton}
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
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    flex: 1,
    textAlign: 'center',
  },
  moreIcon: {
    fontSize: 18,
    color: colors.grayDark,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  profileCard: {
    marginBottom: 16,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  largeAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.white,
  },
  profileInfo: {
    flex: 1,
  },
  workerName: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  ratingStars: {
    fontSize: 14,
    fontWeight: '600',
    marginRight: 4,
  },
  reviewCount: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  location: {
    fontSize: 12,
    color: colors.grayDark,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 12,
  },
  description: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
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
    marginVertical: 8,
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
    fontWeight: '600',
    color: colors.white,
  },
  recentWorkText: {
    fontSize: 13,
    color: colors.text,
    marginBottom: 8,
    lineHeight: 20,
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
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.grayLight,
  },
  hireButton: {
    marginBottom: 0,
  },
});
