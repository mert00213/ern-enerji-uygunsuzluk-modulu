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
        tabBarActiveTintColor: '#00584E',
        tabBarInactiveTintColor: '#747876',
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopWidth: 1,
          borderTopColor: '#E8EDEB',
          height: 65 + insets.bottom,
          paddingBottom: insets.bottom > 0 ? insets.bottom : (Platform.OS === 'ios' ? 20 : 10),
          paddingTop: 10,
          elevation: 10,
          shadowColor: '#000',
          shadowOpacity: 0.08,
          shadowOffset: { width: 0, height: -2 },
          shadowRadius: 8,
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
              top: -10,
              width: 36,
              height: 36, 
              borderRadius: 18,
              backgroundColor: '#00584E',
              justifyContent: 'center',
              alignItems: 'center',
              borderWidth: 3, 
              borderColor: '#FFF', 
              elevation: 4,
              shadowColor: '#00584E',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.3,
              shadowRadius: 3,
            }}>
              <Ionicons name="add" size={20} color="#fff" />
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="detail"
        options={{
          href: null, // Bu satır butonu menüden gizler ama sayfa çalışmaya devam eder
        }}
      />
    </Tabs>
  );
}