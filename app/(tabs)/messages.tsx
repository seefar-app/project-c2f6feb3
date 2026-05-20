import React, { useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList,
  Pressable,
  Animated,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useStore } from '@/store/useStore';
import { formatDistanceToNow } from 'date-fns';

export default function MessagesScreen() {
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];
  const { conversations } = useStore();

  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  const renderConversation = ({ item }: any) => (
    <Pressable 
      style={[styles.conversationCard, { backgroundColor: colors.card }]}
      onPress={() => {}}
    >
      <View style={styles.conversationLeft}>
        <Avatar 
          source={item.agent?.user?.profileImage} 
          name={item.agent?.user?.name}
          size="lg"
          showOnline
          isOnline={Math.random() > 0.5}
        />
      </View>
      <View style={styles.conversationContent}>
        <View style={styles.conversationHeader}>
          <Text style={[styles.agentName, { color: colors.text }]} numberOfLines={1}>
            {item.agent?.user?.name}
          </Text>
          <Text style={[styles.timestamp, { color: colors.textSecondary }]}>
            {formatDistanceToNow(new Date(item.lastMessage?.timestamp || new Date()), { addSuffix: false })}
          </Text>
        </View>
        {item.property && (
          <View style={styles.propertyTag}>
            <Ionicons name="home" size={12} color={colors.primary} />
            <Text style={[styles.propertyName, { color: colors.primary }]} numberOfLines={1}>
              {item.property.title}
            </Text>
          </View>
        )}
        <Text 
          style={[
            styles.lastMessage, 
            { color: item.unreadCount > 0 ? colors.text : colors.textSecondary },
            item.unreadCount > 0 && styles.unreadMessage,
          ]} 
          numberOfLines={1}
        >
          {item.lastMessage?.content}
        </Text>
      </View>
      {item.unreadCount > 0 && (
        <View style={[styles.unreadBadge, { backgroundColor: colors.primary }]}>
          <Text style={styles.unreadCount}>{item.unreadCount}</Text>
        </View>
      )}
    </Pressable>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <Text style={[styles.title, { color: colors.text }]}>Messages</Text>
        <Pressable style={[styles.newMessageButton, { backgroundColor: colors.primary }]}>
          <Ionicons name="create-outline" size={22} color="#ffffff" />
        </Pressable>
      </View>

      <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
        <FlatList
          data={conversations}
          keyExtractor={(item) => item.id}
          renderItem={renderConversation}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <View style={[styles.emptyIcon, { backgroundColor: colors.secondary }]}>
                <Ionicons name="chatbubbles-outline" size={48} color={colors.primary} />
              </View>
              <Text style={[styles.emptyTitle, { color: colors.text }]}>No messages yet</Text>
              <Text style={[styles.emptyDescription, { color: colors.textSecondary }]}>
                Contact agents to start conversations about properties
              </Text>
            </View>
          }
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
  },
  newMessageButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
    flexGrow: 1,
  },
  conversationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 20,
  },
  conversationLeft: {
    marginRight: 14,
  },
  conversationContent: {
    flex: 1,
  },
  conversationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  agentName: {
    fontSize: 16,
    fontWeight: '700',
    flex: 1,
  },
  timestamp: {
    fontSize: 12,
    marginLeft: 8,
  },
  propertyTag: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  propertyName: {
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 4,
    flex: 1,
  },
  lastMessage: {
    fontSize: 14,
  },
  unreadMessage: {
    fontWeight: '600',
  },
  unreadBadge: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  unreadCount: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '700',
  },
  separator: {
    height: 12,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
    paddingTop: 60,
  },
  emptyIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
  },
});