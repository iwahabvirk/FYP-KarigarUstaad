import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
  Switch,
} from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors } from '@/constants/colors';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';


export default function WorkerProfileScreen() {
  const router = useRouter();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [profileCompletion, setProfileCompletion] = useState(85);

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
          await AsyncStorage.removeItem('userToken');
          router.replace('/(auth)/login');
        },
      },
    ]);
  };

  const handleEditProfile = () => {
    Alert.alert('Edit Profile', 'Edit profile feature coming soon!');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Profile</Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.closeIcon}>✕</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Card style={styles.profileCard}>
          <View style={styles.profileHeader}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>AK</Text>
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.name}>Arun Kumar</Text>
              <Text style={styles.role}>Service Provider</Text>
              <View style={styles.ratingContainer}>
                <Text style={styles.ratingStars}>★ ★ ★ ★ ★</Text>
                <Text style={styles.rating}>4.8 (142 reviews)</Text>
              </View>
            </View>
            <View style={styles.verifiedBadge}>
              <Text style={styles.verifiedText}>✓ Verified</Text>
            </View>
          </View>
        </Card>

        <Card>
          <Text style={styles.sectionTitle}>Profile Completion</Text>
          <View style={styles.completionBar}>
            <View style={[styles.completionFill, { width: `${profileCompletion}%` }]} />
          </View>
          <Text style={styles.completionText}>{profileCompletion}% Complete</Text>
          <Text style={styles.completionHint}>Complete your profile to get more jobs</Text>
        </Card>

        <Card>
          <Text style={styles.sectionTitle}>Statistics</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>Rs. 25,000</Text>
              <Text style={styles.statLabel}>Total Earnings</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>156</Text>
              <Text style={styles.statLabel}>Jobs Done</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>98%</Text>
              <Text style={styles.statLabel}>Completion</Text>
            </View>
          </View>
        </Card>

        <Card>
          <Text style={styles.sectionTitle}>Skills</Text>
          <View style={styles.skillsContainer}>
            <View style={styles.skillTag}>
              <Text style={styles.skillTagText}>⚡ Electrical Work</Text>
            </View>
            <View style={styles.skillTag}>
              <Text style={styles.skillTagText}>🔋 Installations</Text>
            </View>
            <View style={styles.skillTag}>
              <Text style={styles.skillTagText}>✓ Verified</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.addSkillButton}>
            <Text style={styles.addSkillText}>+ Add More Skills</Text>
          </TouchableOpacity>
        </Card>

        <Card>
          <Text style={styles.sectionTitle}>Earnings This Month</Text>
          <View style={styles.earningCard}>
            <Text style={styles.earningAmount}>Rs. 25,000</Text>
            <Text style={styles.earningDesc}>45 jobs completed</Text>
          </View>
          <TouchableOpacity style={styles.withdrawButton}>
            <Text style={styles.withdrawButtonText}>💰 Request Withdrawal</Text>
          </TouchableOpacity>
        </Card>

        <Card>
          <Text style={styles.sectionTitle}>Settings</Text>
          <View style={styles.settingRow}>
            <View>
              <Text style={styles.settingLabel}>Push Notifications</Text>
              <Text style={styles.settingDesc}>Receive job alerts instantly</Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: '#ccc', true: colors.primary }}
              thumbColor={notificationsEnabled ? colors.primary : '#f4f3f4'}
            />
          </View>
          <View style={styles.divider} />
          <View style={styles.settingRow}>
            <View>
              <Text style={styles.settingLabel}>Availability Status</Text>
              <Text style={styles.settingDesc}>Show you're online to customers</Text>
            </View>
            <Switch
              value={true}
              onValueChange={() => {}}
              trackColor={{ false: '#ccc', true: colors.primary }}
              thumbColor="#f4f3f4"
            />
          </View>
        </Card>

        <Card>
          <Text style={styles.sectionTitle}>About</Text>
          <Text style={styles.aboutText}>
            I'm a certified electrician with 8+ years of experience in residential and commercial wiring. 
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
          />
          <Button
            label="Logout"
            onPress={handleLogout}
            variant="outline"
            size="large"
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
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
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
    marginBottom: 16,
    backgroundColor: '#E3F2FD',
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.white,
  },
  profileInfo: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  role: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 6,
  },
  ratingStars: {
    fontSize: 12,
    color: '#FFB800',
  },
  rating: {
    fontSize: 12,
    color: colors.text,
    fontWeight: '600',
  },
  verifiedBadge: {
    backgroundColor: colors.success,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  verifiedText: {
    fontSize: 11,
    color: colors.white,
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 12,
  },
  completionBar: {
    height: 8,
    backgroundColor: colors.grayLight,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 10,
  },
  completionFill: {
    height: '100%',
    backgroundColor: colors.primary,
  },
  completionText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  completionHint: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  statDivider: {
    width: 1,
    backgroundColor: colors.grayLight,
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  skillTag: {
    backgroundColor: '#FFF3E0',
    borderWidth: 1,
    borderColor: colors.accent,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  skillTagText: {
    fontSize: 12,
    color: colors.text,
    fontWeight: '600',
  },
  addSkillButton: {
    paddingVertical: 10,
    alignItems: 'center',
  },
  addSkillText: {
    fontSize: 13,
    color: colors.primary,
    fontWeight: '600',
  },
  earningCard: {
    backgroundColor: '#E3F2FD',
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  earningAmount: {
    fontSize: 26,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 4,
  },
  earningDesc: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  withdrawButton: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: '#E8F5E9',
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.success,
  },
  withdrawButtonText: {
    fontSize: 13,
    color: colors.text,
    fontWeight: '600',
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  settingLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  settingDesc: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: colors.grayLight,
  },
  aboutText: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: 12,
  },
  editAboutButton: {
    paddingVertical: 10,
    alignItems: 'center',
  },
  editAboutText: {
    fontSize: 13,
    color: colors.primary,
    fontWeight: '600',
  },
  helpCard: {
    marginBottom: 16,
  },
  helpLink: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.grayLight,
  },
  helpLinkText: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '500',
  },
  footer: {
    flexDirection: 'column',
    gap: 12,
    marginTop: 20,
    marginBottom: 24,
  },
});
