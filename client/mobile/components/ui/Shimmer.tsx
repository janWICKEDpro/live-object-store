import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, ViewStyle, DimensionValue } from 'react-native';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

interface ShimmerProps {
    width: DimensionValue;
    height: DimensionValue;
    borderRadius?: number;
    style?: ViewStyle;
}

export function Shimmer({ width, height, borderRadius = 8, style }: ShimmerProps) {
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme ?? 'light'];
    const shimmerAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const startShimmer = () => {
            shimmerAnim.setValue(0);
            Animated.loop(
                Animated.timing(shimmerAnim, {
                    toValue: 1,
                    duration: 1000,
                    useNativeDriver: true,
                })
            ).start();
        };

        startShimmer();
    }, [shimmerAnim]);

    const translateX = shimmerAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [-200, 200],
    });

    return (
        <View
            style={[
                styles.container,
                { width, height, borderRadius, backgroundColor: theme.borderLight },
                style,
            ]}
        >
            <Animated.View
                style={[
                    styles.shimmer,
                    {
                        transform: [{ translateX }],
                        backgroundColor: theme.surface,
                        opacity: 0.3,
                    },
                ]}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        overflow: 'hidden',
        position: 'relative',
    },
    shimmer: {
        width: '100%',
        height: '100%',
        position: 'absolute',
    },
});
