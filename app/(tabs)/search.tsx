import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  Pressable,
  TextInput,
  Animated,
  LayoutAnimation,
  UIManager,
  Platform,
  Modal,
  ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import MapView, { Marker } from 'react-native-maps';
import { PropertyCard } from '@/components/shared/PropertyCard';
import { PropertyCardSkeleton, Skeleton } from '@/components/ui/Skeleton';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useStore } from '@/store/useStore';
import { Property, WILAYAS, SearchFilters } from '@/types';
import Slider from '@react-native-community/slider';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function SearchScreen() {
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];

  const { properties, searchFilters, searchProperties, isLoading, setSearchFilters, clearFilters } = useStore();

  const [searchQuery, setSearchQuery] = useState(searchFilters.query || '');
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [results, setResults] = useState<Property[]>([]);
  const [localFilters, setLocalFilters] = useState<SearchFilters>(searchFilters);

  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    performSearch();
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();
  }, []);

  const performSearch = async () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    const searchResults = await searchProperties({ ...localFilters, query: searchQuery });
    setResults(searchResults);
  };

  const handleApplyFilters = () => {
    setShowFilters(false);
    setSearchFilters(localFilters);
    performSearch();
  };

  const handleClearFilters = () => {
    setLocalFilters({});
    clearFilters();
    setSearchQuery('');
  };

  const togglePropertyType = (type: Property['type']) => {
    const currentTypes = localFilters.type || [];
    if (currentTypes.includes(type)) {
      setLocalFilters({ ...localFilters, type: currentTypes.filter(t => t !== type) });
    } else {
      setLocalFilters({ ...localFilters, type: [...currentTypes, type] });
    }
  };

  const propertyTypes: { value: Property['type']; label: string; icon: string }[] = [
    { value: 'apartment', label: 'Apartment', icon: 'business' },
    { value: 'villa', label: 'Villa', icon: 'home' },
    { value: 'land', label: 'Land', icon: 'map' },
    { value: 'commercial', label: 'Commercial', icon: 'storefront' },
  ];

  const activeFiltersCount = Object.values(localFilters).filter(v => v && (Array.isArray(v) ? v.length > 0 : true)).length;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 16, backgroundColor: colors.card }]}>
        <View style={styles.searchRow}>
          <View style={[styles.searchInput, { backgroundColor: colors.backgroundSecondary }]}>
            <Ionicons name="search" size={20} color={colors.textSecondary} />
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search properties..."
              placeholderTextColor={colors.textSecondary}
              style={[styles.input, { color: colors.text }]}
              onSubmitEditing={performSearch}
              returnKeyType="search"
            />
            {searchQuery.length > 0 && (
              <Pressable onPress={() => setSearchQuery('')}>
                <Ionicons name="close-circle" size={20} color={colors.textSecondary} />
              </Pressable>
            )}
          </View>
          <Pressable
            onPress={() => setShowFilters(true)}
            style={[styles.filterButton, { backgroundColor: colors.primary }]}
          >
            <Ionicons name="options" size={20} color="#ffffff" />
            {activeFiltersCount > 0 && (
              <View style={styles.filterBadge}>
                <Text style={styles.filterBadgeText}>{activeFiltersCount}</Text>
              </View>
            )}
          </Pressable>
        </View>

        {/* View Toggle & Results */}
        <View style={styles.resultsBar}>
          <Text style={[styles.resultsText, { color: colors.textSecondary }]}>
            {results.length} {results.length === 1 ? 'property' : 'properties'} found
          </Text>
          <View style={styles.viewToggle}>
            <Pressable
              onPress={() => setViewMode('list')}
              style={[
                styles.viewButton,
                viewMode === 'list' && { backgroundColor: colors.primary }
              ]}
            >
              <Ionicons 
                name="list" 
                size={18} 
                color={viewMode === 'list' ? '#ffffff' : colors.textSecondary} 
              />
            </Pressable>
            <Pressable
              onPress={() => setViewMode('map')}
              style={[
                styles.viewButton,
                viewMode === 'map' && { backgroundColor: colors.primary }
              ]}
            >
              <Ionicons 
                name="map" 
                size={18} 
                color={viewMode === 'map' ? '#ffffff' : colors.textSecondary} 
              />
            </Pressable>
          </View>
        </View>
      </View>

      {/* Content */}
      {viewMode === 'list' ? (
        <Animated.View style={[{ flex: 1, opacity: fadeAnim }]}>
          <FlatList
            data={results}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <PropertyCard property={item} />}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              isLoading ? (
                <View>
                  {[1, 2, 3].map(i => <PropertyCardSkeleton key={i} />)}
                </View>
              ) : (
                <View style={styles.emptyState}>
                  <Ionicons name="search" size={64} color={colors.border} />
                  <Text style={[styles.emptyTitle, { color: colors.text }]}>No properties found</Text>
                  <Text style={[styles.emptyDescription, { color: colors.textSecondary }]}>
                    Try adjusting your search or filters
                  </Text>
                  <Button
                    title="Clear Filters"
                    onPress={handleClearFilters}
                    variant="outline"
                    size="md"
                  />
                </View>
              )
            }
          />
        </Animated.View>
      ) : (
        <View style={styles.mapContainer}>
          <MapView
            style={StyleSheet.absoluteFillObject}
            initialRegion={{
              latitude: 36.7538,
              longitude: 3.0588,
              latitudeDelta: 0.5,
              longitudeDelta: 0.5,
            }}
          >
            {results.map((property) => (
              <Marker
                key={property.id}
                coordinate={{
                  latitude: property.latitude,
                  longitude: property.longitude,
                }}
                title={property.title}
                description={`${(property.price / 1000000).toFixed(1)}M DZD`}
              />
            ))}
          </MapView>
        </View>
      )}

      {/* Filter Modal */}
      <Modal
        visible={showFilters}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowFilters(false)}
      >
        <View style={[styles.modalContainer, { backgroundColor: colors.background }]}>
          <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Filters</Text>
            <Pressable onPress={() => setShowFilters(false)}>
              <Ionicons name="close" size={24} color={colors.text} />
            </Pressable>
          </View>

          <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
            {/* Property Type */}
            <View style={styles.filterSection}>
              <Text style={[styles.filterLabel, { color: colors.text }]}>Property Type</Text>
              <View style={styles.typeGrid}>
                {propertyTypes.map((type) => (
                  <Pressable
                    key={type.value}
                    onPress={() => togglePropertyType(type.value)}
                    style={[
                      styles.typeCard,
                      { 
                        backgroundColor: colors.card,
                        borderColor: localFilters.type?.includes(type.value) ? colors.primary : colors.border,
                        borderWidth: localFilters.type?.includes(type.value) ? 2 : 1,
                      }
                    ]}
                  >
                    <Ionicons 
                      name={type.icon as any} 
                      size={24} 
                      color={localFilters.type?.includes(type.value) ? colors.primary : colors.icon} 
                    />
                    <Text style={[
                      styles.typeLabel, 
                      { color: localFilters.type?.includes(type.value) ? colors.primary : colors.text }
                    ]}>
                      {type.label}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>

            {/* Price Range */}
            <View style={styles.filterSection}>
              <Text style={[styles.filterLabel, { color: colors.text }]}>
                Price Range: {((localFilters.minPrice || 0) / 1000000).toFixed(0)}M - {((localFilters.maxPrice || 200000000) / 1000000).toFixed(0)}M DZD
              </Text>
              <Slider
                style={styles.slider}
                minimumValue={0}
                maximumValue={200000000}
                step={5000000}
                value={localFilters.maxPrice || 200000000}
                onValueChange={(value) => setLocalFilters({ ...localFilters, maxPrice: value })}
                minimumTrackTintColor={colors.primary}
                maximumTrackTintColor={colors.border}
                thumbTintColor={colors.primary}
              />
            </View>

            {/* Bedrooms */}
            <View style={styles.filterSection}>
              <Text style={[styles.filterLabel, { color: colors.text }]}>Minimum Bedrooms</Text>
              <View style={styles.bedroomOptions}>
                {[0, 1, 2, 3, 4, 5].map((num) => (
                  <Pressable
                    key={num}
                    onPress={() => setLocalFilters({ ...localFilters, minBedrooms: num })}
                    style={[
                      styles.bedroomButton,
                      { 
                        backgroundColor: localFilters.minBedrooms === num ? colors.primary : colors.card,
                        borderColor: colors.border,
                      }
                    ]}
                  >
                    <Text style={[
                      styles.bedroomText,
                      { color: localFilters.minBedrooms === num ? '#ffffff' : colors.text }
                    ]}>
                      {num === 0 ? 'Any' : num === 5 ? '5+' : num}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>

            {/* Wilaya */}
            <View style={styles.filterSection}>
              <Text style={[styles.filterLabel, { color: colors.text }]}>Location (Wilaya)</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.wilayaList}>
                  <Pressable
                    onPress={() => setLocalFilters({ ...localFilters, wilaya: undefined })}
                    style={[
                      styles.wilayaChip,
                      { 
                        backgroundColor: !localFilters.wilaya ? colors.primary : colors.card,
                        borderColor: colors.border,
                      }
                    ]}
                  >
                    <Text style={[
                      styles.wilayaText,
                      { color: !localFilters.wilaya ? '#ffffff' : colors.text }
                    ]}>
                      All
                    </Text>
                  </Pressable>
                  {WILAYAS.slice(0, 10).map((wilaya) => (
                    <Pressable
                      key={wilaya}
                      onPress={() => setLocalFilters({ ...localFilters, wilaya })}
                      style={[
                        styles.wilayaChip,
                        { 
                          backgroundColor: localFilters.wilaya === wilaya ? colors.primary : colors.card,
                          borderColor: colors.border,
                        }
                      ]}
                    >
                      <Text style={[
                        styles.wilayaText,
                        { color: localFilters.wilaya === wilaya ? '#ffffff' : colors.text }
                      ]}>
                        {wilaya}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </ScrollView>
            </View>
          </ScrollView>

          <View style={[styles.modalFooter, { borderTopColor: colors.border }]}>
            <Button
              title="Clear All"
              onPress={handleClearFilters}
              variant="outline"
              size="md"
            />
            <View style={{ width: 12 }} />
            <View style={{ flex: 1 }}>
              <Button
                title="Apply Filters"
                onPress={handleApplyFilters}
                variant="primary"
                size="md"
                gradient
                fullWidth
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
    zIndex: 10,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  searchInput: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    height: 52,
    borderRadius: 16,
    gap: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
  },
  filterButton: {
    width: 52,
    height: 52,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  filterBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#ef4444',
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterBadgeText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '700',
  },
  resultsBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  resultsText: {
    fontSize: 14,
  },
  viewToggle: {
    flexDirection: 'row',
    borderRadius: 10,
    overflow: 'hidden',
  },
  viewButton: {
    width: 40,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listContent: {
    padding: 20,
    paddingBottom: 100,
  },
  mapContainer: {
    flex: 1,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    gap: 12,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginTop: 16,
  },
  emptyDescription: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 8,
  },
  modalContainer: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  filterSection: {
    marginBottom: 28,
  },
  filterLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  typeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  typeCard: {
    width: '47%',
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    gap: 8,
  },
  typeLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  slider: {
    width: '100%',
    height: 40,
  },
  bedroomOptions: {
    flexDirection: 'row',
    gap: 10,
  },
  bedroomButton: {
    width: 50,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  bedroomText: {
    fontSize: 14,
    fontWeight: '600',
  },
  wilayaList: {
    flexDirection: 'row',
    gap: 10,
  },
  wilayaChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 100,
    borderWidth: 1,
  },
  wilayaText: {
    fontSize: 14,
    fontWeight: '500',
  },
  modalFooter: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    paddingBottom: 32,
  },
});