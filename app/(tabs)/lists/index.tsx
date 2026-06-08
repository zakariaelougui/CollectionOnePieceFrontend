import React, { useCallback } from 'react';
import {
  View, FlatList, Text, StyleSheet,
  ActivityIndicator, Pressable, Alert,
} from 'react-native';
import { Stack, router, useFocusEffect } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ListItem } from '../../../src/components/ListItem';
import { useLists } from '../../../src/hooks/useLists';
import { listsApi } from '../../../src/api/lists.api';
import { ListWithCount } from '../../../src/types/api.types';

export default function ListsScreen() {
  const { lists, loading, error, fetchLists, removeList } = useLists();

  useFocusEffect(
    useCallback(() => {
      fetchLists();
    }, [fetchLists])
  );

  const handleDelete = (list: ListWithCount) => {
    Alert.alert('Delete List', `Delete "${list.name}"?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          removeList(list.id);
          try {
            await listsApi.deleteList(list.id);
          } catch {
            fetchLists();
          }
        },
      },
    ]);
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: 'My Lists',
          headerRight: () => (
            <Pressable onPress={() => router.push('/(tabs)/lists/create')} style={styles.headerBtn}>
              <MaterialCommunityIcons name="plus" size={24} color="#3b82f6" />
            </Pressable>
          ),
        }}
      />
      <View style={styles.container}>
        {loading && lists.length === 0 ? (
          <View style={styles.centered}>
            <ActivityIndicator size="large" color="#3b82f6" />
          </View>
        ) : error ? (
          <View style={styles.centered}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : (
          <FlatList
            data={lists}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.row}>
                <View style={styles.rowContent}>
                  <ListItem list={item} onPress={(l) => router.push(`/(tabs)/lists/${l.id}`)} />
                </View>
                <Pressable onPress={() => handleDelete(item)} style={styles.deleteBtn}>
                  <MaterialCommunityIcons name="trash-can-outline" size={20} color="#ef4444" />
                </Pressable>
              </View>
            )}
            ListEmptyComponent={
              <View style={styles.centered}>
                <Text style={styles.emptyText}>No lists yet</Text>
                <Text style={styles.emptyHint}>Tap + to create your first list</Text>
              </View>
            }
            contentContainerStyle={lists.length === 0 ? styles.flex : undefined}
          />
        )}

        <Pressable style={styles.fab} onPress={() => router.push('/(tabs)/lists/create')}>
          <MaterialCommunityIcons name="plus" size={28} color="#fff" />
        </Pressable>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  flex: { flex: 1 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 8, padding: 24 },
  errorText: { color: '#ef4444' },
  emptyText: { fontSize: 18, fontWeight: '600', color: '#374151' },
  emptyHint: { fontSize: 14, color: '#6b7280' },
  row: { flexDirection: 'row', alignItems: 'center' },
  rowContent: { flex: 1 },
  deleteBtn: {
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerBtn: { paddingRight: 8 },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#3b82f6',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 6,
  },
});
