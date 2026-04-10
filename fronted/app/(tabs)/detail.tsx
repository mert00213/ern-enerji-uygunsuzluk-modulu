import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, Dimensions, FlatList, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
// --- İŞTE YENİ KÜTÜPHANE IMPORTU ---
import ImageView from "react-native-image-viewing";

// Ekran genişliğini alıyoruz
const { width } = Dimensions.get('window');

export default function IssueDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [aktifIndex, setAktifIndex] = useState(0);

  // --- İŞTE YENİ STATE'LERİMİZ ---
  const [viewerVisible, setViewerVisible] = useState(false); // Tam ekran modunu kontrol eder
  const [selectedImageIndex, setSelectedImageIndex] = useState(0); // Hangi resme basıldığını tutar

  // Ana sayfadan gönderilen virgüllerle ayrılmış string'i diziye çeviriyoruz
  const images = params.images ? JSON.parse(params.images as string) : [];

  // react-native-image-viewing kütüphanesi bizden { uri: '...' } formatında bir dizi bekler
  const imagesFormatted = images.map((img: string) => ({ uri: img }));

  // Fotoğraf kaydırıldıkça alttaki noktaları (dot) güncellemek için
  const handleScroll = (event: any) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / width);
    setAktifIndex(index);
  };

  // Bir resme basıldığında tam ekran modunu açan fonksiyon
  const handleImagePress = (index: number) => {
    setSelectedImageIndex(index);
    setViewerVisible(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* ÜST BİLGİ VE GERİ BUTONU */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#00584E" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Kayıt Detayı</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* KAYDIRMALI FOTOĞRAF GALERİSİ */}
        {images.length > 0 ? (
          <View style={styles.galleryContainer}>
            <FlatList
              data={images}
              keyExtractor={(item, index) => index.toString()}
              horizontal // Yan yana diz
              pagingEnabled // Tam ekran atla (Instagram gibi)
              showsHorizontalScrollIndicator={false}
              onScroll={handleScroll}
              renderItem={({ item, index }) => (
                // --- İŞTE DEĞİŞİKLİK BURADA: Resim TouchableOpacity ile sarıldı ---
                <TouchableOpacity onPress={() => handleImagePress(index)} activeOpacity={0.9}>
                  <Image source={{ uri: item }} style={styles.galleryImage} />
                </TouchableOpacity>
              )}
            />
            
            {/* Fotoğraf Sayısı Noktaları (Eğer 1'den fazla fotoğraf varsa göster) */}
            {images.length > 1 && (
              <View style={styles.dotsContainer}>
                {images.map((_: any, index: number) => (
                  <View 
                    key={index} 
                    style={[styles.dot, aktifIndex === index ? styles.activeDot : styles.inactiveDot]} 
                  />
                ))}
              </View>
            )}
          </View>
        ) : (
          <View style={styles.noImageContainer}>
            <Ionicons name="image-outline" size={50} color="#D5DCDA" />
            <Text style={styles.noImageText}>Fotoğraf Eklenmemiş</Text>
          </View>
        )}

        {/* DETAY BİLGİLERİ */}
        <View style={styles.content}>
          <View style={[styles.statusBadge, { backgroundColor: params.status === 'Açık' ? '#7A3E3E' : '#00584E' }]}>
            <Text style={styles.statusText}>{params.status}</Text>
          </View>

          <Text style={styles.title}>{params.title}</Text>
          
          <View style={styles.dateRow}>
            <Ionicons name="calendar-outline" size={16} color="#747876" />
            <Text style={styles.dateText}>{params.date}</Text>
          </View>

          <View style={styles.divider} />

          <Text style={styles.sectionTitle}>AÇIKLAMA</Text>
          <Text style={styles.description}>{params.description}</Text>

          {/* EKLI BELGE BÖLÜMÜ */}
          {params.dosyaYolu ? (
            <>
              <View style={styles.divider} />
              <Text style={styles.sectionTitle}>EKLI BELGE</Text>
              <TouchableOpacity
                style={styles.documentRow}
                onPress={() => Linking.openURL(`http://10.4.10.211:5075${params.dosyaYolu}`)}
              >
                <Ionicons name="document-attach" size={22} color="#00584E" />
                <Text style={styles.documentLinkText} numberOfLines={1}>
                  {(params.dosyaYolu as string).split('/').pop()}
                </Text>
                <Ionicons name="open-outline" size={18} color="#627C77" />
              </TouchableOpacity>
            </>
          ) : null}
        </View>
      </ScrollView>

      {/* --- İŞTE TAM EKRAN GÖRÜNTÜLEYİCİ BİLEŞENİ --- */}
      <ImageView
        images={imagesFormatted}
        imageIndex={selectedImageIndex}
        visible={viewerVisible}
        onRequestClose={() => setViewerVisible(false)} // Kapatma mantığı
        // İsteğe bağlı: Kapatma butonu ekleyelim
        HeaderComponent={() => (
          <TouchableOpacity onPress={() => setViewerVisible(false)} style={styles.closeViewerButton}>
            <Ionicons name="close" size={30} color="#FFF" />
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#00584E' },
  backButton: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F8FBF9', borderRadius: 12 },
  galleryContainer: { position: 'relative' },
  galleryImage: { width: width, height: 300, resizeMode: 'cover' },
  dotsContainer: { flexDirection: 'row', position: 'absolute', bottom: 15, alignSelf: 'center', gap: 6 },
  dot: { width: 8, height: 8, borderRadius: 4 },
  activeDot: { backgroundColor: '#FFF', width: 10, height: 10 },
  inactiveDot: { backgroundColor: 'rgba(255, 255, 255, 0.5)' },
  noImageContainer: { height: 200, backgroundColor: '#F8FBF9', justifyContent: 'center', alignItems: 'center' },
  noImageText: { color: '#A0AAB2', marginTop: 10, fontWeight: 'bold' },
  content: { padding: 20 },
  statusBadge: { alignSelf: 'flex-start', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, marginBottom: 15 },
  statusText: { color: '#FFF', fontWeight: 'bold', fontSize: 12 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#00584E', marginBottom: 10 },
  dateRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  dateText: { color: '#747876', marginLeft: 6, fontSize: 14 },
  divider: { height: 1, backgroundColor: '#EAEFED', marginBottom: 20 },
  sectionTitle: { fontSize: 12, fontWeight: 'bold', color: '#A0AAB2', letterSpacing: 1, marginBottom: 10 },
  description: { fontSize: 16, color: '#2D3436', lineHeight: 24 },
  documentRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F0F5F3', borderRadius: 12, padding: 14, gap: 10 },
  documentLinkText: { flex: 1, fontSize: 14, color: '#00584E', fontWeight: '600' },
  // Tam ekran görüntüleyici için kapatma butonu stili
  closeViewerButton: { position: 'absolute', top: 50, right: 20, zIndex: 1000 },
});