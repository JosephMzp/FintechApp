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
  
  const { transaccionId, amount, usuarioDestino, tarjetaUsada } = route.params || {};

  // Formato de fecha actual
  const today = new Date();
  const dateStr = today.toLocaleDateString('es-PE', { day: 'numeric', month: 'short', year: 'numeric' });
  const timeStr = today.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const isMaster = tarjetaUsada?.numero?.startsWith("5");

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('Home')}>
          <Feather name="chevron-left" size={28} color="#333" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        
        {/* Banner Verde */}
        <View style={styles.successBanner}>
          <Ionicons name="checkmark-circle" size={24} color="#15803d" />
          <Text style={styles.successText}>
            Transaction Complete! - {dateStr} at {timeStr}
          </Text>
        </View>

        {/* Tarjeta Central */}
        <View style={styles.infoCard}>
          <Image 
            source={{ uri: usuarioDestino?.image || 'https://i.pravatar.cc/150?img=3' }} 
            style={styles.avatar} 
          />
          <Text style={styles.userName}>{usuarioDestino?.name || "Usuario"}</Text>
          <Text style={styles.userEmail}>{usuarioDestino?.email || "email@test.com"}</Text>
          
          <Text style={styles.txIdLabel}>Coinpay Transaction ID: {transaccionId}</Text>
        </View>

        {/* Información de la cuenta */}
        <Text style={styles.sectionTitle}>Account</Text>
        <View style={styles.accountRow}>
           <FontAwesome 
              name={isMaster ? "cc-mastercard" : "cc-visa"} 
              size={24} 
              color={isMaster ? "#EB001B" : "#1A1F71"} 
            />
            <Text style={styles.accountText}>
              Account ************{tarjetaUsada?.numero?.slice(-4) || "0000"}
            </Text>
        </View>

        {/* Espaciador */}
        <View style={{ height: 40 }} />

        {/* Botones de acción */}
        <TouchableOpacity 
          style={styles.primaryButton}
          onPress={() => navigation.navigate("Home")}
        >
          <Text style={styles.primaryButtonText}>Back to Homepage</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.secondaryButton}
          onPress={() => navigation.navigate("SendMoney")} // O volver al inicio del flujo
        >
          <Text style={styles.secondaryButtonText}>Make another Payment</Text>
        </TouchableOpacity>

        <Text style={styles.footerText}>
          Thank you for using our app to send money. If you have any questions, 
          please don't hesitate to <Text style={styles.link}>contact us</Text>.
        </Text>

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
    backgroundColor: '#DCFCE7', borderRadius: 12, padding: 15, marginBottom: 25
  },
  successText: { color: '#166534', fontWeight: '600', marginLeft: 8, fontSize: 13 },

  infoCard: {
    backgroundColor: '#FFF', borderRadius: 20, padding: 30, alignItems: 'center',
    marginBottom: 30,
    shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 5, elevation: 2,
  },
  avatar: { width: 70, height: 70, borderRadius: 35, marginBottom: 12 },
  userName: { fontSize: 20, fontWeight: 'bold', color: '#1A1A1A', marginBottom: 4 },
  userEmail: { fontSize: 14, color: '#888', marginBottom: 10 },
  txIdLabel: { fontSize: 12, color: '#347AF0', fontWeight: '500' },

  sectionTitle: { fontSize: 16, fontWeight: '600', color: '#333', marginBottom: 10 },
  accountRow: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', 
    padding: 15, borderRadius: 12
  },
  accountText: { marginLeft: 15, fontSize: 15, color: '#333' },

  primaryButton: {
    backgroundColor: '#347AF0', paddingVertical: 16, borderRadius: 30, alignItems: 'center',
    marginBottom: 15
  },
  primaryButtonText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },

  secondaryButton: {
    backgroundColor: '#FFF', paddingVertical: 16, borderRadius: 30, alignItems: 'center',
    borderWidth: 1, borderColor: '#347AF0', marginBottom: 25
  },
  secondaryButtonText: { color: '#347AF0', fontSize: 16, fontWeight: 'bold' },

  footerText: { textAlign: 'center', color: '#888', fontSize: 12, lineHeight: 18, paddingHorizontal: 10 },
  link: { color: '#347AF0', fontWeight: 'bold' }
});