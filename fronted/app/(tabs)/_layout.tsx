import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Platform, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function TabsLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#512BD4',
        tabBarInactiveTintColor: '#999',
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopWidth: 1,
          borderTopColor: '#eee',
          height: 65 + insets.bottom,
          paddingBottom: insets.bottom > 0 ? insets.bottom : (Platform.OS === 'ios' ? 20 : 10),
          paddingTop: 10,
          elevation: 10,
          shadowOpacity: 0.1,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          marginTop: -5,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Uygunsuzluklar',
          tabBarIcon: ({ color }) => (
            <Ionicons name="list" size={26} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="add-issue"
        options={{
          title: 'Kayıt Ekle',
          tabBarIcon: () => (
            <View style={{
              position: 'relative',
              top: -10, // Havaya kalkma miktarını boyutuna göre dengeledik
              width: 36, // İyice kibarlaştırıldı (42 idi)
              height: 36, 
              borderRadius: 18, // Genişliğin tam yarısı (tam yuvarlak)
              backgroundColor: '#512BD4',
              justifyContent: 'center',
              alignItems: 'center',
              borderWidth: 3, 
              borderColor: '#FFF', 
              elevation: 4,
              shadowColor: '#512BD4',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.3,
              shadowRadius: 3,
            }}>
              {/* İkon boyutu 20'ye düşürüldü */}
              <Ionicons name="add" size={20} color="#fff" />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}