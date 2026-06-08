import api from './axios';
import { List, ListWithCards, ListWithCount, ListCard } from '../types/api.types';

export const listsApi = {
  getLists: async (): Promise<ListWithCount[]> => {
    const res = await api.get<ListWithCount[]>('/lists');
    return res.data;
  },

  getList: async (id: string): Promise<ListWithCards> => {
    const res = await api.get<ListWithCards>(`/lists/${id}`);
    return res.data;
  },

  createList: async (name: string, description?: string): Promise<List> => {
    const res = await api.post<List>('/lists', { name, description });
    return res.data;
  },

  updateList: async (id: string, data: { name?: string; description?: string }): Promise<List> => {
    const res = await api.put<List>(`/lists/${id}`, data);
    return res.data;
  },

  deleteList: async (id: string): Promise<void> => {
    await api.delete(`/lists/${id}`);
  },

  addCard: async (listId: string, cardId: string, quantity = 1): Promise<ListCard> => {
    const res = await api.post<ListCard>(`/lists/${listId}/cards`, { cardId, quantity });
    return res.data;
  },

  updateCardQuantity: async (listId: string, cardId: string, quantity: number): Promise<ListCard> => {
    const res = await api.put<ListCard>(`/lists/${listId}/cards/${cardId}`, { quantity });
    return res.data;
  },

  removeCard: async (listId: string, cardId: string): Promise<void> => {
    await api.delete(`/lists/${listId}/cards/${cardId}`);
  },
};
