import React, { useState } from 'react';
import { 
  StyleSheet, View, TextInput, TouchableOpacity, 
  KeyboardAvoidingView, Platform, ScrollView, Image, Text,
  Dimensions, ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
// InfoModal'ı import etmeyi unutma:
import InfoModal from '../../components/InfoModal'; 

const { height } = Dimensions.get('window');

export default function LoginScreen() {
  const router = useRouter();
  const [kullaniciAd, setKullaniciAd] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // Modal Durum Yönetimi
  const [modalVisible, setModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalMessage, setModalMessage] = useState('');

  const handleLogin = async () => {
    if (!kullaniciAd.trim() || !password.trim()) {
      setModalTitle("Uyarı");
      setModalMessage("Lütfen tüm alanları doldurun.");
      setModalVisible(true);
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('http://10.4.10.211:5075/api/Auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          kullaniciAd: kullaniciAd,
          sifreHash: password 
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // GİRİŞ BAŞARILI
        router.replace('/(tabs)');
      } else {
        // GİRİŞ BAŞARISIZ - Kırmızı Modal Tetiklenir
        setModalTitle("Hatalı Giriş");
        setModalMessage(data.mesaj || "Giriş bilgileri doğrulanamadı.");
        setModalVisible(true);
      }
    } catch (error) {
      setModalTitle("Bağlantı Hatası");
      setModalMessage("Sunucuya ulaşılamadı. IP adresini kontrol edin.");
      setModalVisible(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
        style={{ flex: 1 }}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent} 
          bounces={false} 
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.headerSection}>
            <Image 
              source={require('../../assets/image_6.png')} 
              style={styles.logoImage}
              resizeMode="contain"
            />
            <Text style={styles.brandName}>PERSONEL GİRİŞİ</Text>
            <Text style={styles.brandSub}>Saha Uygunsuzluk Yönetim Sistemi</Text>
          </View>

          <View style={styles.formSection}>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>KULLANICI ADI</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="person-outline" size={20} color="#627C77" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Kullanıcı adınızı girin"
                  placeholderTextColor="#A0AAB2"
                  value={kullaniciAd}
                  onChangeText={setKullaniciAd}
                  autoCapitalize="none"
                />
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>ŞİFRE</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="lock-closed-outline" size={20} color="#627C77" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Şifrenizi girin"
                  placeholderTextColor="#A0AAB2"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                />
              </View>
            </View>

            <TouchableOpacity 
              style={[styles.loginButton, loading && { opacity: 0.7 }]} 
              onPress={handleLogin}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <>
                  <Ionicons name="enter-outline" size={22} color="#FFF" style={{marginRight: 10}} />
                  <Text style={styles.loginButtonText}>Giriş Yap</Text>
                </>
              )}
            </TouchableOpacity>

            <View style={{ height: 50 }} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* KIRMIZI MODAL BURADA ÇAĞRILIYOR */}
      <InfoModal 
        visible={modalVisible}
        title={modalTitle}
        message={modalMessage}
        type="error" // Kırmızı tema için "error" gönderiyoruz
        onClose={() => setModalVisible(false)}
      />

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F8FBF9' },
  scrollContent: { flexGrow: 1, justifyContent: 'center', paddingVertical: 20 },
  headerSection: {
    paddingTop: height * 0.05,
    paddingBottom: 40,
    backgroundColor: '#F8FBF9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoImage: { width: 130, height: 130, marginBottom: 15 },
  brandName: { fontSize: 22, fontWeight: 'bold', color: '#00584E', letterSpacing: 2 },
  brandSub: { fontSize: 12, color: '#627C77', marginTop: 5, fontWeight: '500' },
  formSection: { paddingHorizontal: 30 },
  inputContainer: { marginBottom: 15 },
  inputLabel: { fontSize: 11, fontWeight: '700', color: '#627C77', marginBottom: 8, letterSpacing: 1 },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#EAEFEA',
    paddingHorizontal: 15,
    height: 55,
    elevation: 2,
  },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, fontSize: 16, color: '#00584E' },
  loginButton: {
    backgroundColor: '#00584E',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 55,
    borderRadius: 12,
    marginTop: 15,
    elevation: 4,
  },
  loginButtonText: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
});