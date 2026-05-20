import React from 'react';
import { View, Text, Pressable, StyleSheet, Animated } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import { Property } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useStore } from '@/store/useStore';

interface PropertyCardProps {
  property: Property;
  variant?: 'default' | 'horizontal' | 'featured';
}

export const PropertyCard: React.FC<PropertyCardProps> = ({
  property,
  variant = 'default',
}) => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];
  const { toggleFavorite, isFavorite } = useStore();
  const scaleAnim = React.useRef(new Animated.Value(1)).current;
  const isFav = isFavorite(property.id);

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.98,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push(`/property/${property.id}`);
  };

  const handleFavorite = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    toggleFavorite(property.id);
  };

  const formatPrice = (price: number) => {
    if (price >= 1000000) {
      return `${(price / 1000000).toFixed(1)}M DZD`;
    }
    return `${(price / 1000).toFixed(0)}K DZD`;
  };

  if (variant === 'horizontal') {
    return (
      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <Pressable
          onPress={handlePress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          style={[styles.horizontalCard, { backgroundColor: colors.card }]}
        >
          <Image
            source={{ uri: property.images[0] }}
            style={styles.horizontalImage}
            contentFit="cover"
            transition={200}
          />
          <View style={styles.horizontalContent}>
            <Text style={[styles.horizontalTitle, { color: colors.text }]} numberOfLines={1}>
              {property.title}
            </Text>
            <View style={styles.locationRow}>
              <Ionicons name="location" size={14} color={colors.textSecondary} />
              <Text style={[styles.locationText, { color: colors.textSecondary }]} numberOfLines={1}>
                {property.commune}, {property.wilaya}
              </Text>
            </View>
            <View style={styles.statsRow}>
              <View style={styles.stat}>
                <Ionicons name="bed-outline" size={14} color={colors.icon} />
                <Text style={[styles.statText, { color: colors.textSecondary }]}>{property.bedrooms}</Text>
              </View>
              <View style={styles.stat}>
                <Ionicons name="water-outline" size={14} color={colors.icon} />
                <Text style={[styles.statText, { color: colors.textSecondary }]}>{property.bathrooms}</Text>
              </View>
              <View style={styles.stat}>
                <Ionicons name="resize-outline" size={14} color={colors.icon} />
                <Text style={[styles.statText, { color: colors.textSecondary }]}>{property.area}m²</Text>
              </View>
            </View>
            <Text style={[styles.horizontalPrice, { color: colors.primary }]}>
              {formatPrice(property.price)}
            </Text>
          </View>
        </Pressable>
      </Animated.View>
    );
  }

  if (variant === 'featured') {
    return (
      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <Pressable
          onPress={handlePress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          style={[styles.featuredCard, { backgroundColor: colors.card }]}
        >
          <View style={styles.featuredImageContainer}>
            <Image
              source={{ uri: property.images[0] }}
              style={styles.featuredImage}
              contentFit="cover"
              transition={200}
            />
            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.7)']}
              style={styles.featuredGradient}
            />
            <View style={styles.featuredOverlay}>
              <View style={styles.badgeContainer}>
                {property.isVerified && (
                  <Badge label="Verified" variant="verified" icon="shield-checkmark" />
                )}
                <Badge label={property.type} variant="default" />
              </View>
              <Pressable onPress={handleFavorite} style={styles.favoriteButton}>
                <Ionicons
                  name={isFav ? 'heart' : 'heart-outline'}
                  size={24}
                  color={isFav ? '#ef4444' : '#ffffff'}
                />
              </Pressable>
            </View>
            <View style={styles.featuredBottom}>
              <Text style={styles.featuredPrice}>{formatPrice(property.price)}</Text>
            </View>
          </View>
          <View style={styles.featuredContent}>
            <Text style={[styles.featuredTitle, { color: colors.text }]} numberOfLines={1}>
              {property.title}
            </Text>
            <View style={styles.locationRow}>
              <Ionicons name="location" size={14} color={colors.primary} />
              <Text style={[styles.featuredLocation, { color: colors.textSecondary }]}>
                {property.commune}, {property.wilaya}
              </Text>
            </View>
            <View style={styles.featuredStats}>
              <View style={styles.stat}>
                <Ionicons name="bed-outline" size={16} color={colors.icon} />
                <Text style={[styles.statText, { color: colors.textSecondary }]}>{property.bedrooms} beds</Text>
              </View>
              <View style={styles.stat}>
                <Ionicons name="water-outline" size={16} color={colors.icon} />
                <Text style={[styles.statText, { color: colors.textSecondary }]}>{property.bathrooms} baths</Text>
              </View>
              <View style={styles.stat}>
                <Ionicons name="resize-outline" size={16} color={colors.icon} />
                <Text style={[styles.statText, { color: colors.textSecondary }]}>{property.area}m²</Text>
              </View>
            </View>
          </View>
        </Pressable>
      </Animated.View>
    );
  }

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <Pressable
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[styles.card, { backgroundColor: colors.card }]}
      >
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: property.images[0] }}
            style={styles.image}
            contentFit="cover"
            transition={200}
          />
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.5)']}
            style={styles.gradient}
          />
          <View style={styles.overlay}>
            <View style={styles.badgeContainer}>
              {property.isVerified && (
                <Badge label="Verified" variant="verified" icon="shield-checkmark" />
              )}
            </View>
            <Pressable onPress={handleFavorite} style={styles.favoriteButton}>
              <Ionicons
                name={isFav ? 'heart' : 'heart-outline'}
                size={22}
                color={isFav ? '#ef4444' : '#ffffff'}
              />
            </Pressable>
          </View>
          <View style={styles.priceTag}>
            <Text style={styles.priceText}>{formatPrice(property.price)}</Text>
          </View>
        </View>
        <View style={styles.content}>
          <Text style={[styles.title, { color: colors.text }]} numberOfLines={1}>
            {property.title}
          </Text>
          <View style={styles.locationRow}>
            <Ionicons name="location" size={14} color={colors.primary} />
            <Text style={[styles.location, { color: colors.textSecondary }]} numberOfLines={1}>
              {property.commune}, {property.wilaya}
            </Text>
          </View>
          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <Ionicons name="bed-outline" size={16} color={colors.icon} />
              <Text style={[styles.statText, { color: colors.textSecondary }]}>{property.bedrooms}</Text>
            </View>
            <View style={styles.stat}>
              <Ionicons name="water-outline" size={16} color={colors.icon} />
              <Text style={[styles.statText, { color: colors.textSecondary }]}>{property.bathrooms}</Text>
            </View>
            <View style={styles.stat}>
              <Ionicons name="resize-outline" size={16} color={colors.icon} />
              <Text style={[styles.statText, { color: colors.textSecondary }]}>{property.area}m²</Text>
            </View>
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  imageContainer: {
    height: 180,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
  },
  overlay: {
    position: 'absolute',
    top: 12,
    left: 12,
    right: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  badgeContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  favoriteButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  priceTag: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    backgroundColor: 'rgba(147, 51, 234, 0.9)',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 100,
  },
  priceText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 6,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  location: {
    fontSize: 14,
    marginLeft: 4,
    flex: 1,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 16,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 14,
  },
  horizontalCard: {
    flexDirection: 'row',
    borderRadius: 16,
    marginBottom: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  horizontalImage: {
    width: 120,
    height: 120,
  },
  horizontalContent: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
  },
  horizontalTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  horizontalPrice: {
    fontSize: 16,
    fontWeight: '700',
  },
  locationText: {
    fontSize: 13,
    marginLeft: 4,
    flex: 1,
  },
  featuredCard: {
    width: 280,
    borderRadius: 20,
    marginRight: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  featuredImageContainer: {
    height: 180,
    position: 'relative',
  },
  featuredImage: {
    width: '100%',
    height: '100%',
  },
  featuredGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  featuredOverlay: {
    position: 'absolute',
    top: 12,
    left: 12,
    right: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  featuredBottom: {
    position: 'absolute',
    bottom: 12,
    left: 12,
  },
  featuredPrice: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '800',
  },
  featuredContent: {
    padding: 16,
  },
  featuredTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  featuredLocation: {
    fontSize: 14,
    marginLeft: 4,
  },
  featuredStats: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
  },
});