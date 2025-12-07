import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, FlatList, StyleSheet, Alert } from 'react-native';
import { useSubscription } from '../store/SubscriptionStore';
import { Ionicons } from '@expo/vector-icons'; // Iconos para UI

export default function SubscriptionScreen() {
  const { offerings, isPro, purchasePackage, restorePurchases, loading } = useSubscription();
  const [processing, setProcessing] = useState(false);

  // Manejar la compra
  const handlePurchase = async (pack) => {
    setProcessing(true);
    const success = await purchasePackage(pack);
    setProcessing(false);
    if (success) {
      Alert.alert("¡Felicidades!", "Ahora eres usuario Premium.");
    }
  };

  if (loading) return <ActivityIndicator style={styles.center} size="large" color="#6200ee" />;

  // Renderizar cada opción de suscripción
  const renderItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.card} 
      onPress={() => handlePurchase(item)}
      disabled={processing || isPro}
    >
      <View>
        <Text style={styles.title}>{item.product.title}</Text>
        <Text style={styles.desc}>{item.product.description}</Text>
      </View>
      <View style={styles.priceContainer}>
        <Text style={styles.price}>{item.product.priceString}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Tienda Premium</Text>
      
      {isPro ? (
        <View style={styles.activeBadge}>
          <Ionicons name="checkmark-circle" size={24} color="white" />
          <Text style={styles.activeText}>Suscripción Activa</Text>
        </View>
      ) : (
        <Text style={styles.subHeader}>Desbloquea todas las funcionalidades</Text>
      )}

      {offerings && offerings.availablePackages ? (
        <FlatList
          data={offerings.availablePackages}
          keyExtractor={(item) => item.identifier}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
        />
      ) : (
        <Text style={styles.error}>No hay suscripciones disponibles por el momento.</Text>
      )}

      <TouchableOpacity onPress={restorePurchases} style={styles.restoreBtn}>
        <Text style={styles.restoreText}>Restaurar Compras</Text>
      </TouchableOpacity>

      {processing && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#fff" />
          <Text style={{color:'white', marginTop:10}}>Procesando compra...</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f4f4f4' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { fontSize: 28, fontWeight: 'bold', marginBottom: 10, color: '#333' },
  subHeader: { fontSize: 16, color: '#666', marginBottom: 20 },
  card: { backgroundColor: 'white', padding: 20, borderRadius: 12, marginBottom: 15, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', elevation: 3 },
  title: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  desc: { fontSize: 14, color: '#666', maxWidth: 200 },
  priceContainer: { backgroundColor: '#e0e0e0', padding: 10, borderRadius: 8 },
  price: { fontWeight: 'bold', color: '#6200ee' },
  activeBadge: { backgroundColor: '#4CAF50', padding: 15, borderRadius: 10, flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  activeText: { color: 'white', fontWeight: 'bold', marginLeft: 10, fontSize: 16 },
  restoreBtn: { marginTop: 20, alignItems: 'center' },
  restoreText: { color: '#666', textDecorationLine: 'underline' },
  loadingOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', alignItems: 'center' }
});