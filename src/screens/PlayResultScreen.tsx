import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../types';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'PlayResult'>;
  route: RouteProp<RootStackParamList, 'PlayResult'>;
};

const ANIMATION_COLORS = ['#e53935', '#43a047', '#1e88e5', '#6C3CE1'];
const ANIMATION_DURATION = 2800;

export default function PlayResultScreen({ navigation, route }: Props) {
  const { lineup, productTitle, productId } = route.params;
  const [phase, setPhase] = useState<'animating' | 'reveal'>('animating');
  const [bgColorIndex, setBgColorIndex] = useState(0);
  const fadeIn = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.7)).current;

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      i = (i + 1) % ANIMATION_COLORS.length;
      setBgColorIndex(i);
    }, 350);

    const timer = setTimeout(() => {
      clearInterval(interval);
      setPhase('reveal');
      Animated.parallel([
        Animated.timing(fadeIn, { toValue: 1, duration: 700, useNativeDriver: true }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          useNativeDriver: true,
          tension: 55,
          friction: 8,
        }),
      ]).start();
    }, ANIMATION_DURATION);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, []);

  if (phase === 'animating') {
    return (
      <View style={[styles.animationScreen, { backgroundColor: ANIMATION_COLORS[bgColorIndex] }]}>
        <View style={styles.animationContent}>
          <View style={styles.spinnerWrap}>
            <Ionicons name="gift" size={64} color="rgba(255,255,255,0.95)" />
          </View>
          <Text style={styles.animatingText}>抽選中...</Text>
          <View style={styles.dots}>
            <AnimatedDot delay={0} />
            <AnimatedDot delay={220} />
            <AnimatedDot delay={440} />
          </View>
        </View>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.revealSafe} edges={['top', 'bottom']}>
      <View style={styles.revealScreen}>
        <View style={styles.revealHeader}>
          <Text style={styles.revealSubtitle}>{productTitle}</Text>
          <Text style={styles.revealTitle}>当選結果</Text>
        </View>

        <Animated.View
          style={[
            styles.revealCard,
            { opacity: fadeIn, transform: [{ scale: scaleAnim }] },
          ]}
        >
          <Image
            source={{ uri: lineup.picture_url }}
            style={styles.revealImage}
            resizeMode="cover"
          />
          <View style={styles.revealBody}>
            <Text style={styles.revealItemName}>{lineup.name}</Text>
            <Text style={styles.revealRate}>排出率 {lineup.pickup_rate}%</Text>
          </View>
        </Animated.View>

        <Animated.View style={[styles.revealActions, { opacity: fadeIn }]}>
          <TouchableOpacity
            style={styles.playAgainBtn}
            onPress={() => navigation.replace('Payment', { productId })}
            activeOpacity={0.85}
          >
            <Ionicons name="refresh" size={18} color="#6C3CE1" />
            <Text style={styles.playAgainText}>もう一度プレイ</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.cartBtn}
            onPress={() => navigation.navigate('Main', { screen: 'Cart' })}
            activeOpacity={0.85}
          >
            <Ionicons name="bag" size={18} color="#fff" />
            <Text style={styles.cartBtnText}>配送依頼へ</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.homeBtn}
            onPress={() => navigation.navigate('Main')}
            activeOpacity={0.85}
          >
            <Text style={styles.homeBtnText}>トップページへ戻る</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}

function AnimatedDot({ delay }: { delay: number }) {
  const anim = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(anim, { toValue: 1, duration: 400, useNativeDriver: true }),
        Animated.timing(anim, { toValue: 0.3, duration: 400, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, []);

  return <Animated.View style={[dotStyles.dot, { opacity: anim }]} />;
}

const dotStyles = StyleSheet.create({
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#fff',
    marginHorizontal: 4,
  },
});

const styles = StyleSheet.create({
  animationScreen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  animationContent: { alignItems: 'center', gap: 24 },
  spinnerWrap: {
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  animatingText: { fontSize: 24, fontWeight: '800', color: '#fff' },
  dots: { flexDirection: 'row', alignItems: 'center' },
  revealSafe: { flex: 1, backgroundColor: '#1a1a2e' },
  revealScreen: {
    flex: 1,
    backgroundColor: '#1a1a2e',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 24,
  },
  revealHeader: { alignItems: 'center', paddingTop: 8 },
  revealSubtitle: { fontSize: 13, color: 'rgba(255,255,255,0.6)', marginBottom: 6 },
  revealTitle: { fontSize: 28, fontWeight: '800', color: '#fff' },
  revealCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    overflow: 'hidden',
    width: '100%',
    maxWidth: 320,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 24,
    elevation: 14,
  },
  revealImage: { width: '100%', height: 280 },
  revealBody: { padding: 20, alignItems: 'center', gap: 6 },
  revealItemName: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1a1a2e',
    textAlign: 'center',
  },
  revealRate: { fontSize: 13, color: '#999' },
  revealActions: { width: '100%', gap: 10 },
  playAgainBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#fff',
    borderRadius: 14,
    paddingVertical: 16,
  },
  playAgainText: { fontSize: 16, fontWeight: '700', color: '#6C3CE1' },
  cartBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#6C3CE1',
    borderRadius: 14,
    paddingVertical: 16,
  },
  cartBtnText: { fontSize: 16, fontWeight: '700', color: '#fff' },
  homeBtn: { alignItems: 'center', paddingVertical: 10 },
  homeBtnText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.5)',
    textDecorationLine: 'underline',
  },
});
