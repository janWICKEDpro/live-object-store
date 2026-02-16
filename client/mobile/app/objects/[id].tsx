import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, SafeAreaView, ActivityIndicator, TouchableOpacity, Alert, Platform } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { Colors, Spacing, Typography, BorderRadius } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system/legacy';
import { Button } from '@/components/ui/Button';
import { Heart, Trash2, Download, ChevronLeft, Calendar, HardDrive, FileCode } from 'lucide-react-native';
import { formatBytes } from '@/lib/utils';

export default function ObjectDetailsScreen() {
    const { id } = useLocalSearchParams();
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme ?? 'light'];
    const [object, setObject] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isSaved, setIsSaved] = useState(false);
    const router = useRouter();

    useEffect(() => {
        fetchObject();
    }, [id]);

    const fetchObject = async () => {
        try {
            setLoading(true);
            const apiUrl = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';
            const response = await fetch(`${apiUrl}/objects/${id}`);
            const data = await response.json();
            setObject(data.data);
        } catch (error) {
            console.error('Error fetching object:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleToggleSave = () => {
        setIsSaved(!isSaved);
        // In a real app, this would update local storage or a context
    };

    const handleDelete = async () => {
        Alert.alert(
            'Delete Object',
            'Are you sure you want to delete this object?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            const apiUrl = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';
                            const response = await fetch(`${apiUrl}/objects/${id}`, {
                                method: 'DELETE',
                            });
                            if (response.ok) {
                                router.replace('/');
                            }
                        } catch (error) {
                            console.error(error);
                            alert('Failed to delete object');
                        }
                    }
                },
            ]
        );
    };

    const handleDownload = async () => {
        if (!object?.imageUrl) return;

        try {
            const filename = object.imageUrl.split('/').pop();
            const fileUri = (FileSystem.documentDirectory || '') + filename;

            const downloadRes = await FileSystem.downloadAsync(object.imageUrl, fileUri);

            if (downloadRes.status === 200) {
                if (await Sharing.isAvailableAsync()) {
                    await Sharing.shareAsync(downloadRes.uri);
                } else {
                    alert('Sharing is not available on this device');
                }
            }
        } catch (error) {
            console.error(error);
            alert('Failed to download object');
        }
    };

    if (loading) {
        return (
            <View style={[styles.center, { backgroundColor: theme.background }]}>
                <ActivityIndicator size="large" color={theme.primary} />
            </View>
        );
    }

    if (!object) {
        return (
            <View style={[styles.center, { backgroundColor: theme.background }]}>
                <Text style={{ color: theme.text }}>Object not found</Text>
                <Button title="Go Back" onPress={() => router.back()} style={{ marginTop: Spacing.lg }} />
            </View>
        );
    }

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
            <Stack.Screen options={{
                headerShown: Platform.OS === 'ios',
                title: 'Details',
                headerBackTitle: 'Back'
            }} />

            {Platform.OS === 'android' && (
                <View style={styles.header}>
                    <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                        <View style={[styles.iconCircle, { backgroundColor: theme.surface }]}>
                            <ChevronLeft color={theme.text} size={24} />
                        </View>
                    </TouchableOpacity>
                    <Text style={[styles.headerTitle, { color: theme.text }]}>Details</Text>
                    <View style={{ width: 44 }} />
                </View>
            )}

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={[styles.imageContainer, { backgroundColor: theme.surface }]}>
                    <Image source={{ uri: object.imageUrl }} style={styles.image} resizeMode="cover" />
                </View>

                <View style={styles.content}>
                    <Text style={[styles.title, { color: theme.text }]}>{object.title}</Text>
                    <Text style={[styles.description, { color: theme.muted }]}>{object.description}</Text>

                    <View style={styles.actions}>
                        <Button
                            title={isSaved ? "Saved" : "Save"}
                            variant={isSaved ? "primary" : "outline"}
                            onPress={handleToggleSave}
                            icon={<Heart color={isSaved ? "white" : theme.primary} size={20} fill={isSaved ? "white" : "transparent"} />}
                            style={styles.actionButton}
                        />
                        <Button
                            title="Download"
                            variant="outline"
                            onPress={handleDownload}
                            icon={<Download color={theme.primary} size={20} />}
                            style={styles.actionButton}
                        />
                    </View>

                    <View style={[styles.fileInfoContainer, { backgroundColor: theme.surface }]}>
                        <Text style={[styles.infoTitle, { color: theme.text }]}>File Information</Text>

                        <View style={styles.infoRow}>
                            <View style={styles.infoLabelContainer}>
                                <Calendar size={16} color={theme.muted} />
                                <Text style={[styles.infoLabel, { color: theme.muted }]}>Date Added</Text>
                            </View>
                            <Text style={[styles.infoValue, { color: theme.text }]}>
                                {new Date(object.createdAt).toLocaleDateString()}
                            </Text>
                        </View>

                        <View style={styles.infoRow}>
                            <View style={styles.infoLabelContainer}>
                                <HardDrive size={16} color={theme.muted} />
                                <Text style={[styles.infoLabel, { color: theme.muted }]}>File Size</Text>
                            </View>
                            <Text style={[styles.infoValue, { color: theme.text }]}>
                                {object.size ? formatBytes(object.size) : 'Unknown'}
                            </Text>
                        </View>

                        <View style={styles.infoRow}>
                            <View style={styles.infoLabelContainer}>
                                <FileCode size={16} color={theme.muted} />
                                <Text style={[styles.infoLabel, { color: theme.muted }]}>Format</Text>
                            </View>
                            <Text style={[styles.infoValue, { color: theme.text }]}>
                                {object.imageUrl.split('.').pop()?.toUpperCase() || 'UNKNOWN'}
                            </Text>
                        </View>
                    </View>

                    <Button
                        title="Delete Object"
                        variant="ghost"
                        onPress={handleDelete}
                        icon={<Trash2 color={theme.error} size={20} />}
                        textStyle={{ color: theme.error }}
                        style={{ marginTop: Spacing.xl, marginBottom: Spacing.section }}
                    />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        paddingHorizontal: Spacing.xl,
        paddingVertical: Spacing.md,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    backButton: {
        width: 44,
        height: 44,
        justifyContent: 'center',
    },
    iconCircle: {
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    headerTitle: {
        fontSize: Typography.sizes.lg,
        fontWeight: '700',
    },
    scrollContent: {
        paddingBottom: Spacing.section,
    },
    imageContainer: {
        width: '100%',
        aspectRatio: 1,
        marginBottom: Spacing.xxl,
    },
    image: {
        width: '100%',
        height: '100%',
    },
    content: {
        paddingHorizontal: Spacing.xxl,
    },
    title: {
        fontSize: Typography.sizes.xxl,
        fontWeight: '700',
        marginBottom: Spacing.md,
    },
    description: {
        fontSize: Typography.sizes.base,
        lineHeight: 22,
        marginBottom: Spacing.xxl,
    },
    actions: {
        flexDirection: 'row',
        gap: Spacing.md,
    },
    actionButton: {
        flex: 1,
    },
    fileInfoContainer: {
        marginTop: Spacing.section,
        padding: Spacing.xl,
        borderRadius: BorderRadius.xl,
        borderWidth: 1,
        borderColor: '#f0f0f0',
    },
    infoTitle: {
        fontSize: Typography.sizes.md,
        fontWeight: '700',
        marginBottom: Spacing.lg,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: Spacing.sm,
    },
    infoLabelContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    infoLabel: {
        fontSize: Typography.sizes.sm,
    },
    infoValue: {
        fontSize: Typography.sizes.sm,
        fontWeight: '600',
    },
});
