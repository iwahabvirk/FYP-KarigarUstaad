import React, { useRef } from 'react';
import { View, StyleSheet, ViewStyle, Animated, TouchableOpacity, Platform } from 'react-native';
import { colors } from '@/constants/colors';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  onPress?: () => void;
  interactive?: boolean;
  variant?: 'default' | 'elevated' | 'outlined';
}

export const Card: React.FC<CardProps> = ({
  children,
  style,
  onPress,
  interactive = false,
  variant = 'default'
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const elevationAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    if (interactive) {
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 1.02,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(elevationAnim, {
          toValue: 1.5,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();
    }
  };

  const handlePressOut = () => {
    if (interactive) {
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(elevationAnim, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();
    }
  };

  const cardStyles = getCardStyle(variant);

  const CardComponent = onPress ? TouchableOpacity : View;
  const cardProps = onPress ? {
    onPress,
    onPressIn: handlePressIn,
    onPressOut: handlePressOut,
    activeOpacity: Platform.OS === 'ios' ? 0.8 : 1,
  } : {};

  return (
    <Animated.View
      style={[
        {
          transform: [{ scale: scaleAnim }],
          shadowOpacity: elevationAnim.interpolate({
            inputRange: [1, 1.5],
            outputRange: [cardStyles.shadowOpacity || 0.1, (cardStyles.shadowOpacity || 0.1) * 1.5],
          }),
          elevation: elevationAnim.interpolate({
            inputRange: [1, 1.5],
            outputRange: [cardStyles.elevation || 3, (cardStyles.elevation || 3) * 1.5],
          }),
        },
        style,
      ]}
    >
      <CardComponent {...cardProps} style={cardStyles}>
        {children}
      </CardComponent>
    </Animated.View>
  );
};

const getCardStyle = (variant: 'default' | 'elevated' | 'outlined'): ViewStyle => {
  const baseStyle: ViewStyle = {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  };

  const variantStyles = {
    default: {
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 3,
    },
    elevated: {
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 12,
      elevation: 6,
    },
    outlined: {
      borderWidth: 1,
      borderColor: colors.borderLight,
      shadowOpacity: 0,
      elevation: 0,
    },
  };

  return {
    ...baseStyle,
    ...variantStyles[variant],
  };
};
