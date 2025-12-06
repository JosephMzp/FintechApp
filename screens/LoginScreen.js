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
  ActivityIndicator,
  SafeAreaView // Importamos SafeAreaView para manejar mejor los márgenes
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useAuthStore } from '../store/AuthStore';
import { useTheme } from '../context/ThemeContext';

const COUNTRIES = [
  { code: 'PE', name: 'Perú', dialCode: '+51', maxDigits: 9, flag: '🇵🇪' },
  { code: 'US', name: 'United States', dialCode: '+1', maxDigits: 10, flag: '🇺🇸' },
  { code: 'ES', name: 'España', dialCode: '+34', maxDigits: 9, flag: '🇪🇸' },
  { code: 'BD', name: 'Bangladesh', dialCode: '+880', maxDigits: 10, flag: '🇧🇩' },
];

export default function LoginScreen() {
  const navigation = useNavigation();
  const { login, loading } = useAuthStore();
  const { isDark } = useTheme();

  const [country, setCountry] = useState(COUNTRIES[0]); 
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [countryModalVisible, setCountryModalVisible] = useState(false);
  const [loginError, setLoginError] = useState(false);

  const handlePhoneChange = (text) => {
    const numeric = text.replace(/[^0-9]/g, '');
    const limited = numeric.slice(0, country.maxDigits);
    setPhone(limited);
    setLoginError(false);
  };

  const handleLogin = async () => {
    if (phone.length === 0 || password.length === 0) {
      setLoginError(true);
      return;
    }

    try {
      await login(phone, password);
      navigation.replace('Home');
    } catch (error) {
      setLoginError(true);
    }
  };

  const bgColor = isDark ? '#000000' : '#F7FAFF';
  const textColor = isDark ? '#FFFFFF' : '#243447';
  const subTextColor = isDark ? '#CCCCCC' : '#6A7A8A';
  const inputBg = isDark ? '#1E1E1E' : '#FFFFFF';
  const inputText = isDark ? '#FFFFFF' : '#243447';
  const borderColor = isDark ? '#333' : '#E6EEF9';

  return (
    // Usamos SafeAreaView para asegurar que el contenido no se solape con la barra de estado
    <SafeAreaView style={{ flex: 1, backgroundColor: bgColor }}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* Botón de retroceso ajustado */}
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate("SingUp")}>
          <Ionicons name="chevron-back" size={26} color={isDark ? '#FFFFFF' : '#333'} />
        </TouchableOpacity>

        <View style={styles.content}>
            <Text style={[styles.brand, { color: '#347AF0' }]}>Coinpay</Text>
            <Text style={[styles.title, { color: textColor }]}>Inicia sesión en tu cuenta</Text>
            <Text style={[styles.subtitle, { color: subTextColor }]}>
                Ingresa tu número y contraseña para continuar
            </Text>

            {/* Número */}
            <View style={styles.phoneRow}>
                <TouchableOpacity
                style={[styles.prefixContainer, { backgroundColor: inputBg, borderColor }]}
                onPress={() => setCountryModalVisible(true)}
                >
                <Text style={[styles.flagText, { color: inputText }]}>{country.flag}</Text>
                <Text style={[styles.dialCodeText, { color: inputText }]}>{country.dialCode}</Text>
                <Ionicons name="chevron-down" size={16} color={inputText} style={{ marginLeft: 6 }} />
                </TouchableOpacity>

                <TextInput
                style={[styles.phoneInput, { backgroundColor: inputBg, color: inputText, borderColor }]}
                placeholder="Número de celular"
                placeholderTextColor={subTextColor}
                keyboardType={Platform.OS === 'ios' ? 'phone-pad' : 'numeric'}
                value={phone}
                onChangeText={handlePhoneChange}
                textContentType="telephoneNumber"
                maxLength={country.maxDigits}
                />
            </View>

            {/* Contraseña */}
            <View style={[styles.passwordRow, { backgroundColor: inputBg, borderColor }]}>
                <TextInput
                style={[styles.passwordInput, { color: inputText }]}
                placeholder="Contraseña"
                placeholderTextColor={subTextColor}
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={(t) => { setPassword(t); setLoginError(false); }}
                textContentType="password"
                />
                <TouchableOpacity onPress={() => setShowPassword((s) => !s)} style={styles.eyeBtn}>
                <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={22} color={inputText} />
                </TouchableOpacity>
            </View>

            {loginError && (
                <Text style={styles.errorText}>Contraseña incorrecta</Text>
            )}

            <TouchableOpacity onPress={() => {}}>
                <Text style={[styles.forgot, { color: '#347AF0' }]}>Olvidaste tu contraseña</Text>
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
        </View>

        {/* Modal Países */}
        <Modal
          visible={countryModalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setCountryModalVisible(false)}
        >
          <TouchableOpacity style={styles.modalOverlay} onPress={() => setCountryModalVisible(false)} activeOpacity={1}>
            <View style={[styles.modalInner, { backgroundColor: bgColor }]}>
              <Text style={[styles.modalTitle, { color: textColor }]}>Select country</Text>
              <FlatList
                data={COUNTRIES}
                keyExtractor={(item) => item.code}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.countryRow}
                    onPress={() => {
                      setCountry(item);
                      setPhone((p) => p.slice(0, item.maxDigits));
                      setCountryModalVisible(false);
                    }}
                  >
                    <Text style={[styles.countryFlag, { color: inputText }]}>{item.flag}</Text>
                    <View style={{ marginLeft: 10 }}>
                      <Text style={[styles.countryName, { color: inputText }]}>{item.name}</Text>
                      <Text style={[styles.countryDial, { color: subTextColor }]}>{item.dialCode}</Text>
                    </View>
                  </TouchableOpacity>
                )}
                ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
              />
            </View>
          </TouchableOpacity>
        </Modal>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  // Botón de retroceso ajustado: ya no es absolute top:60, sino relativo con margen
  backButton: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    alignSelf: 'flex-start', // Para que no ocupe todo el ancho
    marginTop: 10, // Margen superior adicional
  },
  content: {
    flex: 1,
    paddingHorizontal: 22,
    justifyContent: 'center', // Centra el contenido verticalmente
    marginTop: -50, // Pequeño ajuste para subir visualmente el formulario
  },
  brand: { fontSize: 18, fontWeight: '700', textAlign: 'center', marginBottom: 6 },
  title: { fontSize: 22, fontWeight: '700', textAlign: 'center', marginBottom: 6 },
  subtitle: { fontSize: 14, textAlign: 'center', marginBottom: 24, paddingHorizontal: 12 },

  phoneRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  prefixContainer: { flexDirection: 'row', alignItems: 'center', borderRadius: 10, paddingVertical: 12, paddingHorizontal: 10, borderWidth: 1, marginRight: 10 },
  flagText: { fontSize: 20 },
  dialCodeText: { marginLeft: 8, fontWeight: '600' },
  phoneInput: { flex: 1, borderRadius: 10, paddingVertical: 12, paddingHorizontal: 14, fontSize: 16, borderWidth: 1 },

  passwordRow: { flexDirection: 'row', alignItems: 'center', borderRadius: 10, paddingHorizontal: 12, borderWidth: 1, marginBottom: 6 },
  passwordInput: { flex: 1, paddingVertical: 12, fontSize: 16 },
  eyeBtn: { padding: 6 },

  errorText: { color: '#E53935', fontSize: 13, marginBottom: 12, marginLeft: 4, fontWeight: '600' },
  forgot: { textAlign: 'right', marginBottom: 18, marginTop: 6, marginRight: 4, fontWeight: '600' },

  loginButton: { paddingVertical: 15, borderRadius: 12, alignItems: 'center', marginTop: 6, shadowColor: '#347AF0', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.12, shadowRadius: 10, elevation: 4 },
  loginText: { color: 'white', fontSize: 16, fontWeight: '700' },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(12, 20, 29, 0.45)', justifyContent: 'flex-end' },
  modalInner: { padding: 18, borderTopLeftRadius: 16, borderTopRightRadius: 16, maxHeight: '55%' },
  modalTitle: { fontSize: 16, fontWeight: '700', marginBottom: 12 },
  countryRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10 },
  countryFlag: { fontSize: 22 },
  countryName: { fontSize: 15, fontWeight: '600' },
  countryDial: { fontSize: 13 },
});