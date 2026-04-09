import React, { useState } from 'react';
import { 
  StyleSheet, View, TextInput, TouchableOpacity, 
  KeyboardAvoidingView, Platform, ScrollView, Image, Text,
  Dimensions
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const { height } = Dimensions.get('window');

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    router.replace('/(tabs)');
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
          {/* Logo ve Başlık Alanı */}
          <View style={styles.headerSection}>
            <Image 
              source={require('../../assets/image_6.png')} 
              style={styles.logoImage}
              resizeMode="contain"
            />
            <Text style={styles.brandName}>PERSONEL GİRİŞİ</Text>
            <Text style={styles.brandSub}>Saha Uygunsuzluk Yönetim Sistemi</Text>
          </View>

          {/* Form Alanı */}
          <View style={styles.formSection}>
            
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>KULLANICI ADI (E-POSTA)</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="person-outline" size={20} color="#627C77" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Kullanıcı adınızı girin"
                  placeholderTextColor="#A0AAB2"
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  // iOS Otomatik Kaydı Engelleme Adımı 1:
                  textContentType="none"
                  autoComplete="off"
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
                  // iOS Otomatik Kaydı Engelleme Adımı 2: 
                  // "oneTimeCode" iOS'a bu şifrenin tek seferlik olduğunu söyler ve saklamaz.
                  textContentType="oneTimeCode"
                  autoComplete="off"
                />
              </View>
            </View>

            <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
              <Ionicons name="enter-outline" size={22} color="#FFF" style={{marginRight: 10}} />
              <Text style={styles.loginButtonText}>Giriş Yap</Text>
            </TouchableOpacity>

            <View style={{ height: 50 }} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
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