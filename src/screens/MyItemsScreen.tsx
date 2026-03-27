import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Rarity } from '../types';
import { useAuth } from '../context/AuthContext';
import ItemCard from '../components/ItemCard';

const RARITY_FILTERS: (Rarity | 'すべて')[] = ['すべて', 'SSR', 'SR', 'R', 'N'];
const PURPLE = '#6C3CE1';

export default function MyItemsScreen() {
  const { ownedItems } = useAuth();
  const [selectedRarity, setSelectedRarity] = useState<Rarity | 'すべて'>('すべて');

  const filtered = useMemo(() => {
    if (selectedRarity === 'すべて') return ownedItems;
    return ownedItems.filter((o) => o.item.rarity === selectedRarity);
  }, [ownedItems, selectedRarity]);

  const counts = useMemo(() => ({
    SSR: ownedItems.filter((o) => o.item.rarity === 'SSR').length,
    SR:  ownedItems.filter((o) => o.item.rarity === 'SR').length,
    R:   ownedItems.filter((o) => o.item.rarity === 'R').length,
    N:   ownedItems.filter((o) => o.item.rarity === 'N').length,
  }), [ownedItems]);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>マイアイテム</Text>
        <Text style={styles.headerCount}>全{ownedItems.length}種類</Text>
      </View>

      <View style={styles.statsRow}>
        {(['SSR', 'SR', 'R', 'N'] as Rarity[]).map((r) => (
          <View key={r} style={[styles.statItem, { borderColor: RARITY_COLORS[r] }]}>
            <Text style={[styles.statRarity, { color: RARITY_COLORS[r] }]}>{r}</Text>
            <Text style={styles.statCount}>{counts[r]}</Text>
          </View>
        ))}
      </View>

      <View style={styles.filterRow}>
        {RARITY_FILTERS.map((r) => (
          <TouchableOpacity
            key={r}
            style={[styles.filterChip, selectedRarity === r && styles.filterChipActive]}
            onPress={() => setSelectedRarity(r)}
            activeOpacity={0.75}
          >
            <Text style={[styles.filterChipText, selectedRarity === r && styles.filterChipTextActive]}>
              {r}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <ItemCard
            item={item.item}
            count={item.count}
            gachaTitle={item.gachaTitle}
          />
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="cube-outline" size={56} color="#ddd" />
            <Text style={styles.emptyTitle}>アイテムがありません</Text>
            <Text style={styles.emptySubtitle}>ガチャを引いてアイテムをゲットしよう！</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const RARITY_COLORS: Record<Rarity, string> = {
  SSR: '#FF9800',
  SR:  '#9C27B0',
  R:   '#2196F3',
  N:   '#9E9E9E',
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f8f8fc' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#1a1a2e' },
  headerCount: { fontSize: 13, color: '#999' },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
    marginBottom: 4,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    borderWidth: 2,
    borderRadius: 10,
    paddingVertical: 8,
  },
  statRarity: { fontSize: 12, fontWeight: '700', letterSpacing: 0.5 },
  statCount: { fontSize: 18, fontWeight: '800', color: '#1a1a2e', marginTop: 2 },
  filterRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
  },
  filterChip: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: '#fff',
    borderWidth: 1.5,
    borderColor: '#e0e0e0',
  },
  filterChipActive: { backgroundColor: PURPLE, borderColor: PURPLE },
  filterChipText: { fontSize: 12, fontWeight: '600', color: '#666' },
  filterChipTextActive: { color: '#fff' },
  row: { paddingHorizontal: 12, gap: 10 },
  listContent: { paddingBottom: 20, paddingTop: 4 },
  empty: { alignItems: 'center', justifyContent: 'center', paddingVertical: 60, gap: 10 },
  emptyTitle: { fontSize: 16, fontWeight: '700', color: '#ccc' },
  emptySubtitle: { fontSize: 13, color: '#bbb', textAlign: 'center' },
});
