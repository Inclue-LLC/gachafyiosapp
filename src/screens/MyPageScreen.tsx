import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Clipboard,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../context/AuthContext';
import { PurchaseHistory } from '../types';

const PURPLE = '#6C3CE1';

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric' });
}
function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString('ja-JP', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

interface MonthGroup {
  key: string;
  label: string;
  total: number;
  pullCount: number;
  entries: PurchaseHistory[];
}

function buildMonthlyGroups(history: PurchaseHistory[]): MonthGroup[] {
  const map = new Map<string, MonthGroup>();
  history.forEach((h) => {
    const d = new Date(h.purchasedAt);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    const label = d.toLocaleDateString('ja-JP', { year: 'numeric', month: 'long' });
    if (!map.has(key)) map.set(key, { key, label, total: 0, pullCount: 0, entries: [] });
    const m = map.get(key)!;
    m.total += h.price;
    m.pullCount += h.pullType === 'ten' ? 10 : 1;
    m.entries.push(h);
  });
  return Array.from(map.entries())
    .sort(([a], [b]) => b.localeCompare(a))
    .map(([, v]) => v);
}

function buildCopyText(group: MonthGroup): string {
  const lines = [
    `【${group.label}のガチャ支出明細】`,
    `合計: ${group.total.toLocaleString()}pt（${group.pullCount}回引き）`,
    '',
    ...group.entries.map((e) => {
      const date = new Date(e.purchasedAt).toLocaleDateString('ja-JP', { month: 'numeric', day: 'numeric' });
      return `${date}  ${e.gachaTitle}  ${e.pullType === 'ten' ? '10連' : '1回'}  -${e.price.toLocaleString()}pt`;
    }),
  ];
  return lines.join('\n');
}

export default function MyPageScreen() {
  const { user, logout, purchaseHistory, ownedItems } = useAuth();
  const [expandedMonths, setExpandedMonths] = useState<Set<string>>(new Set());

  const handleLogout = () => {
    Alert.alert('ログアウト', 'ログアウトしますか？', [
      { text: 'キャンセル', style: 'cancel' },
      { text: 'ログアウト', style: 'destructive', onPress: logout },
    ]);
  };

  const ssrCount = ownedItems.filter((o) => o.item.rarity === 'SSR').length;
  const totalSpent = purchaseHistory.reduce((sum, h) => sum + h.price, 0);
  const monthlyGroups = useMemo(() => buildMonthlyGroups(purchaseHistory), [purchaseHistory]);

  const toggleMonth = (key: string) => {
    setExpandedMonths((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const handleCopy = (group: MonthGroup) => {
    Clipboard.setString(buildCopyText(group));
    Alert.alert('コピー完了', `${group.label}の支出情報をクリップボードにコピーしました。`);
  };

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

        {/* Monthly Expense Report */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="bar-chart-outline" size={18} color={PURPLE} />
            <Text style={styles.sectionTitle}>月別支出レポート</Text>
          </View>

          {monthlyGroups.length === 0 ? (
            <View style={styles.emptyHistory}>
              <Text style={styles.emptyHistoryText}>まだ購入履歴がありません</Text>
            </View>
          ) : (
            monthlyGroups.map((group) => {
              const isExpanded = expandedMonths.has(group.key);
              return (
                <View key={group.key} style={monthStyles.card}>
                  <TouchableOpacity
                    style={monthStyles.header}
                    onPress={() => toggleMonth(group.key)}
                    activeOpacity={0.7}
                  >
                    <View style={monthStyles.headerLeft}>
                      <Text style={monthStyles.monthLabel}>{group.label}</Text>
                      <View style={monthStyles.badgeRow}>
                        <View style={monthStyles.badge}>
                          <Text style={monthStyles.badgeText}>{group.entries.length}回購入</Text>
                        </View>
                        <View style={monthStyles.badge}>
                          <Text style={monthStyles.badgeText}>{group.pullCount}回引き</Text>
                        </View>
                      </View>
                    </View>
                    <View style={monthStyles.headerRight}>
                      <Text style={monthStyles.totalAmount}>-{group.total.toLocaleString()}pt</Text>
                      <TouchableOpacity
                        style={monthStyles.copyBtn}
                        onPress={() => handleCopy(group)}
                        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                      >
                        <Ionicons name="copy-outline" size={16} color={PURPLE} />
                      </TouchableOpacity>
                      <Ionicons
                        name={isExpanded ? 'chevron-up' : 'chevron-down'}
                        size={16}
                        color="#aaa"
                      />
                    </View>
                  </TouchableOpacity>

                  {isExpanded && (
                    <View style={monthStyles.entries}>
                      {group.entries.map((h) => (
                        <View key={h.id} style={monthStyles.entryRow}>
                          <View style={monthStyles.entryIcon}>
                            <Ionicons name="gift" size={14} color={PURPLE} />
                          </View>
                          <View style={monthStyles.entryInfo}>
                            <Text style={monthStyles.entryTitle} numberOfLines={1}>{h.gachaTitle}</Text>
                            <Text style={monthStyles.entryDate}>{formatDateTime(h.purchasedAt)}</Text>
                          </View>
                          <View style={monthStyles.entryRight}>
                            <Text style={monthStyles.entryPullType}>
                              {h.pullType === 'ten' ? '10連' : '1回'}
                            </Text>
                            <Text style={monthStyles.entryPrice}>-{h.price.toLocaleString()}pt</Text>
                          </View>
                        </View>
                      ))}
                    </View>
                  )}
                </View>
              );
            })
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

const monthStyles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    marginBottom: 10,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  headerLeft: { flex: 1, gap: 4 },
  monthLabel: { fontSize: 15, fontWeight: '700', color: '#1a1a2e' },
  badgeRow: { flexDirection: 'row', gap: 6 },
  badge: {
    backgroundColor: '#f0ebff',
    borderRadius: 6,
    paddingHorizontal: 7,
    paddingVertical: 2,
  },
  badgeText: { fontSize: 11, color: PURPLE, fontWeight: '600' },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  totalAmount: { fontSize: 16, fontWeight: '800', color: '#e53935' },
  copyBtn: {
    padding: 4,
    backgroundColor: '#f0ebff',
    borderRadius: 6,
  },
  entries: {
    borderTopWidth: 1,
    borderTopColor: '#f5f5f5',
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 6,
  },
  entryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    gap: 10,
  },
  entryIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#f0ebff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  entryInfo: { flex: 1 },
  entryTitle: { fontSize: 13, fontWeight: '600', color: '#1a1a2e' },
  entryDate: { fontSize: 11, color: '#999', marginTop: 1 },
  entryRight: { alignItems: 'flex-end', gap: 2 },
  entryPullType: {
    fontSize: 11,
    color: '#888',
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  entryPrice: { fontSize: 13, fontWeight: '700', color: '#e53935' },
});

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
  section: { marginHorizontal: 16, marginBottom: 16 },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 12,
  },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#1a1a2e' },
  emptyHistory: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 24,
    alignItems: 'center',
  },
  emptyHistoryText: { color: '#bbb', fontSize: 14 },
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
