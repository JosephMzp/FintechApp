import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Dimensions } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');
const SCAN_AREA_SIZE = width * 0.7;

export default function QRScannerScreen() {
  const navigation = useNavigation();
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    // Pedir permisos automáticamente al entrar
    if (!permission?.granted) {
      requestPermission();
    }
  }, []);

  const handleBarCodeScanned = ({ data }) => {
    if (scanned) return;
    setScanned(true);

    try {
      // 1. Intentamos parsear la data del QR
      const usuarioDestino = JSON.parse(data);

      // 2. Validamos que tenga la info mínima (por ejemplo un ID o Nombre)
      if (usuarioDestino && usuarioDestino.id) {
        
        // 3. NAVEGACIÓN DIRECTA
        // Saltamos SelectPurpose y vamos directo a poner el monto
        // Asumimos propósito "QR Scan" o "Personal" por defecto
        navigation.replace('InputAmount', { 
          usuarioDestino: usuarioDestino,
          purpose: 'Transferencia QR' 
        });

      } else {
        throw new Error("Formato inválido");
      }
    } catch (error) {
      Alert.alert("Error", "El código QR no es válido o no pertenece a esta app.", [
        { text: "OK", onPress: () => setScanned(false) }
      ]);
    }
  };

  if (!permission) {
    return <View style={styles.container} />; // Cargando permisos
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: 'center', marginBottom: 20 }}>Necesitamos acceso a tu cámara</Text>
        <TouchableOpacity style={styles.button} onPress={requestPermission}>
          <Text style={styles.textBtn}>Dar Permiso</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        style={StyleSheet.absoluteFillObject}
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: ["qr"],
        }}
      />
      
      {/* Overlay Oscuro con Hueco Transparente */}
      <View style={styles.overlay}>
        <View style={styles.topOverlay}>
          <Text style={styles.scanText}>Escanea el código QR para pagar</Text>
        </View>
        <View style={{ flexDirection: 'row' }}>
          <View style={styles.sideOverlay} />
          <View style={styles.focusedContainer}>
             <View style={styles.cornerTL} />
             <View style={styles.cornerTR} />
             <View style={styles.cornerBL} />
             <View style={styles.cornerBR} />
          </View>
          <View style={styles.sideOverlay} />
        </View>
        <View style={styles.bottomOverlay}>
          <TouchableOpacity style={styles.closeButton} onPress={() => navigation.goBack()}>
            <Feather name="x" size={30} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const overlayColor = 'rgba(0,0,0,0.6)';

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'black', justifyContent: 'center' },
  button: { backgroundColor: '#347AF0', padding: 15, borderRadius: 10, alignSelf: 'center' },
  textBtn: { color: 'white', fontWeight: 'bold' },
  
  overlay: { ...StyleSheet.absoluteFillObject, justifyContent: 'center' },
  topOverlay: { flex: 1, backgroundColor: overlayColor, justifyContent: 'center', alignItems: 'center' },
  bottomOverlay: { flex: 1, backgroundColor: overlayColor, justifyContent: 'center', alignItems: 'center' },
  sideOverlay: { flex: 1, backgroundColor: overlayColor },
  
  focusedContainer: {
    width: SCAN_AREA_SIZE,
    height: SCAN_AREA_SIZE,
  },
  
  scanText: { color: 'white', fontSize: 16, fontWeight: '600', marginTop: 40 },
  
  closeButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    width: 60, height: 60, borderRadius: 30,
    justifyContent: 'center', alignItems: 'center',
    marginBottom: 40
  },

  // Esquinas del cuadro
  cornerTL: { position: 'absolute', top: 0, left: 0, width: 40, height: 40, borderTopWidth: 4, borderLeftWidth: 4, borderColor: '#347AF0' },
  cornerTR: { position: 'absolute', top: 0, right: 0, width: 40, height: 40, borderTopWidth: 4, borderRightWidth: 4, borderColor: '#347AF0' },
  cornerBL: { position: 'absolute', bottom: 0, left: 0, width: 40, height: 40, borderBottomWidth: 4, borderLeftWidth: 4, borderColor: '#347AF0' },
  cornerBR: { position: 'absolute', bottom: 0, right: 0, width: 40, height: 40, borderBottomWidth: 4, borderRightWidth: 4, borderColor: '#347AF0' },
});