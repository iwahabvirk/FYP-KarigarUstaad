import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { colors } from '@/constants/colors';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { getMyServices, ServiceItem } from '@/src/services/serviceService';

export default function ManageServicesScreen() {
  const router = useRouter();
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      loadServices();
    }, []),
  );

  const loadServices = async () => {
    try {
      setLoading(true);
      const data = await getMyServices();
      setServices(data);
    } catch (error: any) {
      Alert.alert('Error', error?.message || 'Unable to load services');
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
        <Text style={styles.title}>Manage Services</Text>
        <View style={{ width: 50 }} />
      </View>

      <FlatList
        data={services}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<Text style={styles.empty}>No services posted yet.</Text>}
        renderItem={({ item }) => (
          <Card style={styles.card}>
            <Text style={styles.name}>{item.title}</Text>
            <Text style={styles.meta}>{item.category}</Text>
            <Text style={styles.price}>Rs. {item.price}</Text>
            <Text style={styles.desc} numberOfLines={2}>{item.description}</Text>
          </Card>
        )}
      />

      <View style={styles.footer}>
        <Button label="Post New Service" onPress={() => router.push('/(worker)/post-service')} size="large" />
      </View>
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
  price: { marginTop: 8, fontSize: 14, fontWeight: '700', color: colors.primary },
  desc: { marginTop: 8, fontSize: 12, color: colors.textSecondary },
  empty: { textAlign: 'center', color: colors.textSecondary, marginTop: 40 },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.white,
  },
});
