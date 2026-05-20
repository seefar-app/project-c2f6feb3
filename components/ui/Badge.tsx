import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

interface BadgeProps {
  label: string;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info' | 'verified';
  size?: 'sm' | 'md';
  icon?: keyof typeof Ionicons.glyphMap;
}

export const Badge: React.FC<BadgeProps> = ({
  label,
  variant = 'default',
  size = 'sm',
  icon,
}) => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];

  const getVariantColors = () => {
    switch (variant) {
      case 'success':
        return { bg: '#dcfce7', text: '#166534', iconColor: '#16a34a' };
      case 'warning':
        return { bg: '#fef3c7', text: '#92400e', iconColor: '#d97706' };
      case 'error':
        return { bg: '#fee2e2', text: '#991b1b', iconColor: '#dc2626' };
      case 'info':
        return { bg: '#dbeafe', text: '#1e40af', iconColor: '#2563eb' };
      case 'verified':
        return { bg: '#e9d5ff', text: '#6b21a8', iconColor: '#9333ea' };
      default:
        return { bg: colors.backgroundSecondary, text: colors.textSecondary, iconColor: colors.icon };
    }
  };

  const variantColors = getVariantColors();

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: variantColors.bg,
          paddingVertical: size === 'sm' ? 4 : 6,
          paddingHorizontal: size === 'sm' ? 8 : 12,
        },
      ]}
    >
      {icon && (
        <Ionicons
          name={icon}
          size={size === 'sm' ? 12 : 14}
          color={variantColors.iconColor}
          style={styles.icon}
        />
      )}
      <Text
        style={[
          styles.text,
          {
            color: variantColors.text,
            fontSize: size === 'sm' ? 11 : 13,
          },
        ]}
      >
        {label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 100,
    alignSelf: 'flex-start',
  },
  icon: {
    marginRight: 4,
  },
  text: {
    fontWeight: '600',
  },
});