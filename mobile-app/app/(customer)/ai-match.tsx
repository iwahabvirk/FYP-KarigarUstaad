import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { colors } from '@/constants/colors';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { dummyWorkers } from '@/src/data';

export default function AIMatchScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const workerId = params.workerId as string;
  const addressId = params.addressId as string;

  const selectedWorker = dummyWorkers.find((w) => w.id === workerId);
  const recommendations = dummyWorkers.slice(0, 3);

  const handleSelectWorker = () => {
    router.push({
      pathname: '/(customer)/booking-summary',
      params: { workerId, addressId },
    });
  };

  const renderRecommendation = ({ item }: { item: (typeof dummyWorkers)[0] }) => (
    <Card style={styles.recommendationCard}>
      <View style={styles.recommendationContent}>
        <View style={styles.recommendationHeader}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {item.name
                .split(' ')
                .map((n) => n[0])
                .join('')}
            </Text>
          </View>
          <View style={styles.recommendationInfo}>
            <Text style={styles.recommendationName}>{item.name}</Text>
            <Text style={styles.recommendationCategory}>{item.category}</Text>
          </View>
          {item.id === workerId && (
            <View style={styles.selectedBadge}>
              <Text style={styles.selectedBadgeText}>✓ Selected</Text>
            </View>
          )}
        </View>
        <View style={styles.recommendationFooter}>
          <View style={styles.ratingBadge}>
            <Text style={styles.rating}>⭐ {item.rating}</Text>
          </View>
          <Text style={styles.price}>Rs. {item.price}</Text>
        </View>
      </View>
    </Card>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>AI Recommendations</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Card style={styles.aiCard}>
          <View style={styles.aiHeader}>
            <Text style={styles.aiIcon}>🤖</Text>
            <Text style={styles.aiTitle}>Smart Matching</Text>
          </View>
          <Text style={styles.aiDescription}>
            We've analyzed worker ratings, availability, and expertise to find the best match for you.
          </Text>
        </Card>

        {selectedWorker && (
          <Card style={styles.selectedWorkerCard}>
            <View style={styles.selectedWorkerBadge}>
              <Text style={styles.bestMatchText}>✨ Best Match</Text>
            </View>
            <View style={styles.selectedWorkerContent}>
              <View style={styles.largeAvatar}>
                <Text style={styles.avatarTextLarge}>
                  {selectedWorker.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')}
                </Text>
              </View>
              <View style={styles.selectedWorkerInfo}>
                <Text style={styles.selectedWorkerName}>{selectedWorker.name}</Text>
                <Text style={styles.selectedWorkerCategory}>
                  {selectedWorker.category}
                </Text>
                <View style={styles.selectedWorkerStats}>
                  <Text style={styles.selectedWorkerRating}>
                    ⭐ {selectedWorker.rating} ({selectedWorker.reviews} reviews)
                  </Text>
                  <Text style={styles.selectedWorkerDistance}>
                    📍 {selectedWorker.distance}
                  </Text>
                </View>
              </View>
            </View>
            <Text style={styles.matchReasonTitle}>Why this worker?</Text>
            <Text style={styles.matchReason}>
              ✓ Highest rated in your area{'\n'}
              ✓ {selectedWorker.reviews}+ verified reviews{'\n'}
              ✓ Average response time: 5 mins
            </Text>
          </Card>
        )}

        <View style={styles.alternativesContainer}>
          <Text style={styles.alternativesTitle}>Other Options</Text>
          <FlatList
            data={recommendations.filter((w) => w.id !== workerId)}
            keyExtractor={(item) => item.id}
            renderItem={renderRecommendation}
            scrollEnabled={false}
          />
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          label="Proceed with Booking"
          onPress={handleSelectWorker}
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
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  aiCard: {
    marginBottom: 20,
    backgroundColor: '#F3E5F5',
  },
  aiHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  aiIcon: {
    fontSize: 24,
    marginRight: 8,
  },
  aiTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  aiDescription: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  selectedWorkerCard: {
    marginBottom: 24,
    backgroundColor: '#E8F5E9',
    borderWidth: 2,
    borderColor: colors.success,
  },
  selectedWorkerBadge: {
    marginBottom: 16,
  },
  bestMatchText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.success,
  },
  selectedWorkerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  largeAvatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarTextLarge: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.white,
  },
  selectedWorkerInfo: {
    flex: 1,
  },
  selectedWorkerName: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  selectedWorkerCategory: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  selectedWorkerStats: {
    gap: 4,
  },
  selectedWorkerRating: {
    fontSize: 12,
    color: colors.text,
  },
  selectedWorkerDistance: {
    fontSize: 12,
    color: colors.text,
  },
  matchReasonTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  matchReason: {
    fontSize: 12,
    color: colors.text,
    lineHeight: 18,
  },
  alternativesContainer: {
    marginBottom: 40,
  },
  alternativesTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 12,
  },
  recommendationCard: {
    marginBottom: 12,
  },
  recommendationContent: {
    flex: 1,
  },
  recommendationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.white,
  },
  recommendationInfo: {
    flex: 1,
  },
  recommendationName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  recommendationCategory: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  selectedBadge: {
    backgroundColor: colors.success,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  selectedBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.white,
  },
  recommendationFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontSize: 12,
    fontWeight: '600',
  },
  price: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primary,
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
});
