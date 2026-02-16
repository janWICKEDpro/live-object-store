import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle, ActivityIndicator } from 'react-native';
import { Colors, BorderRadius, Typography, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

interface ButtonProps {
    title: string;
    onPress: () => void;
    variant?: 'primary' | 'secondary' | 'ghost' | 'outline';
    size?: 'sm' | 'md' | 'lg';
    loading?: boolean;
    disabled?: boolean;
    style?: ViewStyle;
    textStyle?: TextStyle;
    icon?: React.ReactNode;
}

export function Button({
    title,
    onPress,
    variant = 'primary',
    size = 'md',
    loading = false,
    disabled = false,
    style,
    textStyle,
    icon,
}: ButtonProps) {
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme ?? 'light'];

    const getBackgroundColor = () => {
        if (disabled) return theme.muted;
        switch (variant) {
            case 'primary':
                return theme.primary;
            case 'secondary':
                return theme.borderLight;
            case 'outline':
                return 'transparent';
            case 'ghost':
                return 'transparent';
            default:
                return theme.primary;
        }
    };

    const getTextColor = () => {
        if (disabled) return theme.mutedForeground;
        switch (variant) {
            case 'primary':
                return theme.primaryForeground;
            case 'secondary':
                return theme.text;
            case 'outline':
                return theme.primary;
            case 'ghost':
                return theme.primary;
            default:
                return theme.primaryForeground;
        }
    };

    const getBorder = () => {
        if (variant === 'outline') {
            return {
                borderWidth: 1,
                borderColor: disabled ? theme.muted : theme.primary,
            };
        }
        return {};
    };

    const getPadding = () => {
        switch (size) {
            case 'sm':
                return { paddingVertical: Spacing.xs, paddingHorizontal: Spacing.md };
            case 'md':
                return { paddingVertical: Spacing.md, paddingHorizontal: Spacing.lg };
            case 'lg':
                return { paddingVertical: Spacing.lg, paddingHorizontal: Spacing.xl };
            default:
                return { paddingVertical: Spacing.md, paddingHorizontal: Spacing.lg };
        }
    };

    return (
        <TouchableOpacity
            onPress={onPress}
            disabled={disabled || loading}
            style={[
                styles.button,
                { backgroundColor: getBackgroundColor(), borderRadius: BorderRadius.lg },
                getBorder(),
                getPadding(),
                style,
            ]}
            activeOpacity={0.8}
        >
            {loading ? (
                <ActivityIndicator color={getTextColor()} />
            ) : (
                <>
                    {icon}
                    <Text
                        style={[
                            styles.text,
                            {
                                color: getTextColor(),
                                fontSize: size === 'sm' ? Typography.sizes.sm : Typography.sizes.base,
                                marginLeft: icon ? Spacing.sm : 0,
                            },
                            textStyle,
                        ]}
                    >
                        {title}
                    </Text>
                </>
            )}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        fontWeight: Typography.weights.medium,
        textAlign: 'center',
    },
});
