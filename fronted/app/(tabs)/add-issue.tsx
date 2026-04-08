import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

export default function AddIssueScreen() {
  const router = useRouter();
  const [baslik, setBaslik] = useState('');
  const [aciklama, setAciklama] = useState('');

  const handleSave = () => {
    if (!baslik || !aciklama) {
      Alert.alert('Uyarı', 'Lütfen tüm alanları doldurun.');
      return;
    }
    // API'ye gönderme işlemi daha sonra buraya eklenecek
    Alert.alert('Başarılı', 'Kayıt eklendi.', [
      { text: 'Tamam', onPress: () => router.replace('/(tabs)') }
    ]);
  };

  return (
    // edges={['top']} sayesinde sadece üst taraftaki çentik/saat kısmını korur
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={styles.headerTitle}>Yeni Uygunsuzluk Kaydı</Text>
          
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Başlık"
              placeholderTextColor="#999"
              value={baslik}
              onChangeText={setBaslik}
            />
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Açıklama"
              placeholderTextColor="#999"
              value={aciklama}
              onChangeText={setAciklama}
              multiline
              numberOfLines={4}
              textAlignVertical="top" // Android'de metnin üstten başlamasını sağlar
            />
          </View>

          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>KAYDET</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 30,
    marginTop: 10, // Yazıyı biraz daha aşağı iter
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#f2f2f2',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    color: '#333',
  },
  textArea: {
    height: 120,
  },
  saveButton: {
    backgroundColor: '#512BD4',
    borderRadius: 10,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 10,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});