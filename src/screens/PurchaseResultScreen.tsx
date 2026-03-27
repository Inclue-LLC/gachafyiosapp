import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList, GachaItem, Rarity } from '../types';
import RarityBadge from '../components/RarityBadge';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'PurchaseResult'>;
  route: RouteProp<RootStackParamList, 'PurchaseResult'>;
};

const RARITY_ORDER: Record<Rarity, number> = { SSR: 0, SR: 1, R: 2, N: 3 };
const RARITY_BORDER: Record<Rarity, string> = {
  SSR: '#FF9800',
  SR:  '#9C27B0',
  R:   '#2196F3',
  N:   '#9E9E9E',
};

export default function PurchaseResultScreen({ navigation, route }: Props) {
  const { items, gachaTitle } = route.params;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 500, useNativeDriver: true }),
    ]).start();
  }, []);

  const sorted = [...items].sort((a, b) => RARITY_ORDER[a.rarity] - RARITY_ORDER[b.rarity]);
  const hasSSR = items.some((i) => i.rarity === 'SSR');
  const hasSR = items.some((i) => i.rarity === 'SR');

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <LinearGradient colors={['#1a1a2e', '#6C3CE1']} style={styles.bg}>
        <Animated.View style={[styles.container, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
          <View style={styles.header}>
            {hasSSR ? (
              <View style={styles.rainbowBanner}>
                <Text style={styles.rainbowText}>✨ SSR排出！おめでとう！ ✨</Text>
              </View>
            ) : hasSR ? (
              <View style={styles.srBanner}>
                <Text style={styles.srBannerText}>⭐ SR排出！</Text>
              </View>
            ) : null}
            <Text style={styles.title}>ガチャ結果</Text>
            <Text style={styles.subtitle}>{gachaTitle}</Text>
          </View>

          <FlatList
            data={sorted}
            keyExtractor={(item, idx) => `${item.id}_${idx}`}
            numColumns={2}
            columnWrapperStyle={styles.row}
            contentContainerStyle={styles.listContent}
            renderItem={({ item }) => <ResultItem item={item} />}
          />

          <View style={styles.footer}>
            <View style={styles.summary}>
              {(['SSR', 'SR', 'R', 'N'] as Rarity[]).map((r) => {
                const cnt = items.filter((i) => i.rarity === r).length;
                if (!cnt) return null;
                return (
                  <View key={r} style={styles.summaryItem}>
                    <RarityBadge rarity={r} size="sm" />
                    <Text style={styles.summaryCount}>×{cnt}</Text>
                  </View>
                );
              })}
            </View>

            <TouchableOpacity
              style={styles.homeBtn}
              onPress={() => navigation.navigate('Main')}
              activeOpacity={0.85}
            >
              <Ionicons name="home" size={18} color="#fff" />
              <Text style={styles.homeBtnText}>ガチャ一覧に戻る</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </LinearGradient>
    </SafeAreaView>
  );
}

function ResultItem({ item }: { item: GachaItem }) {
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  useEffect(() => {
    Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true, tension: 60, friction: 7 }).start();
  }, []);

  return (
    <Animated.View style={[itemStyles.card, { borderColor: RARITY_BORDER[item.rarity], transform: [{ scale: scaleAnim }] }]}>
      {item.rarity === 'SSR' && (
        <View style={itemStyles.ssrGlow} />
      )}
      <Image source={{ uri: item.imageUrl }} style={itemStyles.image} />
      <View style={itemStyles.body}>
        <RarityBadge rarity={item.rarity} size="sm" />
        <Text style={itemStyles.name} numberOfLines={2}>{item.name}</Text>
      </View>
    </Animated.View>
  );
}

const itemStyles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: '#1e1e3a',
    borderRadius: 14,
    borderWidth: 2,
    overflow: 'hidden',
    margin: 5,
  },
  ssrGlow: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(255,152,0,0.08)',
  },
  image: { width: '100%', height: 110, resizeMode: 'cover' },
  body: { padding: 8, gap: 4 },
  name: { fontSize: 11, fontWeight: '700', color: '#fff', lineHeight: 15 },
});

const styles = StyleSheet.create({
  safe: { flex: 1 },
  bg: { flex: 1 },
  container: { flex: 1 },
  header: { alignItems: 'center', paddingTop: 20, paddingBottom: 12, paddingHorizontal: 20 },
  rainbowBanner: {
    backgroundColor: '#FF9800',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 6,
    marginBottom: 10,
  },
  rainbowText: { color: '#fff', fontWeight: '800', fontSize: 14 },
  srBanner: {
    backgroundColor: '#9C27B0',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 6,
    marginBottom: 10,
  },
  srBannerText: { color: '#fff', fontWeight: '800', fontSize: 14 },
  title: { fontSize: 24, fontWeight: '800', color: '#fff', marginBottom: 4 },
  subtitle: { fontSize: 13, color: 'rgba(255,255,255,0.7)' },
  row: { paddingHorizontal: 10 },
  listContent: { paddingBottom: 10 },
  footer: {
    padding: 16,
    paddingBottom: 8,
    gap: 12,
  },
  summary: { flexDirection: 'row', justifyContent: 'center', gap: 16, flexWrap: 'wrap' },
  summaryItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  summaryCount: { color: '#fff', fontSize: 14, fontWeight: '700' },
  homeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 14,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  homeBtnText: { color: '#fff', fontSize: 15, fontWeight: '700' },
});
