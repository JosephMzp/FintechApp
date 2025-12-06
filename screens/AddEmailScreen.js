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

// ⭐ CAMBIO PARA MODO OSCURO
import { useTheme } from "../context/ThemeContext";

export default function AddEmailScreen({ navigation }) {
  // ⭐ MODO OSCURO
  const { isDark } = useTheme();

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
    <View
      style={[
        styles.container,
        {
          // ⭐ CAMBIO PARA MODO OSCURO
          backgroundColor: isDark ? "#121212" : "#FFFFFF",
        },
      ]}
    >
      {/* BOTÓN REGRESAR */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Icon
          name="arrow-back"
          size={24}
          color={isDark ? "#fff" : "#000"} // ⭐ CAMBIO PARA MODO OSCURO
        />
      </TouchableOpacity>

      <Text
        style={[
          styles.title,
          { color: isDark ? "#fff" : "#000" }, // ⭐
        ]}
      >
        Agrega tu correo
      </Text>

      <Text
        style={[
          styles.subtitle,
          { color: isDark ? "#bbb" : "#666" }, // ⭐
        ]}
      >
        Esta información debe coincidir con tu documento de identidad.
      </Text>

      <Text
        style={[
          styles.label,
          { color: isDark ? "#ccc" : "#555" }, // ⭐
        ]}
      >
        Correo electrónico
      </Text>

      <TextInput
        style={[
          styles.input,
          {
            // ⭐ CAMBIO PARA MODO OSCURO
            backgroundColor: isDark ? "#1E1E1E" : "#fff",
            borderColor: isDark ? "#444" : "#ddd",
            color: isDark ? "#fff" : "#000",
          },
        ]}
        placeholder="ejemplo@gmail.com"
        placeholderTextColor={isDark ? "#888" : "#999"} // ⭐
        value={emailLocal}
        onChangeText={validarCorreo}
      />

      {/* MENSAJE DE ERROR */}
      {error ? (
        <Text style={[styles.error, { color: "#ff6b6b" }]}>{error}</Text>
      ) : null}

      <TouchableOpacity
        style={[
          styles.button,
          {
            backgroundColor: isDark ? "#347AF0" : "#347AF0", 
            opacity: emailLocal && !error ? 1 : 0.4,
          },
        ]}
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
  container: { flex: 1, padding: 25 },
  backButton: { marginBottom: 15 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 10 },
  subtitle: { marginBottom: 25 },
  label: { marginBottom: 5 },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
  },
  error: {
    marginBottom: 15,
    fontSize: 14,
  },
  button: {
    padding: 15,
    borderRadius: 30,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: { color: "#fff", fontWeight: "600", fontSize: 16 },
});
