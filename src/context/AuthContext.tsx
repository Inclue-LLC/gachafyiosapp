import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User, OwnedItem, PurchaseHistory } from '../types';
import { MOCK_OWNED_ITEMS, MOCK_PURCHASE_HISTORY } from '../data/mockData';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  ownedItems: OwnedItem[];
  purchaseHistory: PurchaseHistory[];
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  addOwnedItems: (items: OwnedItem[]) => void;
  addPurchaseHistory: (history: PurchaseHistory) => void;
  deductPoints: (amount: number) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [ownedItems, setOwnedItems] = useState<OwnedItem[]>([]);
  const [purchaseHistory, setPurchaseHistory] = useState<PurchaseHistory[]>([]);

  const login = async (email: string, _password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 1000));
      const mockUser: User = {
        id: 'u1',
        name: email.split('@')[0],
        email,
        points: 10000,
        totalPulls: 47,
        joinedAt: '2025-01-15T00:00:00Z',
      };
      setUser(mockUser);
      setOwnedItems(MOCK_OWNED_ITEMS);
      setPurchaseHistory(MOCK_PURCHASE_HISTORY);
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
        points: 3000,
        totalPulls: 0,
        joinedAt: new Date().toISOString(),
      };
      setUser(newUser);
      setOwnedItems([]);
      setPurchaseHistory([]);
      return true;
    } catch {
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setOwnedItems([]);
    setPurchaseHistory([]);
  };

  const addOwnedItems = (newItems: OwnedItem[]) => {
    setOwnedItems((prev) => {
      const updated = [...prev];
      newItems.forEach((newItem) => {
        const existing = updated.find((o) => o.item.id === newItem.item.id);
        if (existing) {
          existing.count += 1;
        } else {
          updated.push(newItem);
        }
      });
      return updated;
    });
  };

  const addPurchaseHistory = (history: PurchaseHistory) => {
    setPurchaseHistory((prev) => [history, ...prev]);
  };

  const deductPoints = (amount: number) => {
    setUser((prev) => prev ? { ...prev, points: prev.points - amount, totalPulls: prev.totalPulls + (amount >= 2700 ? 10 : 1) } : null);
  };

  return (
    <AuthContext.Provider
      value={{ user, isLoading, ownedItems, purchaseHistory, login, register, logout, addOwnedItems, addPurchaseHistory, deductPoints }}
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
