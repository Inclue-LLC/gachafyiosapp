import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../context/AuthContext';

const PURPLE = '#6C3CE1';

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric' });
}
function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString('ja-JP', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export default function MyPageScreen() {
  const { user, logout, purchaseHistory, ownedItems } = useAuth();

  const handleLogout = () => {
    Alert.alert('ログアウト', 'ログアウトしますか？', [
      { text: 'キャンセル', style: 'cancel' },
      { text: 'ログアウト', style: 'destructive', onPress: logout },
    ]);
  };

  const ssrCount = ownedItems.filter((o) => o.item.rarity === 'SSR').length;
  const totalSpent = purchaseHistory.reduce((sum, h) => sum + h.price, 0);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <LinearGradient colors={[PURPLE, '#9C27B0']} style={styles.profileSection}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{user?.name?.[0]?.toUpperCase() ?? '?'}</Text>
          </View>
          <Text style={styles.userName}>{user?.name}</Text>
          <Text style={styles.userEmail}>{user?.email}</Text>
          <Text style={styles.joinDate}>登録日: {user ? formatDate(user.joinedAt) : ''}</Text>

          <View style={styles.pointCard}>
            <Ionicons name="diamond" size={22} color={PURPLE} />
            <View style={styles.pointCardText}>
              <Text style={styles.pointCardLabel}>所持ポイント</Text>
              <Text style={styles.pointCardValue}>{user?.points.toLocaleString()} pt</Text>
            </View>
            <TouchableOpacity style={styles.chargeBtn}>
              <Text style={styles.chargeBtnText}>チャージ</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>

        <View style={styles.statsGrid}>
          <StatCard icon="git-pull-request" label="総ガチャ回数" value={`${user?.totalPulls ?? 0}回`} color={PURPLE} />
          <StatCard icon="star" label="SSR獲得数" value={`${ssrCount}体`} color="#FF9800" />
          <StatCard icon="cube" label="所持アイテム" value={`${ownedItems.length}種`} color="#4CAF50" />
          <StatCard icon="card" label="累計消費" value={`${totalSpent.toLocaleString()}pt`} color="#e53935" />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>購入履歴</Text>
          {purchaseHistory.length === 0 ? (
            <View style={styles.emptyHistory}>
              <Text style={styles.emptyHistoryText}>まだ購入履歴がありません</Text>
            </View>
          ) : (
            purchaseHistory.slice(0, 5).map((h) => (
              <View key={h.id} style={styles.historyItem}>
                <View style={styles.historyIcon}>
                  <Ionicons name="gift" size={18} color={PURPLE} />
                </View>
                <View style={styles.historyInfo}>
                  <Text style={styles.historyTitle} numberOfLines={1}>{h.gachaTitle}</Text>
                  <Text style={styles.historyDate}>{formatDateTime(h.purchasedAt)}</Text>
                </View>
                <View style={styles.historyRight}>
                  <Text style={styles.historyPullType}>
                    {h.pullType === 'ten' ? '10連' : '1回'}
                  </Text>
                  <Text style={styles.historyPrice}>-{h.price.toLocaleString()}pt</Text>
                </View>
              </View>
            ))
          )}
        </View>

        <View style={styles.menuSection}>
          <MenuItem icon="help-circle-outline" label="よくある質問" />
          <MenuItem icon="document-text-outline" label="利用規約" />
          <MenuItem icon="shield-checkmark-outline" label="プライバシーポリシー" />
          <MenuItem icon="mail-outline" label="お問い合わせ" />
          <MenuItem icon="log-out-outline" label="ログアウト" onPress={handleLogout} danger />
        </View>

        <Text style={styles.versionText}>Gachafy v1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

function StatCard({ icon, label, value, color }: { icon: string; label: string; value: string; color: string }) {
  return (
    <View style={statStyles.card}>
      <Ionicons name={icon as any} size={22} color={color} />
      <Text style={statStyles.value}>{value}</Text>
      <Text style={statStyles.label}>{label}</Text>
    </View>
  );
}

function MenuItem({ icon, label, onPress, danger }: { icon: string; label: string; onPress?: () => void; danger?: boolean }) {
  return (
    <TouchableOpacity style={menuStyles.item} onPress={onPress} activeOpacity={0.7}>
      <Ionicons name={icon as any} size={20} color={danger ? '#e53935' : '#555'} />
      <Text style={[menuStyles.label, danger && menuStyles.labelDanger]}>{label}</Text>
      <Ionicons name="chevron-forward" size={16} color="#ccc" />
    </TouchableOpacity>
  );
}

const statStyles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 14,
    alignItems: 'center',
    gap: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  value: { fontSize: 18, fontWeight: '800', color: '#1a1a2e' },
  label: { fontSize: 11, color: '#999', textAlign: 'center' },
});

const menuStyles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 14,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },
  label: { flex: 1, fontSize: 15, color: '#333' },
  labelDanger: { color: '#e53935' },
});

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f8f8fc' },
  profileSection: {
    paddingTop: 32,
    paddingBottom: 24,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.25)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.5)',
  },
  avatarText: { fontSize: 32, fontWeight: '800', color: '#fff' },
  userName: { fontSize: 22, fontWeight: '800', color: '#fff', marginBottom: 2 },
  userEmail: { fontSize: 13, color: 'rgba(255,255,255,0.8)', marginBottom: 4 },
  joinDate: { fontSize: 12, color: 'rgba(255,255,255,0.6)', marginBottom: 16 },
  pointCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    width: '100%',
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  pointCardText: { flex: 1 },
  pointCardLabel: { fontSize: 11, color: '#999' },
  pointCardValue: { fontSize: 20, fontWeight: '800', color: PURPLE },
  chargeBtn: {
    backgroundColor: PURPLE,
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  chargeBtnText: { color: '#fff', fontWeight: '700', fontSize: 13 },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 12,
    gap: 10,
  },
  section: { margin: 16, marginTop: 4 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#1a1a2e', marginBottom: 12 },
  emptyHistory: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 24,
    alignItems: 'center',
  },
  emptyHistoryText: { color: '#bbb', fontSize: 14 },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  historyIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0ebff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  historyInfo: { flex: 1 },
  historyTitle: { fontSize: 14, fontWeight: '600', color: '#1a1a2e' },
  historyDate: { fontSize: 11, color: '#999', marginTop: 2 },
  historyRight: { alignItems: 'flex-end', gap: 2 },
  historyPullType: { fontSize: 11, color: '#888', backgroundColor: '#f5f5f5', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  historyPrice: { fontSize: 13, fontWeight: '700', color: '#e53935' },
  menuSection: {
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  versionText: {
    textAlign: 'center',
    color: '#ccc',
    fontSize: 12,
    paddingVertical: 20,
  },
});
