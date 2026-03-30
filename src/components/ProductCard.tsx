import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Product } from '../types';

interface Props {
  product: Product;
  onPress: () => void;
}

const PURPLE = '#6C3CE1';

export default function ProductCard({ product, onPress }: Props) {
  const isSoldOut = product.status === 'sold_out' || product.remain_count === 0;

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.9}
      disabled={isSoldOut}
    >
      <View style={styles.imageWrap}>
        <Image source={{ uri: product.picture_url }} style={styles.image} resizeMode="cover" />
        {isSoldOut && (
          <View style={styles.soldOutOverlay}>
            <Text style={styles.soldOutText}>SOLD OUT</Text>
          </View>
        )}
      </View>
      <View style={styles.body}>
        <Text style={styles.seller}>{product.seller_name}</Text>
        <Text style={styles.title} numberOfLines={2}>
          {product.title}
        </Text>
        <View style={styles.footer}>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>¥</Text>
            <Text style={styles.price}>{product.play_cost.toLocaleString()}</Text>
            <Text style={styles.priceUnit}>/回</Text>
          </View>
          {!isSoldOut && (
            <View style={styles.remainRow}>
              <Ionicons name="cube-outline" size={12} color="#999" />
              <Text style={styles.remain}>残り{product.remain_count}個</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 3,
  },
  imageWrap: { position: 'relative' },
  image: { width: '100%', height: 180 },
  soldOutOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  soldOutText: { color: '#fff', fontSize: 20, fontWeight: '800', letterSpacing: 2 },
  body: { padding: 14 },
  seller: { fontSize: 12, color: '#999', marginBottom: 4 },
  title: { fontSize: 16, fontWeight: '700', color: '#1a1a2e', marginBottom: 10 },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  priceRow: { flexDirection: 'row', alignItems: 'baseline', gap: 2 },
  priceLabel: { fontSize: 14, fontWeight: '700', color: PURPLE },
  price: { fontSize: 22, fontWeight: '800', color: PURPLE },
  priceUnit: { fontSize: 13, color: '#999' },
  remainRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  remain: { fontSize: 12, color: '#999' },
});
