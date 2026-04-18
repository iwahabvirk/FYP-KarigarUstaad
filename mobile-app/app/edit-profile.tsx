import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { colors } from '@/constants/colors';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { getMe, updateMe, UserProfile } from '@/src/services/userService';

export default function EditProfileScreen() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    bio: '',
    skills: [] as string[],
    experience: '',
    location: '',
    availability: true,
    responseTime: '24 hours',
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const profile = await getMe();
      setUser(profile);
      setFormData({
        name: profile.name,
        phone: profile.phone || '',
        bio: profile.bio || '',
        skills: profile.skills || [],
        experience: profile.experience || '',
        location: profile.location || '',
        availability: profile.availability || true,
        responseTime: profile.responseTime || '24 hours',
      });
    } catch (error) {
      console.error('Failed to load profile:', error);
      Alert.alert('Error', 'Failed to load profile data');
      router.back();
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!user) return;

    setSaving(true);
    try {
      const updates: Partial<UserProfile> = {
        name: formData.name,
        phone: formData.phone,
        bio: formData.bio,
        skills: formData.skills,
        experience: formData.experience,
        location: formData.location,
      };

      if (user.role === 'worker') {
        updates.availability = formData.availability;
        updates.responseTime = formData.responseTime;
      }

      await updateMe(updates);
      Alert.alert('Success', 'Profile updated successfully!');
      router.back();
    } catch (error) {
      console.error('Failed to update profile:', error);
      Alert.alert('Error', 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const addSkill = () => {
    const newSkill = `Skill ${formData.skills.length + 1}`;
    setFormData(prev => ({
      ...prev,
      skills: [...prev.skills, newSkill],
    }));
  };

  const removeSkill = (index: number) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index),
    }));
  };

  const updateSkill = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.map((skill, i) => i === index ? value : skill),
    }));
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading profile...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Edit Profile</Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Card style={styles.formCard}>
          {/* Basic Information */}
          <Text style={styles.sectionTitle}>Basic Information</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Full Name</Text>
            <TextInput
              style={styles.input}
              value={formData.name}
              onChangeText={(text) => setFormData(prev => ({ ...prev, name: text }))}
              placeholder="Enter your full name"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Phone Number</Text>
            <TextInput
              style={styles.input}
              value={formData.phone}
              onChangeText={(text) => setFormData(prev => ({ ...prev, phone: text }))}
              placeholder="Enter your phone number"
              keyboardType="phone-pad"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Location</Text>
            <TextInput
              style={styles.input}
              value={formData.location}
              onChangeText={(text) => setFormData(prev => ({ ...prev, location: text }))}
              placeholder="Enter your location"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Bio</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={formData.bio}
              onChangeText={(text) => setFormData(prev => ({ ...prev, bio: text }))}
              placeholder="Tell us about yourself"
              multiline
              numberOfLines={3}
            />
          </View>

          {/* Skills Section (for workers) */}
          {user?.role === 'worker' && (
            <>
              <Text style={styles.sectionTitle}>Skills</Text>
              {formData.skills.map((skill, index) => (
                <View key={index} style={styles.skillInputGroup}>
                  <TextInput
                    style={styles.skillInput}
                    value={skill}
                    onChangeText={(text) => updateSkill(index, text)}
                    placeholder="Enter a skill"
                  />
                  <TouchableOpacity
                    style={styles.removeSkillButton}
                    onPress={() => removeSkill(index)}
                  >
                    <Text style={styles.removeSkillText}>✕</Text>
                  </TouchableOpacity>
                </View>
              ))}
              <TouchableOpacity style={styles.addSkillButton} onPress={addSkill}>
                <Text style={styles.addSkillText}>+ Add Skill</Text>
              </TouchableOpacity>
            </>
          )}

          {/* Experience Section (for workers) */}
          {user?.role === 'worker' && (
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Experience</Text>
              <TextInput
                style={styles.input}
                value={formData.experience}
                onChangeText={(text) => setFormData(prev => ({ ...prev, experience: text }))}
                placeholder="e.g. 5 years, 2+ years"
              />
            </View>
          )}

          {/* Worker-specific settings */}
          {user?.role === 'worker' && (
            <>
              <Text style={styles.sectionTitle}>Work Settings</Text>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Response Time</Text>
                <TextInput
                  style={styles.input}
                  value={formData.responseTime}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, responseTime: text }))}
                  placeholder="e.g. 10 mins, 1 hour"
                />
              </View>
            </>
          )}
        </Card>

        <View style={styles.buttonContainer}>
          <Button
            label={saving ? "Saving..." : "Save Changes"}
            onPress={handleSave}
            variant="primary"
            size="large"
            disabled={saving}
          />
        </View>
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
    borderBottomWidth: 1,
    borderBottomColor: colors.grayLight,
  },
  backButton: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: '600',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 16,
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
  formCard: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
    marginTop: 8,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.grayLight,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    color: colors.text,
    backgroundColor: colors.white,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  skillInputGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  skillInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.grayLight,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: colors.text,
    backgroundColor: colors.white,
    marginRight: 8,
  },
  removeSkillButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.error,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeSkillText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  addSkillButton: {
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  addSkillText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '600',
  },
  buttonContainer: {
    marginBottom: 20,
  },
});