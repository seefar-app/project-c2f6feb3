import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

interface MapCardProps {
  latitude: number;
  longitude: number;
  title?: string;
  address?: string;
  onPress?: () => void;
}

export const MapCard: React.FC<MapCardProps> = ({
  latitude,
  longitude,
  title,
  address,
  onPress,
}) => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];

  return (
    <Pressable onPress={onPress} style={[styles.container, { backgroundColor: colors.card }]}>
      <View style={styles.mapContainer}>
        <MapView
          style={styles.map}
          initialRegion={{
            latitude,
            longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
          scrollEnabled={false}
          zoomEnabled={false}
          pitchEnabled={false}
          rotateEnabled={false}
        >
          <Marker coordinate={{ latitude, longitude }}>
            <View style={[styles.markerContainer, { backgroundColor: colors.primary }]}>
              <Ionicons name="home" size={16} color="#ffffff" />
            </View>
          </Marker>
        </MapView>
      </View>
      {(title || address) && (
        <View style={styles.infoContainer}>
          {title && <Text style={[styles.title, { color: colors.text }]}>{title}</Text>}
          {address && (
            <View style={styles.addressRow}>
              <Ionicons name="location" size={14} color={colors.primary} />
              <Text style={[styles.address, { color: colors.textSecondary }]} numberOfLines={2}>
                {address}
              </Text>
            </View>
          )}
          <View style={styles.viewMore}>
            <Text style={[styles.viewMoreText, { color: colors.primary }]}>View on map</Text>
            <Ionicons name="chevron-forward" size={16} color={colors.primary} />
          </View>
        </View>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  mapContainer: {
    height: 150,
    borderRadius: 20,
    overflow: 'hidden',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  markerContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  infoContainer: {
    padding: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  address: {
    fontSize: 14,
    marginLeft: 4,
    flex: 1,
  },
  viewMore: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewMoreText: {
    fontSize: 14,
    fontWeight: '600',
  },
});