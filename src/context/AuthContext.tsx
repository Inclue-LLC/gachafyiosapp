import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User, CartItem, PlayHistory } from '../types';
import { MOCK_CART_ITEMS, MOCK_PLAY_HISTORY } from '../data/mockData';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  cartItems: CartItem[];
  playHistory: PlayHistory[];
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  addCartItem: (item: CartItem) => void;
  addPlayHistory: (history: PlayHistory) => void;
  requestShipping: (cartItemId: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [playHistory, setPlayHistory] = useState<PlayHistory[]>([]);

  const login = async (email: string, _password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 1000));
      const mockUser: User = {
        id: 'u1',
        name: email.split('@')[0],
        email,
        totalPlays: 12,
        joinedAt: '2025-01-15T00:00:00Z',
      };
      setUser(mockUser);
      setCartItems(MOCK_CART_ITEMS);
      setPlayHistory(MOCK_PLAY_HISTORY);
      return true;
    } catch {
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, _password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 1000));
      const newUser: User = {
        id: 'u_new',
        name,
        email,
        totalPlays: 0,
        joinedAt: new Date().toISOString(),
      };
      setUser(newUser);
      setCartItems([]);
      setPlayHistory([]);
      return true;
    } catch {
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setCartItems([]);
    setPlayHistory([]);
  };

  const addCartItem = (item: CartItem) => {
    setCartItems((prev) => [item, ...prev]);
  };

  const addPlayHistory = (history: PlayHistory) => {
    setPlayHistory((prev) => [history, ...prev]);
    setUser((prev) => (prev ? { ...prev, totalPlays: prev.totalPlays + 1 } : null));
  };

  const requestShipping = (cartItemId: string) => {
    setCartItems((prev) =>
      prev.map((item) => (item.id === cartItemId ? { ...item, shipping_requested: true } : item))
    );
  };

  return (
    <AuthContext.Provider
      value={{ user, isLoading, cartItems, playHistory, login, register, logout, addCartItem, addPlayHistory, requestShipping }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
