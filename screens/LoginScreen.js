// screens/LoginScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Modal,
  FlatList,
  Alert,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

// 1. CORRECCIÓN: Importamos desde AuthStore, no UsuarioStore
import { useAuthStore } from '../store/AuthStore'; 

const COUNTRIES = [
  { code: 'PE', name: 'Perú', dialCode: '+51', maxDigits: 9, flag: '🇵🇪' },
  { code: 'US', name: 'United States', dialCode: '+1', maxDigits: 10, flag: '🇺🇸' },
  { code: 'ES', name: 'España', dialCode: '+34', maxDigits: 9, flag: '🇪🇸' },
  { code: 'BD', name: 'Bangladesh', dialCode: '+880', maxDigits: 10, flag: '🇧🇩' },
];

export default function LoginScreen() {
  const navigation = useNavigation();

  // Extraemos la función login y el estado de carga
  const { login, loading } = useAuthStore(); 

  const [country, setCountry] = useState(COUNTRIES[0]); 
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [countryModalVisible, setCountryModalVisible] = useState(false);

  const handlePhoneChange = (text) => {
    const numeric = text.replace(/[^0-9]/g, '');
    const limited = numeric.slice(0, country.maxDigits);
    setPhone(limited);
  };

  const handleLogin = async () => {
    // Validación básica
    if (phone.length === 0 || password.length === 0) {
      Alert.alert("Campos vacíos", "Por favor ingresa tu número y contraseña");
      return;
    }

    try {
      // IMPORTANTE: Enviamos 'phone' (solo los dígitos) y 'password'.
      // El AuthStore se encarga de agregarle el "@miapp.com"
      await login(phone, password);
      
      // Si el login no lanza error, navegamos al Home
      navigation.replace('Home');
      
    } catch (error) {
      console.log(error);
      // Mensaje de error amigable para el usuario
      Alert.alert("Error de acceso", "El número o la contraseña son incorrectos.");
    }
  };

  const openCountrySelector = () => setCountryModalVisible(true);
  const closeCountrySelector = () => setCountryModalVisible(false);

  const renderCountryItem = ({ item }) => (
    <TouchableOpacity
      style={styles.countryRow}
      onPress={() => {
        setCountry(item);
        setPhone((p) => p.slice(0, item.maxDigits));
        closeCountrySelector();
      }}
    >
      <Text style={styles.countryFlag}>{item.flag}</Text>
      <View style={{ marginLeft: 10 }}>
        <Text style={styles.countryName}>{item.name}</Text>
        <Text style={styles.countryDial}>{item.dialCode}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="chevron-back" size={26} color="#333" />
      </TouchableOpacity>

      <Text style={styles.brand}>Coinpay</Text>
      <Text style={styles.title}>Inicia sesión en tu cuenta</Text>
      <Text style={styles.subtitle}>Ingresa tu número y contraseña para continuar</Text>

      <View style={styles.phoneRow}>
        <TouchableOpacity style={styles.prefixContainer} onPress={openCountrySelector}>
          <Text style={styles.flagText}>{country.flag}</Text>
          <Text style={styles.dialCodeText}>{country.dialCode}</Text>
          <Ionicons name="chevron-down" size={16} color="#555" style={{ marginLeft: 6 }} />
        </TouchableOpacity>

        <TextInput
          style={styles.phoneInput}
          placeholder="Número de celular"
          placeholderTextColor="#9AA6BF"
          keyboardType={Platform.OS === 'ios' ? 'phone-pad' : 'numeric'}
          value={phone}
          onChangeText={handlePhoneChange}
          textContentType="telephoneNumber"
          maxLength={country.maxDigits}
        />
      </View>

      <View style={styles.passwordRow}>
        <TextInput
          style={styles.passwordInput}
          placeholder="Contraseña"
          placeholderTextColor="#9AA6BF"
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={setPassword}
          textContentType="password"
        />
        <TouchableOpacity onPress={() => setShowPassword((s) => !s)} style={styles.eyeBtn}>
          <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={22} color="#555" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={() => {}}>
        <Text style={styles.forgot}>Olvidaste tu contraseña</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.loginButton,
          { backgroundColor: phone.length >= 1 && password.length >= 1 ? '#347AF0' : '#9BB8EC' },
        ]}
        onPress={handleLogin}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={styles.loginText}>Iniciar Sesión</Text>
        )}
      </TouchableOpacity>

      <Modal
        visible={countryModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={closeCountrySelector}
      >
         <TouchableOpacity style={styles.modalOverlay} onPress={closeCountrySelector} activeOpacity={1}>
          <View style={styles.modalInner}>
            <Text style={styles.modalTitle}>Select country</Text>
            <FlatList
              data={COUNTRIES}
              keyExtractor={(item) => item.code}
              renderItem={renderCountryItem}
              ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7FAFF',
    paddingHorizontal: 22,
    justifyContent: 'center',
  },
  backButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 60 : 30,
    left: 18,
    zIndex: 5,
  },
  brand: {
    fontSize: 18,
    fontWeight: '700',
    color: '#347AF0',
    textAlign: 'center',
    marginBottom: 6,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 6,
    color: '#243447',
  },
  subtitle: {
    fontSize: 14,
    color: '#6A7A8A',
    textAlign: 'center',
    marginBottom: 24,
    paddingHorizontal: 12,
  },

  phoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  prefixContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#E6EEF9',
    marginRight: 10,
  },
  flagText: {
    fontSize: 20,
  },
  dialCodeText: {
    marginLeft: 8,
    fontWeight: '600',
    color: '#243447',
  },
  phoneInput: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 14,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E6EEF9',
    color: '#243447',
  },

  passwordRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#E6EEF9',
    marginBottom: 10,
  },
  passwordInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: '#243447',
  },
  eyeBtn: {
    padding: 6,
  },

  forgot: {
    color: '#347AF0',
    textAlign: 'right',
    marginBottom: 18,
    marginTop: 6,
    marginRight: 4,
    fontWeight: '600',
  },

  loginButton: {
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 6,
    shadowColor: '#347AF0',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 4,
  },
  loginText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
  },

  /* Modal styles */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(12, 20, 29, 0.45)',
    justifyContent: 'flex-end',
  },
  modalInner: {
    backgroundColor: '#fff',
    padding: 18,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: '55%',
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
    color: '#243447',
  },
  countryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  countryFlag: {
    fontSize: 22,
  },
  countryName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#243447',
  },
  countryDial: {
    fontSize: 13,
    color: '#6A7A8A',
  },
});