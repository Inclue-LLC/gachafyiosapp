import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StatusBar,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { CompositeNavigationProp } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';

import { RootStackParamList, MainTabParamList, GachaCategory } from '../types';
import { MOCK_GACHAS } from '../data/mockData';
import { useAuth } from '../context/AuthContext';
import GachaCard from '../components/GachaCard';

type Props = {
  navigation: CompositeNavigationProp<
    BottomTabNavigationProp<MainTabParamList, 'Home'>,
    NativeStackNavigationProp<RootStackParamList>
  >;
};

const CATEGORIES: (GachaCategory | 'すべて')[] = ['すべて', 'キャラクター', 'アイテム', '限定', 'コラボ'];
const PURPLE = '#6C3CE1';

export default function HomeScreen({ navigation }: Props) {
  const { user } = useAuth();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<GachaCategory | 'すべて'>('すべて');

  const filtered = useMemo(() => {
    return MOCK_GACHAS.filter((g) => {
      const matchCategory = selectedCategory === 'すべて' || g.category === selectedCategory;
      const matchSearch = !search.trim() || g.title.includes(search) || g.description.includes(search);
      return matchCategory && matchSearch;
    });
  }, [search, selectedCategory]);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>こんにちは、{user?.name}さん！</Text>
          <View style={styles.pointsRow}>
            <Ionicons name="diamond" size={16} color={PURPLE} />
            <Text style={styles.points}>{user?.points.toLocaleString()} pt</Text>
          </View>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.addPointBtn}>
            <Ionicons name="add-circle" size={20} color={PURPLE} />
            <Text style={styles.addPointText}>チャージ</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.searchBar}>
        <Ionicons name="search" size={18} color="#999" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="ガチャを検索..."
          placeholderTextColor="#bbb"
          value={search}
          onChangeText={setSearch}
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => setSearch('')}>
            <Ionicons name="close-circle" size={18} color="#999" />
          </TouchableOpacity>
        )}
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoryScroll}
        contentContainerStyle={styles.categoryContent}
      >
        {CATEGORIES.map((cat) => (
          <TouchableOpacity
            key={cat}
            style={[styles.catChip, selectedCategory === cat && styles.catChipActive]}
            onPress={() => setSelectedCategory(cat)}
            activeOpacity={0.75}
          >
            <Text style={[styles.catChipText, selectedCategory === cat && styles.catChipTextActive]}>
              {cat}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <GachaCard
            gacha={item}
            onPress={() => navigation.navigate('GachaDetail', { gachaId: item.id })}
          />
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="search-outline" size={48} color="#ddd" />
            <Text style={styles.emptyText}>ガチャが見つかりません</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f8f8fc' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  greeting: { fontSize: 16, fontWeight: '700', color: '#1a1a2e' },
  pointsRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 },
  points: { fontSize: 15, fontWeight: '700', color: PURPLE },
  headerRight: { flexDirection: 'row', gap: 8 },
  addPointBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#f0ebff',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  addPointText: { fontSize: 13, fontWeight: '600', color: PURPLE },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 4,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
    borderWidth: 1,
    borderColor: '#e8e8e8',
    gap: 8,
  },
  searchIcon: {},
  searchInput: { flex: 1, fontSize: 15, color: '#1a1a2e' },
  categoryScroll: { marginTop: 10 },
  categoryContent: { paddingHorizontal: 16, gap: 8, paddingBottom: 4 },
  catChip: {
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: '#fff',
    borderWidth: 1.5,
    borderColor: '#e0e0e0',
  },
  catChipActive: {
    backgroundColor: PURPLE,
    borderColor: PURPLE,
  },
  catChipText: { fontSize: 13, fontWeight: '600', color: '#666' },
  catChipTextActive: { color: '#fff' },
  listContent: { paddingTop: 14, paddingBottom: 20 },
  empty: { alignItems: 'center', justifyContent: 'center', paddingVertical: 60, gap: 12 },
  emptyText: { fontSize: 15, color: '#bbb' },
});
