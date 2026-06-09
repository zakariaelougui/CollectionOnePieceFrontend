import { useState, useCallback } from 'react';
import { cardsApi } from '../api/cards.api';
import { Card, CardFilterParams } from '../types/api.types';

export function useCards() {
  const [cards, setCards] = useState<Card[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCards = useCallback(async (params: CardFilterParams = {}, reset = true) => {
    if (reset) {
      setLoading(true);
      setError(null);
    } else {
      setLoadingMore(true);
    }
    try {
      const targetPage = reset ? 1 : page + 1;
      const data = await cardsApi.getCards({ ...params, page: targetPage, limit: 20 });
      if (reset) {
        setCards(data.cards);
        setPage(1);
      } else {
        setCards((prev) => [...prev, ...data.cards]);
        setPage(targetPage);
      }
      setTotal(data.total);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to load cards';
      setError(msg);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [page]);

  const loadMore = useCallback((params: CardFilterParams = {}) => {
    if (!loadingMore && cards.length < total) {
      fetchCards(params, false);
    }
  }, [loadingMore, cards.length, total, fetchCards]);

  return { cards, total, loading, loadingMore, error, fetchCards, loadMore };
}
