import React, { useRef } from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  Animated,
  Platform,
} from 'react-native';
import { colors } from '@/constants/colors';

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'success';
  disabled?: boolean;
  size?: 'small' | 'medium' | 'large';
  style?: ViewStyle;
  loading?: boolean;
  icon?: string;
}

export const Button: React.FC<ButtonProps> = ({
  label,
  onPress,
  variant = 'primary',
  disabled = false,
  size = 'medium',
  style,
  loading = false,
  icon,
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 0.8,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handlePressOut = () => {
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const buttonStyles = getButtonStyle(variant, size, disabled || loading);
  const textStyles = getTextStyle(variant, size);

  return (
    <Animated.View
      style={[
        {
          transform: [{ scale: scaleAnim }],
          opacity: opacityAnim,
        },
        style,
      ]}
    >
      <TouchableOpacity
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled || loading}
        style={buttonStyles}
        activeOpacity={Platform.OS === 'ios' ? 0.7 : 1}
      >
        {loading ? (
          <Text style={textStyles}>Loading...</Text>
        ) : (
          <>
            {icon && <Text style={[textStyles, { marginRight: 8 }]}>{icon}</Text>}
            <Text style={textStyles}>{label}</Text>
          </>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

const getButtonStyle = (
  variant: 'primary' | 'secondary' | 'outline' | 'success',
  size: 'small' | 'medium' | 'large',
  disabled: boolean,
): ViewStyle => {
  const baseStyle: ViewStyle = {
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    opacity: disabled ? 0.5 : 1,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  };

  const sizeStyles = {
    small: { paddingVertical: 10, paddingHorizontal: 16, minWidth: 80 },
    medium: { paddingVertical: 14, paddingHorizontal: 24, minWidth: 120 },
    large: { paddingVertical: 16, paddingHorizontal: 32, minWidth: 160 },
  };

  const variantStyles = {
    primary: {
      backgroundColor: colors.primary,
      shadowColor: colors.primary,
      shadowOpacity: 0.3,
    },
    secondary: {
      backgroundColor: colors.secondary,
      shadowColor: colors.secondary,
      shadowOpacity: 0.3,
    },
    success: {
      backgroundColor: colors.success,
      shadowColor: colors.success,
      shadowOpacity: 0.3,
    },
    outline: {
      backgroundColor: 'transparent',
      borderWidth: 2,
      borderColor: colors.primary,
      shadowOpacity: 0,
      elevation: 0,
    },
  };

  return {
    ...baseStyle,
    ...sizeStyles[size],
    ...variantStyles[variant],
  };
};

const getTextStyle = (
  variant: 'primary' | 'secondary' | 'outline' | 'success',
  size: 'small' | 'medium' | 'large',
): TextStyle => {
  const sizeStyles = {
    small: { fontSize: 13 },
    medium: { fontSize: 15 },
    large: { fontSize: 17 },
  };

  const variantStyles = {
    primary: { color: colors.white, fontWeight: '700' as const },
    secondary: { color: colors.white, fontWeight: '700' as const },
    success: { color: colors.white, fontWeight: '700' as const },
    outline: { color: colors.primary, fontWeight: '700' as const },
  };

  return {
    ...sizeStyles[size],
    ...variantStyles[variant],
    textAlign: 'center',
    letterSpacing: 0.5,
  };
};
