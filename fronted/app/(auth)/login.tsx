import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, Platform } from 'react-native';
import axios from 'axios';
import { useRouter } from 'expo-router';

const API_URL = Platform.OS === 'web'
  ? 'http://localhost:5075/api'
  : 'http://10.4.10.211:5075/api';

export default function LoginScreen() {
  const router = useRouter();
  const [kullaniciAd, setKullaniciAd] = useState('');
  const [sifre, setSifre] = useState('');

  const handleLogin = async () => {
    if (kullaniciAd === '' || sifre === '') {
      Alert.alert('Hata', 'Lütfen tüm alanlari doldurun!');
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/Auth/login`, {
        kullaniciAd: kullaniciAd,
        sifreHash: sifre,
      });

      if (response.status === 200) {
        router.replace('/(tabs)');
      }
    } catch (error: any) {
      const status = error?.response?.status;
      const mesaj =
        error?.response?.data?.mesaj ||
        error?.response?.data ||
        error?.message ||
        'Bilinmeyen hata';
      Alert.alert('Hata', `Kod: ${status ?? 'Yok'}\n${mesaj}`);
      console.log('Login hatası:', error?.response ?? error);
    }
  };

  return (
    <View style={styles.authContainer}>
      <View style={styles.logoCircle}>
        <Text style={styles.logoText}>ERN</Text>
      </View>
      <Text style={styles.authTitle}>Personel Girişi</Text>

      <TextInput
        style={styles.input}
        placeholder="Kullanici Adi"
        value={kullaniciAd}
        onChangeText={setKullaniciAd}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Şifre"
        secureTextEntry
        value={sifre}
        onChangeText={setSifre}
      />

      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.buttonText}>GİRİŞ YAP</Text>
      </TouchableOpacity>

      <Text style={styles.footerNote}>Ern Enerji Portal v1.0</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  authContainer: { flex: 1, justifyContent: 'center', padding: 30, backgroundColor: '#fdfdfd' },
  logoCircle: { width: 80, height: 80, backgroundColor: '#512BD4', borderRadius: 40, alignSelf: 'center', justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
  logoText: { color: '#fff', fontSize: 24, fontWeight: 'bold' },
  authTitle: { fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginBottom: 30, color: '#333' },
  input: { backgroundColor: '#eee', padding: 15, borderRadius: 10, marginBottom: 15, fontSize: 16 },
  loginButton: { backgroundColor: '#512BD4', padding: 18, borderRadius: 10, alignItems: 'center', marginTop: 10 },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  footerNote: { textAlign: 'center', marginTop: 50, color: '#aaa', fontSize: 12 },
});