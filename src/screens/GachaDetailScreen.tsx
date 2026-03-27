import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { RootStackParamList } from '../types';
import { MOCK_GACHAS } from '../data/mockData';
import { useAuth } from '../context/AuthContext';
import RarityBadge from '../components/RarityBadge';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'GachaDetail'>;
  route: RouteProp<RootStackParamList, 'GachaDetail'>;
};

const PURPLE = '#6C3CE1';

export default function GachaDetailScreen({ navigation, route }: Props) {
  const { user } = useAuth();
  const gacha = MOCK_GACHAS.find((g) => g.id === route.params.gachaId);

  if (!gacha) {
    return (
      <SafeAreaView style={styles.safe}>
        <Text style={{ textAlign: 'center', marginTop: 40 }}>ガチャが見つかりません</Text>
      </SafeAreaView>
    );
  }

  const canAffordSingle = (user?.points ?? 0) >= gacha.price;
  const canAffordTen = (user?.points ?? 0) >= gacha.tenPullPrice;

  const handlePull = (pullType: 'single' | 'ten') => {
    navigation.navigate('Purchase', { gachaId: gacha.id, pullType });
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.imageContainer}>
          <Image source={{ uri: gacha.imageUrl }} style={styles.image} resizeMode="cover" />
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.7)']}
            style={styles.imageOverlay}
          />
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={22} color="#fff" />
          </TouchableOpacity>
          <View style={styles.imageMeta}>
            <View style={styles.tagRow}>
              {gacha.isNew && <View style={[styles.tag, styles.tagNew]}><Text style={styles.tagText}>NEW</Text></View>}
              {gacha.isLimited && <View style={[styles.tag, styles.tagLimited]}><Text style={styles.tagText}>限定</Text></View>}
            </View>
            <Text style={styles.imageTitle}>{gacha.title}</Text>
          </View>
        </View>

        <View style={styles.body}>
          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <Ionicons name="time-outline" size={14} color="#e53935" />
              <Text style={styles.infoLabel}>終了日</Text>
              <Text style={[styles.infoValue, { color: '#e53935' }]}>{gacha.endDate}</Text>
            </View>
            <View style={styles.infoItem}>
              <Ionicons name="people-outline" size={14} color="#666" />
              <Text style={styles.infoLabel}>総ガチャ数</Text>
              <Text style={styles.infoValue}>{gacha.pullCount.toLocaleString()}回</Text>
            </View>
            <View style={styles.infoItem}>
              <Ionicons name="pricetag-outline" size={14} color="#666" />
              <Text style={styles.infoLabel}>カテゴリ</Text>
              <Text style={styles.infoValue}>{gacha.category}</Text>
            </View>
          </View>

          <Text style={styles.desc}>{gacha.description}</Text>

          <View style={styles.pullSection}>
            <View style={styles.pointBalance}>
              <Ionicons name="diamond" size={14} color={PURPLE} />
              <Text style={styles.pointBalanceText}>
                所持ポイント: <Text style={{ fontWeight: '700', color: PURPLE }}>{user?.points.toLocaleString()} pt</Text>
              </Text>
            </View>

            <TouchableOpacity
              style={[styles.pullBtn, styles.pullBtnSingle, !canAffordSingle && styles.btnDisabled]}
              onPress={() => handlePull('single')}
              disabled={!canAffordSingle}
              activeOpacity={0.85}
            >
              <View style={styles.pullBtnInner}>
                <Text style={styles.pullBtnTitle}>1回ガチャ</Text>
                <View style={styles.pullBtnPrice}>
                  <Ionicons name="diamond" size={14} color={PURPLE} />
                  <Text style={styles.pullBtnPriceText}>{gacha.price.toLocaleString()} pt</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color={PURPLE} />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.pullBtn, styles.pullBtnTen, !canAffordTen && styles.btnDisabled]}
              onPress={() => handlePull('ten')}
              disabled={!canAffordTen}
              activeOpacity={0.85}
            >
              <LinearGradient colors={[PURPLE, '#9C27B0']} style={styles.pullBtnGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
                <View style={styles.pullBtnInner}>
                  <View>
                    <Text style={styles.pullBtnTitleWhite}>10回ガチャ</Text>
                    <Text style={styles.pullBtnSavings}>
                      お得！{(gacha.price * 10 - gacha.tenPullPrice).toLocaleString()}pt割引
                    </Text>
                  </View>
                  <View style={styles.pullBtnPrice}>
                    <Ionicons name="diamond" size={14} color="#fff" />
                    <Text style={styles.pullBtnPriceTextWhite}>{gacha.tenPullPrice.toLocaleString()} pt</Text>
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#fff" />
              </LinearGradient>
            </TouchableOpacity>

            {!canAffordSingle && (
              <Text style={styles.insufficientText}>
                ポイントが不足しています。チャージしてください。
              </Text>
            )}
          </View>

          <View style={styles.itemsSection}>
            <Text style={styles.sectionTitle}>排出アイテム一覧</Text>
            <FlatList
              data={gacha.items}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              renderItem={({ item }) => (
                <View style={styles.itemRow}>
                  <Image source={{ uri: item.imageUrl }} style={styles.itemImage} />
                  <View style={styles.itemInfo}>
                    <View style={styles.itemNameRow}>
                      <RarityBadge rarity={item.rarity} size="sm" />
                      <Text style={styles.itemName}>{item.name}</Text>
                    </View>
                    <Text style={styles.itemDesc}>{item.description}</Text>
                  </View>
                  <Text style={styles.itemProb}>{item.probability}%</Text>
                </View>
              )}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f8f8fc' },
  imageContainer: { position: 'relative', height: 240 },
  image: { width: '100%', height: '100%' },
  imageOverlay: { position: 'absolute', left: 0, right: 0, bottom: 0, height: 120 },
  backBtn: {
    position: 'absolute',
    top: 16,
    left: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageMeta: { position: 'absolute', bottom: 16, left: 16, right: 16 },
  tagRow: { flexDirection: 'row', gap: 6, marginBottom: 6 },
  tag: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 4 },
  tagNew: { backgroundColor: '#4CAF50' },
  tagLimited: { backgroundColor: '#e53935' },
  tagText: { color: '#fff', fontSize: 11, fontWeight: '700' },
  imageTitle: { fontSize: 20, fontWeight: '800', color: '#fff' },
  body: { padding: 20 },
  infoRow: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 14,
    marginBottom: 16,
    gap: 8,
  },
  infoItem: { flex: 1, alignItems: 'center', gap: 3 },
  infoLabel: { fontSize: 11, color: '#999' },
  infoValue: { fontSize: 12, fontWeight: '700', color: '#333', textAlign: 'center' },
  desc: { fontSize: 14, color: '#555', lineHeight: 22, marginBottom: 20 },
  pullSection: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  pointBalance: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 14,
    backgroundColor: '#f0ebff',
    padding: 10,
    borderRadius: 10,
  },
  pointBalanceText: { fontSize: 13, color: '#555' },
  pullBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 12,
    marginBottom: 10,
    overflow: 'hidden',
  },
  pullBtnSingle: {
    backgroundColor: '#f0ebff',
    padding: 14,
    borderWidth: 2,
    borderColor: PURPLE,
  },
  pullBtnTen: { borderWidth: 0 },
  pullBtnGradient: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
  },
  pullBtnInner: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  pullBtnTitle: { fontSize: 15, fontWeight: '700', color: PURPLE },
  pullBtnTitleWhite: { fontSize: 15, fontWeight: '700', color: '#fff' },
  pullBtnSavings: { fontSize: 11, color: 'rgba(255,255,255,0.8)', marginTop: 2 },
  pullBtnPrice: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  pullBtnPriceText: { fontSize: 16, fontWeight: '800', color: PURPLE },
  pullBtnPriceTextWhite: { fontSize: 16, fontWeight: '800', color: '#fff' },
  btnDisabled: { opacity: 0.45 },
  insufficientText: { fontSize: 12, color: '#e53935', textAlign: 'center', marginTop: 6 },
  itemsSection: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
  },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#1a1a2e', marginBottom: 14 },
  itemRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  itemImage: { width: 52, height: 52, borderRadius: 8 },
  itemInfo: { flex: 1, gap: 4 },
  itemNameRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  itemName: { fontSize: 14, fontWeight: '600', color: '#1a1a2e', flex: 1 },
  itemDesc: { fontSize: 12, color: '#888' },
  itemProb: { fontSize: 13, fontWeight: '700', color: '#666' },
  separator: { height: 1, backgroundColor: '#f0f0f0', marginVertical: 12 },
});
