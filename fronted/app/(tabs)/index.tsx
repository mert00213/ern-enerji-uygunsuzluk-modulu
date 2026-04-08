import React, { useState, useCallback, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, RefreshControl, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

// Paylaşılan veri havuzu
export const initialData = [
  { 
    id: '1', 
    title: 'Kat 3 Kolon Donatı Eksikliği', 
    description: 'Kolon demirlerinde eksik etriye tespit edildi.', 
    status: 'Açık', 
    date: '08.04.2026', 
    images: [] 
  },
  { 
    id: '2', 
    title: 'İskele Kurulum Hatası', 
    description: 'B blok iskele bağlantıları standartlara uygun değil.', 
    status: 'Giderildi', 
    date: '07.04.2026', 
    images: [] 
  }
];

export default function IssuesScreen() {
  const router = useRouter();
  const [issues, setIssues] = useState([...initialData]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    setIssues([...initialData]);
  }, [initialData.length]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setIssues([...initialData]);
      setRefreshing(false);
    }, 1200);
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
        images: JSON.stringify(item.images || []) 
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
        <View style={styles.cardHeaderRow}>
          <Text style={styles.cardTitle} numberOfLines={1}>{item.title}</Text>
          <Ionicons name="chevron-forward" size={16} color="#D5DCDA" />
        </View>
        <View style={styles.cardInfoRow}>
          <Text style={styles.cardDate}>{item.date}</Text>
          <View style={[styles.statusBadge, { backgroundColor: item.status === 'Açık' ? '#FDEDEC' : '#EAFAF1' }]}>
            <Text style={[styles.statusText, { color: item.status === 'Açık' ? '#E74C3C' : '#00584E' }]}>{item.status}</Text>
          </View>
        </View>
        {item.images && item.images.length > 1 && (
          <View style={styles.multiImageBadge}>
            <Ionicons name="images" size={10} color="#627C77" />
            <Text style={styles.multiImageText}>+{item.images.length - 1}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerSubtitle}>ERN ENERJİ PORTAL</Text>
        <Text style={styles.headerTitle}>Uygunsuzluklar</Text>
      </View>
      <FlatList
        data={issues}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={{ padding: 20 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={'#00584E'} />}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FBF9' },
  header: { paddingHorizontal: 20, paddingTop: 10, paddingBottom: 10 },
  headerSubtitle: { fontSize: 10, fontWeight: 'bold', color: '#627C77', letterSpacing: 2 },
  headerTitle: { fontSize: 28, fontWeight: 'bold', color: '#00584E', marginTop: 2 },
  card: { flexDirection: 'row', backgroundColor: '#FFF', borderRadius: 16, marginBottom: 15, elevation: 4, shadowColor: '#000', shadowOpacity: 0.08, shadowOffset: { width: 0, height: 4 }, shadowRadius: 10, overflow: 'hidden', minHeight: 90 },
  cardAccent: { width: 6 },
  cardThumbnail: { width: 85, height: '100%', resizeMode: 'cover' },
  cardContent: { flex: 1, padding: 12, justifyContent: 'center' },
  cardHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  cardTitle: { fontSize: 15, fontWeight: 'bold', color: '#00584E', flex: 1 },
  cardInfoRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardDate: { fontSize: 11, color: '#747876' },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 12 },
  statusText: { fontSize: 9, fontWeight: 'bold' },
  multiImageBadge: { position: 'absolute', bottom: 8, right: 10, flexDirection: 'row', alignItems: 'center', backgroundColor: '#F0F7F4', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 8 },
  multiImageText: { fontSize: 9, color: '#627C77', marginLeft: 3, fontWeight: 'bold' }
});