export interface Card {
  id: string;
  name: string;
  setId: string;
  type: string;
  color: string;
  cost: number | null;
  power: number | null;
  counter: number | null;
  rarity: string;
  imageUrl: string;
  attribute: string | null;
  effect: string | null;
  cardType: string | null;
}

export interface AuthUser {
  id?: string;
  email: string;
  username?: string;
}

export interface List {
  id: string;
  userId: string;
  name: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ListWithCount extends List {
  _count: { listCards: number };
}

export interface ListCard {
  id: string;
  listId: string;
  cardId: string;
  quantity: number;
  addedAt: string;
  card: Card;
}

export interface ListWithCards extends List {
  listCards: ListCard[];
}

export interface CardFilterParams {
  search?: string;
  color?: string;
  type?: string;
  setId?: string;
  page?: number;
  limit?: number;
}

export interface CardsResponse {
  cards: Card[];
  total: number;
  page: number;
  limit: number;
}

export interface LoginResponse {
  user: { id: string; email: string };
  accessToken: string;
  refreshToken: string;
}

export interface RegisterResponse {
  user: { email: string; username: string };
  accessToken: string;
  refreshToken: string;
}
