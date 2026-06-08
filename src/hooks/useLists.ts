import { useState, useCallback } from 'react';
import { listsApi } from '../api/lists.api';
import { ListWithCount } from '../types/api.types';

export function useLists() {
  const [lists, setLists] = useState<ListWithCount[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLists = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await listsApi.getLists();
      setLists(data);
    } catch {
      setError('Failed to load lists');
    } finally {
      setLoading(false);
    }
  }, []);

  const removeList = useCallback((id: string) => {
    setLists((prev) => prev.filter((l) => l.id !== id));
  }, []);

  return { lists, loading, error, fetchLists, removeList };
}
