import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator
} from "react-native";
import { useRegisterStore } from "../store/RegistroStore";
import { useUsuariosStore } from "../store/UsuarioStore";
import Icon from "react-native-vector-icons/Ionicons";

// ⭐ CAMBIO PARA MODO OSCURO
import { useTheme } from "../context/ThemeContext";

export default function AddressScreen({ navigation }) {

  // ⭐ MODO OSCURO
  const { isDark } = useTheme();

  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [postcode, setPostcode] = useState("");
  const [loading, setLoading] = useState(false);

  const canContinue = address && city && postcode;

  const {
    telefono,
    password,
    email,
    pais,
    nombre,
    apellido,
    nacimiento,
    reset,
  } = useRegisterStore();

  const registrarUsuario = useUsuariosStore((s) => s.registrarUsuario);

  // SOLO LETRAS Y ESPACIOS EN CIUDAD
  const handleCityChange = (text) => {
    const formatted = text.replace(/[^A-Za-zÁÉÍÓÚÑáéíóúñ ]/g, "");
    setCity(formatted);
  };

  // SOLO NÚMEROS EN CÓDIGO POSTAL
  const handlePostcodeChange = (text) => {
    const formatted = text.replace(/[^0-9]/g, "");
    setPostcode(formatted);
  };

  const handleFinish = async () => {
    if (!canContinue) {
      Alert.alert("Campos incompletos", "Por favor completa todos los campos.");
      return;
    }

    if (postcode.length < 4) {
      Alert.alert("Código inválido", "El código postal debe tener al menos 4 dígitos.");
      return;
    }

    if (loading) return;

    setLoading(true);

    const user = await registrarUsuario({
      telefono,
      password,
      correo: email,
      pais,
      nombre: `${nombre} ${apellido}`,
      nacimiento,
      direccion: address,
      ciudad: city,
      codigo_postal: postcode,
    });

    setLoading(false);

    if (user) {
      reset();
      navigation.replace("Home");
    } else {
      Alert.alert("Error", "No se pudo registrar el usuario. Intenta nuevamente.");
    }
  };

  return (
    <View
      style={[
        styles.container,
        {
          // ⭐ FONDO MODO OSCURO
          backgroundColor: isDark ? "#121212" : "#fff",
        },
      ]}
    >
      {/* BOTÓN REGRESAR */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Icon
          name="arrow-back"
          size={26}
          color={isDark ? "#fff" : "#000"} // ⭐
        />
      </TouchableOpacity>

      <Text style={[styles.title, { color: isDark ? "#fff" : "#000" }]}>
        Dirección domiciliaria
      </Text>

      <Text style={[styles.subtitle, { color: isDark ? "#bbb" : "#666" }]}>
        Esta información debe coincidir con tu documento de identidad.
      </Text>

      <Text style={[styles.label, { color: isDark ? "#ccc" : "#555" }]}>Dirección</Text>
      <TextInput
        style={[
          styles.input,
          {
            // ⭐ INPUT MODO OSCURO
            backgroundColor: isDark ? "#1E1E1E" : "#fff",
            borderColor: isDark ? "#444" : "#ddd",
            color: isDark ? "#fff" : "#000",
          },
        ]}
        value={address}
        onChangeText={setAddress}
        placeholder="Ej. Av. Larco 123"
        placeholderTextColor={isDark ? "#888" : "#999"} // ⭐
      />

      <Text style={[styles.label, { color: isDark ? "#ccc" : "#555" }]}>Ciudad</Text>
      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: isDark ? "#1E1E1E" : "#fff",
            borderColor: isDark ? "#444" : "#ddd",
            color: isDark ? "#fff" : "#000",
          },
        ]}
        value={city}
        onChangeText={handleCityChange}
        placeholder="Ej. Lima"
        placeholderTextColor={isDark ? "#888" : "#999"}
      />

      <Text style={[styles.label, { color: isDark ? "#ccc" : "#555" }]}>Código Postal</Text>
      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: isDark ? "#1E1E1E" : "#fff",
            borderColor: isDark ? "#444" : "#ddd",
            color: isDark ? "#fff" : "#000",
          },
        ]}
        value={postcode}
        onChangeText={handlePostcodeChange}
        placeholder="Ej. 15036"
        keyboardType="numeric"
        placeholderTextColor={isDark ? "#888" : "#999"}
      />

      <TouchableOpacity
        style={[styles.button, { opacity: canContinue ? 1 : 0.4 }]}
        disabled={!canContinue || loading}
        onPress={handleFinish}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Continuar</Text>
        )}
      </TouchableOpacity>
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 25 },
  backButton: { marginBottom: 10 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 10 },
  subtitle: { marginBottom: 20 },
  label: { marginBottom: 5 },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    marginBottom: 20,
    fontSize: 16,
  },
  button: {
    backgroundColor: "#347AF0",
    padding: 15,
    borderRadius: 30,
    alignItems: "center",
    marginTop: 10
  },
  buttonText: { color: "#fff", fontWeight: "600", fontSize: 16 },
});
