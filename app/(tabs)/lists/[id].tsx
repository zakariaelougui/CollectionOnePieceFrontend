import React, { useCallback } from 'react';
import {
  View, Text, FlatList, StyleSheet,
  ActivityIndicator, Pressable, Image, Alert,
} from 'react-native';
import { Stack, useLocalSearchParams, useFocusEffect } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useListDetail } from '../../../src/hooks/useListDetail';
import { ListCard } from '../../../src/types/api.types';
import { useAppTheme } from '../../../src/theme/useAppTheme';

export default function ListDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { list, loading, error, fetchList, updateQuantity, removeCard } = useListDetail(id);
  const { colors } = useAppTheme();

  useFocusEffect(
    useCallback(() => {
      fetchList();
    }, [fetchList])
  );

  const handleRemove = (lc: ListCard) => {
    Alert.alert('Remove Card', `Remove "${lc.card.name}" from this list?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Remove', style: 'destructive', onPress: () => removeCard(lc.cardId) },
    ]);
  };

  if (loading && !list) {
    return (
      <View style={[styles.centered, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.accent} />
      </View>
    );
  }

  if (error || !list) {
    return (
      <View style={[styles.centered, { backgroundColor: colors.background }]}>
        <Text style={styles.errorText}>{error || 'List not found'}</Text>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen options={{ title: list.name }} />
      <FlatList
        style={[styles.container, { backgroundColor: colors.background }]}
        data={list.listCards}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={[styles.row, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
            <Image
              source={{ uri: item.card.imageUrl }}
              style={[styles.thumb, { backgroundColor: colors.surfaceSecondary }]}
              resizeMode="cover"
            />
            <View style={styles.info}>
              <Text style={[styles.cardName, { color: colors.text }]} numberOfLines={2}>
                {item.card.name}
              </Text>
              <Text style={[styles.cardMeta, { color: colors.textSecondary }]}>
                {item.card.color} · {item.card.type}
              </Text>
            </View>
            <View style={styles.qtyControls}>
              <Pressable
                style={[styles.qtyBtn, { backgroundColor: colors.surfaceSecondary }]}
                onPress={() => updateQuantity(item.cardId, item.quantity - 1)}
              >
                <MaterialCommunityIcons name="minus" size={18} color={colors.text} />
              </Pressable>
              <Text style={[styles.qtyText, { color: colors.text }]}>{item.quantity}</Text>
              <Pressable
                style={[styles.qtyBtn, { backgroundColor: colors.surfaceSecondary }]}
                onPress={() => updateQuantity(item.cardId, item.quantity + 1)}
              >
                <MaterialCommunityIcons name="plus" size={18} color={colors.text} />
              </Pressable>
            </View>
            <Pressable onPress={() => handleRemove(item)} style={styles.removeBtn}>
              <MaterialCommunityIcons name="trash-can-outline" size={20} color={colors.danger} />
            </Pressable>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.centered}>
            <Text style={[styles.emptyText, { color: colors.text }]}>No cards in this list</Text>
            <Text style={[styles.emptyHint, { color: colors.textSecondary }]}>Browse cards and tap "Add to List"</Text>
          </View>
        }
        contentContainerStyle={list.listCards.length === 0 ? styles.flex : undefined}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  flex: { flex: 1 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 8, padding: 24 },
  errorText: { color: '#ef4444' },
  emptyText: { fontSize: 18, fontWeight: '600' },
  emptyHint: { fontSize: 14 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  thumb: {
    width: 48,
    height: 67,
    borderRadius: 4,
  },
  info: { flex: 1, marginLeft: 10, gap: 2 },
  cardName: { fontSize: 14, fontWeight: '600' },
  cardMeta: { fontSize: 12 },
  qtyControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginRight: 8,
  },
  qtyBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  qtyText: {
    fontSize: 15,
    fontWeight: '700',
    minWidth: 24,
    textAlign: 'center',
  },
  removeBtn: { padding: 8 },
});
