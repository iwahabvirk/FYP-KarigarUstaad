import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { colors } from '@/constants/colors';
import { Input } from '@/components/Input';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { JOB_CATEGORIES } from '@/constants/jobCategories';
import { createService } from '@/src/services/serviceService';

export default function PostServiceScreen() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('electrical');
  const [loading, setLoading] = useState(false);

  const handleCreateService = async () => {
    const parsedPrice = Number(price);

    if (!title.trim() || !description.trim() || Number.isNaN(parsedPrice) || parsedPrice <= 0) {
      Alert.alert('Validation', 'Please provide title, description, and a valid price.');
      return;
    }

    try {
      setLoading(true);
      await createService({
        title: title.trim(),
        description: description.trim(),
        price: parsedPrice,
        category,
      });

      Alert.alert('Success', 'Service posted successfully.');
      router.replace('/(worker)/dashboard');
    } catch (error: any) {
      Alert.alert('Error', error?.message || 'Unable to post service');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Post Service</Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.close}>✕</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Card>
          <Text style={styles.label}>Title</Text>
          <Input value={title} onChangeText={setTitle} placeholder="e.g., Home wiring repair" />
        </Card>

        <Card>
          <Text style={styles.label}>Description</Text>
          <Input
            value={description}
            onChangeText={setDescription}
            placeholder="Describe your service"
            multiline
            numberOfLines={4}
          />
        </Card>

        <Card>
          <Text style={styles.label}>Category</Text>
          <View style={styles.categoryWrap}>
            {JOB_CATEGORIES.map((item) => (
              <TouchableOpacity
                key={item.value}
                style={[styles.category, category === item.value && styles.categoryActive]}
                onPress={() => setCategory(item.value)}
              >
                <Text style={[styles.categoryText, category === item.value && styles.categoryTextActive]}>{item.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </Card>

        <Card>
          <Text style={styles.label}>Price</Text>
          <Input value={price} onChangeText={setPrice} keyboardType="numeric" placeholder="e.g., 2500" />
        </Card>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          label={loading ? 'Posting...' : 'Post Service'}
          onPress={handleCreateService}
          size="large"
          disabled={loading}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  title: { fontSize: 24, fontWeight: '700', color: colors.text },
  close: { fontSize: 24, color: colors.text },
  content: { flex: 1, paddingHorizontal: 20 },
  label: { fontSize: 14, fontWeight: '600', color: colors.text, marginBottom: 10 },
  categoryWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  category: {
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: colors.white,
  },
  categoryActive: { borderColor: colors.primary, backgroundColor: colors.primary },
  categoryText: { color: colors.text, fontSize: 12, fontWeight: '500' },
  categoryTextActive: { color: colors.white },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.white,
  },
});
