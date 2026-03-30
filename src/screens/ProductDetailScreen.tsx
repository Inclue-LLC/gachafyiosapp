import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../types';
import { MOCK_PRODUCTS } from '../data/mockData';
import { useAuth } from '../context/AuthContext';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'ProductDetail'>;
  route: RouteProp<RootStackParamList, 'ProductDetail'>;
};

const PURPLE = '#6C3CE1';

export default function ProductDetailScreen({ navigation, route }: Props) {
  const [tradeLawOpen, setTradeLawOpen] = useState(false);
  const [returnPolicyOpen, setReturnPolicyOpen] = useState(false);
  const { user } = useAuth();

  const product = MOCK_PRODUCTS.find((p) => p.id === route.params.productId);

  if (!product) {
    return (
      <SafeAreaView style={styles.safe}>
        <Text style={{ textAlign: 'center', marginTop: 40, color: '#999' }}>
          商品が見つかりません
        </Text>
      </SafeAreaView>
    );
  }

  const isSoldOut = product.status === 'sold_out' || product.remain_count === 0;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.navBar}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color="#1a1a2e" />
        </TouchableOpacity>
        <Text style={styles.navTitle} numberOfLines={1}>
          {product.title}
        </Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <Image source={{ uri: product.picture_url }} style={styles.hero} resizeMode="cover" />

        <View style={styles.body}>
          <Text style={styles.sellerName}>{product.seller_name}</Text>
          <Text style={styles.title}>{product.title}</Text>

          {isSoldOut ? (
            <View style={styles.soldOutBanner}>
              <Text style={styles.soldOutText}>SOLD OUT</Text>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.playBtn}
              onPress={() => {
                if (user) {
                  // ログイン済み → そのまま決済へ
                  navigation.navigate('Payment', { productId: product.id });
                } else {
                  // 未ログイン → ログイン画面へ遷移（商品IDを渡して、ログイン後に戻れるようにする）
                  navigation.navigate('Login', { redirectProductId: product.id });
                }
              }}
              activeOpacity={0.85}
            >
              <LinearGradient
                colors={[PURPLE, '#9C27B0']}
                style={styles.playBtnGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Text style={styles.playBtnText}>
                  {user
                    ? `¥${product.play_cost.toLocaleString()} / 回でプレイ`
                    : 'ログインしてプレイ'}
                </Text>
                <Ionicons name={user ? 'gift' : 'log-in-outline'} size={20} color="#fff" />
              </LinearGradient>
            </TouchableOpacity>
          )}

          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <Ionicons name="cube-outline" size={14} color="#999" />
              <Text style={styles.metaText}>残り{product.remain_count}個</Text>
            </View>
            <View style={styles.metaItem}>
              <Ionicons name="car-outline" size={14} color="#999" />
              <Text style={styles.metaText}>{product.shipping_cost_label}</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>ラインナップ</Text>
            {product.lineups.map((lineup, index) => (
              <View
                key={lineup.id}
                style={[
                  styles.lineupRow,
                  index === product.lineups.length - 1 && { borderBottomWidth: 0 },
                ]}
              >
                <Image
                  source={{ uri: lineup.picture_url }}
                  style={styles.lineupImage}
                />
                <Text style={styles.lineupName} numberOfLines={2}>
                  {lineup.name}
                </Text>
                <Text style={styles.lineupRate}>{lineup.pickup_rate}%</Text>
              </View>
            ))}
          </View>

          {product.description ? (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>商品説明</Text>
              <Text style={styles.descText}>{product.description}</Text>
            </View>
          ) : null}

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>配送について</Text>
            <Text style={styles.descText}>{product.delivery}</Text>
          </View>

          <Accordion
            title="特定商取引法に基づく表示"
            content={product.trade_law}
            open={tradeLawOpen}
            onToggle={() => setTradeLawOpen(!tradeLawOpen)}
          />
          <Accordion
            title="返品・交換ポリシー"
            content={product.return_policy}
            open={returnPolicyOpen}
            onToggle={() => setReturnPolicyOpen(!returnPolicyOpen)}
          />

          <View style={{ height: 20 }} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function Accordion({
  title,
  content,
  open,
  onToggle,
}: {
  title: string;
  content: string;
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <View style={accordionStyles.wrap}>
      <TouchableOpacity
        style={accordionStyles.header}
        onPress={onToggle}
        activeOpacity={0.75}
      >
        <Text style={accordionStyles.title}>{title}</Text>
        <Ionicons name={open ? 'chevron-up' : 'chevron-down'} size={18} color="#999" />
      </TouchableOpacity>
      {open && <Text style={accordionStyles.content}>{content}</Text>}
    </View>
  );
}

const accordionStyles = StyleSheet.create({
  wrap: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#f0f0f0',
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  title: { fontSize: 14, fontWeight: '600', color: '#333', flex: 1 },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 14,
    paddingTop: 12,
    fontSize: 13,
    color: '#666',
    lineHeight: 20,
    borderTopWidth: 1,
    borderTopColor: '#f5f5f5',
  },
});

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f8f8fc' },
  navBar: {
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
  navTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
    color: '#1a1a2e',
    textAlign: 'center',
  },
  hero: { width: '100%', height: 220 },
  body: { padding: 16 },
  sellerName: { fontSize: 13, color: '#999', marginBottom: 4 },
  title: { fontSize: 20, fontWeight: '800', color: '#1a1a2e', marginBottom: 14 },
  soldOutBanner: {
    backgroundColor: '#e0e0e0',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  soldOutText: { fontSize: 18, fontWeight: '800', color: '#999', letterSpacing: 2 },
  playBtn: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 12,
  },
  playBtnGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 18,
  },
  playBtnText: { fontSize: 18, fontWeight: '800', color: '#fff' },
  metaRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metaText: { fontSize: 12, color: '#999' },
  section: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    marginBottom: 10,
  },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: '#1a1a2e', marginBottom: 12 },
  lineupRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
    gap: 12,
  },
  lineupImage: { width: 56, height: 56, borderRadius: 8 },
  lineupName: { flex: 1, fontSize: 14, color: '#333', fontWeight: '500' },
  lineupRate: { fontSize: 14, fontWeight: '700', color: '#666' },
  descText: { fontSize: 14, color: '#555', lineHeight: 22 },
});
