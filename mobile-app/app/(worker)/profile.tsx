import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
  Switch,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { colors } from '@/constants/colors';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { Badge } from '@/components/Badge';
import { Icon, Icons } from '@/components/Icon';
import { getCurrentUser, logoutUser, UserPayload } from '@/src/services/authService';

type UserProfile = UserPayload & {
  bio?: string;
  skills?: string[];
  location?: string;
  profileImage?: string;
};

export default function WorkerProfileScreen() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      const currentUser = await getCurrentUser();
      setUser(currentUser as UserProfile);
    } catch (error: any) {
      Alert.alert('Error', error?.message || 'Unable to load profile.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      {
        text: 'Cancel',
        onPress: () => {},
        style: 'cancel',
      },
      {
        text: 'Logout',
        onPress: async () => {
          await logoutUser();
          router.replace('/(auth)/login');
        },
      },
    ]);
  };

  const handleEditProfile = () => {
    router.push('/edit-profile');
  };

  const calculateProfileCompletion = (profile: UserProfile | null) => {
    const criteria = [
      Boolean(profile?.name?.trim()),
      Boolean(profile?.bio?.trim()),
      Array.isArray(profile?.skills) && profile.skills.length > 0,
      Boolean(profile?.location?.trim()),
      Boolean(profile?.profileImage?.trim()),
    ];

    const completed = criteria.filter(Boolean).length;
    return Math.round((completed / criteria.length) * 100);
  };

  const profileCompletion = calculateProfileCompletion(user);

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
        <Text style={styles.title}>My Profile</Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.closeIcon}>✕</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Card style={styles.profileCard} variant="elevated">
          <View style={styles.profileHeader}>
            <View style={styles.avatarContainer}>
              <View style={styles.avatar}>
                <Icon name={Icons.user} size={32} color={colors.white} />
              </View>
              <View style={styles.verificationBadge}>
                <Icon name={Icons.check} size={12} color={colors.white} />
              </View>
            </View>
            <View style={styles.profileInfo}>
              <View style={styles.nameRow}>
                <Text style={styles.name}>{user?.name || 'Worker'}</Text>
                <Badge label="Verified" variant="success" size="small" />
              </View>
              <Text style={styles.role}>Service Provider</Text>
              <View style={styles.ratingContainer}>
                <Icon name={Icons.star} size={14} color="#FFB800" />
                <Text style={styles.rating}>4.8 (142 reviews)</Text>
              </View>
            </View>
          </View>
        </Card>

        <Card variant="elevated">
          <Text style={styles.sectionTitle}>Profile Completion</Text>
          <View style={styles.completionBar}>
            <View style={[styles.completionFill, { width: `${profileCompletion}%` }]} />
          </View>
          <Text style={styles.completionText}>{profileCompletion}% Complete</Text>
          <Text style={styles.completionHint}>Complete your profile to get more jobs</Text>
        </Card>

        <Card variant="elevated">
          <Text style={styles.sectionTitle}>Statistics</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Icon name={Icons.money} size={24} color={colors.primary} />
              <Text style={styles.statValue}>Rs. 25,000</Text>
              <Text style={styles.statLabel}>Total Earnings</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Icon name={Icons.checkCircle} size={24} color={colors.success} />
              <Text style={styles.statValue}>156</Text>
              <Text style={styles.statLabel}>Jobs Done</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Icon name={Icons.star} size={24} color="#FFB800" />
              <Text style={styles.statValue}>98%</Text>
              <Text style={styles.statLabel}>Completion</Text>
            </View>
          </View>
        </Card>

        <Card variant="elevated">
          <Text style={styles.sectionTitle}>Skills</Text>
          <View style={styles.skillsContainer}>
            <Badge label="⚡ Electrical Work" variant="primary" />
            <Badge label="🔌 Installations" variant="secondary" />
            <Badge label="✓ Verified" variant="success" />
          </View>
          <TouchableOpacity style={styles.addSkillButton}>
            <Text style={styles.addSkillText}>+ Add More Skills</Text>
          </TouchableOpacity>
        </Card>

        <Card variant="elevated" style={styles.earningsCard}>
          <Text style={styles.sectionTitle}>Earnings This Month</Text>
          <View style={styles.earningCard}>
            <Icon name={Icons.money} size={28} color={colors.primary} />
            <Text style={styles.earningAmount}>Rs. 25,000</Text>
            <Text style={styles.earningDesc}>45 jobs completed</Text>
          </View>
          <Button
            label="Request Withdrawal"
            onPress={() => {}}
            variant="outline"
            size="medium"
            icon={Icons.money}
          />
        </Card>

        <Card variant="elevated">
          <Text style={styles.sectionTitle}>Settings</Text>
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Icon name={Icons.notification} size={20} color={colors.textSecondary} />
              <View style={styles.settingText}>
                <Text style={styles.settingLabel}>Push Notifications</Text>
                <Text style={styles.settingDesc}>Receive job alerts instantly</Text>
              </View>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: colors.borderLight, true: colors.primaryLight }}
              thumbColor={notificationsEnabled ? colors.primary : colors.surface}
            />
          </View>
          <View style={styles.divider} />
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Icon name={Icons.time} size={20} color={colors.textSecondary} />
              <View style={styles.settingText}>
                <Text style={styles.settingLabel}>Availability Status</Text>
                <Text style={styles.settingDesc}>Show you&apos;re online to customers</Text>
              </View>
            </View>
            <Switch
              value={true}
              onValueChange={() => {}}
              trackColor={{ false: colors.borderLight, true: colors.successLight }}
              thumbColor={colors.success}
            />
          </View>
        </Card>

        <Card>
          <Text style={styles.sectionTitle}>About</Text>
          <Text style={styles.aboutText}>
            I&apos;m a certified electrician with 8+ years of experience in residential and commercial wiring. 
            I pride myself on quality workmanship and excellent customer service.
          </Text>
          <TouchableOpacity style={styles.editAboutButton}>
            <Text style={styles.editAboutText}>✏️ Edit About</Text>
          </TouchableOpacity>
        </Card>

        <Card style={styles.helpCard}>
          <Text style={styles.sectionTitle}>Help & Support</Text>
          <TouchableOpacity style={styles.helpLink}>
            <Text style={styles.helpLinkText}>📞 Contact Support</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.helpLink}>
            <Text style={styles.helpLinkText}>❓ FAQs</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.helpLink}>
            <Text style={styles.helpLinkText}>📋 Terms & Conditions</Text>
          </TouchableOpacity>
        </Card>

        <View style={styles.footer}>
          <Button
            label="Edit Profile"
            onPress={handleEditProfile}
            variant="primary"
            size="large"
            icon="✏️"
          />
          <Button
            label="Settings"
            onPress={() => console.log('Settings pressed')}
            variant="outline"
            size="large"
            icon="⚙️"
          />
          <Button
            label="Help & Support"
            onPress={() => console.log('Help pressed')}
            variant="outline"
            size="large"
            icon="❓"
          />
          <Button
            label="Logout"
            onPress={handleLogout}
            variant="outline"
            size="large"
            icon="🚪"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundLight,
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    letterSpacing: 0.5,
  },
  closeIcon: {
    fontSize: 24,
    color: colors.textSecondary,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  profileCard: {
    backgroundColor: colors.surface,
    marginBottom: 16,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 16,
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  verificationBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: colors.success,
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.surface,
  },
  profileInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    gap: 8,
  },
  name: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    letterSpacing: 0.3,
  },
  role: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 6,
    fontWeight: '500',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  rating: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
    letterSpacing: 0.3,
  },
  completionBar: {
    height: 8,
    backgroundColor: colors.borderLight,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 12,
  },
  completionFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 4,
  },
  completionText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
    marginBottom: 4,
  },
  completionHint: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.primary,
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  statDivider: {
    width: 1,
    backgroundColor: colors.borderLight,
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  addSkillButton: {
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.borderLight,
    borderRadius: 12,
    borderStyle: 'dashed',
  },
  addSkillText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '600',
  },
  earningsCard: {
    backgroundColor: colors.successLight,
    borderWidth: 1,
    borderColor: colors.success,
  },
  earningCard: {
    alignItems: 'center',
    paddingVertical: 20,
    marginBottom: 16,
  },
  earningAmount: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.primary,
    marginTop: 8,
    marginBottom: 4,
  },
  earningDesc: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingText: {
    marginLeft: 12,
    flex: 1,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  settingDesc: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  divider: {
    height: 1,
    backgroundColor: colors.borderLight,
  },
  footer: {
    flexDirection: 'column',
    gap: 12,
    marginTop: 24,
    marginBottom: 32,
  },
  aboutText: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: 16,
  },
  editAboutButton: {
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.borderLight,
    borderRadius: 12,
    borderStyle: 'dashed',
  },
  editAboutText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '600',
  },
  helpCard: {
    marginBottom: 16,
  },
  helpLink: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  helpLinkText: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '500',
  },
});
