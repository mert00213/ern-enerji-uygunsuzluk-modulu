import React from 'react';
import { StyleSheet, Text, View, ScrollView, Image, TouchableOpacity, Dimensions, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';

const { width } = Dimensions.get('window');

export default function DetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const images = params.images ? JSON.parse(params.images as string) : [];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#00584E" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Kayıt Detayı</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {images.length > 0 ? (
          <FlatList 
            data={images} 
            horizontal 
            pagingEnabled 
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => <Image source={{ uri: item }} style={{ width, height: 300, resizeMode: 'cover' }} />} 
            keyExtractor={(item, index) => index.toString()}
          />
        ) : (
          <View style={styles.noImg}><Ionicons name="image" size={60} color="#D5DCDA" /><Text style={{color:'#A0AAB2', marginTop:10}}>Görsel Yok</Text></View>
        )}

        <View style={styles.content}>
          <View style={[styles.statusBanner, { backgroundColor: params.status === 'Açık' ? '#763E2A' : '#00584E' }]}>
            <Text style={styles.statusText}>{params.status?.toString().toUpperCase()}</Text>
          </View>
          <Text style={styles.title}>{params.title}</Text>
          <View style={styles.metaRow}>
            <Ionicons name="calendar-outline" size={16} color="#627C77" />
            <Text style={styles.metaText}>{params.date}</Text>
          </View>
          <View style={styles.divider} />
          <Text style={styles.sectionLabel}>AÇIKLAMA</Text>
          <Text style={styles.desc}>{params.description}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems:'center', padding: 15, borderBottomWidth: 1, borderColor: '#F0F7F4' },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#00584E' },
  backButton: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F0F7F4', borderRadius: 12 },
  noImg: { height: 300, backgroundColor: '#F9F9F9', justifyContent: 'center', alignItems: 'center' },
  content: { padding: 20 },
  statusBanner: { alignSelf: 'flex-start', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, marginBottom: 15 },
  statusText: { color: '#FFF', fontSize: 12, fontWeight: 'bold' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#00584E', marginBottom: 10 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 20 },
  metaText: { color: '#627C77', fontSize: 14 },
  divider: { height: 1, backgroundColor: '#F0F7F4', marginBottom: 20 },
  sectionLabel: { fontSize: 12, fontWeight: 'bold', color: '#A0AAB2', marginBottom: 8, letterSpacing: 1 },
  desc: { fontSize: 16, color: '#2D3436', lineHeight: 24 }
});