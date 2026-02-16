import { Tabs } from 'expo-router';
import React from 'react';
import { View, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Colors, Spacing, BorderRadius } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { LayoutGrid, Heart, Plus } from 'lucide-react-native';
import { useRouter } from 'expo-router';

function CustomTabBarButton({ children, onPress }: any) {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];

  return (
    <TouchableOpacity
      style={styles.plusButtonContainer}
      onPress={onPress}
      activeOpacity={0.9}
    >
      <View style={[styles.plusButton, { backgroundColor: theme.primary }]}>
        <Plus color={theme.primaryForeground} size={32} strokeWidth={2.5} />
      </View>
    </TouchableOpacity>
  );
}

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];
  const router = useRouter();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: theme.mutedForeground,
        tabBarStyle: {
          backgroundColor: theme.surface,
          borderTopWidth: 1,
          borderTopColor: theme.borderLight,
          height: Platform.OS === 'ios' ? 88 : 68,
          paddingBottom: Platform.OS === 'ios' ? 30 : 10,
          paddingTop: 10,
          elevation: 10,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.05,
          shadowRadius: 10,
        },
        headerShown: false,
        tabBarShowLabel: true,
        tabBarLabelStyle: {
          fontWeight: '600',
          fontSize: 10,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'HOME',
          tabBarIcon: ({ color }) => <LayoutGrid color={color} size={24} />,
        }}
      />

      <Tabs.Screen
        name="add-placeholder"
        options={{
          tabBarButton: (props) => (
            <CustomTabBarButton {...props} onPress={() => router.push('/modal')} />
          ),
        }}
      />

      <Tabs.Screen
        name="saved"
        options={{
          title: 'SAVED',
          tabBarIcon: ({ color }) => <Heart color={color} size={24} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  plusButtonContainer: {
    top: -20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  plusButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#F05A28',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 4,
    borderColor: '#FAFAFA', // Match background to create notch effect
  },
});
