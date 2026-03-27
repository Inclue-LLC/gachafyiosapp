import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { GachaItem } from '../types';
import RarityBadge from './RarityBadge';

interface Props {
  item: GachaItem;
  count?: number;
  gachaTitle?: string;
  showAnimation?: boolean;
}

const RARITY_BORDER: Record<string, string> = {
  N:   '#9E9E9E',
  R:   '#2196F3',
  SR:  '#9C27B0',
  SSR: '#FF9800',
};

export default function ItemCard({ item, count, gachaTitle }: Props) {
  return (
    <View style={[styles.card, { borderColor: RARITY_BORDER[item.rarity] }]}>
      <Image source={{ uri: item.imageUrl }} style={styles.image} />
      <View style={styles.body}>
        <RarityBadge rarity={item.rarity} size="sm" />
        <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
        {gachaTitle && (
          <Text style={styles.gacha} numberOfLines={1}>{gachaTitle}</Text>
        )}
      </View>
      {count !== undefined && count > 1 && (
        <View style={styles.countBadge}>
          <Text style={styles.countText}>×{count}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 2,
    overflow: 'hidden',
    width: '47%',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  image: {
    width: '100%',
    height: 100,
    resizeMode: 'cover',
  },
  body: {
    padding: 8,
    gap: 4,
  },
  name: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1a1a2e',
    marginTop: 2,
  },
  gacha: {
    fontSize: 10,
    color: '#999',
  },
  countBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  countText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
  },
});
