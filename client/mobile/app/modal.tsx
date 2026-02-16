import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Image, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { Colors, Spacing, Typography, BorderRadius } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Button } from '@/components/ui/Button';
import { UploadCloud, X, Plus } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';

export default function ModalScreen() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    if (!title || !description || !image) {
      alert('Please fill in all fields and select an image');
      return;
    }

    setLoading(true);
    try {
      const apiUrl = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);

      const filename = image.split('/').pop() || 'upload.jpg';
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : `image/jpg`;

      // @ts-ignore
      formData.append('image', { uri: image, name: filename, type });

      const response = await fetch(`${apiUrl}/objects`, {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.ok) {
        alert('Object created successfully!');
        router.back();
      } else {
        throw new Error('Failed to upload');
      }
    } catch (error) {
      console.error(error);
      alert('Failed to create object.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.text }]}>Add New Object</Text>
          <Text style={[styles.subtitle, { color: theme.muted }]}>
            Share a digital asset with the gallery.
          </Text>
        </View>

        <TouchableOpacity
          style={[
            styles.uploadZone,
            { backgroundColor: theme.surface, borderColor: theme.border }
          ]}
          onPress={pickImage}
        >
          {image ? (
            <View style={styles.imagePreviewContainer}>
              <Image source={{ uri: image }} style={styles.imagePreview} />
              <TouchableOpacity
                style={[styles.removeButton, { backgroundColor: theme.error }]}
                onPress={() => setImage(null)}
              >
                <X color="white" size={16} />
              </TouchableOpacity>
            </View>
          ) : (
            <>
              <View style={[styles.iconCircle, { backgroundColor: theme.primaryLight }]}>
                <UploadCloud color={theme.primary} size={32} />
              </View>
              <Text style={[styles.uploadText, { color: theme.text }]}>
                Tap to upload image
              </Text>
            </>
          )}
        </TouchableOpacity>

        <View style={styles.form}>
          <TextInput
            style={[styles.input, { backgroundColor: theme.surface, color: theme.text, borderColor: theme.border }]}
            placeholder="e.g. Vintage Camera"
            placeholderTextColor={theme.mutedForeground}
            value={title}
            onChangeText={setTitle}
          />
          <TextInput
            style={[styles.input, styles.textArea, { backgroundColor: theme.surface, color: theme.text, borderColor: theme.border }]}
            placeholder="Describe this object..."
            placeholderTextColor={theme.mutedForeground}
            multiline
            numberOfLines={4}
            value={description}
            onChangeText={setDescription}
          />
        </View>

        <View style={styles.footer}>
          <Button
            title="Create Object"
            onPress={handleSubmit}
            loading={loading}
            icon={<Plus color="white" size={20} />}
          />
          <TouchableOpacity onPress={() => router.back()} style={styles.cancelButton}>
            <Text style={[styles.cancelText, { color: theme.muted }]}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.xxl,
  },
  header: {
    alignItems: 'center',
    marginBottom: Spacing.section,
  },
  title: {
    fontSize: Typography.sizes.xl,
    fontWeight: '700',
    marginBottom: Spacing.xs,
  },
  subtitle: {
    fontSize: Typography.sizes.base,
    textAlign: 'center',
  },
  uploadZone: {
    height: 200,
    borderRadius: BorderRadius.xl,
    borderWidth: 2,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.xxl,
    overflow: 'hidden',
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  uploadText: {
    fontSize: Typography.sizes.base,
    fontWeight: '500',
  },
  imagePreviewContainer: {
    width: '100%',
    height: '100%',
  },
  imagePreview: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  removeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  form: {
    gap: Spacing.lg,
    marginBottom: Spacing.section,
  },
  input: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    fontSize: Typography.sizes.base,
    borderWidth: 1,
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },
  footer: {
    gap: Spacing.md,
  },
  cancelButton: {
    padding: Spacing.md,
    alignItems: 'center',
  },
  cancelText: {
    fontSize: Typography.sizes.base,
    fontWeight: '500',
  },
});
