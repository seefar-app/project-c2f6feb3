import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Pressable,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Avatar } from '@/components/ui/Avatar';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useAuthStore } from '@/store/useAuthStore';
import { useStore } from '@/store/useStore';

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];
  const { user, logout } = useAuthStore();
  const { favorites, appointments } = useStore();

  const handleLogout = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Sign Out', 
          style: 'destructive',
          onPress: async () => {
            await logout();
            router.replace('/(auth)/login');
          }
        },
      ]
    );
  };

  const menuItems = [
    { icon: 'person-outline', label: 'Edit Profile', screen: '' },
    { icon: 'notifications-outline', label: 'Notifications', screen: '' },
    { icon: 'shield-checkmark-outline', label: 'Verification', screen: '' },
    { icon: 'card-outline', label: 'Payment Methods', screen: '' },
    { icon: 'language-outline', label: 'Language', value: 'English', screen: '' },
    { icon: 'moon-outline', label: 'Dark Mode', toggle: true, screen: '' },
    { icon: 'help-circle-outline', label: 'Help & Support', screen: '' },
    { icon: 'document-text-outline', label: 'Terms & Privacy', screen: '' },
  ];

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={{ paddingBottom: 100 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <LinearGradient
        colors={Colors.gradient.hero}
        style={[styles.header, { paddingTop: insets.top + 20 }]}
      >
        <View style={styles.profileInfo}>
          <Avatar
            source={user?.profileImage}
            name={user?.name}
            size="xl"
          />
          <Text style={styles.userName}>{user?.name || 'Guest User'}</Text>
          <Text style={styles.userEmail}>{user?.email}</Text>
          <Badge 
            label={user?.role === 'agent' ? 'Verified Agent' : user?.role || 'Buyer'} 
            variant={user?.role === 'agent' ? 'verified' : 'default'} 
            icon={user?.role === 'agent' ? 'shield-checkmark' : undefined}
          />
        </View>
      </LinearGradient>

      {/* Stats */}
      <View style={styles.statsContainer}>
        <Card style={styles.statsCard}>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: colors.primary }]}>
                {favorites.length}
              </Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                Saved
              </Text>
            </View>
            <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: colors.primary }]}>
                {appointments.length}
              </Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                Appointments
              </Text>
            </View>
            <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: colors.primary }]}>
                12
              </Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                Views
              </Text>
            </View>
          </View>
        </Card>
      </View>

      {/* Menu */}
      <View style={styles.menuContainer}>
        {menuItems.map((item, index) => (
          <Pressable
            key={index}
            style={[styles.menuItem, { backgroundColor: colors.card }]}
            onPress={() => {}}
          >
            <View style={[styles.menuIconContainer, { backgroundColor: colors.secondary }]}>
              <Ionicons name={item.icon as any} size={20} color={colors.primary} />
            </View>
            <Text style={[styles.menuLabel, { color: colors.text }]}>{item.label}</Text>
            {item.value && (
              <Text style={[styles.menuValue, { color: colors.textSecondary }]}>
                {item.value}
              </Text>
            )}
            <Ionicons name="chevron-forward" size={20} color={colors.icon} />
          </Pressable>
        ))}
      </View>

      {/* Logout */}
      <View style={styles.logoutContainer}>
        <Button
          title="Sign Out"
          onPress={handleLogout}
          variant="destructive"
          icon="log-out-outline"
          fullWidth
        />
      </View>

      <Text style={[styles.version, { color: colors.textSecondary }]}>
        DarCom v1.0.0
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  profileInfo: {
    alignItems: 'center',
  },
  userName: {
    fontSize: 26,
    fontWeight: '800',
    color: '#ffffff',
    marginTop: 16,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 12,
  },
  statsContainer: {
    paddingHorizontal: 20,
    marginTop: -24,
  },
  statsCard: {
    shadowColor: '#9333ea',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  statValue: {
    fontSize: 28,
    fontWeight: '800',
  },
  statLabel: {
    fontSize: 13,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 40,
  },
  menuContainer: {
    paddingHorizontal: 20,
    paddingTop: 24,
    gap: 10,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
  },
  menuIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  menuLabel: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
  },
  menuValue: {
    fontSize: 14,
    marginRight: 8,
  },
  logoutContainer: {
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  version: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 24,
  },
});