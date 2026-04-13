import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { colors } from '@/constants/colors';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';

export default function RateWorkerScreen() {
  const router = useRouter();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmitReview = async () => {
    if (rating === 0) {
      Alert.alert('Please select a rating');
      return;
    }

    try {
      setSubmitting(true);
      await new Promise((resolve) => setTimeout(resolve, 1500));
      Alert.alert('Thank You!', 'Your review has been submitted', [
        {
          text: 'OK',
          onPress: () => router.replace('/(customer)/home'),
        },
      ]);
    } catch (error) {
      Alert.alert('Error', 'Unable to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Rate Worker</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Card style={styles.workerCard}>
          <View style={styles.workerInfo}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>AR</Text>
            </View>
            <View style={styles.workerDetails}>
              <Text style={styles.workerName}>Ali Raza</Text>
              <Text style={styles.workerCategory}>Electrician</Text>
              <Text style={styles.workerCompletion}>✓ Service Completed</Text>
            </View>
          </View>
        </Card>

        <Card>
          <Text style={styles.ratingLabel}>How would you rate the service?</Text>
          <View style={styles.starsContainer}>
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity
                key={star}
                onPress={() => setRating(star)}
                style={styles.starButton}
              >
                <Text
                  style={[
                    styles.star,
                    rating >= star && styles.starFilled,
                  ]}
                >
                  ★
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <Text style={styles.ratingText}>
            {rating === 0 && 'Select a rating'}
            {rating === 1 && 'Poor'}
            {rating === 2 && 'Average'}
            {rating === 3 && 'Good'}
            {rating === 4 && 'Very Good'}
            {rating === 5 && 'Excellent'}
          </Text>
        </Card>

        <Card>
          <Text style={styles.commentLabel}>Share your feedback (optional)</Text>
          <TextInput
            style={styles.commentInput}
            placeholder="Tell other customers about your experience..."
            placeholderTextColor={colors.grayDark}
            value={comment}
            onChangeText={setComment}
            multiline
            numberOfLines={5}
          />
          <Text style={styles.characterCount}>{comment.length}/500</Text>
        </Card>

        <Card>
          <Text style={styles.quickFeedbackLabel}>Quick Feedback</Text>
          <View style={styles.feedbackOptions}>
            <TouchableOpacity style={styles.feedbackButton}>
              <Text style={styles.feedbackIcon}>⏱️</Text>
              <Text style={styles.feedbackText}>On Time</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.feedbackButton}>
              <Text style={styles.feedbackIcon}>🎯</Text>
              <Text style={styles.feedbackText}>Quality</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.feedbackButton}>
              <Text style={styles.feedbackIcon}>😊</Text>
              <Text style={styles.feedbackText}>Nice</Text>
            </TouchableOpacity>
          </View>
        </Card>

        <Card style={styles.tipsCard}>
          <Text style={styles.tipTitle}>Tips for better reviews</Text>
          <Text style={styles.tipText}>✓ Be specific about your experience</Text>
          <Text style={styles.tipText}>✓ Help other customers make decisions</Text>
          <Text style={styles.tipText}>✓ Be honest and fair</Text>
        </Card>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          label={submitting ? 'Submitting...' : 'Submit Review'}
          onPress={handleSubmitReview}
          size="large"
          disabled={submitting}
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
  workerCard: {
    marginBottom: 20,
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
    marginRight: 16,
  },
  avatarText: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.white,
  },
  workerDetails: {
    flex: 1,
  },
  workerName: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  workerCategory: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  workerCompletion: {
    fontSize: 12,
    color: colors.success,
    marginTop: 4,
    fontWeight: '600',
  },
  ratingLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
  },
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginBottom: 16,
  },
  starButton: {
    padding: 8,
  },
  star: {
    fontSize: 44,
    color: colors.grayLight,
  },
  starFilled: {
    color: '#FFB800',
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
    textAlign: 'center',
  },
  commentLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 12,
  },
  commentInput: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 13,
    color: colors.text,
    textAlignVertical: 'top',
    marginBottom: 8,
  },
  characterCount: {
    fontSize: 11,
    color: colors.textSecondary,
    textAlign: 'right',
  },
  quickFeedbackLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 12,
  },
  feedbackOptions: {
    flexDirection: 'row',
    gap: 8,
  },
  feedbackButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingVertical: 12,
  },
  feedbackIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  feedbackText: {
    fontSize: 11,
    color: colors.text,
    fontWeight: '500',
  },
  tipsCard: {
    backgroundColor: '#FFF3E0',
  },
  tipTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  tipText: {
    fontSize: 12,
    color: colors.text,
    marginBottom: 6,
    lineHeight: 18,
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
});
