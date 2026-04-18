import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { colors } from '@/constants/colors';
import { Card } from '@/components/Card';
import { getWorkersByCategory } from '@/src/data';
import { Worker } from '@/src/types';

export default function AIMatchScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const category = params.category as string || 'Painter';
  const location = params.location as string || 'DHA Lahore';

  const [loading, setLoading] = useState(false);
  
  // Get workers in this category (sorted by rating)
  const workers = useMemo(() => {
    const categoryWorkers = getWorkersByCategory(category);
    return categoryWorkers.sort((a, b) => b.rating - a.rating);
  }, [category]);

  const handleSelectWorker = (worker: Worker) => {
    router.push({
      pathname: '/(customer)/service-details',
      params: {
        workerId: worker.id,
      },
    });
  };

  const renderWorker = ({ item, index }: { item: Worker; index: number }) => {
    const isTop = index === 0;
    const badges = [];
    if (item.rating >= 4.5) badges.push('Top Rated');
    badges.push(item.distance);
    if (item.reviews > 50) badges.push('Highly Reviewed');

    return (
      <Card style={styles.workerCard}>
        {isTop && <View style={styles.bestMatchBadge}><Text style={styles.bestMatchText}>🌟 Best Match</Text></View>}
        
        <View style={styles.workerProfile}>
          <View style={styles.workerAvatar}>
            <Text style={styles.avatarText}>
              {item.name
                .split(' ')
                .map((n) => n[0])
                .join('')}
            </Text>
          </View>
          <View style={styles.workerInfo}>
            <Text style={styles.workerName}>{item.name}</Text>
            <Text style={styles.workerCategory}>{item.category}</Text>
            <View style={styles.ratingContainer}>
              <Text style={styles.rating}>⭐ {item.rating.toFixed(1)}</Text>
              <Text style={styles.reviews}>({item.reviews} reviews)</Text>
            </View>
          </View>
        </View>

        <View style={styles.badgesContainer}>
          {badges.map((badge, idx) => (
            <View key={idx} style={styles.badge}>
              <Text style={styles.badgeText}>{badge}</Text>
            </View>
          ))}
        </View>

        <View style={styles.priceRow}>
          <Text style={styles.priceLabel}>Rs. {item.price}/hour</Text>
          <TouchableOpacity 
            style={styles.selectButton}
            onPress={() => handleSelectWorker(item)}
          >
            <Text style={styles.selectButtonText}>Select →</Text>
          </TouchableOpacity>
        </View>
      </Card>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Finding the best workers for you...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Recommended Workers</Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backButton}>✕</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.subtitleContainer}>
        <Text style={styles.subtitle}>AI found the best workers near you</Text>
      </View>

      <FlatList
        data={workers}
        keyExtractor={(item) => item.id}
        renderItem={renderWorker}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
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
    borderBottomWidth: 1,
    borderBottomColor: colors.grayLight,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
  },
  backButton: {
    fontSize: 24,
    color: colors.text,
  },
  subtitleContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#F0F7FF',
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    fontWeight: '500',
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
  listContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  workerCard: {
    marginBottom: 16,
  },
  bestMatchBadge: {
    position: 'absolute',
    top: -8,
    right: 16,
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    zIndex: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  bestMatchText: {
    color: colors.white,
    fontSize: 13,
    fontWeight: '700',
  },
  workerProfile: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  workerAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.white,
  },
  workerInfo: {
    flex: 1,
  },
  workerName: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 2,
  },
  workerCategory: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primary,
    marginRight: 4,
  },
  reviews: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  badgesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  badge: {
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 11,
    color: colors.primary,
    fontWeight: '600',
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primary,
  },
  selectButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  selectButtonText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '600',
  },
});
