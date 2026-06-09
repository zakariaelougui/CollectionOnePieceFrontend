import React, { useCallback, useEffect, useRef, useState } from 'react';
import { FlatList, View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Stack, router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CardItem } from '../../../src/components/CardItem';
import { CardFilters } from '../../../src/components/CardFilters';
import { useCards } from '../../../src/hooks/useCards';
import { Card, CardFilterParams } from '../../../src/types/api.types';
import { useAppTheme } from '../../../src/theme/useAppTheme';

const NUM_COLUMNS = 2;
const COLUMN_GAP = 10;
const HORIZONTAL_PADDING = 12;

export default function CardsScreen() {
  const { cards, total, loading, loadingMore, error, fetchCards, loadMore } = useCards();
  const { colors } = useAppTheme();
  const insets = useSafeAreaInsets();
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
      applyFilters(buildParams(val, selectedColor, selectedType));
    }, 400);
  };

  const handleColorChange = (val: string) => {
    setSelectedColor(val);
    applyFilters(buildParams(search, val, selectedType));
  };

  const handleTypeChange = (val: string) => {
    setSelectedType(val);
    applyFilters(buildParams(search, selectedColor, val));
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={[styles.container, { backgroundColor: colors.background, paddingTop: insets.top }]}>
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
            <ActivityIndicator size="large" color={colors.accent} />
          </View>
        ) : error ? (
          <View style={styles.centered}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : (
          <FlatList
            style={styles.list}
            data={cards}
            keyExtractor={(item) => item.id}
            numColumns={NUM_COLUMNS}
            columnWrapperStyle={styles.row}
            contentContainerStyle={styles.listContent}
            renderItem={({ item }) => (
              <CardItem card={item} onPress={(c: Card) => router.push(`/(tabs)/cards/${c.id}`)} />
            )}
            onEndReached={() => loadMore(currentParams.current)}
            onEndReachedThreshold={0.3}
            ListFooterComponent={
              loadingMore ? <ActivityIndicator style={styles.footer} color={colors.accent} /> : null
            }
            ListEmptyComponent={
              <View style={styles.centered}>
                <Text style={[styles.emptyText, { color: colors.textSecondary }]}>No cards found</Text>
              </View>
            }
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
  container: { flex: 1 },
  list: { flex: 1 },
  listContent: {
    padding: HORIZONTAL_PADDING,
    gap: COLUMN_GAP,
  },
  row: {
    gap: COLUMN_GAP,
  },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  errorText: { color: '#ef4444', textAlign: 'center' },
  emptyText: { color: '#6b7280', fontSize: 16 },
  footer: { paddingVertical: 16 },
});
