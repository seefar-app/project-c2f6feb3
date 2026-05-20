import React from 'react';
import { View, Pressable, StyleSheet, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

interface CardProps {
  children: React.ReactNode;
  onPress?: () => void;
  variant?: 'default' | 'gradient' | 'outlined';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  style?: ViewStyle;
}

export const Card: React.FC<CardProps> = ({
  children,
  onPress,
  variant = 'default',
  padding = 'md',
  style,
}) => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];

  const paddingStyles = {
    none: 0,
    sm: 12,
    md: 16,
    lg: 24,
  };

  const baseStyle: ViewStyle = {
    borderRadius: 20,
    padding: paddingStyles[padding],
    overflow: 'hidden',
  };

  const variantStyles: ViewStyle = {
    default: {
      backgroundColor: colors.card,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: colorScheme === 'dark' ? 0.3 : 0.1,
      shadowRadius: 8,
      elevation: 4,
    },
    gradient: {},
    outlined: {
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: colors.border,
    },
  }[variant];

  if (variant === 'gradient') {
    const content = (
      <LinearGradient
        colors={[colors.primary, colors.primaryLight]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[baseStyle, style]}
      >
        {children}
      </LinearGradient>
    );

    if (onPress) {
      return (
        <Pressable onPress={onPress} style={({ pressed }) => ({ opacity: pressed ? 0.9 : 1 })}>
          {content}
        </Pressable>
      );
    }

    return content;
  }

  const cardContent = (
    <View style={[baseStyle, variantStyles, style]}>
      {children}
    </View>
  );

  if (onPress) {
    return (
      <Pressable 
        onPress={onPress} 
        style={({ pressed }) => ({ opacity: pressed ? 0.95 : 1 })}
      >
        {cardContent}
      </Pressable>
    );
  }

  return cardContent;
};