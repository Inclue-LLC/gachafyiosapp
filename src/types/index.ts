import { NavigatorScreenParams } from '@react-navigation/native';

export interface Lineup {
  id: string;
  product_id: string;
  priority: number;
  name: string;
  picture_url: string;
  count: number;
  pickup_rate: number;
}

export interface Product {
  id: string;
  slug: string;
  title: string;
  seller_name: string;
  play_cost: number;
  shipping_cost_label: string;
  delivery: string;
  description: string;
  trade_law: string;
  return_policy: string;
  picture_url: string;
  remain_count: number;
  status: 'active' | 'sold_out' | 'draft';
  lineups: Lineup[];
}

export interface CartItem {
  id: string;
  lineup: Lineup;
  product_id: string;
  product_title: string;
  product_picture_url: string;
  won_at: string;
  shipping_requested: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  joinedAt: string;
  totalPlays: number;
}

export interface PlayHistory {
  id: string;
  product_id: string;
  product_title: string;
  played_at: string;
  cost: number;
  lineup: Lineup;
}

export type MainTabParamList = {
  Home: undefined;
  Cart: undefined;
  MyPage: undefined;
};

export type RootStackParamList = {
  Main: NavigatorScreenParams<MainTabParamList> | undefined;
  ProductDetail: { productId: string };
  Payment: { productId: string };
  PlayResult: { lineup: Lineup; productTitle: string; productId: string };
};

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};
