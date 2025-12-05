import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  SafeAreaView, 
  Share 
} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { useUsuariosStore } from '../store/UsuarioStore';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from "../context/ThemeContext";  // ⭐ MODO OSCURO

export default function MyQRScreen() {
  const navigation = useNavigation();
  const { usuarioActual } = useUsuariosStore();
  const { isDark } = useTheme(); // ⭐ USAR TEMA

  if (!usuarioActual) return null;

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
    <SafeAreaView 
      style={[
        styles.container, 
        { backgroundColor: isDark ? "#121212" : "#F8F9FD" } // ⭐ CAMBIO
      ]}
    >
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Feather 
            name="chevron-left" 
            size={28} 
            color={isDark ? "#fff" : "#333"} // ⭐ CAMBIO
          />
        </TouchableOpacity>

        <Text 
          style={[
            styles.title, 
            { color: isDark ? "#fff" : "#1A1A1A" } // ⭐ CAMBIO
          ]}
        >
          Mi Código QR
        </Text>

        <View style={{ width: 28 }} />
      </View>

      {/* CONTENIDO */}
      <View style={styles.content}>
        
        <View 
          style={[
            styles.qrCard,
            { 
              backgroundColor: isDark ? "#1e1e1e" : "#fff", // ⭐ CAMBIO
            }
          ]}
        >
          <Text style={[styles.name, { color: isDark ? "#fff" : "#333" }]}>
            {usuarioActual.nombre}
          </Text>

          <Text style={[styles.phone, { color: isDark ? "#ccc" : "#666" }]}>
            {usuarioActual.telefono}
          </Text>

          <View 
            style={[
              styles.qrContainer,
              { backgroundColor: isDark ? "#fff" : "white" } // QR siempre legible
            ]}
          >
            <QRCode
              value={qrData}
              size={220}
              color="black"
              backgroundColor="white"
              logo={require('../assets/adaptive-icon.png')}
              logoSize={40}
              logoBackgroundColor='white'
            />
          </View>

          <Text style={[styles.hint, { color: isDark ? "#aaa" : "#888" }]}>
            Escanea este código para recibir dinero
          </Text>
        </View>

        <TouchableOpacity style={styles.shareButton} onPress={shareQR}>
          <Feather name="share-2" size={20} color="white" style={{ marginRight: 10 }}/>
          <Text style={styles.shareText}>Compartir</Text>
        </TouchableOpacity>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1
  },

  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    padding: 20, 
    marginTop: 10 
  },

  title: { 
    fontSize: 20, 
    fontWeight: 'bold' 
  },

  content: { 
    flex: 1, 
    alignItems: 'center', 
    justifyContent: 'center', 
    paddingHorizontal: 30 
  },

  qrCard: {
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

  name: { 
    fontSize: 22, 
    fontWeight: 'bold', 
    marginBottom: 5 
  },

  phone: { 
    fontSize: 16, 
    marginBottom: 25 
  },

  qrContainer: { 
    padding: 10 
  },

  hint: { 
    marginTop: 20, 
    fontSize: 14 
  },

  shareButton: {
    flexDirection: 'row',
    backgroundColor: '#347AF0',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 30,
    alignItems: 'center',
  },

  shareText: { 
    color: 'white', 
    fontWeight: 'bold', 
    fontSize: 16 
  }
});
