import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Rarity } from '../types';

const RARITY_COLORS: Record<Rarity, { bg: string; text: string }> = {
  N:   { bg: '#9E9E9E', text: '#fff' },
  R:   { bg: '#2196F3', text: '#fff' },
  SR:  { bg: '#9C27B0', text: '#fff' },
  SSR: { bg: '#FF9800', text: '#fff' },
};

interface Props {
  rarity: Rarity;
  size?: 'sm' | 'md';
}

export default function RarityBadge({ rarity, size = 'md' }: Props) {
  const colors = RARITY_COLORS[rarity];
  const isSmall = size === 'sm';
  return (
    <View style={[styles.badge, { backgroundColor: colors.bg }, isSmall && styles.badgeSm]}>
      <Text style={[styles.text, { color: colors.text }, isSmall && styles.textSm]}>
        {rarity}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  badgeSm: {
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 3,
  },
  text: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  textSm: {
    fontSize: 10,
  },
});
