import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Image,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Alert
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';

export default function InputAmountScreen() {
  const navigation = useNavigation();
  const route = useRoute();

  // 1. Recibimos los datos de la pantalla anterior
  const { usuarioDestino, purpose } = route.params || {};

  // Estado para el monto
  const [amount, setAmount] = useState('');

  // 2. Datos dummy de respaldo (por si entras directo a esta pantalla sin navegar)
  const userFallback = {
    nombre: 'Mehedi Hasan',
    correo: 'helloyouthmind@gmail.com',
    foto: 'https://i.pravatar.cc/150?img=11',
    telefono: '+1 123 456 7890'
  };

  // 3. Seleccionamos el usuario a mostrar (el real o el dummy)
  const targetUser = usuarioDestino || userFallback;

  // 4. Normalización de datos para visualización
  const displayName = targetUser.nombre || targetUser.name || "Usuario Desconocido";
  // Priorizamos teléfono, si no hay, email
  const displayContact = targetUser.telefono || targetUser.phone || targetUser.correo || targetUser.email || "Sin contacto";
  
  // Imagen: aseguramos URI válida o placeholder
  const displayImageUri = targetUser.foto || targetUser.image || 'https://cdn-icons-png.flaticon.com/512/149/149071.png';

  const handleContinue = () => {
    // Convertimos a float para validar
    const numericAmount = parseFloat(amount);

    if (!amount || isNaN(numericAmount) || numericAmount <= 0) {
      Alert.alert("Monto inválido", "Por favor ingresa un monto mayor a 0.");
      return;
    }

    // Navegar a la pantalla de confirmación
    navigation.navigate('ConfirmPayment', { 
        usuarioDestino: targetUser, 
        purpose: purpose,
        amount: amount 
    });
  };

  // Validar si el botón debe estar activo
  const isButtonEnabled = amount.length > 0 && parseFloat(amount) > 0;

  return (
    <SafeAreaView style={styles.container}>
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Feather name="chevron-left" size={28} color="#1A1A1A" />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.content}
      >
        <Text style={styles.pageTitle}>Ingresa el Monto</Text>
        <Text style={styles.pageSubtitle}>Ingresa la cantidad que deseas enviar</Text>

        {/* Tarjeta Blanca Principal */}
        <View style={styles.card}>
          
          {/* Avatar e Info del Usuario */}
          <View style={styles.userInfo}>
            <Image 
              source={{ uri: displayImageUri }} 
              style={styles.avatar} 
            />
            <Text style={styles.userName}>{displayName}</Text> 
            <Text style={styles.userEmail}>{displayContact}</Text>
          </View>

          {/* Input de Dinero */}
          <View style={styles.amountContainer}>
            {/* Selector de Moneda */}
            <View style={styles.currencyBadge}>
              <Text style={styles.flag}>PEN</Text>
              <Feather name="chevron-down" size={16} color="#333" />
            </View>

            {/* Input Numérico */}
            <TextInput
              style={styles.amountInput}
              placeholder="0.00"
              placeholderTextColor="#ccc"
              keyboardType="numeric" // Teclado numérico
              value={amount}
              onChangeText={setAmount}
              autoFocus={true} // Enfocar al abrir
            />
            <View style={styles.underline} />
          </View>

          {/* Botón Continuar */}
          <TouchableOpacity 
            style={[
              styles.continueButton, 
              !isButtonEnabled && styles.disabledButton 
            ]} 
            onPress={handleContinue}
            disabled={!isButtonEnabled}
          >
            <Text style={styles.continueText}>Continuar</Text>
          </TouchableOpacity>

        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FD',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 10,
  },
  pageTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 5,
  },
  pageSubtitle: {
    fontSize: 15,
    color: '#757575',
    marginBottom: 30,
  },
  // Tarjeta Blanca Central
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    paddingVertical: 40,
    paddingHorizontal: 20,
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 5,
  },
  userInfo: {
    alignItems: 'center',
    marginBottom: 30,
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#F0F0F0',
    backgroundColor: '#eee'
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 13,
    color: '#888',
  },
  
  // Sección del Input
  amountContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 40,
  },
  currencyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 15,
    marginBottom: 15,
  },
  flag: {
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 4,
    color: '#333'
  },
  amountInput: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#1A1A1A',
    textAlign: 'center',
    width: '80%',
    paddingVertical: 10,
  },
  underline: {
    width: '60%',
    height: 2,
    backgroundColor: '#E0E0E0',
    marginTop: -5, 
  },

  // Botón
  continueButton: {
    width: '100%',
    backgroundColor: '#347AF0',
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
    shadowColor: "#347AF0",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  disabledButton: {
    backgroundColor: '#A0C4FF', 
    shadowOpacity: 0,
    elevation: 0,
  },
  continueText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});