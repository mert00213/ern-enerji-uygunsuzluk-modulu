import React, { useState, useCallback } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, RefreshControl, Image, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useFocusEffect } from 'expo-router';
import ConfirmModal from '../../components/ConfirmModal';

export default function IssuesScreen() {
  const router = useRouter();
  const [issues, setIssues] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [yukleniyor, setYukleniyor] = useState(true);
  const [cikisModalVisible, setCikisModalVisible] = useState(false);

  useFocusEffect(
    useCallback(() => {
      verileriGetir();
    }, [])
  );

  const verileriGetir = async () => {
    try {
      const response = await fetch('http://10.4.10.211:5075/api/Uygunsuzluk'); 
      if (!response.ok) throw new Error('Sunucu yanıt vermedi');

      const dbVerileri = await response.json();
      const formatliVeriler = dbVerileri.map((item: any) => ({
        id: item.id.toString(),
        title: item.baslik,
        description: item.aciklama,
        status: item.cozulduMu ? 'Giderildi' : 'Açık',
        date: new Date(item.tespitTarihi).toLocaleDateString('tr-TR'), 
        images: item.fotografYolu ? item.fotografYolu.split(',') : [],
        dosyaYolu: item.dosyaYolu || '',
        dosyalar: item.dosyalar || [],
        ekleyenKisi: item.ekleyenKisi || 'Bilinmiyor'
      }));

      setIssues(formatliVeriler);
    } catch (error) {
      console.error("Veri çekme hatası:", error);
    } finally {
      setYukleniyor(false);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await verileriGetir();
    setRefreshing(false);
  }, []);

  const openDetail = (item: any) => {
    router.push({
      pathname: '/detail',
      params: { 
        id: item.id,
        title: item.title,
        description: item.description,
        status: item.status,
        date: item.date,
        images: JSON.stringify(item.images || []),
        dosyaYolu: item.dosyaYolu || '',
        dosyalar: JSON.stringify(item.dosyalar || [])
      }
    });
  };

  const renderItem = ({ item }: any) => (
    <TouchableOpacity style={styles.card} onPress={() => openDetail(item)} activeOpacity={0.8}>
      {item.images && item.images.length > 0 ? (
        <Image source={{ uri: item.images[0] }} style={styles.cardThumbnail} />
      ) : (
        <View style={[styles.cardAccent, { backgroundColor: item.status === 'Açık' ? '#E74C3C' : '#00584E' }]} />
      )}
      
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle} numberOfLines={1}>{item.title}</Text>

        <View style={styles.cardMetaRow}>
          <Text style={styles.cardDate}>{item.date}</Text>
          <View style={[styles.statusBadge, { backgroundColor: item.status === 'Açık' ? '#FDEDEC' : '#EAFAF1' }]}>
            <Text style={[styles.statusText, { color: item.status === 'Açık' ? '#E74C3C' : '#00584E' }]}>{item.status}</Text>
          </View>
        </View>

        <View style={styles.cardFooterRow}>
          <Text style={styles.cardEkleyen}>👤 {item.ekleyenKisi}</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            {item.dosyalar && item.dosyalar.length > 0 ? (
              <View style={styles.imageIndicatorContainer}>
                <Ionicons name="document-attach-outline" size={12} color="#00584E" />
                <Text style={styles.imageIndicatorText}>{item.dosyalar.length} Belge</Text>
              </View>
            ) : item.dosyaYolu ? (
              <View style={styles.imageIndicatorContainer}>
                <Ionicons name="document-attach-outline" size={12} color="#00584E" />
                <Text style={styles.imageIndicatorText}>Belge</Text>
              </View>
            ) : null}
            {item.images && item.images.length > 1 && (
              <View style={styles.imageIndicatorContainer}>
                <Ionicons name="images-outline" size={12} color="#00584E" />
                <Text style={styles.imageIndicatorText}>+{item.images.length - 1}</Text>
              </View>
            )}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.greenBanner}>
        <View style={styles.bannerTextContainer}>
          <Text style={styles.portalSubtitle}>ERN ENERJİ PORTAL</Text>
          <Text style={styles.portalTitle}>Uygunsuzluklar</Text>
        </View>
        
        <TouchableOpacity style={styles.logoutButton} onPress={() => setCikisModalVisible(true)}>
          <Ionicons name="log-out-outline" size={24} color="#00584E" />
        </TouchableOpacity>
      </View>

      {yukleniyor ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#00584E" />
        </View>
      ) : (
        <FlatList
          data={issues}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          contentContainerStyle={{ padding: 20 }}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={'#00584E'} />}
        />
      )}

      <ConfirmModal
        visible={cikisModalVisible}
        title="Oturumu Kapat"
        message="Hesabınızdan çıkış yapmak istediğinize emin misiniz?"
        confirmText="Çıkış Yap"
        cancelText="Vazgeç"
        onConfirm={() => {
          setCikisModalVisible(false);
          router.replace('/login');
        }}
        onCancel={() => setCikisModalVisible(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FBF9' },
  greenBanner: {
    backgroundColor: '#00584E',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 25,
    paddingVertical: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 10,
  },
  bannerTextContainer: { flex: 1 },
  portalSubtitle: { color: '#EAEFED', fontSize: 10, fontWeight: 'bold', letterSpacing: 1.5, opacity: 0.9, marginBottom: 4 },
  portalTitle: { color: '#FFF', fontSize: 28, fontWeight: 'bold' },
  logoutButton: { backgroundColor: '#FFF', width: 48, height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center', elevation: 4 },
  card: { flexDirection: 'row', backgroundColor: '#FFF', borderRadius: 16, marginBottom: 15, elevation: 4, overflow: 'hidden', minHeight: 100, shadowColor: '#0A5A4A', shadowOpacity: 0.08, shadowOffset: { width: 0, height: 3 }, shadowRadius: 8 },
  cardAccent: { width: 6 },
  cardThumbnail: { width: 85, height: '100%', resizeMode: 'cover' },
  cardContent: { flex: 1, padding: 12, justifyContent: 'space-between' },
  cardTitle: { fontSize: 16, fontWeight: 'bold', color: '#0A5A4A', marginBottom: 6 },
  cardMetaRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  cardDate: { fontSize: 11, color: '#9BA3A0' },
  cardFooterRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardEkleyen: { fontSize: 11, color: '#9BA3A0' },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 12 },
  statusText: { fontSize: 9, fontWeight: 'bold' },
  imageIndicatorContainer: { flexDirection: 'row', alignItems: 'center' },
  imageIndicatorText: { fontSize: 10, color: '#747876', fontWeight: 'bold', marginLeft: 3 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});