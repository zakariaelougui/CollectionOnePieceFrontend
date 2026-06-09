import React from 'react';
import { View, TextInput, ScrollView, Pressable, Text, StyleSheet } from 'react-native';
import { useAppTheme } from '../theme/useAppTheme';

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
  const { colors } = useAppTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
      <TextInput
        style={[styles.searchInput, { backgroundColor: colors.surfaceSecondary, borderColor: colors.border, color: colors.text }]}
        placeholder="Search cards..."
        placeholderTextColor={colors.textSecondary}
        value={search}
        onChangeText={onSearchChange}
        clearButtonMode="while-editing"
        autoCorrect={false}
      />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipRow} contentContainerStyle={styles.chipContent}>
        <Chip label="All" active={!selectedColor} onPress={() => onColorChange('')} activeColor="#6b7280" colors={colors} />
        {COLORS.map((c) => (
          <Chip key={c} label={c} active={selectedColor === c} onPress={() => onColorChange(selectedColor === c ? '' : c)} activeColor={COLOR_MAP[c]} colors={colors} />
        ))}
      </ScrollView>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipRow} contentContainerStyle={styles.chipContent}>
        <Chip label="All types" active={!selectedType} onPress={() => onTypeChange('')} activeColor="#6b7280" colors={colors} />
        {TYPES.map((t) => (
          <Chip key={t} label={t} active={selectedType === t} onPress={() => onTypeChange(selectedType === t ? '' : t)} activeColor="#475569" colors={colors} />
        ))}
      </ScrollView>
    </View>
  );
}

type AppColors = ReturnType<typeof useAppTheme>['colors'];

function Chip({ label, active, onPress, activeColor, colors }: { label: string; active: boolean; onPress: () => void; activeColor: string; colors: AppColors }) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.chip,
        { borderColor: colors.border, backgroundColor: colors.surfaceSecondary },
        active && { backgroundColor: activeColor, borderColor: activeColor },
      ]}
    >
      <Text style={[styles.chipText, { color: colors.textSecondary }, active && styles.chipTextActive]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  searchInput: {
    margin: 12,
    marginBottom: 8,
    height: 40,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
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
  },
  chipText: {
    fontSize: 12,
    fontWeight: '500',
  },
  chipTextActive: {
    color: '#fff',
  },
});
