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

export default function AddressScreen({ navigation }) {
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
    <View style={styles.container}>

      {/* BOTÓN REGRESAR */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Icon name="arrow-back" size={26} color="#000" />
      </TouchableOpacity>

      <Text style={styles.title}>Dirección domiciliaria</Text>
      <Text style={styles.subtitle}>
        Esta información debe coincidir con tu documento de identidad.
      </Text>

      <Text style={styles.label}>Dirección</Text>
      <TextInput
        style={styles.input}
        value={address}
        onChangeText={setAddress}
        placeholder="Ej. Av. Larco 123"
      />

      <Text style={styles.label}>Ciudad</Text>
      <TextInput
        style={styles.input}
        value={city}
        onChangeText={handleCityChange}
        placeholder="Ej. Lima"
      />

      <Text style={styles.label}>Código Postal</Text>
      <TextInput
        style={styles.input}
        value={postcode}
        onChangeText={handlePostcodeChange}
        placeholder="Ej. 15036"
        keyboardType="numeric"
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
  container: { flex: 1, padding: 25, backgroundColor: "#fff" },
  backButton: { marginBottom: 10 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 10 },
  subtitle: { color: "#666", marginBottom: 20 },
  label: { color: "#555", marginBottom: 5 },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
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
