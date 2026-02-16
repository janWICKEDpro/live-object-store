import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Colors, BorderRadius, Spacing, Typography } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Link } from 'expo-router';
import { Calendar, HardDrive, Heart } from 'lucide-react-native';

interface ObjectCardProps {
    id: string;
    title: string;
    description?: string;
    imageUrl: string;
    createdAt?: string;
    size?: string;
    onPress?: () => void;
}

const { width } = Dimensions.get('window');

export function ObjectCard({ id, title, description, imageUrl, createdAt, size, onPress }: ObjectCardProps) {
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme ?? 'light'];

    const formattedDate = createdAt
        ? new Date(createdAt).toLocaleDateString()
        : '2/16/2026';

    const displaySize = size || '12 MB';

    return (
        <Link href={`/objects/${id}`} asChild>
            <TouchableOpacity style={[styles.card, { backgroundColor: theme.surface }]} activeOpacity={0.9}>
                {/* Image Section */}
                <View style={styles.imageContainer}>
                    <Image source={{ uri: imageUrl }} style={styles.image} resizeMode="cover" />

                    {/* Active Badge */}
                    <View style={styles.badgeContainer}>
                        <Text style={styles.badgeText}>Active</Text>
                    </View>

                    {/* Heart Icon */}
                    <TouchableOpacity style={styles.heartButton} activeOpacity={0.7}>
                        <Heart size={18} color="#737373" />
                    </TouchableOpacity>
                </View>

                {/* Content Section */}
                <View style={styles.content}>
                    <Text style={[styles.title, { color: theme.text }]} numberOfLines={1}>
                        {title}
                    </Text>
                    <Text style={[styles.description, { color: theme.muted }]} numberOfLines={2}>
                        {description || 'This is a high-quality digital asset curated for your collection.'}
                    </Text>
                </View>

                {/* Footer Section */}
                <View style={[styles.footer, { borderTopColor: theme.borderLight }]}>
                    <View style={styles.footerItem}>
                        <Calendar size={14} color={theme.muted} />
                        <Text style={[styles.footerText, { color: theme.muted }]}>{formattedDate}</Text>
                    </View>
                    <View style={styles.footerItem}>
                        <HardDrive size={14} color={theme.muted} />
                        <Text style={[styles.footerText, { color: theme.muted }]}>{displaySize}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        </Link>
    );
}

const styles = StyleSheet.create({
    card: {
        borderRadius: 24,
        marginBottom: Spacing.xxl,
        backgroundColor: 'white',
        overflow: 'hidden',
        // Shadow for iOS
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        // Elevation for Android
        elevation: 4,
        borderWidth: 1,
        borderColor: '#f0f0f0',
    },
    imageContainer: {
        width: '100%',
        aspectRatio: 16 / 10,
        backgroundColor: '#f8f8f8',
        position: 'relative',
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
        overflow: 'hidden',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    badgeContainer: {
        position: 'absolute',
        top: 12,
        left: 12,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
    },
    badgeText: {
        color: '#F05A28', // Primary color
        fontSize: 12,
        fontWeight: '600',
    },
    heartButton: {
        position: 'absolute',
        top: 12,
        right: 12,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
    },
    content: {
        paddingTop: 16,
        paddingHorizontal: 16,
        paddingBottom: 12,
    },
    title: {
        fontSize: 20,
        fontWeight: '700',
        marginBottom: 8,
    },
    description: {
        fontSize: 15,
        lineHeight: 20,
        opacity: 0.8,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderTopWidth: 1,
    },
    footerItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    footerText: {
        fontSize: 13,
        fontWeight: '500',
    },
});
