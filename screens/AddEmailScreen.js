import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useRegisterStore } from "../store/RegistroStore";
import Icon from "react-native-vector-icons/Ionicons";

export default function AddEmailScreen({ navigation }) {
  const setEmail = useRegisterStore((s) => s.setEmail);
  const [emailLocal, setEmailLocal] = useState("");
  const [error, setError] = useState("");

  const validarCorreo = (input) => {
    setEmailLocal(input);

    const regex = /^[\w.-]+@(gmail|hotmail)\.com$/i;

    if (!regex.test(input)) {
      setError("Correo inválido. Solo se permiten Gmail o Hotmail.");
    } else {
      setError("");
    }
  };

  return (
    <View style={styles.container}>
      {/* BOTÓN REGRESAR */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Icon name="arrow-back" size={24} color="#000" />
      </TouchableOpacity>

      <Text style={styles.title}>Agrega tu correo</Text>
      <Text style={styles.subtitle}>
        Esta información debe coincidir con tu documento de identidad.
      </Text>

      <Text style={styles.label}>Correo electrónico</Text>

      <TextInput
        style={styles.input}
        placeholder="ejemplo@gmail.com"
        value={emailLocal}
        onChangeText={validarCorreo}
      />

      {/* MENSAJE DE ERROR */}
      {error ? <Text style={styles.error}>{error}</Text> : null}

      <TouchableOpacity
        style={[styles.button, { opacity: emailLocal && !error ? 1 : 0.4 }]}
        disabled={!emailLocal || !!error}
        onPress={() => {
          setEmail(emailLocal);
          navigation.navigate("CountryResidenceScreen");
        }}
      >
        <Text style={styles.buttonText}>Continuar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 25, backgroundColor: "#fff" },
  backButton: { marginBottom: 15 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 10 },
  subtitle: { color: "#666", marginBottom: 25 },
  label: { color: "#555", marginBottom: 5 },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
  },
  error: {
    color: "red",
    marginBottom: 15,
    fontSize: 14,
  },
  button: {
    backgroundColor: "#347AF0",
    padding: 15,
    borderRadius: 30,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: { color: "#fff", fontWeight: "600", fontSize: 16 },
});
