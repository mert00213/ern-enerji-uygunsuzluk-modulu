import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform, ScrollView, Image, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { initialData } from './index';

export default function AddIssueScreen() {
  const router = useRouter();
  const [baslik, setBaslik] = useState('');
  const [aciklama, setAciklama] = useState('');
  const [selectedImages, setSelectedImages] = useState<string[]>([]);

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') return Alert.alert('Hata', 'Kamera izni gerekli.');
    let result = await ImagePicker.launchCameraAsync({ quality: 0.7 });
    if (!result.canceled) setSelectedImages(prev => [...prev, result.assets[0].uri]);
  };

  const pickImages = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsMultipleSelection: true,
      selectionLimit: 5,
      quality: 0.7,
    });
    if (!result.canceled) {
      const uris = result.assets.map(a => a.uri);
      setSelectedImages(prev => [...prev, ...uris]);
    }
  };

  const handleSave = () => {
    if (!baslik || !aciklama) return Alert.alert('Uyarı', 'Lütfen tüm alanları doldurun.');
    initialData.unshift({
      id: Date.now().toString(),
      title: baslik,
      description: aciklama,
      status: 'Açık',
      date: new Date().toLocaleDateString('tr-TR'),
      images: selectedImages
    });
    router.replace('/(tabs)');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          <View style={styles.headerRow}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color="#00584E" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Yeni Kayıt Ekle</Text>
            <View style={{ width: 40 }} />
          </View>

          <View style={styles.formCard}>
            <Text style={styles.subtitle}>YENİ RAPOR OLUŞTUR</Text>
            <Text style={styles.mainTitle}>Saha Uygunsuzluk Formu</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>UYGUNSUZLUK BAŞLIĞI</Text>
              <TextInput style={styles.input} value={baslik} onChangeText={setBaslik} placeholder="Örn: Kat 3 kolon donatı eksikliği" placeholderTextColor="#A0AAB2" />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>AÇIKLAMA</Text>
              <TextInput style={[styles.input, { height: 120 }]} multiline value={aciklama} onChangeText={setAciklama} placeholder="Durumu detaylandırın..." placeholderTextColor="#A0AAB2" textAlignVertical="top" />
            </View>

            <Text style={styles.inputLabel}>MEDYA EKLE</Text>
            <View style={styles.mediaBtnRow}>
              <TouchableOpacity style={styles.mediaBtn} onPress={takePhoto}>
                <Ionicons name="camera" size={24} color="#00584E" />
                <Text style={styles.mediaBtnText}>FOTOĞRAF ÇEK</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.mediaBtn} onPress={pickImages}>
                <Ionicons name="images" size={24} color="#00584E" />
                <Text style={styles.mediaBtnText}>GALERİDEN SEÇ</Text>
              </TouchableOpacity>
            </View>

            {selectedImages.length > 0 && (
              <FlatList
                data={selectedImages}
                renderItem={({ item }) => (
                  <View style={styles.imageWrapper}>
                    <Image source={{ uri: item }} style={styles.previewImage} />
                    <TouchableOpacity style={styles.deleteBadge} onPress={() => setSelectedImages(prev => prev.filter(u => u !== item))}>
                      <Ionicons name="close" size={16} color="#fff" />
                    </TouchableOpacity>
                  </View>
                )}
                keyExtractor={(item) => item}
                horizontal
                showsHorizontalScrollIndicator={false}
                style={{ marginTop: 10 }}
                contentContainerStyle={{ gap: 10 }}
              />
            )}
          </View>

          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Ionicons name="cloud-upload-outline" size={22} color="#fff" />
            <Text style={styles.saveButtonText}>Sisteme Kaydet</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F8FBF9' },
  scrollContent: { padding: 20 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#00584E' },
  backButton: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff', borderRadius: 12, elevation: 2 },
  formCard: { backgroundColor: '#fff', borderRadius: 20, padding: 20, elevation: 2 },
  subtitle: { fontSize: 10, fontWeight: 'bold', color: '#627C77', letterSpacing: 1 },
  mainTitle: { fontSize: 22, fontWeight: 'bold', color: '#00584E', marginBottom: 25, marginTop: 5 },
  inputGroup: { marginBottom: 20 },
  inputLabel: { fontSize: 11, fontWeight: 'bold', color: '#627C77', marginBottom: 8 },
  input: { backgroundColor: '#EAEFED', borderRadius: 12, padding: 15, fontSize: 15, color: '#2D3436' },
  mediaBtnRow: { flexDirection: 'row', gap: 12, marginBottom: 20 },
  mediaBtn: { flex: 1, borderWidth: 1.5, borderColor: '#D5DCDA', borderStyle: 'dashed', borderRadius: 12, padding: 15, alignItems: 'center', backgroundColor: '#fff' },
  mediaBtnText: { fontSize: 10, fontWeight: 'bold', color: '#00584E', marginTop: 8 },
  imageWrapper: { width: 120, height: 120, borderRadius: 15, overflow: 'hidden', position: 'relative' },
  previewImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  deleteBadge: { position: 'absolute', top: 8, right: 8, backgroundColor: '#E74C3C', borderRadius: 12, width: 24, height: 24, justifyContent: 'center', alignItems: 'center' },
  saveButton: { backgroundColor: '#00584E', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', padding: 18, borderRadius: 15, marginTop: 20, gap: 10, elevation: 4 },
  saveButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' }
});