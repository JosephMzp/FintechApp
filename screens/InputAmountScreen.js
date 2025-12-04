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
import { Feather, MaterialIcons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';

export default function InputAmountScreen() {
  const navigation = useNavigation();
  const route = useRoute();

  // Recibimos los datos de la pantalla anterior
  const { usuarioDestino, purpose } = route.params || {};

  // Estado para el monto
  const [amount, setAmount] = useState('');

  // Datos dummy por si entras directo sin pasar por el flujo (para pruebas)
  const userDisplay = usuarioDestino || {
    name: 'Mehedi Hasan',
    email: 'helloyouthmind@gmail.com',
    image: 'https://i.pravatar.cc/150?img=11'
  };

  const handleContinue = () => {
    if (!amount || parseFloat(amount) <= 0) {
      Alert.alert("Monto inválido", "Por favor ingresa un monto mayor a 0.");
      return;
    }

    // Navegar a la pantalla de confirmación
    navigation.navigate('ConfirmPayment', { 
        usuarioDestino: usuarioDestino,
        purpose: purpose,
        amount: amount 
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Feather name="chevron-left" size={28} color="#1A1A1A" />
        </TouchableOpacity>
        {/* En la imagen el título parece ser parte del flujo anterior, 
            aquí ponemos algo acorde a la acción actual */}
        {/* <Text style={styles.headerTitle}>Enviar Dinero</Text> */}
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
              source={{ uri: userDisplay.image }} 
              style={styles.avatar} 
            />
            <Text style={styles.userName}>{userDisplay.name}</Text>
            <Text style={styles.userEmail}>{userDisplay.email}</Text>
          </View>

          {/* Input de Dinero */}
          <View style={styles.amountContainer}>
            {/* Selector de Moneda (Estático por ahora como en la imagen) */}
            <View style={styles.currencyBadge}>
              <Text style={styles.flag}>PEN</Text>
              <Feather name="chevron-down" size={16} color="#333" />
            </View>

            {/* Input Numérico */}
            <TextInput
              style={styles.amountInput}
              placeholder="0.00"
              placeholderTextColor="#ccc"
              keyboardType="numeric"
              value={amount}
              onChangeText={setAmount}
              autoFocus={true}
            />
            {/* Línea inferior decorativa */}
            <View style={styles.underline} />
          </View>

          {/* Botón Continuar */}
          <TouchableOpacity 
            style={[
              styles.continueButton, 
              !amount && styles.disabledButton // Estilo deshabilitado si no hay monto
            ]} 
            onPress={handleContinue}
            disabled={!amount}
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
    // Sombras
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
    borderColor: '#F0F0F0'
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
    fontSize: 20,
    marginRight: 4,
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
    backgroundColor: '#A0C4FF', // Color más claro cuando está deshabilitado
    shadowOpacity: 0,
    elevation: 0,
  },
  continueText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});