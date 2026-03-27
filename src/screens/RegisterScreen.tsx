import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
  ScrollView,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { AuthStackParamList } from '../types';
import { useAuth } from '../context/AuthContext';

type Props = {
  navigation: NativeStackNavigationProp<AuthStackParamList, 'Register'>;
};

export default function RegisterScreen({ navigation }: Props) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { register, isLoading } = useAuth();

  const handleRegister = async () => {
    if (!name.trim() || !email.trim() || !password.trim()) {
      Alert.alert('エラー', '全ての項目を入力してください');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('エラー', 'パスワードが一致しません');
      return;
    }
    if (password.length < 6) {
      Alert.alert('エラー', 'パスワードは6文字以上で入力してください');
      return;
    }
    const success = await register(name.trim(), email.trim(), password);
    if (!success) {
      Alert.alert('登録失敗', '登録に失敗しました。もう一度お試しください');
    }
  };

  return (
    <LinearGradient colors={['#6C3CE1', '#9C27B0']} style={styles.gradient}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex}
      >
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>

          <View style={styles.header}>
            <Text style={styles.headerTitle}>新規登録</Text>
            <Text style={styles.headerSub}>Gachafyへようこそ！</Text>
          </View>

          <View style={styles.card}>
            <View style={styles.bonusBanner}>
              <Ionicons name="gift" size={18} color="#FF9800" />
              <Text style={styles.bonusText}>新規登録で3,000ptプレゼント！</Text>
            </View>

            <Field label="ニックネーム" icon="person-outline" value={name} onChangeText={setName} placeholder="ニックネームを入力" />
            <Field label="メールアドレス" icon="mail-outline" value={email} onChangeText={setEmail} placeholder="example@email.com" keyboardType="email-address" />
            <Field label="パスワード（6文字以上）" icon="lock-closed-outline" value={password} onChangeText={setPassword} placeholder="パスワードを入力" secure />
            <Field label="パスワード（確認）" icon="lock-closed-outline" value={confirmPassword} onChangeText={setConfirmPassword} placeholder="パスワードを再入力" secure />

            <TouchableOpacity
              style={[styles.registerBtn, isLoading && styles.btnDisabled]}
              onPress={handleRegister}
              disabled={isLoading}
              activeOpacity={0.85}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.registerBtnText}>アカウントを作成</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.loginLink}>
              <Text style={styles.loginLinkText}>すでにアカウントをお持ちの方はこちら</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

function Field({
  label, icon, value, onChangeText, placeholder, keyboardType, secure,
}: {
  label: string;
  icon: string;
  value: string;
  onChangeText: (v: string) => void;
  placeholder: string;
  keyboardType?: 'email-address' | 'default';
  secure?: boolean;
}) {
  const [show, setShow] = useState(false);
  return (
    <View style={fieldStyles.group}>
      <Text style={fieldStyles.label}>{label}</Text>
      <View style={fieldStyles.wrap}>
        <Ionicons name={icon as any} size={18} color="#999" style={fieldStyles.icon} />
        <TextInput
          style={fieldStyles.input}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#bbb"
          keyboardType={keyboardType || 'default'}
          autoCapitalize="none"
          secureTextEntry={secure && !show}
        />
        {secure && (
          <TouchableOpacity onPress={() => setShow(!show)} style={fieldStyles.eye}>
            <Ionicons name={show ? 'eye-outline' : 'eye-off-outline'} size={18} color="#999" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const fieldStyles = StyleSheet.create({
  group: { marginBottom: 14 },
  label: { fontSize: 13, fontWeight: '600', color: '#555', marginBottom: 6 },
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  icon: { paddingLeft: 12 },
  input: { flex: 1, height: 48, paddingHorizontal: 10, fontSize: 15, color: '#1a1a2e' },
  eye: { padding: 12 },
});

const PURPLE = '#6C3CE1';
const styles = StyleSheet.create({
  gradient: { flex: 1 },
  flex: { flex: 1 },
  container: { flexGrow: 1, padding: 24, paddingTop: 60 },
  backBtn: { marginBottom: 16 },
  header: { marginBottom: 24 },
  headerTitle: { fontSize: 28, fontWeight: '800', color: '#fff' },
  headerSub: { fontSize: 14, color: 'rgba(255,255,255,0.8)', marginTop: 4 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  bonusBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF8E1',
    borderRadius: 10,
    padding: 12,
    marginBottom: 20,
    gap: 8,
  },
  bonusText: { fontSize: 14, fontWeight: '700', color: '#E65100' },
  registerBtn: {
    backgroundColor: PURPLE,
    borderRadius: 12,
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 16,
  },
  btnDisabled: { opacity: 0.7 },
  registerBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  loginLink: { alignItems: 'center', padding: 8 },
  loginLinkText: { color: PURPLE, fontSize: 13, textDecorationLine: 'underline' },
});
