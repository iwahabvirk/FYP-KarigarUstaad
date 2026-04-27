import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { colors } from '@/constants/colors';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { createJob } from '@/src/services/jobService';

const categories = ['Electrician', 'Plumber', 'Painter', 'AC Technician', 'Carpenter'];

export default function PostJobScreen() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [budget, setBudget] = useState('');
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(false);

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setBudget('');
    setLocation('');
    setCategory('');
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

      Alert.alert('Success', 'Job posted successfully.', [
        {
          text: 'OK',
          onPress: () => {
            console.log('🛠️  Post Job: Resetting form and navigating to My Jobs');
            resetForm();
            router.replace('/(customer)/my-jobs');
          },
        },
      ]);
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
          <Text style={styles.fieldLabel}>Category *</Text>
          <View style={styles.categoryContainer}>
            {categories.map((item) => (
              <TouchableOpacity
                key={item}
                style={[
                  styles.categoryButton,
                  category === item && styles.categoryButtonActive,
                ]}
                onPress={() => setCategory(item)}
              >
                <Text
                  style={[
                    styles.categoryButtonText,
                    category === item && styles.categoryButtonTextActive,
                  ]}
                >
                  {item}
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
