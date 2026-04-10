import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface InfoModalProps {
  visible: boolean;
  title?: string;
  message: string;
  type?: 'success' | 'warning' | 'error'; // Error tipi eklendi
  onClose: () => void;
}

export default function InfoModal({ visible, title = 'Bilgi', message, type = 'success', onClose }: InfoModalProps) {
  
  // TİP KONTROLLERİ
  const isWarning = type === 'warning';
  const isError = type === 'error';

  // İKON BELİRLEME
  let iconName: keyof typeof Ionicons.glyphMap = 'checkmark-circle';
  if (isWarning) iconName = 'warning';
  if (isError) iconName = 'close-circle'; // Hata için çarpı ikonu
  
  // RENK BELİRLEME
  let iconColor = '#00584E'; // Default Yeşil
  let circleBgColor = '#EAF6F4';
  let buttonColor = '#00584E';

  if (isWarning) {
    iconColor = '#F39C12'; // Turuncu
    circleBgColor = '#FEF5E7';
    buttonColor = '#F39C12';
  } else if (isError) {
    iconColor = '#E74C3C'; // KIRMIZI
    circleBgColor = '#FDEDEC';
    buttonColor = '#E74C3C';
  }

  return (
    <Modal transparent animationType="fade" visible={visible} onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          
          {/* İkon Dairesi */}
          <View style={[styles.iconCircle, { backgroundColor: circleBgColor }]}>
            <Ionicons name={iconName} size={40} color={iconColor} />
          </View>
          
          {/* Başlık - Hata durumunda kırmızı olur */}
          <Text style={[styles.title, isError && { color: '#E74C3C' }]}>{title}</Text>
          <Text style={styles.message}>{message}</Text>
          
          {/* Buton - Dinamik renkli */}
          <TouchableOpacity 
            style={[styles.button, { backgroundColor: buttonColor }]} 
            onPress={onClose} 
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>Tamam</Text>
          </TouchableOpacity>
          
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)', // Biraz daha koyulaştırdım ki kırmızı öne çıksın
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: '82%',
    backgroundColor: '#fff',
    borderRadius: 24, // Biraz daha yumuşattım
    paddingVertical: 32,
    paddingHorizontal: 24,
    alignItems: 'center',
    elevation: 20,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 20,
  },
  iconCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#00584E',
    marginBottom: 10,
  },
  message: {
    fontSize: 15,
    color: '#555',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 30,
  },
  button: {
    paddingVertical: 16,
    borderRadius: 16,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});