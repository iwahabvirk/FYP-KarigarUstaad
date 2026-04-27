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
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { createJob } from '@/src/services/jobService';
import { JOB_CATEGORIES } from '@/constants/jobCategories';
import { suggestCategory } from '@/src/services/aiService';

export default function PostJobScreen() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [budget, setBudget] = useState('');
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const router = useRouter();

  const handleSuggestCategory = async () => {
    if (!description.trim()) {
      Alert.alert('Missing description', 'Please enter a description first.');
      return;
    }

    try {
      setAiLoading(true);
      const suggestedCategory = await suggestCategory(description);
      setCategory(suggestedCategory);
      Alert.alert('Category suggested', `Suggested: ${JOB_CATEGORIES.find(c => c.value === suggestedCategory)?.label || suggestedCategory}`);
    } catch (error: any) {
      console.error('Error suggesting category:', error);
      Alert.alert('Error', 'Could not suggest category. Please select manually.');
    } finally {
      setAiLoading(false);
    }
  };

  const handlePostJob = async () => {
    if (!title || !description || !budget || !category || !location) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      setLoading(true);
      await createJob({
        title,
        description,
        budget: Number(budget),
        location,
        category,
        requiredSkills: [category],
      });

      Alert.alert('Success!', 'Job posted successfully!');
      router.replace('/(employer)/dashboard');
    } catch (error: any) {
      Alert.alert('Error', error?.message || 'Unable to post job.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Post a New Job</Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backButton}>✕</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Card>
          <Text style={styles.fieldLabel}>Job Title *</Text>
          <Input
            placeholder="e.g., Paint Living Room"
            value={title}
            onChangeText={setTitle}
          />
        </Card>

        <Card>
          <View style={styles.categoryHeader}>
            <Text style={styles.fieldLabel}>Category *</Text>
            <TouchableOpacity
              onPress={handleSuggestCategory}
              disabled={aiLoading}
              style={styles.suggestButton}
            >
              <Text style={[styles.suggestButtonText, aiLoading && styles.suggestButtonTextDisabled]}>
                {aiLoading ? 'Suggesting...' : '🤖 Suggest'}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.categoryContainer}>
            {JOB_CATEGORIES.map((item) => (
              <TouchableOpacity
                key={item.value}
                style={[
                  styles.categoryButton,
                  category === item.value && styles.categoryButtonActive,
                ]}
                onPress={() => setCategory(item.value)}
              >
                <Text
                  style={[
                    styles.categoryButtonText,
                    category === item.value && styles.categoryButtonTextActive,
                  ]}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Card>

        <Card>
          <Text style={styles.fieldLabel}>Description *</Text>
          <Input
            placeholder="Describe the job in detail..."
            value={description}
            onChangeText={setDescription}
            multiline={true}
            numberOfLines={4}
          />
        </Card>

        <Card>
          <Text style={styles.fieldLabel}>Location *</Text>
          <Input
            placeholder="Enter job location"
            value={location}
            onChangeText={setLocation}
          />
        </Card>

        <Card>
          <Text style={styles.fieldLabel}>Budget (USD) *</Text>
          <Input
            placeholder="e.g., 300"
            value={budget}
            onChangeText={setBudget}
            keyboardType="numeric"
          />
          <Text style={styles.budgetHint}>Enter approximate budget amount</Text>
        </Card>

        <Card>
          <Text style={styles.sectionTitle}>Additional Information</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Estimated Completion Time:</Text>
            <Text style={styles.infoValue}>1-3 days</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Visibility:</Text>
            <Text style={styles.infoValue}>Public</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Experience Level:</Text>
            <Text style={styles.infoValue}>Intermediate</Text>
          </View>
        </Card>

        <View style={styles.bottomSpacing} />
      </ScrollView>

      <View style={styles.footer}>
        <Button
          label="Post Job"
          onPress={handlePostJob}
          size="large"
          style={styles.postButton}
        />
        <Button
          label="Cancel"
          onPress={() => router.back()}
          variant="outline"
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
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  suggestButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: colors.primary,
    borderRadius: 6,
  },
  suggestButtonText: {
    fontSize: 12,
    color: colors.white,
    fontWeight: '600',
  },
  suggestButtonTextDisabled: {
    opacity: 0.6,
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.white,
  },
  categoryButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  categoryButtonText: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.text,
  },
  categoryButtonTextActive: {
    color: colors.white,
  },
  budgetHint: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  infoLabel: {
    fontSize: 13,
    color: colors.text,
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    gap: 10,
  },
  postButton: {
    marginBottom: 0,
  },
  bottomSpacing: {
    height: 20,
  },
});
