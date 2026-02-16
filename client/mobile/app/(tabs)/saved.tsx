import React from 'react';
import { View, Text, StyleSheet, FlatList, SafeAreaView } from 'react-native';
import { Colors, Spacing, Typography } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { ObjectCard } from '@/components/ObjectCard';

export default function SavedScreen() {
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme ?? 'light'];

    // This will be connected to a real storage/context later
    const savedObjects: any[] = [];

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
            <View style={styles.header}>
                <Text style={[styles.title, { color: theme.text }]}>Saved Objects</Text>
            </View>

            {savedObjects.length === 0 ? (
                <View style={styles.emptyState}>
                    <Text style={[styles.emptyText, { color: theme.muted }]}>No saved objects yet.</Text>
                </View>
            ) : (
                <FlatList
                    data={savedObjects}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => <ObjectCard {...item} />}
                    contentContainerStyle={styles.list}
                    numColumns={2}
                    columnWrapperStyle={styles.columnWrapper}
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
        padding: Spacing.xxl,
        paddingTop: Spacing.xl,
    },
    title: {
        fontSize: Typography.sizes.title,
        fontWeight: Typography.weights.bold,
    },
    list: {
        padding: Spacing.lg,
    },
    columnWrapper: {
        justifyContent: 'space-between',
    },
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: {
        fontSize: Typography.sizes.base,
    },
});
