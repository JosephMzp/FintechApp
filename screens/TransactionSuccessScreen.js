import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Image,
  ScrollView
} from 'react-native';
import { Feather, FontAwesome, Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';

export default function TransactionSuccessScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  
  const { transaccionId, amount, usuarioDestino, tarjetaUsada, fecha, hora } = route.params || {};

  const isMaster = tarjetaUsada?.numero?.startsWith("5");

  return (
    <SafeAreaView style={styles.container}>
      {/* Botón X para cerrar todo el flujo */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('Home')}>
          <Feather name="x" size={28} color="#333" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        
        {/* Banner de Éxito */}
        <View style={styles.successBanner}>
          <Ionicons name="checkmark-circle" size={28} color="#15803d" />
          <View style={{marginLeft: 10}}>
            <Text style={styles.successTitle}>¡Transacción Completada!</Text>
            <Text style={styles.successDate}>{fecha} a las {hora}</Text>
          </View>
        </View>

        {/* Info Central */}
        <View style={styles.infoCard}>
          <Image 
            source={{ uri: usuarioDestino?.foto || 'https://i.pravatar.cc/150?img=3' }} 
            style={styles.avatar} 
          />
          <Text style={styles.userName}>{usuarioDestino?.nombre}</Text>
          <Text style={styles.userEmail}>{usuarioDestino?.correo}</Text>
          
          <Text style={styles.amountText}>S/ {amount}</Text>
          
          <Text style={styles.txIdLabel}>ID Transacción: {transaccionId}</Text>
        </View>

        {/* Tarjeta Usada */}
        <Text style={styles.sectionTitle}>Pagado con</Text>
        <View style={styles.accountRow}>
           <FontAwesome 
              name={isMaster ? "cc-mastercard" : "cc-visa"} 
              size={24} 
              color={isMaster ? "#EB001B" : "#1A1F71"} 
            />
            <Text style={styles.accountText}>
              Tarjeta ************{tarjetaUsada?.numero?.slice(-4) || "0000"}
            </Text>
        </View>

        <View style={{ height: 40 }} />

        <TouchableOpacity 
          style={styles.primaryButton}
          onPress={() => navigation.navigate("Home")}
        >
          <Text style={styles.primaryButtonText}>Volver al Inicio</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FD' },
  header: { paddingHorizontal: 20, paddingTop: 10, paddingBottom: 10 },
  content: { paddingHorizontal: 24, paddingBottom: 30 },
  
  successBanner: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#DCFCE7', borderRadius: 16, padding: 20, marginBottom: 25,
    borderWidth: 1, borderColor: '#bbf7d0'
  },
  successTitle: { color: '#166534', fontWeight: 'bold', fontSize: 16 },
  successDate: { color: '#166534', fontSize: 13, marginTop: 2 },

  infoCard: {
    backgroundColor: '#FFF', borderRadius: 20, padding: 30, alignItems: 'center',
    marginBottom: 30,
    shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 5, elevation: 2,
  },
  avatar: { width: 70, height: 70, borderRadius: 35, marginBottom: 12, backgroundColor: '#eee' },
  userName: { fontSize: 20, fontWeight: 'bold', color: '#1A1A1A', marginBottom: 4 },
  userEmail: { fontSize: 14, color: '#888', marginBottom: 15 },
  amountText: { fontSize: 32, fontWeight: 'bold', color: '#1A1A1A', marginBottom: 10 },
  txIdLabel: { fontSize: 12, color: '#347AF0', fontWeight: '500' },

  sectionTitle: { fontSize: 16, fontWeight: '600', color: '#333', marginBottom: 10 },
  accountRow: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', 
    padding: 15, borderRadius: 12
  },
  accountText: { marginLeft: 15, fontSize: 15, color: '#333' },

  primaryButton: {
    backgroundColor: '#347AF0', paddingVertical: 16, borderRadius: 30, alignItems: 'center',
    marginBottom: 15, shadowColor: "#347AF0", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 6,
  },
  primaryButtonText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
});