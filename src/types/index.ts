export type Rarity = 'N' | 'R' | 'SR' | 'SSR';

export type GachaCategory = 'キャラクター' | 'アイテム' | '限定' | 'コラボ';

export interface GachaItem {
  id: string;
  name: string;
  rarity: Rarity;
  imageUrl: string;
  description: string;
  probability: number;
}

export interface Gacha {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  category: GachaCategory;
  price: number;
  tenPullPrice: number;
  endDate: string;
  isNew: boolean;
  isLimited: boolean;
  items: GachaItem[];
  pullCount: number;
}

export interface OwnedItem {
  id: string;
  item: GachaItem;
  gachaTitle: string;
  obtainedAt: string;
  count: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  points: number;
  totalPulls: number;
  joinedAt: string;
}

export interface PurchaseHistory {
  id: string;
  gachaId: string;
  gachaTitle: string;
  pullType: 'single' | 'ten';
  price: number;
  purchasedAt: string;
  items: GachaItem[];
}

export type RootStackParamList = {
  Main: undefined;
  GachaDetail: { gachaId: string };
  Purchase: { gachaId: string; pullType: 'single' | 'ten' };
  PurchaseResult: { items: GachaItem[]; gachaTitle: string };
};

export type MainTabParamList = {
  Home: undefined;
  MyItems: undefined;
  MyPage: undefined;
};

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};
