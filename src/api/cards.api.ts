import api from './axios';
import { Card, CardFilterParams, CardsResponse } from '../types/api.types';

export const cardsApi = {
  getCards: async (params: CardFilterParams = {}): Promise<CardsResponse> => {
    const res = await api.get<CardsResponse>('/cards', { params });
    return res.data;
  },

  getCard: async (id: string): Promise<Card> => {
    const res = await api.get<Card>(`/cards/${id}`);
    return res.data;
  },
};
