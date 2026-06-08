import { useState, useCallback } from 'react';
import { listsApi } from '../api/lists.api';
import { ListWithCards } from '../types/api.types';

export function useListDetail(listId: string) {
  const [list, setList] = useState<ListWithCards | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchList = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await listsApi.getList(listId);
      setList(data);
    } catch {
      setError('Failed to load list');
    } finally {
      setLoading(false);
    }
  }, [listId]);

  const updateQuantity = useCallback(async (cardId: string, quantity: number) => {
    if (!list) return;
    if (quantity <= 0) {
      await listsApi.removeCard(listId, cardId);
      setList((prev) =>
        prev ? { ...prev, listCards: prev.listCards.filter((lc) => lc.cardId !== cardId) } : prev
      );
    } else {
      const updated = await listsApi.updateCardQuantity(listId, cardId, quantity);
      setList((prev) =>
        prev
          ? {
              ...prev,
              listCards: prev.listCards.map((lc) =>
                lc.cardId === cardId ? { ...lc, quantity: updated.quantity } : lc
              ),
            }
          : prev
      );
    }
  }, [listId, list]);

  const removeCard = useCallback(async (cardId: string) => {
    await listsApi.removeCard(listId, cardId);
    setList((prev) =>
      prev ? { ...prev, listCards: prev.listCards.filter((lc) => lc.cardId !== cardId) } : prev
    );
  }, [listId]);

  return { list, loading, error, fetchList, updateQuantity, removeCard };
}
