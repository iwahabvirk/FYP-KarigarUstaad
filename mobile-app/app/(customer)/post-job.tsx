import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { colors } from '@/constants/colors';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { createJob } from '@/src/services/jobService';
import { JOB_CATEGORIES } from '@/constants/jobCategories';
import { suggestCategory, generateJobDescription } from '@/src/services/aiService';

export default function PostJobScreen() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [budget, setBudget] = useState('');
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [descriptionLoading, setDescriptionLoading] = useState(false);

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setBudget('');
    setLocation('');
    setCategory('');
  };

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

  const handleImproveDescription = async () => {
    if (!description.trim()) {
      Alert.alert('Missing description', 'Please write a short description first.');
      return;
    }

    try {
      setDescriptionLoading(true);
      const response = await generateJobDescription({ text: description });
      const generatedText = response.data.data.improvedDescription;
      const suggestedCategory = response.data.data.suggestedCategory;

      setDescription(generatedText);
      setCategory(suggestedCategory);

      Alert.alert('Improved description generated', 'We updated your description and suggested a category.');
    } catch (error: any) {
      console.error('Error improving description:', error);
      Alert.alert('Error', 'Could not improve the description right now. Please try again.');
    } finally {
      setDescriptionLoading(false);
    }
  };

  const handlePostJob = async () => {
    console.log('🛠️  Post Job: Started job posting process...');
    
    const trimmedTitle = title.trim();
    const trimmedDescription = description.trim();
    const trimmedLocation = location.trim();
    const parsedBudget = Number(budget);

    console.log('🛠️  Post Job: Form validation - inputs:', {
      title: trimmedTitle ? '✅' : '❌',
      description: trimmedDescription ? '✅' : '❌',
      location: trimmedLocation ? '✅' : '❌',
      category: category ? '✅' : '❌',
      budget: budget ? '✅' : '❌',
    });

    if (!trimmedTitle || !trimmedDescription || !trimmedLocation || !category || !budget) {
      console.error('❌ Post Job: Missing required fields');
      Alert.alert('Missing fields', 'Please fill in all required fields.');
      return;
    }

    if (Number.isNaN(parsedBudget) || parsedBudget <= 0) {
      console.error('❌ Post Job: Invalid budget:', budget);
      Alert.alert('Invalid budget', 'Budget must be a valid number greater than 0.');
      return;
    }

    try {
      setLoading(true);
      console.log('🛠️  Post Job: Calling createJob API with payload:', {
        title: trimmedTitle,
        description: trimmedDescription.substring(0, 50) + '...',
        budget: parsedBudget,
        location: trimmedLocation,
        category,
      });

      const result = await createJob({
        title: trimmedTitle,
        description: trimmedDescription,
        budget: parsedBudget,
        location: trimmedLocation,
        category,
        requiredSkills: [category],
      });

      console.log('✅ Post Job: Job created successfully with ID:', result.id);
      resetForm();
      Alert.alert('Success', 'Job posted successfully.');
      router.replace('/(customer)/home');
    } catch (error: any) {
      console.error('❌ Post Job: Error creating job:', {
        message: error?.message,
        status: error?.response?.status,
        data: error?.response?.data,
      });
      Alert.alert('Error', error?.message || 'Unable to post the job.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Post a Service Request</Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backButton}>✕</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Card>
          <Text style={styles.fieldLabel}>Title *</Text>
          <Input
            placeholder="e.g., Need Painter"
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
            placeholder="Describe the work you need done..."
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={5}
          />
          <TouchableOpacity
            onPress={handleImproveDescription}
            disabled={descriptionLoading}
            style={styles.improveButton}
          >
            <Text style={[styles.improveButtonText, descriptionLoading && styles.improveButtonTextDisabled]}>
              {descriptionLoading ? 'Improving...' : '🤖 Improve Description'}
            </Text>
          </TouchableOpacity>
        </Card>

        <Card>
          <Text style={styles.fieldLabel}>Location *</Text>
          <Input
            placeholder="Enter location"
            value={location}
            onChangeText={setLocation}
          />
        </Card>

        <Card>
          <Text style={styles.fieldLabel}>Budget (PKR) *</Text>
          <Input
            placeholder="e.g., 5000"
            value={budget}
            onChangeText={setBudget}
            keyboardType="numeric"
          />
        </Card>

        <View style={styles.bottomSpacing} />
      </ScrollView>

      <View style={styles.footer}>
        <Button
          label={loading ? 'Posting...' : 'Post Job'}
          onPress={handlePostJob}
          size="large"
          disabled={loading}
          style={styles.postButton}
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
    marginBottom: 10,
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
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
    gap: 10,
  },
  categoryButton: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
  },
  categoryButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  categoryButtonText: {
    fontSize: 13,
    color: colors.text,
    fontWeight: '500',
  },
  categoryButtonTextActive: {
    color: colors.white,
  },
  improveButton: {
    marginTop: 12,
    alignSelf: 'flex-start',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: colors.primary,
  },
  improveButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.white,
  },
  improveButtonTextDisabled: {
    opacity: 0.6,
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  postButton: {
    marginBottom: 0,
  },
  bottomSpacing: {
    height: 24,
  },
});
