import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, SafeAreaView, ActivityIndicator, Image, Dimensions } from 'react-native';
import { Colors, Spacing, Typography, BorderRadius } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { ObjectCard } from '@/components/ObjectCard';
import { Button } from '@/components/ui/Button';
import { Shimmer } from '@/components/ui/Shimmer';
import { Plus } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { io } from 'socket.io-client';

const { width } = Dimensions.get('window');
const LIST_ITEM_WIDTH = width - Spacing.xxl * 2;

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];
  const [objects, setObjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchObjects();

    const apiUrl = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';
    const socket = io(apiUrl);

    socket.on('connect', () => {
      setIsConnected(true);
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    socket.on('new_object', (newObject) => {
      setObjects((prev) => [newObject, ...prev]);
    });

    socket.on('delete_object', (deletedId) => {
      setObjects((prev) => prev.filter((obj) => obj.id !== deletedId));
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const fetchObjects = async () => {
    try {
      setLoading(true);
      const apiUrl = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';
      const response = await fetch(`${apiUrl}/objects`);
      const data = await response.json();
      setObjects(data.data || []);
    } catch (error) {
      console.error('Error fetching objects:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <View style={[styles.emptyIconContainer, { backgroundColor: theme.surface }]}>
        <View style={[styles.emptyIcon, { backgroundColor: theme.primaryLight }]}>
          <Image
            source={require('@/assets/images/icon.png')}
            style={{ width: 60, height: 60, tintColor: theme.primary }}
          />
        </View>
      </View>
      <Text style={[styles.emptyTitle, { color: theme.text }]}>Your collection is empty</Text>
      <Text style={[styles.emptySubtitle, { color: theme.muted }]}>
        Start building your live gallery by adding your first object.
      </Text>
      <Button
        title="Add First Object"
        onPress={() => router.push('/modal')}
        icon={<Plus color={theme.primaryForeground} size={20} />}
        style={{ marginTop: Spacing.xxl, width: '100%' }}
      />
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>Live Store</Text>
        <View style={[styles.liveBadge, { backgroundColor: isConnected ? '#F0FDF4' : '#FEF2F2' }]}>
          <View style={[styles.liveDot, { backgroundColor: isConnected ? '#22C55E' : '#EF4444' }]} />
          <Text style={[styles.liveText, { color: isConnected ? '#166534' : '#991B1B' }]}>
            {isConnected ? 'LIVE' : 'OFFLINE'}
          </Text>
        </View>
      </View>

      {loading ? (
        <View style={styles.list}>
          <Shimmer width={LIST_ITEM_WIDTH} height={320} borderRadius={24} />
          <View style={{ height: Spacing.lg }} />
          <Shimmer width={LIST_ITEM_WIDTH} height={320} borderRadius={24} />
          <View style={{ height: Spacing.lg }} />
          <Shimmer width={LIST_ITEM_WIDTH} height={320} borderRadius={24} />
        </View>
      ) : (
        <FlatList
          data={objects}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <ObjectCard {...item} />}
          contentContainerStyle={[styles.list, { paddingVertical: Spacing.xl }]}
          ListEmptyComponent={renderEmptyState}
          onRefresh={fetchObjects}
          refreshing={loading}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: Spacing.xxl,
    paddingVertical: Spacing.xl,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: Typography.sizes.title,
    fontWeight: Typography.weights.bold,
  },
  list: {
    padding: Spacing.lg,
    flexGrow: 1,
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDF4', // Light green
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: BorderRadius.full,
  },
  liveDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#22C55E', // Green
    marginRight: 6,
  },
  liveText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#166534',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.section,
    paddingTop: '30%',
  },
  emptyIconContainer: {
    width: 160,
    height: 160,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xxl,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 5,
  },
  emptyIcon: {
    width: 100,
    height: 100,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  emptySubtitle: {
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
  },
});
