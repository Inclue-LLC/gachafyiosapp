import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList, GachaItem, OwnedItem, PurchaseHistory } from '../types';
import { MOCK_GACHAS } from '../data/mockData';
import { useAuth } from '../context/AuthContext';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Purchase'>;
  route: RouteProp<RootStackParamList, 'Purchase'>;
};

const PURPLE = '#6C3CE1';

function weightedRandom(items: GachaItem[]): GachaItem {
  const totalWeight = items.reduce((sum, i) => sum + i.probability, 0);
  let random = Math.random() * totalWeight;
  for (const item of items) {
    random -= item.probability;
    if (random <= 0) return item;
  }
  return items[items.length - 1];
}

function pullItems(gacha: typeof MOCK_GACHAS[0], count: number): GachaItem[] {
  const results: GachaItem[] = [];
  for (let i = 0; i < count; i++) {
    results.push(weightedRandom(gacha.items));
  }
  return results;
}

export default function PurchaseScreen({ navigation, route }: Props) {
  const { gachaId, pullType } = route.params;
  const { user, deductPoints, addOwnedItems, addPurchaseHistory } = useAuth();
  const [isPurchasing, setIsPurchasing] = useState(false);

  const gacha = MOCK_GACHAS.find((g) => g.id === gachaId);
  if (!gacha) return null;

  const count = pullType === 'ten' ? 10 : 1;
  const price = pullType === 'ten' ? gacha.tenPullPrice : gacha.price;
  const canAfford = (user?.points ?? 0) >= price;

  const handleConfirm = async () => {
    if (!canAfford) {
      Alert.alert('ポイント不足', 'ポイントが不足しています');
      return;
    }
    setIsPurchasing(true);
    try {
      await new Promise((r) => setTimeout(r, 1200));
      const pulledItems = pullItems(gacha, count);
      deductPoints(price);

      const newOwnedItems: OwnedItem[] = pulledItems.map((item, idx) => ({
        id: `owned_${Date.now()}_${idx}`,
        item,
        gachaTitle: gacha.title,
        obtainedAt: new Date().toISOString(),
        count: 1,
      }));
      addOwnedItems(newOwnedItems);

      const history: PurchaseHistory = {
        id: `purchase_${Date.now()}`,
        gachaId: gacha.id,
        gachaTitle: gacha.title,
        pullType,
        price,
        purchasedAt: new Date().toISOString(),
        items: pulledItems,
      };
      addPurchaseHistory(history);

      navigation.replace('PurchaseResult', { items: pulledItems, gachaTitle: gacha.title });
    } finally {
      setIsPurchasing(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color="#1a1a2e" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>購入確認</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.body}>
        <View style={styles.gachaPreview}>
          <Image source={{ uri: gacha.imageUrl }} style={styles.gachaImage} resizeMode="cover" />
          <View style={styles.gachaInfo}>
            <Text style={styles.gachaTitle} numberOfLines={2}>{gacha.title}</Text>
            <Text style={styles.gachaCategory}>{gacha.category}</Text>
          </View>
        </View>

        <View style={styles.detailCard}>
          <Row label="ガチャ内容" value={pullType === 'ten' ? '10回ガチャ' : '1回ガチャ'} />
          <View style={styles.divider} />
          <Row label="消費ポイント" value={`${price.toLocaleString()} pt`} valueColor={PURPLE} bold />
          <View style={styles.divider} />
          <Row label="残ポイント（購入後）" value={`${((user?.points ?? 0) - price).toLocaleString()} pt`} />
          {pullType === 'ten' && (
            <>
              <View style={styles.divider} />
              <Row label="割引額" value={`${(gacha.price * 10 - gacha.tenPullPrice).toLocaleString()} pt お得`} valueColor="#4CAF50" />
            </>
          )}
        </View>

        {!canAfford && (
          <View style={styles.warningBanner}>
            <Ionicons name="warning" size={16} color="#e53935" />
            <Text style={styles.warningText}>ポイントが不足しています</Text>
          </View>
        )}

        <TouchableOpacity
          style={[styles.confirmBtn, (!canAfford || isPurchasing) && styles.btnDisabled]}
          onPress={handleConfirm}
          disabled={!canAfford || isPurchasing}
          activeOpacity={0.85}
        >
          {isPurchasing ? (
            <View style={styles.loadingRow}>
              <ActivityIndicator color="#fff" />
              <Text style={styles.confirmBtnText}>ガチャ中...</Text>
            </View>
          ) : (
            <LinearGradient colors={[PURPLE, '#9C27B0']} style={styles.btnGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
              <Ionicons name="gift" size={22} color="#fff" />
              <Text style={styles.confirmBtnText}>
                {pullType === 'ten' ? '10連ガチャを引く' : 'ガチャを引く'}
              </Text>
            </LinearGradient>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.cancelBtn}>
          <Text style={styles.cancelBtnText}>キャンセル</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

function Row({ label, value, valueColor, bold }: { label: string; value: string; valueColor?: string; bold?: boolean }) {
  return (
    <View style={rowStyles.row}>
      <Text style={rowStyles.label}>{label}</Text>
      <Text style={[rowStyles.value, valueColor ? { color: valueColor } : null, bold ? { fontWeight: '800' } : null]}>{value}</Text>
    </View>
  );
}

const rowStyles = StyleSheet.create({
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12 },
  label: { fontSize: 14, color: '#666' },
  value: { fontSize: 15, fontWeight: '600', color: '#1a1a2e' },
});

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f8f8fc' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backBtn: { width: 40, height: 40, justifyContent: 'center' },
  headerTitle: { fontSize: 17, fontWeight: '700', color: '#1a1a2e' },
  body: { flex: 1, padding: 20 },
  gachaPreview: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 14,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  gachaImage: { width: 90, height: 70 },
  gachaInfo: { flex: 1, padding: 12, justifyContent: 'center' },
  gachaTitle: { fontSize: 15, fontWeight: '700', color: '#1a1a2e', marginBottom: 4 },
  gachaCategory: { fontSize: 12, color: '#999' },
  detailCard: {
    backgroundColor: '#fff',
    borderRadius: 14,
    paddingHorizontal: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  divider: { height: 1, backgroundColor: '#f5f5f5' },
  warningBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#ffebee',
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
  },
  warningText: { fontSize: 13, color: '#e53935', fontWeight: '600' },
  confirmBtn: {
    borderRadius: 14,
    overflow: 'hidden',
    marginBottom: 12,
  },
  btnDisabled: { opacity: 0.5 },
  btnGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 18,
  },
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 18,
    backgroundColor: PURPLE,
  },
  confirmBtnText: { fontSize: 17, fontWeight: '800', color: '#fff' },
  cancelBtn: { alignItems: 'center', paddingVertical: 12 },
  cancelBtnText: { fontSize: 14, color: '#999' },
});
