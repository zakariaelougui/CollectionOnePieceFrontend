import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { ListWithCount } from '../types/api.types';

interface Props {
  list: ListWithCount;
  onPress: (list: ListWithCount) => void;
}

export function ListItem({ list, onPress }: Props) {
  const count = list._count?.listCards ?? 0;

  return (
    <Pressable style={styles.container} onPress={() => onPress(list)}>
      <View style={styles.info}>
        <Text style={styles.name}>{list.name}</Text>
        {list.description ? (
          <Text style={styles.description} numberOfLines={1}>{list.description}</Text>
        ) : null}
      </View>
      <View style={styles.countBadge}>
        <Text style={styles.countText}>{count}</Text>
        <Text style={styles.countLabel}>cards</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e5e7eb',
  },
  info: {
    flex: 1,
    gap: 2,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  description: {
    fontSize: 13,
    color: '#6b7280',
  },
  countBadge: {
    alignItems: 'center',
    minWidth: 44,
  },
  countText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#3b82f6',
  },
  countLabel: {
    fontSize: 11,
    color: '#6b7280',
  },
});
