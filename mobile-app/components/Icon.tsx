import React from 'react';
import { Text, StyleSheet, TextStyle } from 'react-native';
import { colors } from '@/constants/colors';

interface IconProps {
  name: string;
  size?: number;
  color?: string;
  style?: TextStyle;
}

export const Icon: React.FC<IconProps> = ({
  name,
  size = 24,
  color = colors.text,
  style,
}) => {
  return (
    <Text
      style={[
        styles.icon,
        {
          fontSize: size,
          color,
        },
        style,
      ]}
    >
      {name}
    </Text>
  );
};

const styles = StyleSheet.create({
  icon: {
    textAlign: 'center',
  },
});

// Common icons
export const Icons = {
  star: '⭐',
  starOutline: '☆',
  location: '📍',
  user: '👤',
  phone: '📞',
  email: '✉️',
  check: '✅',
  checkCircle: '✔',
  cross: '✕',
  plus: '➕',
  minus: '➖',
  arrowRight: '→',
  arrowLeft: '←',
  arrowUp: '↑',
  arrowDown: '↓',
  home: '🏠',
  work: '💼',
  time: '⏰',
  calendar: '📅',
  money: '💰',
  heart: '❤️',
  chat: '💬',
  notification: '🔔',
  settings: '⚙️',
  search: '🔍',
  filter: '🔽',
  menu: '☰',
  close: '✕',
  edit: '✏️',
  delete: '🗑️',
  share: '📤',
  bookmark: '🔖',
  camera: '📷',
  image: '🖼️',
  video: '🎥',
  music: '🎵',
  map: '🗺️',
  wifi: '📶',
  battery: '🔋',
  signal: '📡',
  lock: '🔒',
  unlock: '🔓',
  key: '🔑',
  shield: '🛡️',
  warning: '⚠️',
  error: '❌',
  success: '✅',
  info: 'ℹ️',
  question: '❓',
  lightbulb: '💡',
  fire: '🔥',
  water: '💧',
  earth: '🌍',
  air: '💨',
};