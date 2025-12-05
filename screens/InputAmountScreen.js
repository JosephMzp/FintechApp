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
import { useTheme } from "../context/ThemeContext"; // ⬅️ MODO OSCURO

export default function InputAmountScreen() {

  const { isDark } = useTheme(); // ⬅️ LEER EL TEMA
  const navigation = useNavigation();
  const route = useRoute();

  const { usuarioDestino, purpose } = route.params || {};

  const [amount, setAmount] = useState('');

  const userFallback = {
    nombre: 'Mehedi Hasan',
    correo: 'helloyouthmind@gmail.com',
    foto: 'https://i.pravatar.cc/150?img=11',
    telefono: '+1 123 456 7890'
  };

  const targetUser = usuarioDestino || userFallback;

  const displayName = targetUser.nombre || targetUser.name || "Usuario Desconocido";
  const displayContact = targetUser.telefono || targetUser.phone || targetUser.correo || targetUser.email || "Sin contacto";
  const displayImageUri = targetUser.foto || targetUser.image || 'https://cdn-icons-png.flaticon.com/512/149/149071.png';

  const handleContinue = () => {
    const numericAmount = parseFloat(amount);

    if (!amount || isNaN(numericAmount) || numericAmount <= 0) {
      Alert.alert("Monto inválido", "Por favor ingresa un monto mayor a 0.");
      return;
    }

    navigation.navigate('ConfirmPayment', { 
      usuarioDestino: targetUser, 
      purpose,
      amount
    });
  };

  const isButtonEnabled = amount.length > 0 && parseFloat(amount) > 0;

  const dynamic = styles(isDark); // ⬅️ estilos dinámicos

  return (
    <SafeAreaView style={dynamic.container}>
      
      <View style={dynamic.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={dynamic.backButton}>
          <Feather name="chevron-left" size={28} color={isDark ? "#fff" : "#1A1A1A"} />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={dynamic.content}
      >
        <Text style={dynamic.pageTitle}>Ingresa el Monto</Text>
        <Text style={dynamic.pageSubtitle}>Ingresa la cantidad que deseas enviar</Text>

        <View style={dynamic.card}>
          
          <View style={dynamic.userInfo}>
            <Image 
              source={{ uri: displayImageUri }} 
              style={dynamic.avatar} 
            />
            <Text style={dynamic.userName}>{displayName}</Text> 
            <Text style={dynamic.userEmail}>{displayContact}</Text>
          </View>

          <View style={dynamic.amountContainer}>
            
            <View style={dynamic.currencyBadge}>
              <Text style={dynamic.flag}>PEN</Text>
              <Feather name="chevron-down" size={16} color={isDark ? "#ddd" : "#333"} />
            </View>

            <TextInput
              style={dynamic.amountInput}
              placeholder="0.00"
              placeholderTextColor={isDark ? "#666" : "#ccc"}
              keyboardType="numeric"
              value={amount}
              onChangeText={setAmount}
              autoFocus={true}
            />
            <View style={dynamic.underline} />
          </View>

          <TouchableOpacity 
            style={[
              dynamic.continueButton, 
              !isButtonEnabled && dynamic.disabledButton 
            ]} 
            onPress={handleContinue}
            disabled={!isButtonEnabled}
          >
            <Text style={dynamic.continueText}>Continuar</Text>
          </TouchableOpacity>

        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = (isDark) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: isDark ? "#121212" : '#F8F9FD',
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
    color: isDark ? "#fff" : '#1A1A1A',
    marginBottom: 5,
  },
  pageSubtitle: {
    fontSize: 15,
    color: isDark ? "#bbb" : '#757575',
    marginBottom: 30,
  },
  card: {
    backgroundColor: isDark ? "#1E1E1E" : '#FFFFFF',
    borderRadius: 24,
    paddingVertical: 40,
    paddingHorizontal: 20,
    alignItems: 'center',
    shadowColor: isDark ? "transparent" : "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: isDark ? 0 : 0.08,
    shadowRadius: 10,
    elevation: isDark ? 0 : 5,
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
    borderColor: isDark ? "#333" : '#F0F0F0',
    backgroundColor: '#eee'
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: isDark ? "#fff" : '#1A1A1A',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 13,
    color: isDark ? "#aaa" : '#888',
  },
  amountContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 40,
  },
  currencyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: isDark ? "#2A2A2A" : '#F5F5F5',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 15,
    marginBottom: 15,
  },
  flag: {
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 4,
    color: isDark ? "#fff" : '#333'
  },
  amountInput: {
    fontSize: 48,
    fontWeight: 'bold',
    color: isDark ? "#fff" : '#1A1A1A',
    textAlign: 'center',
    width: '80%',
    paddingVertical: 10,
  },
  underline: {
    width: '60%',
    height: 2,
    backgroundColor: isDark ? "#444" : '#E0E0E0',
    marginTop: -5, 
  },
  continueButton: {
    width: '100%',
    backgroundColor: '#347AF0',
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
    elevation: 6,
  },
  disabledButton: {
    backgroundColor: '#A0C4FF',
    elevation: 0,
  },
  continueText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
