import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface InfoModalProps {
  visible: boolean;
  title?: string;
  message: string;
  type?: 'success' | 'warning';
  onClose: () => void;
}

export default function InfoModal({ visible, title = 'Bilgi', message, type = 'success', onClose }: InfoModalProps) {
  
  const isWarning = type === 'warning';
  const iconName = isWarning ? 'warning' : 'checkmark-circle';
  
  // YENİ TURUNCU RENKLER
  const iconColor = isWarning ? '#F39C12' : '#00584E'; 
  const circleBgColor = isWarning ? '#FEF5E7' : '#EAF6F4'; 

  return (
    <Modal transparent animationType="fade" visible={visible} onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          
          <View style={[styles.iconCircle, { backgroundColor: circleBgColor }]}>
            <Ionicons name={iconName} size={40} color={iconColor} />
          </View>
          
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>
          
          <TouchableOpacity style={styles.button} onPress={onClose} activeOpacity={0.8}>
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
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: '82%',
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingVertical: 30,
    paddingHorizontal: 24,
    alignItems: 'center',
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 16,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#00584E',
    marginBottom: 8,
  },
  message: {
    fontSize: 14,
    color: '#747876',
    textAlign: 'center',
    lineHeight: 21,
    marginBottom: 24,
  },
  button: {
    backgroundColor: '#00584E',
    paddingVertical: 14,
    paddingHorizontal: 48,
    borderRadius: 14,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
  },
});