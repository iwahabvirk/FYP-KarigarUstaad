import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { colors } from '@/constants/colors';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Input } from '@/components/Input';
import { getAllStaff, bookStaff, InHouseStaff } from '@/src/services/staffService';

const CATEGORIES = ['plumbing', 'electrical', 'painting', 'cleaning', 'carpentry', 'other'];

export default function StaffBookingScreen() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [staff, setStaff] = useState<InHouseStaff[]>([]);
  const [loading, setLoading] = useState(false);
  const [bookingLoading, setBookingLoading] = useState<string | null>(null);
  const [selectedStaff, setSelectedStaff] = useState<InHouseStaff | null>(null);
  const [bookingTitle, setBookingTitle] = useState('');

  useEffect(() => {
    if (selectedCategory) {
      loadStaff();
    }
  }, [selectedCategory]);

  const loadStaff = async () => {
    try {
      setLoading(true);
      const staffData = await getAllStaff(selectedCategory);
      setStaff(staffData);
    } catch (error: any) {
      Alert.alert('Error', 'Failed to load staff members');
    } finally {
      setLoading(false);
    }
  };

  const handleBookStaff = (staffMember: InHouseStaff) => {
    setSelectedStaff(staffMember);
    setBookingTitle(`Work with ${staffMember.name}`);
  };

  const handleConfirmBooking = async () => {
    if (!selectedStaff) {
      return;
    }

    if (!bookingTitle.trim()) {
      Alert.alert('Error', 'Please enter a job title');
      return;
    }

    try {
      setBookingLoading(selectedStaff.id);
      await bookStaff({
        staffId: selectedStaff.id,
        jobDetails: {
          title: bookingTitle.trim(),
          description: `In-house staff booking for ${selectedStaff.category} work`,
          budget: selectedStaff.hourlyRate * 2,
          location: selectedStaff.location,
        },
      });

      Alert.alert('Success', 'Staff booking request submitted successfully');
      setSelectedStaff(null);
      setBookingTitle('');
      router.back();
    } catch (error: any) {
      Alert.alert('Error', 'Failed to book staff member');
    } finally {
      setBookingLoading(null);
    }
  };

  const handleCancelBooking = () => {
    setSelectedStaff(null);
    setBookingTitle('');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Book In-House Staff</Text>
          <Text style={styles.subtitle}>Professional workers ready to help</Text>
        </View>

        <View style={styles.categorySection}>
          <Text style={styles.sectionTitle}>Select Category</Text>
          <View style={styles.categoryGrid}>
            {CATEGORIES.map((category) => (
              <TouchableOpacity
                key={category}
                style={[
                  styles.categoryButton,
                  selectedCategory === category && styles.categoryButtonActive,
                ]}
                onPress={() => setSelectedCategory(category)}
              >
                <Text
                  style={[
                    styles.categoryText,
                    selectedCategory === category && styles.categoryTextActive,
                  ]}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {selectedCategory && (
          <View style={styles.staffSection}>
            <Text style={styles.sectionTitle}>
              Available {selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} Staff
            </Text>

            {loading ? (
              <Text style={styles.loadingText}>Loading staff...</Text>
            ) : staff.length === 0 ? (
              <Text style={styles.emptyText}>No staff available in this category</Text>
            ) : (
              staff.map((member) => (
                <Card key={member.id} style={styles.staffCard}>
                  <View style={styles.staffHeader}>
                    <Text style={styles.staffName}>{member.name}</Text>
                    <View style={styles.ratingContainer}>
                      <Text style={styles.rating}>⭐ {member.rating}</Text>
                    </View>
                  </View>

                  <Text style={styles.staffSkills}>
                    Skills: {member.skills.join(', ')}
                  </Text>

                  <View style={styles.staffDetails}>
                    <Text style={styles.staffLocation}>📍 {member.location}</Text>
                    <Text style={styles.staffRate}>💰 Rs. {member.hourlyRate}/hour</Text>
                  </View>

                  <Button
                    label={bookingLoading === member.id ? 'Booking...' : 'Book Now'}
                    onPress={() => handleBookStaff(member)}
                    size="small"
                    disabled={bookingLoading === member.id}
                    style={styles.bookButton}
                  />
                </Card>
              ))
            )}

            {selectedStaff && (
              <Card style={styles.bookingCard}>
                <Text style={styles.sectionTitle}>Confirm booking for {selectedStaff.name}</Text>
                <Input
                  placeholder="Booking title"
                  value={bookingTitle}
                  onChangeText={setBookingTitle}
                />
                <Text style={styles.bookingNote}>
                  This will create a staff booking request for {selectedStaff.category} at {selectedStaff.location}.
                </Text>
                <View style={styles.bookingActions}>
                  <Button
                    label="Cancel"
                    onPress={handleCancelBooking}
                    size="small"
                    style={styles.cancelButton}
                  />
                  <Button
                    label={bookingLoading === selectedStaff.id ? 'Booking...' : 'Confirm'}
                    onPress={handleConfirmBooking}
                    size="small"
                    disabled={bookingLoading === selectedStaff.id}
                    style={styles.confirmButton}
                  />
                </View>
              </Card>
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    padding: 20,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  categorySection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
  },
  categoryButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  categoryText: {
    fontSize: 14,
    color: colors.text,
  },
  categoryTextActive: {
    color: colors.white,
  },
  staffSection: {
    marginBottom: 24,
  },
  loadingText: {
    textAlign: 'center',
    fontSize: 16,
    color: colors.textSecondary,
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    color: colors.textSecondary,
  },
  staffCard: {
    marginBottom: 16,
  },
  staffHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  staffName: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  ratingContainer: {
    backgroundColor: colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  rating: {
    fontSize: 12,
    color: colors.white,
    fontWeight: '600',
  },
  staffSkills: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  staffDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  staffLocation: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  staffRate: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '600',
  },
  bookButton: {
    marginTop: 8,
  },
  bookingCard: {
    marginTop: 20,
    padding: 16,
  },
  bookingNote: {
    marginTop: 12,
    fontSize: 13,
    color: colors.textSecondary,
  },
  bookingActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    marginTop: 16,
  },
  cancelButton: {
    backgroundColor: colors.border,
    flex: 1,
  },
  confirmButton: {
    flex: 1,
    backgroundColor: colors.primary,
  },
});