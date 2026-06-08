import React from 'react';
import { View, Text, Image, Pressable, StyleSheet } from 'react-native';
import { Card } from '../types/api.types';

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
  const badgeColor = COLOR_MAP[card.color] ?? '#6b7280';

  return (
    <Pressable style={styles.container} onPress={() => onPress(card)}>
      <Image
        source={{ uri: card.imageUrl }}
        style={styles.image}
        resizeMode="cover"
      />
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={2}>{card.name}</Text>
        <View style={styles.badges}>
          <View style={[styles.badge, { backgroundColor: badgeColor }]}>
            <Text style={styles.badgeText}>{card.color}</Text>
          </View>
          <View style={[styles.badge, styles.typeBadge]}>
            <Text style={styles.badgeText}>{card.type}</Text>
          </View>
          {card.rarity ? (
            <View style={[styles.badge, styles.rarityBadge]}>
              <Text style={styles.badgeText}>{card.rarity}</Text>
            </View>
          ) : null}
        </View>
        {card.cost != null && (
          <Text style={styles.meta}>Cost: {card.cost}</Text>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e5e7eb',
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  image: {
    width: 56,
    height: 78,
    borderRadius: 4,
    backgroundColor: '#f3f4f6',
  },
  info: {
    flex: 1,
    marginLeft: 12,
    gap: 4,
  },
  name: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
  },
  badges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
  badge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  typeBadge: {
    backgroundColor: '#6b7280',
  },
  rarityBadge: {
    backgroundColor: '#9ca3af',
  },
  badgeText: {
    fontSize: 10,
    color: '#fff',
    fontWeight: '600',
  },
  meta: {
    fontSize: 12,
    color: '#6b7280',
  },
});
