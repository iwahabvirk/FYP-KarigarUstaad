import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { colors } from '@/constants/colors';

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  disabled?: boolean;
  size?: 'small' | 'medium' | 'large';
  style?: ViewStyle;
}

export const Button: React.FC<ButtonProps> = ({
  label,
  onPress,
  variant = 'primary',
  disabled = false,
  size = 'medium',
  style,
}) => {
  const buttonStyles = getButtonStyle(variant, size, disabled);
  const textStyles = getTextStyle(variant, size);

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={[buttonStyles, style]}
    >
      <Text style={textStyles}>{label}</Text>
    </TouchableOpacity>
  );
};

const getButtonStyle = (
  variant: 'primary' | 'secondary' | 'outline',
  size: 'small' | 'medium' | 'large',
  disabled: boolean,
): ViewStyle => {
  const baseStyle: ViewStyle = {
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    opacity: disabled ? 0.6 : 1,
  };

  const sizeStyles = {
    small: { paddingVertical: 8, paddingHorizontal: 12 },
    medium: { paddingVertical: 12, paddingHorizontal: 24 },
    large: { paddingVertical: 14, paddingHorizontal: 32 },
  };

  const variantStyles = {
    primary: { backgroundColor: colors.primary },
    secondary: { backgroundColor: colors.secondary },
    outline: { backgroundColor: 'transparent', borderWidth: 1.5, borderColor: colors.primary },
  };

  return {
    ...baseStyle,
    ...sizeStyles[size],
    ...variantStyles[variant],
  };
};

const getTextStyle = (
  variant: 'primary' | 'secondary' | 'outline',
  size: 'small' | 'medium' | 'large',
): TextStyle => {
  const sizeStyles = {
    small: { fontSize: 12 },
    medium: { fontSize: 14 },
    large: { fontSize: 16 },
  };

  const variantStyles = {
    primary: { color: colors.white, fontWeight: '600' as const },
    secondary: { color: colors.white, fontWeight: '600' as const },
    outline: { color: colors.primary, fontWeight: '600' as const },
  };

  return {
    ...sizeStyles[size],
    ...variantStyles[variant],
  };
};
