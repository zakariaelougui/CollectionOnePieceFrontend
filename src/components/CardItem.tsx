import React from 'react';
import { View, Text, Image, Pressable, StyleSheet } from 'react-native';
import { Card } from '../types/api.types';
import { useAppTheme } from '../theme/useAppTheme';

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
  card: Card;
  onPress: (card: Card) => void;
}

export function CardItem({ card, onPress }: Props) {
  const { colors } = useAppTheme();
  const badgeColor = COLOR_MAP[card.color] ?? '#6b7280';

  return (
    <Pressable style={[styles.container, { backgroundColor: colors.surface }]} onPress={() => onPress(card)}>
      <Image
        source={{ uri: card.imageUrl }}
        style={[styles.image, { backgroundColor: colors.surfaceSecondary }]}
        resizeMode="cover"
      />
      <View style={styles.info}>
        <Text style={[styles.name, { color: colors.text }]} numberOfLines={2}>{card.name}</Text>
        <View style={styles.footer}>
          <View style={[styles.badge, { backgroundColor: badgeColor }]}>
            <Text style={styles.badgeText}>{card.color}</Text>
          </View>
          {card.cost != null && (
            <Text style={[styles.cost, { color: colors.textSecondary }]}>Cost {card.cost}</Text>
          )}
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: 10,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  image: {
    width: '100%',
    aspectRatio: 0.72,
  },
  info: {
    padding: 8,
    gap: 6,
  },
  name: {
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 17,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  badge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  badgeText: {
    fontSize: 10,
    color: '#fff',
    fontWeight: '600',
  },
  cost: {
    fontSize: 11,
    fontWeight: '500',
  },
});
