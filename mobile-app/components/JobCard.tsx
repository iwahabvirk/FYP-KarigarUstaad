import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '@/constants/colors';
import { Card } from './Card';
import { getCategoryLabel } from '@/constants/jobCategories';

interface JobCardProps {
  id: string;
  title: string;
  company: string;
  budget: string;
  category: string;
  onPress: () => void;
}

export const JobCard: React.FC<JobCardProps> = ({
  id,
  title,
  company,
  budget,
  category,
  onPress,
}) => {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <Card>
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Text style={styles.title} numberOfLines={2}>
              {title}
            </Text>
            <Text style={styles.company}>{company}</Text>
          </View>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{getCategoryLabel(category)}</Text>
          </View>
        </View>
        <View style={styles.footer}>
          <Text style={styles.budget}>${budget}</Text>
        </View>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  titleContainer: {
    flex: 1,
    marginRight: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  company: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  badge: {
    backgroundColor: colors.accent,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '500',
    color: colors.white,
  },
  footer: {
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: colors.grayLight,
  },
  budget: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primary,
  },
});
