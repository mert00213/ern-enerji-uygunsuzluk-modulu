import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, Image, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import InfoModal from '../../components/InfoModal';

export default function AddIssueScreen() {
  const router = useRouter();
  const [baslik, setBaslik] = useState('');
  const [aciklama, setAciklama] = useState('');
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [kaydediliyor, setKaydediliyor] = useState(false); 
  const [hataModalVisible, setHataModalVisible] = useState(false);
  const [hataModalMesaj, setHataModalMesaj] = useState('');
  const [basariliModalVisible, setBasariliModalVisible] = useState(false);

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      setHataModalMesaj('Kamera izni gerekli.');
      setHataModalVisible(true);
      return;
    }
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

  const handleSave = async () => {
    if (!baslik.trim() || !aciklama.trim() || selectedImages.length === 0) {
      setHataModalMesaj('Lütfen tüm zorunlu alanları (Başlık, Açıklama ve Medya) doldurun.');
      setHataModalVisible(true);
      return;
    }

    setKaydediliyor(true); 

    try {
      const yeniKayit = {
        baslik: baslik,
        aciklama: aciklama,
        cozulduMu: false, 
        tespitTarihi: new Date().toISOString(), 
        fotografYolu: selectedImages.join(',')
      };

      const response = await fetch('http://10.4.10.211:5075/api/Uygunsuzluk', {
        method: 'POST', 
        headers: {
          'Content-Type': 'application/json', 
        },
        body: JSON.stringify(yeniKayit) 
      });

      if (!response.ok) throw new Error('Sunucuya kaydedilemedi');

      setBaslik('');
      setAciklama('');
      setSelectedImages([]);
      setBasariliModalVisible(true);

    } catch (error) {
      console.error("Kayıt hatası:", error);
      setHataModalMesaj('Sisteme kaydedilirken bir sorun oluştu. Bağlantınızı kontrol edin.');
      setHataModalVisible(true);
    } finally {
      setKaydediliyor(false); 
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
        <ScrollView 
          contentContainerStyle={styles.scrollContent} 
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
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
              <Text style={styles.inputLabel}>UYGUNSUZLUK BAŞLIĞI <Text style={styles.requiredStar}>*</Text></Text>
              <TextInput style={styles.input} value={baslik} onChangeText={setBaslik} placeholder="Örn: Kat 3 kolon donatı eksikliği" placeholderTextColor="#A0AAB2" />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>AÇIKLAMA <Text style={styles.requiredStar}>*</Text></Text>
              <TextInput style={[styles.input, { height: 120 }]} multiline value={aciklama} onChangeText={setAciklama} placeholder="Durumu detaylandırın..." placeholderTextColor="#A0AAB2" textAlignVertical="top" />
            </View>

            <Text style={styles.inputLabel}>MEDYA EKLE <Text style={styles.requiredStar}>*</Text></Text>
            
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

            {/* FOTOĞRAFLARIN LİSTELENDİĞİ YENİ YATAY ALAN */}
            {selectedImages.length > 0 && (
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imageListContainer}>
                {selectedImages.map((uri, index) => (
                  <View key={index} style={styles.imageWrapper}>
                    <Image source={{ uri: uri }} style={styles.previewImage} />
                    <TouchableOpacity style={styles.deleteBadge} onPress={() => setSelectedImages(prev => prev.filter(u => u !== uri))}>
                      <Ionicons name="close" size={14} color="#fff" />
                    </TouchableOpacity>
                  </View>
                ))}
              </ScrollView>
            )}
          </View>

          {/* KAYDET BUTONU ARTIK FORM KARTININ ALTINDA VE KAYDIRILABİLİR ALANDA */}
          <TouchableOpacity 
            style={[styles.saveButton, kaydediliyor && { backgroundColor: '#627C77' }]} 
            onPress={handleSave}
            disabled={kaydediliyor}
            activeOpacity={0.8}
          >
            {kaydediliyor ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Ionicons name="cloud-upload-outline" size={22} color="#fff" />
                <Text style={styles.saveButtonText}>Sisteme Kaydet</Text>
              </>
            )}
          </TouchableOpacity>
          
          {/* Klavye açıldığında butonun altında boşluk bırakmak için */}
          <View style={{ height: 30 }} />
        </ScrollView>
      </KeyboardAvoidingView>

      <InfoModal
        visible={hataModalVisible}
        title="Uyarı"
        message={hataModalMesaj}
        type="warning" 
        onClose={() => setHataModalVisible(false)}
      />

      <InfoModal
        visible={basariliModalVisible}
        title="Başarılı"
        message="Uygunsuzluk kaydı başarıyla sisteme eklendi."
        onClose={() => {
          setBasariliModalVisible(false);
          router.replace('/(tabs)');
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F8FBF9' },
  scrollContent: { padding: 20 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#00584E' },
  backButton: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff', borderRadius: 12, elevation: 2 },
  formCard: { backgroundColor: '#fff', borderRadius: 20, padding: 20, elevation: 2, marginBottom: 10 },
  subtitle: { fontSize: 10, fontWeight: 'bold', color: '#627C77', letterSpacing: 1 },
  mainTitle: { fontSize: 22, fontWeight: 'bold', color: '#00584E', marginBottom: 25, marginTop: 5 },
  inputGroup: { marginBottom: 20 },
  inputLabel: { fontSize: 11, fontWeight: 'bold', color: '#627C77', marginBottom: 8 },
  input: { backgroundColor: '#EAEFED', borderRadius: 12, padding: 15, fontSize: 15, color: '#2D3436' },
  mediaBtnRow: { flexDirection: 'row', gap: 12, marginBottom: 10, marginTop: 5 }, 
  mediaBtn: { flex: 1, borderWidth: 1.5, borderColor: '#D5DCDA', borderStyle: 'dashed', borderRadius: 12, padding: 15, alignItems: 'center', backgroundColor: '#fff' },
  mediaBtnText: { fontSize: 10, fontWeight: 'bold', color: '#00584E', marginTop: 8 },
  
  // Resim listesi için stil
  imageListContainer: { marginTop: 15, marginBottom: 5 },
  imageWrapper: { width: 100, height: 100, borderRadius: 12, overflow: 'hidden', position: 'relative', marginRight: 10 },
  previewImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  deleteBadge: { position: 'absolute', top: 5, right: 5, backgroundColor: '#E74C3C', borderRadius: 10, width: 20, height: 20, justifyContent: 'center', alignItems: 'center' },
  
  saveButton: { backgroundColor: '#00584E', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', padding: 18, borderRadius: 15, marginTop: 15, gap: 10, elevation: 4 },
  saveButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  requiredStar: { color: '#E74C3C', fontSize: 13, fontWeight: 'bold' },
});