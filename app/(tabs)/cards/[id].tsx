import React, { useEffect, useState } from 'react';
import {
  View, Text, Image, ScrollView, StyleSheet,
  Pressable, ActivityIndicator, Alert,
} from 'react-native';
import { Stack, useLocalSearchParams } from 'expo-router';
import { cardsApi } from '../../../src/api/cards.api';
import { listsApi } from '../../../src/api/lists.api';
import { Card, ListWithCount } from '../../../src/types/api.types';
import { useAuthStore } from '../../../src/store/auth.store';
import { QuantityModal } from '../../../src/components/QuantityModal';

export default function CardDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [card, setCard] = useState<Card | null>(null);
  const [lists, setLists] = useState<ListWithCount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  useEffect(() => {
    const load = async () => {
      try {
        const [cardData, listsData] = await Promise.all([
          cardsApi.getCard(id),
          isAuthenticated ? listsApi.getLists() : Promise.resolve([]),
        ]);
        setCard(cardData);
        setLists(listsData);
      } catch {
        setError('Failed to load card');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id, isAuthenticated]);

  const handleAddToList = async (listId: string, quantity: number) => {
    if (!card) return;
    await listsApi.addCard(listId, card.id, quantity);
    Alert.alert('Added!', `${card.name} added to list.`);
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  if (error || !card) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error || 'Card not found'}</Text>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen options={{ title: card.name }} />
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Image source={{ uri: card.imageUrl }} style={styles.image} resizeMode="contain" />

        <View style={styles.card}>
          <Text style={styles.cardName}>{card.name}</Text>

          <View style={styles.attrGrid}>
            <Attr label="Set" value={card.setId} />
            <Attr label="Color" value={card.color} />
            <Attr label="Type" value={card.type} />
            <Attr label="Rarity" value={card.rarity} />
            {card.cost != null && <Attr label="Cost" value={String(card.cost)} />}
            {card.power != null && <Attr label="Power" value={String(card.power)} />}
            {card.counter != null && <Attr label="Counter" value={String(card.counter)} />}
            {card.attribute && <Attr label="Attribute" value={card.attribute} />}
            {card.cardType && <Attr label="Card Type" value={card.cardType} />}
          </View>

          {card.effect ? (
            <View style={styles.effectBlock}>
              <Text style={styles.effectLabel}>Effect</Text>
              <Text style={styles.effectText}>{card.effect}</Text>
            </View>
          ) : null}
        </View>

        {isAuthenticated ? (
          <Pressable style={styles.addButton} onPress={() => setModalVisible(true)}>
            <Text style={styles.addButtonText}>+ Add to List</Text>
          </Pressable>
        ) : (
          <Text style={styles.authHint}>Sign in to save cards to your lists</Text>
        )}
      </ScrollView>

      <QuantityModal
        visible={modalVisible}
        lists={lists}
        onClose={() => setModalVisible(false)}
        onAdd={handleAddToList}
      />
    </>
  );
}

function Attr({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.attrItem}>
      <Text style={styles.attrLabel}>{label}</Text>
      <Text style={styles.attrValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  content: { padding: 16, gap: 16 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  errorText: { color: '#ef4444' },
  image: { width: '100%', height: 320, borderRadius: 8 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    gap: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardName: { fontSize: 22, fontWeight: '800', color: '#111827' },
  attrGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  attrItem: {
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    minWidth: 80,
  },
  attrLabel: { fontSize: 11, color: '#6b7280', fontWeight: '500' },
  attrValue: { fontSize: 14, color: '#111827', fontWeight: '600', marginTop: 2 },
  effectBlock: { gap: 4 },
  effectLabel: { fontSize: 13, fontWeight: '700', color: '#374151' },
  effectText: { fontSize: 14, color: '#374151', lineHeight: 20 },
  addButton: {
    backgroundColor: '#3b82f6',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  addButtonText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  authHint: { textAlign: 'center', color: '#6b7280', fontSize: 14 },
});
