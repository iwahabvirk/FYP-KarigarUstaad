import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { colors } from '@/constants/colors';

interface BadgeProps {
  label: string;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'info';
  size?: 'small' | 'medium';
  style?: ViewStyle;
  icon?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  label,
  variant = 'primary',
  size = 'medium',
  style,
  icon,
}) => {
  const badgeStyles = getBadgeStyle(variant, size);
  const textStyles = getTextStyle(variant, size);

  return (
    <View style={[badgeStyles, style]}>
      {icon && <Text style={[textStyles, { marginRight: 4 }]}>{icon}</Text>}
      <Text style={textStyles}>{label}</Text>
    </View>
  );
};

const getBadgeStyle = (
  variant: 'primary' | 'secondary' | 'success' | 'warning' | 'info',
  size: 'small' | 'medium',
): ViewStyle => {
  const baseStyle: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderRadius: 20,
    paddingHorizontal: size === 'small' ? 8 : 12,
    paddingVertical: size === 'small' ? 4 : 6,
  };

  const variantStyles = {
    primary: {
      backgroundColor: colors.primaryLight,
    },
    secondary: {
      backgroundColor: colors.secondaryLight,
    },
    success: {
      backgroundColor: colors.successLight,
    },
    warning: {
      backgroundColor: colors.warningLight,
    },
    info: {
      backgroundColor: colors.infoLight,
    },
  };

  return {
    ...baseStyle,
    ...variantStyles[variant],
  };
};

const getTextStyle = (
  variant: 'primary' | 'secondary' | 'success' | 'warning' | 'info',
  size: 'small' | 'medium',
) => {
  const sizeStyles = {
    small: { fontSize: 11 },
    medium: { fontSize: 12 },
  };

  const variantStyles = {
    primary: { color: colors.primaryDark },
    secondary: { color: colors.secondaryDark },
    success: { color: colors.success },
    warning: { color: colors.text },
    info: { color: colors.info },
  };

  return {
    ...sizeStyles[size],
    ...variantStyles[variant],
    fontWeight: '600',
    letterSpacing: 0.3,
  };
};