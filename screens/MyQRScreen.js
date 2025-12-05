import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Share } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { useUsuariosStore } from '../store/UsuarioStore';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function MyQRScreen() {
  const navigation = useNavigation();
  const { usuarioActual } = useUsuariosStore();

  // Si no hay usuario cargado, no mostramos nada o un loader
  if (!usuarioActual) return null;

  // Los datos que irán dentro del QR
  const qrData = JSON.stringify({
    id: usuarioActual.id,
    nombre: usuarioActual.nombre,
    telefono: usuarioActual.telefono,
    correo: usuarioActual.correo,
    foto: usuarioActual.foto
  });

  const shareQR = () => {
    Share.share({
      message: `Envíame dinero a mi cuenta Coinpay escaneando este código o a mi número ${usuarioActual.telefono}`,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Feather name="chevron-left" size={28} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title}>Mi Código QR</Text>
        <View style={{ width: 28 }} />
      </View>

      <View style={styles.content}>
        <View style={styles.qrCard}>
          <Text style={styles.name}>{usuarioActual.nombre}</Text>
          <Text style={styles.phone}>{usuarioActual.telefono}</Text>
          
          <View style={styles.qrContainer}>
            <QRCode
              value={qrData}
              size={220}
              color="black"
              backgroundColor="white"
              logo={require('../assets/adaptive-icon.png')} // Opcional: logo en el centro
              logoSize={40}
              logoBackgroundColor='white'
            />
          </View>
          <Text style={styles.hint}>Escanea este código para recibir dinero</Text>
        </View>

        <TouchableOpacity style={styles.shareButton} onPress={shareQR}>
          <Feather name="share-2" size={20} color="white" style={{marginRight: 10}}/>
          <Text style={styles.shareText}>Compartir</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FD' },
  header: { 
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', 
    padding: 20, marginTop: 10 
  },
  title: { fontSize: 20, fontWeight: 'bold', color: '#1A1A1A' },
  content: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 30 },
  qrCard: {
    backgroundColor: 'white',
    padding: 30,
    borderRadius: 24,
    alignItems: 'center',
    width: '100%',
    shadowColor: "#347AF0",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    marginBottom: 40
  },
  name: { fontSize: 22, fontWeight: 'bold', color: '#333', marginBottom: 5 },
  phone: { fontSize: 16, color: '#666', marginBottom: 25 },
  qrContainer: { padding: 10, backgroundColor: 'white' },
  hint: { marginTop: 20, color: '#888', fontSize: 14 },
  shareButton: {
    flexDirection: 'row',
    backgroundColor: '#347AF0',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 30,
    alignItems: 'center',
  },
  shareText: { color: 'white', fontWeight: 'bold', fontSize: 16 }
});