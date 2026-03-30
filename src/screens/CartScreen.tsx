import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';

const PURPLE = '#6C3CE1';

function formatDate(iso: string) {
  return new Date(iso).toLocaleString('ja-JP', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function CartScreen() {
  const { cartItems, requestShipping } = useAuth();

  const pendingCount = cartItems.filter((c) => !c.shipping_requested).length;

  const handleRequestShipping = (id: string, name: string) => {
    Alert.alert('配送依頼', `「${name}」の配送を依頼しますか？`, [
      { text: 'キャンセル', style: 'cancel' },
      { text: '依頼する', onPress: () => requestShipping(id) },
    ]);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>カート・配送管理</Text>
        <Text style={styles.headerCount}>{pendingCount}件 配送待ち</Text>
      </View>

      <FlatList
        data={cartItems}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          cartItems.length > 0 ? (
            <Text style={styles.sectionLabel}>獲得アイテム一覧</Text>
          ) : null
        }
        renderItem={({ item }) => (
          <View style={styles.cartCard}>
            <Image source={{ uri: item.lineup.picture_url }} style={styles.itemImage} />
            <View style={styles.itemInfo}>
              <Text style={styles.itemName} numberOfLines={2}>
                {item.lineup.name}
              </Text>
              <Text style={styles.productTitle} numberOfLines={1}>
                {item.product_title}
              </Text>
              <Text style={styles.wonDate}>{formatDate(item.won_at)}</Text>
            </View>
            <View style={styles.itemAction}>
              {item.shipping_requested ? (
                <View style={styles.requestedBadge}>
                  <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
                  <Text style={styles.requestedText}>依頼済み</Text>
                </View>
              ) : (
                <TouchableOpacity
                  style={styles.shippingBtn}
                  onPress={() => handleRequestShipping(item.id, item.lineup.name)}
                  activeOpacity={0.85}
                >
                  <Text style={styles.shippingBtnText}>配送依頼</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="bag-outline" size={56} color="#ddd" />
            <Text style={styles.emptyTitle}>カートは空です</Text>
            <Text style={styles.emptySubtitle}>
              ガチャをプレイして当てたアイテムがここに表示されます
            </Text>
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
  listContent: { padding: 16, paddingBottom: 30 },
  sectionLabel: { fontSize: 13, color: '#999', marginBottom: 10 },
  cartCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 14,
    marginBottom: 10,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  itemImage: { width: 90, height: 90 },
  itemInfo: { flex: 1, padding: 12, justifyContent: 'center', gap: 3 },
  itemName: { fontSize: 14, fontWeight: '700', color: '#1a1a2e' },
  productTitle: { fontSize: 11, color: '#999' },
  wonDate: { fontSize: 11, color: '#bbb' },
  itemAction: { justifyContent: 'center', paddingRight: 12 },
  requestedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#e8f5e9',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 8,
  },
  requestedText: { fontSize: 12, color: '#4CAF50', fontWeight: '600' },
  shippingBtn: {
    backgroundColor: PURPLE,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  shippingBtnText: { color: '#fff', fontSize: 12, fontWeight: '700' },
  empty: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
    gap: 12,
  },
  emptyTitle: { fontSize: 16, fontWeight: '700', color: '#ccc' },
  emptySubtitle: {
    fontSize: 13,
    color: '#bbb',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
});
