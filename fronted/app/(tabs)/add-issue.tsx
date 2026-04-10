import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, Image, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import InfoModal from '../../components/InfoModal';
import AsyncStorage from '@react-native-async-storage/async-storage';

// İzin verilen MIME tipleri (Sadece resmi dokümanlar — fotoğraflar ayrı alanda)
const IZIN_VERILEN_MIME_TIPLERI = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
];

type SecilenDosya = {
  uri: string;
  name: string;
  mimeType: string;
};

export default function AddIssueScreen() {
  const router = useRouter();
  const [baslik, setBaslik] = useState('');
  const [aciklama, setAciklama] = useState('');
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [secilenDosya, setSecilenDosya] = useState<SecilenDosya | null>(null);
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

  // Dosya Yöneticisinden Belge Seçme (Sadece PDF, Word, Excel)
  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: IZIN_VERILEN_MIME_TIPLERI,
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        setSecilenDosya({
          uri: asset.uri,
          name: asset.name,
          mimeType: asset.mimeType || 'application/octet-stream',
        });
      }
    } catch (error) {
      console.error('Dosya seçme hatası:', error);
      setHataModalMesaj('Dosya seçilirken bir sorun oluştu.');
      setHataModalVisible(true);
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
      const odKullaniciId = await AsyncStorage.getItem('kullaniciId');

      // FormData objesi oluştur
      const formData = new FormData();
      formData.append('Baslik', baslik);
      formData.append('Aciklama', aciklama);
      formData.append('CozulduMu', 'false');
      formData.append('TespitTarihi', new Date().toISOString());
      formData.append('FotografYolu', selectedImages.join(','));

      if (odKullaniciId) {
        formData.append('OlusturanKullaniciId', odKullaniciId);
      }

      // Seçilen belgeyi FormData'ya ekle
      if (secilenDosya) {
        formData.append('ekDosya', {
          uri: secilenDosya.uri,
          name: secilenDosya.name,
          type: secilenDosya.mimeType,
        } as any);
      }

      const response = await fetch('http://10.4.10.211:5075/api/Uygunsuzluk', {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });

      if (!response.ok) {
        const hataMetni = await response.text();
        throw new Error(hataMetni || 'Sunucuya kaydedilemedi');
      }

      setBaslik('');
      setAciklama('');
      setSelectedImages([]);
      setSecilenDosya(null);
      setBasariliModalVisible(true);

    } catch (error: any) {
      console.error("Kayıt hatası:", error);
      setHataModalMesaj(error.message || 'Sisteme kaydedilirken bir sorun oluştu. Bağlantınızı kontrol edin.');
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

            <Text style={styles.inputLabel}>DOSYA / BELGE EKLE</Text>
            <TouchableOpacity style={styles.documentBtn} onPress={pickDocument}>
              <Ionicons name="document-attach" size={24} color="#00584E" />
              <Text style={styles.mediaBtnText}>PDF, WORD VEYA EXCEL SEÇ</Text>
            </TouchableOpacity>

            {secilenDosya && (
              <View style={styles.selectedFileRow}>
                <Ionicons name="checkmark-circle" size={18} color="#27AE60" />
                <Text style={styles.selectedFileName} numberOfLines={1}>{secilenDosya.name}</Text>
                <TouchableOpacity onPress={() => setSecilenDosya(null)}>
                  <Ionicons name="close-circle" size={20} color="#E74C3C" />
                </TouchableOpacity>
              </View>
            )}

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
  
  // Dosya/Belge seçici butonu
  documentBtn: { borderWidth: 1.5, borderColor: '#D5DCDA', borderStyle: 'dashed', borderRadius: 12, padding: 15, alignItems: 'center', backgroundColor: '#F0F5F3', marginBottom: 10, marginTop: 5 },
  selectedFileRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#E8F5E9', borderRadius: 10, padding: 10, marginBottom: 10, gap: 8 },
  selectedFileName: { flex: 1, fontSize: 13, color: '#2D3436' },

  // Resim listesi için stil
  imageListContainer: { marginTop: 15, marginBottom: 5 },
  imageWrapper: { width: 100, height: 100, borderRadius: 12, overflow: 'hidden', position: 'relative', marginRight: 10 },
  previewImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  deleteBadge: { position: 'absolute', top: 5, right: 5, backgroundColor: '#E74C3C', borderRadius: 10, width: 20, height: 20, justifyContent: 'center', alignItems: 'center' },
  
  saveButton: { backgroundColor: '#00584E', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', padding: 18, borderRadius: 15, marginTop: 15, gap: 10, elevation: 4 },
  saveButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  requiredStar: { color: '#E74C3C', fontSize: 13, fontWeight: 'bold' },
});