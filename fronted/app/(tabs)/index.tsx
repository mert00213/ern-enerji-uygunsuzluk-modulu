import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, Platform, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from 'axios';
import { useRouter } from 'expo-router';

const API_URL = Platform.OS === 'web'
  ? 'http://localhost:5075/api'
  : 'http://10.4.10.211:5075/api';

export default function HomeScreen() {
  const router = useRouter();
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(`${API_URL}/Uygunsuzluk`);
      setData(response.data);
    } catch (e) {
      console.log("Veri çekme hatası:", e);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Uygunsuzluk Listesi</Text>
        <TouchableOpacity 
          style={styles.logoutBtn} 
          onPress={() => router.replace('/(auth)/login')}
        >
          <Text style={styles.logoutBtnText}>Çıkış</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={data}
        keyExtractor={(item: any) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardStatus} />
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>{item.baslik}</Text>
              <Text style={styles.cardDesc} numberOfLines={2}>{item.aciklama}</Text>
            </View>
          </View>
        )}
        contentContainerStyle={styles.listPadding}
        onRefresh={fetchData}
        refreshing={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  header: { 
    paddingHorizontal: 20, 
    paddingVertical: 15, 
    backgroundColor: '#512BD4', 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
  },
  headerTitle: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  logoutBtn: { backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  logoutBtnText: { color: '#fff', fontSize: 13, fontWeight: '600' },
  listPadding: { padding: 16, paddingBottom: 100 }, // Liste sonuna ekstra boşluk
  card: { 
    backgroundColor: '#fff', 
    borderRadius: 12, 
    marginBottom: 16, 
    flexDirection: 'row',
    overflow: 'hidden',
    elevation: 2, 
    shadowColor: '#000', 
    shadowOpacity: 0.05, 
    shadowRadius: 10 
  },
  cardStatus: { width: 6, backgroundColor: '#512BD4' },
  cardContent: { padding: 16, flex: 1 },
  cardTitle: { fontSize: 16, fontWeight: 'bold', color: '#2D3436', marginBottom: 4 },
  cardDesc: { fontSize: 14, color: '#636E72', lineHeight: 20 },
});