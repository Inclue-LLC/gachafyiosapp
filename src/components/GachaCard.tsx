import React from 'react';
import {
  TouchableOpacity,
  View,
  Text,
  Image,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Gacha } from '../types';

interface Props {
  gacha: Gacha;
  onPress: () => void;
}

const PURPLE = '#6C3CE1';

export default function GachaCard({ gacha, onPress }: Props) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: gacha.imageUrl }}
          style={styles.image}
          resizeMode="cover"
        />
        <View style={styles.badgeRow}>
          {gacha.isNew && (
            <View style={[styles.tag, styles.tagNew]}>
              <Text style={styles.tagText}>NEW</Text>
            </View>
          )}
          {gacha.isLimited && (
            <View style={[styles.tag, styles.tagLimited]}>
              <Text style={styles.tagText}>限定</Text>
            </View>
          )}
        </View>
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryText}>{gacha.category}</Text>
        </View>
      </View>
      <View style={styles.body}>
        <Text style={styles.title} numberOfLines={1}>{gacha.title}</Text>
        <Text style={styles.desc} numberOfLines={2}>{gacha.description}</Text>
        <View style={styles.footer}>
          <View style={styles.priceRow}>
            <Ionicons name="diamond-outline" size={14} color={PURPLE} />
            <Text style={styles.price}>{gacha.price.toLocaleString()}pt / 1回</Text>
          </View>
          <View style={styles.pullCount}>
            <Ionicons name="people-outline" size={12} color="#999" />
            <Text style={styles.pullCountText}>{gacha.pullCount.toLocaleString()}</Text>
          </View>
        </View>
        <View style={styles.endDate}>
          <Ionicons name="time-outline" size={12} color="#e53935" />
          <Text style={styles.endDateText}>
            {gacha.endDate} まで
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    overflow: 'hidden',
  },
  imageContainer: {
    position: 'relative',
    height: 160,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  badgeRow: {
    position: 'absolute',
    top: 10,
    left: 10,
    flexDirection: 'row',
    gap: 6,
  },
  tag: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  tagNew: { backgroundColor: '#4CAF50' },
  tagLimited: { backgroundColor: '#e53935' },
  tagText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
  },
  categoryBadge: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: 'rgba(0,0,0,0.55)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  categoryText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '600',
  },
  body: {
    padding: 14,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1a1a2e',
    marginBottom: 4,
  },
  desc: {
    fontSize: 13,
    color: '#666',
    lineHeight: 18,
    marginBottom: 10,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  price: {
    fontSize: 14,
    fontWeight: '700',
    color: PURPLE,
  },
  pullCount: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  pullCountText: {
    fontSize: 12,
    color: '#999',
  },
  endDate: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  endDateText: {
    fontSize: 11,
    color: '#e53935',
  },
});
