import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { colors } from '@/constants/colors';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { getAllServices, ServiceItem } from '@/src/services/serviceService';

export default function CategoryScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const category = params.category as string;
  const [userLocation] = React.useState('DHA Lahore');
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchServices();
  }, [category]);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const apiServices = await getAllServices(category);
      setServices(apiServices);
    } catch (error: any) {
      Alert.alert('Error', error?.message || 'Unable to load services');
    } finally {
      setLoading(false);
    }
  };

  // Navigate to AI recommendations for this category
  const handleNavigateToAI = () => {
    router.push({
      pathname: '/(customer)/ai-match',
      params: { category, location: userLocation },
    });
  };

  const handleWorkerSelect = (serviceId: string) => {
    router.push({
      pathname: '/(customer)/service-details',
      params: { serviceId },
    });
  };

  const renderWorkerCard = ({ item }: { item: ServiceItem }) => (
    <TouchableOpacity
      style={styles.workerCard}
      onPress={() => handleWorkerSelect(item.id)}
    >
      <Card>
        <View style={styles.cardContent}>
          <View style={styles.workerInfo}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {item.worker.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')}
              </Text>
            </View>
            <View style={styles.details}>
              <Text style={styles.name}>{item.worker.name}</Text>
              <View style={styles.ratingContainer}>
                <Text style={styles.stars}>
                  {'⭐'.repeat(Math.floor(item.worker.rating || 0))}
                </Text>
                <Text style={styles.ratingText}>{(item.worker.rating || 0).toFixed(1)}</Text>
              </View>
              <Text style={styles.distance}>{item.category}</Text>
            </View>
            <Text style={styles.price}>Rs. {item.price}</Text>
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>{category}</Text>
        <Text style={styles.filterIcon}>☰</Text>
      </View>

      {/* AI Recommendation Banner */}
      <Card style={styles.aiBanner}>
        <View style={styles.aiBannerContent}>
          <View style={styles.aiIconContainer}>
            <Text style={styles.aiIcon}>🤖</Text>
          </View>
          <View style={styles.aiBannerText}>
            <Text style={styles.aiBannerTitle}>Get AI Recommendations</Text>
            <Text style={styles.aiBannerSubtitle}>Find the best workers for your needs</Text>
          </View>
        </View>
        <Button
          label="View Recommended"
          onPress={handleNavigateToAI}
          size="small"
          style={styles.aiButton}
        />
      </Card>

      <View style={styles.divider} />

      {/* Manual Browse Section */}
      <View style={styles.browseHeaderContainer}>
        <Text style={styles.browseTitle}>Browse All Services</Text>
        <Text style={styles.statsText}>{services.length} available</Text>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <FlatList
          data={services}
          keyExtractor={(item) => item.id}
          renderItem={renderWorkerCard}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
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
  statsContainer: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: colors.white,
  },
  statsText: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  workerCard: {
    marginBottom: 12,
  },
  cardContent: {
    flex: 1,
  },
  workerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
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
  details: {
    flex: 1,
  },
  name: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  stars: {
    marginRight: 4,
  },
  ratingText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  distance: {
    fontSize: 12,
    color: colors.grayDark,
  },
  price: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primary,
  },
  aiBanner: {
    marginHorizontal: 20,
    marginVertical: 16,
    backgroundColor: '#F0F7FF',
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  aiBannerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  aiIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  aiIcon: {
    fontSize: 28,
  },
  aiBannerText: {
    flex: 1,
  },
  aiBannerTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 2,
  },
  aiBannerSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  aiButton: {
    marginTop: 8,
  },
  divider: {
    height: 1,
    backgroundColor: colors.grayLight,
    marginVertical: 8,
  },
  browseHeaderContainer: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: colors.white,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  browseTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
});
