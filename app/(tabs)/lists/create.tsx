import React, { useState } from 'react';
import {
  View, Text, TextInput, Pressable, StyleSheet,
  KeyboardAvoidingView, Platform, ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import { listsApi } from '../../../src/api/lists.api';
import { useAppTheme } from '../../../src/theme/useAppTheme';

export default function CreateListScreen() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { colors } = useAppTheme();

  const handleCreate = async () => {
    if (!name.trim()) {
      setError('List name is required');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await listsApi.createList(name.trim(), description.trim() || undefined);
      router.back();
    } catch (e: any) {
      const msg = e?.response?.data?.message ?? e?.response?.data?.error ?? 'Failed to create list';
      setError(typeof msg === 'string' ? msg : 'Failed to create list');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.flex, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.container}>
        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <TextInput
          style={[styles.input, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text }]}
          placeholder="List name *"
          placeholderTextColor={colors.textSecondary}
          value={name}
          onChangeText={setName}
          autoFocus
        />
        <TextInput
          style={[styles.input, styles.multiline, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text }]}
          placeholder="Description (optional)"
          placeholderTextColor={colors.textSecondary}
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={3}
        />

        <Pressable style={[styles.button, loading && styles.buttonDisabled]} onPress={handleCreate} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Create List</Text>}
        </Pressable>

        <Pressable onPress={() => router.back()} style={styles.cancel}>
          <Text style={[styles.cancelText, { color: colors.textSecondary }]}>Cancel</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: { padding: 20, gap: 12 },
  errorText: { color: '#ef4444', fontSize: 14 },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 13,
    fontSize: 15,
  },
  multiline: {
    height: 80,
    textAlignVertical: 'top',
    paddingTop: 12,
  },
  button: {
    backgroundColor: '#3b82f6',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 4,
  },
  buttonDisabled: { backgroundColor: '#93c5fd' },
  buttonText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  cancel: { alignItems: 'center', padding: 10 },
  cancelText: { fontSize: 15 },
});
