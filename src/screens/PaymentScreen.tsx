import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  TextInput,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList, CartItem, PlayHistory } from '../types';
import { MOCK_PRODUCTS } from '../data/mockData';
import { useAuth } from '../context/AuthContext';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Payment'>;
  route: RouteProp<RootStackParamList, 'Payment'>;
};

const PURPLE = '#6C3CE1';

function weightedRandom(lineups: typeof MOCK_PRODUCTS[0]['lineups']) {
  const total = lineups.reduce((sum, l) => sum + l.count, 0);
  let r = Math.random() * total;
  for (const lineup of lineups) {
    r -= lineup.count;
    if (r <= 0) return lineup;
  }
  return lineups[lineups.length - 1];
}

export default function PaymentScreen({ navigation, route }: Props) {
  const { productId } = route.params;
  const { addCartItem, addPlayHistory } = useAuth();
  const [isPaying, setIsPaying] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [cardName, setCardName] = useState('');

  const product = MOCK_PRODUCTS.find((p) => p.id === productId);
  if (!product) return null;

  const formatCardNumber = (text: string) => {
    const digits = text.replace(/\D/g, '').slice(0, 16);
    return digits.replace(/(\d{4})(?=\d)/g, '$1 ');
  };

  const formatExpiry = (text: string) => {
    const digits = text.replace(/\D/g, '').slice(0, 4);
    if (digits.length >= 3) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
    return digits;
  };

  const handlePay = async () => {
    if (!cardNumber || !expiry || !cvc || !cardName) {
      Alert.alert('入力エラー', 'カード情報をすべて入力してください');
      return;
    }
    setIsPaying(true);
    try {
      await new Promise((r) => setTimeout(r, 1500));
      const wonLineup = weightedRandom(product.lineups);

      const cartItem: CartItem = {
        id: `cart_${Date.now()}`,
        lineup: wonLineup,
        product_id: product.id,
        product_title: product.title,
        product_picture_url: product.picture_url,
        won_at: new Date().toISOString(),
        shipping_requested: false,
      };
      addCartItem(cartItem);

      const history: PlayHistory = {
        id: `play_${Date.now()}`,
        product_id: product.id,
        product_title: product.title,
        played_at: new Date().toISOString(),
        cost: product.play_cost,
        lineup: wonLineup,
      };
      addPlayHistory(history);

      navigation.replace('PlayResult', {
        lineup: wonLineup,
        productTitle: product.title,
        productId: product.id,
      });
    } finally {
      setIsPaying(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color="#1a1a2e" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>お支払い</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.body} keyboardShouldPersistTaps="handled">
        <View style={styles.orderSummary}>
          <Text style={styles.orderLabel}>注文内容</Text>
          <Text style={styles.orderTitle}>{product.title}</Text>
          <View style={styles.orderRow}>
            <Text style={styles.orderRowLabel}>プレイ料金</Text>
            <Text style={styles.orderRowValue}>¥{product.play_cost.toLocaleString()}</Text>
          </View>
          <View style={styles.orderRow}>
            <Text style={styles.orderRowLabel}>配送料</Text>
            <Text style={styles.orderRowValue}>{product.shipping_cost_label}</Text>
          </View>
          <View style={[styles.orderRow, styles.orderTotal]}>
            <Text style={styles.orderTotalLabel}>今回の決済</Text>
            <Text style={styles.orderTotalValue}>¥{product.play_cost.toLocaleString()}</Text>
          </View>
        </View>

        <View style={styles.cardForm}>
          <View style={styles.cardFormHeader}>
            <Ionicons name="card" size={20} color={PURPLE} />
            <Text style={styles.cardFormTitle}>カード情報</Text>
            <Ionicons name="lock-closed" size={14} color="#999" />
            <Text style={styles.secureText}>安全な決済</Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>カード番号</Text>
            <TextInput
              style={styles.input}
              value={cardNumber}
              onChangeText={(t) => setCardNumber(formatCardNumber(t))}
              placeholder="1234 5678 9012 3456"
              placeholderTextColor="#ccc"
              keyboardType="numeric"
              maxLength={19}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>カード名義</Text>
            <TextInput
              style={styles.input}
              value={cardName}
              onChangeText={setCardName}
              placeholder="TARO YAMADA"
              placeholderTextColor="#ccc"
              autoCapitalize="characters"
            />
          </View>

          <View style={styles.inputRow}>
            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={styles.inputLabel}>有効期限</Text>
              <TextInput
                style={styles.input}
                value={expiry}
                onChangeText={(t) => setExpiry(formatExpiry(t))}
                placeholder="MM/YY"
                placeholderTextColor="#ccc"
                keyboardType="numeric"
                maxLength={5}
              />
            </View>
            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={styles.inputLabel}>セキュリティコード</Text>
              <TextInput
                style={styles.input}
                value={cvc}
                onChangeText={(t) => setCvc(t.replace(/\D/g, '').slice(0, 4))}
                placeholder="123"
                placeholderTextColor="#ccc"
                keyboardType="numeric"
                maxLength={4}
                secureTextEntry
              />
            </View>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.payBtn, isPaying && styles.payBtnDisabled]}
          onPress={handlePay}
          disabled={isPaying}
          activeOpacity={0.85}
        >
          {isPaying ? (
            <View style={styles.loadingRow}>
              <ActivityIndicator color="#fff" />
              <Text style={styles.payBtnText}>処理中...</Text>
            </View>
          ) : (
            <LinearGradient
              colors={[PURPLE, '#9C27B0']}
              style={styles.payBtnGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Ionicons name="lock-closed" size={18} color="#fff" />
              <Text style={styles.payBtnText}>
                ¥{product.play_cost.toLocaleString()} を支払ってプレイ
              </Text>
            </LinearGradient>
          )}
        </TouchableOpacity>

        <Text style={styles.disclaimer}>
          ※ これはデモアプリです。実際の決済は発生しません。
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f8f8fc' },
  header: {
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
  headerTitle: { fontSize: 17, fontWeight: '700', color: '#1a1a2e' },
  body: { padding: 16, gap: 16 },
  orderSummary: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  orderLabel: { fontSize: 12, color: '#999', marginBottom: 6 },
  orderTitle: { fontSize: 16, fontWeight: '700', color: '#1a1a2e', marginBottom: 12 },
  orderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#f5f5f5',
  },
  orderRowLabel: { fontSize: 14, color: '#666' },
  orderRowValue: { fontSize: 14, color: '#333' },
  orderTotal: { paddingTop: 12 },
  orderTotalLabel: { fontSize: 15, fontWeight: '700', color: '#1a1a2e' },
  orderTotalValue: { fontSize: 18, fontWeight: '800', color: PURPLE },
  cardForm: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  cardFormHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 16,
  },
  cardFormTitle: { fontSize: 15, fontWeight: '700', color: '#1a1a2e', flex: 1 },
  secureText: { fontSize: 12, color: '#999' },
  inputGroup: { marginBottom: 12 },
  inputLabel: { fontSize: 12, fontWeight: '600', color: '#666', marginBottom: 6 },
  input: {
    backgroundColor: '#f8f8f8',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: '#1a1a2e',
  },
  inputRow: { flexDirection: 'row', gap: 12 },
  payBtn: { borderRadius: 14, overflow: 'hidden' },
  payBtnDisabled: { opacity: 0.6 },
  payBtnGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 18,
  },
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 18,
    backgroundColor: PURPLE,
  },
  payBtnText: { fontSize: 16, fontWeight: '800', color: '#fff' },
  disclaimer: { fontSize: 12, color: '#bbb', textAlign: 'center' },
});
