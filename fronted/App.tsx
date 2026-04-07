import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, FlatList, SafeAreaView, Alert } from 'react-native';
import axios from 'axios';

// Web için localhost, mobil için kendi IP adresini yaz
import { Platform } from 'react-native';
const API_URL = Platform.OS === 'web' 
  ? 'http://localhost:5075/api' 
  : 'http://10.4.10.211:5075/api';

export default function App() {
  // 1. BEKÇİ DEĞİŞKENİ: Başlangıçta "false" (Giriş yapılmadı)
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  const [kullaniciAd, setKullaniciAd] = useState('');
  const [sifre, setSifre] = useState('');
  const [data, setData] = useState([]);

  // --- GİRİŞ YAPMA FONKSİYONU ---
  const handleLogin = async () => {
    if (kullaniciAd === '' || sifre === '') {
      Alert.alert("Hata", "Lütfen tüm alanlari doldurun!");
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/Auth/login`, { 
        kullaniciAd: kullaniciAd, 
        sifreHash: sifre 
      });

      if (response.data.mesaj === "Giriş başarili!") {
        // GİRİŞ BAŞARILI: Bekçiyi "true" yapıyoruz, kapı açılıyor!
        setIsLoggedIn(true); 
        fetchData(); // Ana sayfaya geçerken verileri çekiyoruz
      }
    } catch (error) {
      Alert.alert("Hata", "Kullanici adi veya sifre hatali!");
    }
  };

  // --- ÇIKIŞ YAPMA FONKSİYONU ---
  const handleLogout = () => {
    setIsLoggedIn(false); // Bekçiyi "false" yap, kullanıcıyı dışarı at
    setKullaniciAd('');
    setSifre('');
  };

  const fetchData = async () => {
    try {
      const response = await axios.get(`${API_URL}/Uygunsuzluk`);
      setData(response.data);
    } catch (e) { console.log(e); }
  };

  // --- MANTIK KATMANI ---
  // Eğer giriş yapılmadıysa (!isLoggedIn), sadece bu ekranı göster:
  if (!isLoggedIn) {
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

  // Eğer giriş yapıldıysa, kod buraya geçer ve Ana Sayfayı gösterir:
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Uygunsuzluk Listesi</Text>
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Text style={styles.logoutBtnText}>Çikiş</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={data}
        keyExtractor={(item: any) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{item.baslik}</Text>
            <Text style={styles.cardDesc}>{item.aciklama}</Text>
          </View>
        )}
        contentContainerStyle={{ padding: 15 }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // Giriş Ekranı Stilleri
  authContainer: { flex: 1, justifyContent: 'center', padding: 30, backgroundColor: '#fdfdfd' },
  logoCircle: { width: 80, height: 80, backgroundColor: '#512BD4', borderRadius: 40, alignSelf: 'center', justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
  logoText: { color: '#fff', fontSize: 24, fontWeight: 'bold' },
  authTitle: { fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginBottom: 30, color: '#333' },
  input: { backgroundColor: '#eee', padding: 15, borderRadius: 10, marginBottom: 15, fontSize: 16 },
  loginButton: { backgroundColor: '#512BD4', padding: 18, borderRadius: 10, alignItems: 'center', marginTop: 10 },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  footerNote: { textAlign: 'center', marginTop: 50, color: '#aaa', fontSize: 12 },

  // Ana Sayfa Stilleri
  container: { flex: 1, backgroundColor: '#fff' },
  header: { padding: 20, backgroundColor: '#512BD4', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  headerTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  logoutBtn: { backgroundColor: '#ff5252', paddingHorizontal: 15, paddingVertical: 8, borderRadius: 5 },
  logoutBtnText: { color: '#fff', fontWeight: 'bold' },
  card: { backgroundColor: '#fff', padding: 15, borderRadius: 10, marginBottom: 15, borderLeftWidth: 5, borderLeftColor: '#512BD4', elevation: 3, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 5 },
  cardTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  cardDesc: { fontSize: 14, color: '#666', marginTop: 5 }
});