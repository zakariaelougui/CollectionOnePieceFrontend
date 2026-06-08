import React, { useCallback, useEffect, useRef, useState } from 'react';
import { FlatList, View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Stack, router } from 'expo-router';
import { CardItem } from '../../../src/components/CardItem';
import { CardFilters } from '../../../src/components/CardFilters';
import { useCards } from '../../../src/hooks/useCards';
import { Card, CardFilterParams } from '../../../src/types/api.types';

export default function CardsScreen() {
  const { cards, total, loading, loadingMore, error, fetchCards, loadMore } = useCards();
  const [search, setSearch] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const currentParams = useRef<CardFilterParams>({});

  const applyFilters = useCallback((params: CardFilterParams) => {
    currentParams.current = params;
    fetchCards(params, true);
  }, [fetchCards]);

  useEffect(() => {
    applyFilters({});
  }, []);

  const handleSearchChange = (val: string) => {
    setSearch(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      const params = buildParams(val, selectedColor, selectedType);
      applyFilters(params);
    }, 400);
  };

  const handleColorChange = (val: string) => {
    setSelectedColor(val);
    const params = buildParams(search, val, selectedType);
    applyFilters(params);
  };

  const handleTypeChange = (val: string) => {
    setSelectedType(val);
    const params = buildParams(search, selectedColor, val);
    applyFilters(params);
  };

  const handleEndReached = () => {
    loadMore(currentParams.current);
  };

  return (
    <>
      <Stack.Screen options={{ title: 'Cards' }} />
      <View style={styles.container}>
        <CardFilters
          search={search}
          selectedColor={selectedColor}
          selectedType={selectedType}
          onSearchChange={handleSearchChange}
          onColorChange={handleColorChange}
          onTypeChange={handleTypeChange}
        />
        {loading && cards.length === 0 ? (
          <View style={styles.centered}>
            <ActivityIndicator size="large" color="#3b82f6" />
          </View>
        ) : error ? (
          <View style={styles.centered}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : (
          <FlatList
            data={cards}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <CardItem card={item} onPress={(c: Card) => router.push(`/(tabs)/cards/${c.id}`)} />
            )}
            onEndReached={handleEndReached}
            onEndReachedThreshold={0.3}
            ListFooterComponent={loadingMore ? <ActivityIndicator style={styles.footer} color="#3b82f6" /> : null}
            ListEmptyComponent={
              <View style={styles.centered}>
                <Text style={styles.emptyText}>No cards found</Text>
              </View>
            }
            contentContainerStyle={cards.length === 0 ? styles.flex : undefined}
          />
        )}
      </View>
    </>
  );
}

function buildParams(search: string, color: string, type: string): CardFilterParams {
  const params: CardFilterParams = {};
  if (search.trim()) params.search = search.trim();
  if (color) params.color = color;
  if (type) params.type = type;
  return params;
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  flex: { flex: 1 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  errorText: { color: '#ef4444', textAlign: 'center' },
  emptyText: { color: '#6b7280', fontSize: 16 },
  footer: { paddingVertical: 16 },
});
