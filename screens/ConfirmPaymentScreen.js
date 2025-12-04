import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Image,
  FlatList,
  Alert,
  ActivityIndicator
} from 'react-native';
import { Feather, FontAwesome } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTarjetaStore } from '../store/TarjetaStore'; // Tu store de tarjetas
import { supabase } from '../supabase/supabase.config';

export default function ConfirmPaymentScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  
  // Datos recibidos
  const { usuarioDestino, purpose, amount } = route.params || {};
  
  // Store de tarjetas
  const { tarjetas, listarTarjetas } = useTarjetaStore();
  
  const [selectedCardId, setSelectedCardId] = useState(null);
  const [loadingPay, setLoadingPay] = useState(false);

  // Asegurarnos de tener tarjetas cargadas
  useEffect(() => {
    // Si la lista está vacía en memoria, podrías llamar a listarTarjetas aquí
    // asumiendo que ya tienes el ID del usuario logueado en algún lado.
    if (tarjetas.length > 0) {
      setSelectedCardId(tarjetas[0].id); // Seleccionar la primera por defecto
    }
  }, [tarjetas]);

  const handlePay = async () => {
    if (!selectedCardId) {
      Alert.alert("Error", "Por favor selecciona una tarjeta");
      return;
    }

    setLoadingPay(true);

    try {
      // 1. Obtener la tarjeta seleccionada para sacar el 'cuenta_id' (origen)
      const tarjetaOrigen = tarjetas.find(t => t.id === selectedCardId);
      
      if (!tarjetaOrigen) throw new Error("Tarjeta no válida");

      // 2. Buscar la cuenta destino del usuario al que le enviamos (usuarioDestino)
      // Asumimos que usuarioDestino tiene un campo 'id' que es el id de la tabla usuarios
      const { data: cuentaDestinoData, error: errorCuenta } = await supabase
        .from('cuentas')
        .select('id')
        .eq('user_id', usuarioDestino.id) // Ojo: asegúrate que usuarioDestino tenga el ID correcto
        .limit(1)
        .maybeSingle();

      // Nota: Si es educativo y no tienes cuentas creadas para todos, esto podría fallar.
      // Para pruebas, si no hay cuenta destino, usaremos null o manejamos el error.
      
      // 3. Registrar la transacción
      const { data: transaccion, error: errorTx } = await supabase
        .from('transacciones')
        .insert({
          cuenta_origen: tarjetaOrigen.cuenta_id, 
          cuenta_destino: cuentaDestinoData ? cuentaDestinoData.id : null, // O manejas si no existe
          monto: parseFloat(amount),
          tipo: 'pago',
          estado: 'completado',
          referencia: purpose,
          fecha: new Date().toISOString(),
          // hora: new Date().toLocaleTimeString() // Postgres 'time' a veces requiere formato específico, 'now()' suele ser mejor
        })
        .select()
        .single();

      if (errorTx) throw errorTx;

      // 4. Navegar a Éxito
      navigation.navigate("TransactionSuccess", {
        transaccionId: transaccion ? transaccion.id : 'REF-TEMP-123',
        amount,
        usuarioDestino,
        tarjetaUsada: tarjetaOrigen
      });

    } catch (error) {
      console.error("Error pagando:", error);
      Alert.alert("Error", "No se pudo procesar la transacción. " + error.message);
    } finally {
      setLoadingPay(false);
    }
  };

  const renderCardItem = ({ item }) => {
    const isSelected = selectedCardId === item.id;
    const isMaster = item.numero.startsWith("5"); // Simple validación visual

    return (
      <TouchableOpacity 
        style={[styles.cardOption, isSelected && styles.cardOptionSelected]}
        onPress={() => setSelectedCardId(item.id)}
      >
        <View style={styles.cardLeft}>
          <FontAwesome 
            name={isMaster ? "cc-mastercard" : "cc-visa"} 
            size={24} 
            color={isMaster ? "#EB001B" : "#1A1F71"} 
          />
          <Text style={styles.cardText}>
            Account ************{item.numero.slice(-4)}
          </Text>
        </View>
        
        {/* Radio Circle */}
        <View style={styles.radioOuter}>
          {isSelected && <View style={styles.radioInner} />}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather name="chevron-left" size={28} color="#333" />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>Confirmar Pago</Text>
        <Text style={styles.subtitle}>Revisa los detalles antes de enviar</Text>

        {/* Tarjeta de Usuario (Resumen) */}
        <View style={styles.userCard}>
          <Image 
            source={{ uri: usuarioDestino?.image || 'https://i.pravatar.cc/150?img=3' }} 
            style={styles.avatar} 
          />
          <Text style={styles.userName}>{usuarioDestino?.name || "Usuario"}</Text>
          <Text style={styles.userEmail}>{usuarioDestino?.email || "email@test.com"}</Text>
        </View>

        {/* Selección de Cuenta */}
        <Text style={styles.sectionLabel}>Choose Account</Text>
        
        <View style={{ maxHeight: 200 }}>
          <FlatList 
            data={tarjetas}
            keyExtractor={item => item.id.toString()}
            renderItem={renderCardItem}
            ListEmptyComponent={<Text style={{color:'#999'}}>No tienes tarjetas registradas.</Text>}
          />
        </View>

        {/* Botón Pagar */}
        <View style={{ flex: 1, justifyContent: 'flex-end', marginBottom: 20 }}>
          <TouchableOpacity 
            style={styles.payButton} 
            onPress={handlePay}
            disabled={loadingPay}
          >
            {loadingPay ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.payButtonText}>Pay S/{amount}</Text>
            )}
          </TouchableOpacity>
        </View>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FD' },
  header: { paddingHorizontal: 20, paddingTop: 10 },
  content: { flex: 1, paddingHorizontal: 24, paddingTop: 10 },
  title: { fontSize: 26, fontWeight: 'bold', color: '#1A1A1A', marginBottom: 5 },
  subtitle: { fontSize: 15, color: '#757575', marginBottom: 30 },
  
  userCard: {
    backgroundColor: '#FFF', borderRadius: 20, padding: 25, alignItems: 'center',
    shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 5, elevation: 2,
    marginBottom: 30
  },
  avatar: { width: 60, height: 60, borderRadius: 30, marginBottom: 10 },
  userName: { fontSize: 18, fontWeight: 'bold', color: '#1A1A1A' },
  userEmail: { fontSize: 13, color: '#888', marginTop: 2 },

  sectionLabel: { fontSize: 16, fontWeight: '600', color: '#333', marginBottom: 15 },
  
  cardOption: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: '#FFF', padding: 15, borderRadius: 12, marginBottom: 10,
    borderWidth: 1, borderColor: 'transparent'
  },
  cardOptionSelected: { borderColor: '#347AF0' }, // Borde azul al seleccionar
  cardLeft: { flexDirection: 'row', alignItems: 'center' },
  cardText: { marginLeft: 10, fontSize: 14, color: '#333', fontWeight: '500' },
  
  radioOuter: {
    width: 20, height: 20, borderRadius: 10, borderWidth: 1, borderColor: '#DDD',
    alignItems: 'center', justifyContent: 'center'
  },
  radioInner: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#347AF0' },

  payButton: {
    backgroundColor: '#347AF0', paddingVertical: 18, borderRadius: 30, alignItems: 'center',
    shadowColor: "#347AF0", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 6,
  },
  payButtonText: { color: '#FFF', fontSize: 18, fontWeight: 'bold' }
});