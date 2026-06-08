import React from 'react';
import { View, TextInput, ScrollView, Pressable, Text, StyleSheet } from 'react-native';

const COLORS = ['Red', 'Blue', 'Green', 'Yellow', 'Purple', 'Black', 'Multi-Color'];
const TYPES = ['Character', 'Event', 'Stage', 'Leader', 'DON!!'];

const COLOR_MAP: Record<string, string> = {
  Red: '#ef4444',
  Blue: '#3b82f6',
  Green: '#22c55e',
  Yellow: '#eab308',
  Purple: '#a855f7',
  Black: '#374151',
  'Multi-Color': '#f97316',
};

interface Props {
  search: string;
  selectedColor: string;
  selectedType: string;
  onSearchChange: (v: string) => void;
  onColorChange: (v: string) => void;
  onTypeChange: (v: string) => void;
}

export function CardFilters({
  search,
  selectedColor,
  selectedType,
  onSearchChange,
  onColorChange,
  onTypeChange,
}: Props) {
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search cards..."
        value={search}
        onChangeText={onSearchChange}
        clearButtonMode="while-editing"
        autoCorrect={false}
      />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipRow} contentContainerStyle={styles.chipContent}>
        <Chip label="All" active={!selectedColor} onPress={() => onColorChange('')} color="#6b7280" />
        {COLORS.map((c) => (
          <Chip key={c} label={c} active={selectedColor === c} onPress={() => onColorChange(selectedColor === c ? '' : c)} color={COLOR_MAP[c]} />
        ))}
      </ScrollView>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipRow} contentContainerStyle={styles.chipContent}>
        <Chip label="All types" active={!selectedType} onPress={() => onTypeChange('')} color="#6b7280" />
        {TYPES.map((t) => (
          <Chip key={t} label={t} active={selectedType === t} onPress={() => onTypeChange(selectedType === t ? '' : t)} color="#475569" />
        ))}
      </ScrollView>
    </View>
  );
}

function Chip({ label, active, onPress, color }: { label: string; active: boolean; onPress: () => void; color: string }) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.chip, active && { backgroundColor: color, borderColor: color }]}
    >
      <Text style={[styles.chipText, active && styles.chipTextActive]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e5e7eb',
  },
  searchInput: {
    margin: 12,
    marginBottom: 8,
    height: 40,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#d1d5db',
    backgroundColor: '#f9fafb',
    fontSize: 15,
  },
  chipRow: {
    marginBottom: 8,
  },
  chipContent: {
    paddingHorizontal: 12,
    gap: 6,
  },
  chip: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#d1d5db',
    backgroundColor: '#fff',
  },
  chipText: {
    fontSize: 12,
    color: '#374151',
    fontWeight: '500',
  },
  chipTextActive: {
    color: '#fff',
  },
});
