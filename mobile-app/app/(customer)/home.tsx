import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useFocusEffect } from 'expo-router';
import { colors } from '@/constants/colors';
import { Card } from '@/components/Card';
import { getMe, UserProfile, getRecommendedWorkers, RecommendedWorker } from '@/src/services/userService';

const CATEGORIES = [
  { id: '1', name: 'Electrical', icon: '⚡' },
  { id: '2', name: 'Plumbing', icon: '🔧' },
  { id: '3', name: 'Painting', icon: '🎨' },
  { id: '4', name: 'Carpentry', icon: '🪵' },
  { id: '5', name: 'Repair', icon: '❄️' },
];

export default function CustomerHomeScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [user, setUser] = useState<UserProfile | null>(null);
  const [recommendedWorkers, setRecommendedWorkers] = useState<RecommendedWorker[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useFocusEffect(
    React.useCallback(() => {
      loadHomeData();
    }, []),
  );

  const loadHomeData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch user profile
      const userData = await getMe();
      setUser(userData);

      // Fetch recommended workers (using Electrician as default category)
      const workers = await getRecommendedWorkers('Electrician', userData.location || 'Lahore');
      setRecommendedWorkers(workers);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load home data';
      console.error('❌ Home Error:', err);
      // Don't set error state - show cached data or continue with empty state
      setRecommendedWorkers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryPress = (categoryName: string) => {
    router.push({
      pathname: '/(customer)/category',
      params: { category: categoryName },
    });
  };

  const handleWorkerPress = (workerId: string) => {
    const selected = recommendedWorkers.find((worker) => worker.name === workerId);
    router.push({
      pathname: '/(customer)/ai-match',
      params: {
        category: selected?.skills?.[0] || 'Electrical',
        location: user?.location || 'Lahore',
        description: searchQuery || '',
      },
    });
  };

  const handleAISuggestions = () => {
    router.push({
      pathname: '/(customer)/ai-match',
      params: {
        category: 'Electrical',
        location: user?.location || 'Lahore',
        description: searchQuery || '',
      },
    });
  };

  const handleProfilePress = () => {
    router.push('/(customer)/profile');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Hi, {user?.name || 'Customer'}! 👋</Text>
            <Text style={styles.location}>📍 {user?.location || 'DHA Lahore, Lahore'}</Text>
          </View>
          <TouchableOpacity style={styles.profileButton} onPress={handleProfilePress}>
            <Text style={styles.profileIcon}>👤</Text>
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search services..."
            placeholderTextColor={colors.grayDark}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <Text style={styles.searchIcon}>🔍</Text>
        </View>

        {/* Quick Access Buttons */}
        <View style={styles.quickAccessContainer}>
          <TouchableOpacity style={styles.quickButton} onPress={() => Alert.alert('Info', 'Fair price mode enabled for suggestions')}>
            <Text style={styles.quickButtonIcon}>🎯</Text>
            <Text style={styles.quickButtonText}>Fair Price</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickButton} onPress={() => Alert.alert('Info', 'Showing top-rated workers in AI suggestions')}>
            <Text style={styles.quickButtonIcon}>⭐</Text>
            <Text style={styles.quickButtonText}>Top Rated</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickButton} onPress={() => Alert.alert('Info', 'Urgent filtering is available in AI suggestions')}>
            <Text style={styles.quickButtonIcon}>🚀</Text>
            <Text style={styles.quickButtonText}>Urgent</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickButton} onPress={handleAISuggestions}>
            <Text style={styles.quickButtonIcon}>🤖</Text>
            <Text style={styles.quickButtonText}>AI Suggest</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickButton} onPress={() => router.push('/(customer)/post-job')}>
            <Text style={styles.quickButtonIcon}>➕</Text>
            <Text style={styles.quickButtonText}>Post Job</Text>
          </TouchableOpacity>
        </View>

        {/* AI Recommendations */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>✨ Recommended For You</Text>
            <TouchableOpacity onPress={handleAISuggestions}>
              <Text style={styles.seeAll}>See all</Text>
            </TouchableOpacity>
          </View>

          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color={colors.primary} />
            </View>
          ) : recommendedWorkers.length > 0 ? (
            <FlatList
              data={recommendedWorkers}
              keyExtractor={(item, idx) => `${item.name}-${idx}`}
              horizontal
              showsHorizontalScrollIndicator={false}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.recommendationCard}
                  onPress={() => handleWorkerPress(`${item.name}`)}
                >
                  <View style={styles.recommendationImageBox}>
                    <Text style={styles.workerInitial}>
                      {item.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')}
                    </Text>
                  </View>
                  <Text style={styles.recommendationName} numberOfLines={1}>
                    {item.name}
                  </Text>
                  <View style={styles.ratingBadge}>
                    <Text style={styles.rating}>⭐ {item.rating.toFixed(1)}</Text>
                  </View>
                  <Text style={styles.recommendationCategory} numberOfLines={1}>
                    {item.skills?.[0] || 'Services'}
                  </Text>
                  <Text style={styles.recommendationPrice}>Score: {item.score.toFixed(1)}</Text>
                </TouchableOpacity>
              )}
              contentContainerStyle={styles.recommendationsList}
            />
          ) : (
            <View style={styles.emptyRecommendations}>
              <Text style={styles.emptyText}>No recommendations available</Text>
            </View>
          )}
        </View>

        {/* Categories Grid */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Browse Services</Text>
          </View>

          <View style={styles.categoriesGrid}>
            {CATEGORIES.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={styles.categoryCard}
                onPress={() => handleCategoryPress(category.name)}
              >
                <View style={styles.categoryIconBox}>
                  <Text style={styles.categoryIcon}>{category.icon}</Text>
                </View>
                <Text style={styles.categoryName}>{category.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* How It Works */}
        <Card style={styles.howItWorksCard}>
          <Text style={styles.howItWorksTitle}>How It Works</Text>
          <View style={styles.stepContainer}>
            <View style={styles.step}>
              <Text style={styles.stepNumber}>1</Text>
              <Text style={styles.stepText}>Choose a service</Text>
            </View>
            <View style={styles.step}>
              <Text style={styles.stepNumber}>2</Text>
              <Text style={styles.stepText}>Find a worker</Text>
            </View>
            <View style={styles.step}>
              <Text style={styles.stepNumber}>3</Text>
              <Text style={styles.stepText}>Book & pay safely</Text>
            </View>
          </View>
        </Card>

        {/* Promo Banner */}
        <Card style={styles.promoBanner}>
          <Text style={styles.promoTitle}>🎉 Special Offer</Text>
          <Text style={styles.promoText}>Get 20% off on your first booking</Text>
          <TouchableOpacity style={styles.promoButton}>
            <Text style={styles.promoButtonText}>Claim Offer</Text>
          </TouchableOpacity>
        </Card>
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
  },
  greeting: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
  },
  location: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
  },
  profileButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  profileIcon: {
    fontSize: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    backgroundColor: colors.white,
    color: colors.text,
  },
  searchIcon: {
    fontSize: 18,
    marginLeft: 12,
  },
  quickAccessContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 24,
    gap: 10,
  },
  quickButton: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.grayLight,
  },
  quickButtonIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  quickButtonText: {
    fontSize: 11,
    color: colors.text,
    fontWeight: '500',
    textAlign: 'center',
  },
  sectionContainer: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  seeAll: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '600',
  },
  loadingContainer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyRecommendations: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  recommendationsList: {
    paddingHorizontal: 20,
    gap: 12,
  },
  recommendationCard: {
    width: 120,
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  recommendationImageBox: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  workerInitial: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.white,
  },
  recommendationName: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  ratingBadge: {
    backgroundColor: '#FFF3E0',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginBottom: 4,
  },
  rating: {
    fontSize: 11,
    color: colors.text,
    fontWeight: '600',
  },
  recommendationCategory: {
    fontSize: 11,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  recommendationPrice: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    gap: 12,
  },
  categoryCard: {
    width: '30%',
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
  categoryIconBox: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryIcon: {
    fontSize: 28,
  },
  categoryName: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
  },
  howItWorksCard: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  howItWorksTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
  },
  stepContainer: {
    flexDirection: 'row',
    gap: 16,
  },
  step: {
    flex: 1,
    alignItems: 'center',
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary,
    color: colors.white,
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 32,
    marginBottom: 8,
  },
  stepText: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  promoBanner: {
    marginHorizontal: 20,
    marginBottom: 24,
    backgroundColor: '#E8F5E9',
    borderWidth: 1,
    borderColor: colors.success,
  },
  promoTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  promoText: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 12,
  },
  promoButton: {
    backgroundColor: colors.success,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignItems: 'center',
  },
  promoButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.white,
  },
});
