import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { useTheme } from "../context/ThemeContext"; // <-- ⭐ IMPORTANTE

export default function ConfirmPhoneScreen({ navigation }) {
  const [code, setCode] = useState("");

  const { isDark } = useTheme(); // <-- ⭐ TU SISTEMA DE TEMA

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: isDark ? "#121212" : "#FFFFFF" }, // <-- ⭐ CAMBIADO
      ]}
    >

      {/* Botón regresar */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Icon name="arrow-back" size={26} color={isDark ? "#fff" : "#000"} />
      </TouchableOpacity>

      <Text style={[styles.title, { color: isDark ? "#fff" : "#000" }]}>
        Confirm your phone
      </Text>

      <Text style={[styles.subtitle, { color: isDark ? "#bbb" : "#666" }]}>
        We sent a 6-digit code to your number
      </Text>

      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: isDark ? "#1E1E1E" : "#FFF",
            borderColor: isDark ? "#333" : "#CCC",
            color: isDark ? "#FFF" : "#000",
          },
        ]}
        placeholder="Enter code"
        placeholderTextColor={isDark ? "#888" : "#AAA"}
        keyboardType="number-pad"
        value={code}
        onChangeText={setCode}
        maxLength={6}
      />

      <TouchableOpacity
        style={[
          styles.button,
          {
            backgroundColor:
              code.length === 6
                ? "#2E5BFF"
                : isDark
                ? "#444"
                : "#CCC",
          },
        ]}
        disabled={code.length !== 6}
        onPress={() => navigation.navigate("CreatePasscodeScreen")}
      >
        <Text style={styles.buttonText}>Verify Your Number</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: "center" },

  backButton: {
    position: "absolute",
    top: 40,
    left: 20,
  },

  title: { fontSize: 22, fontWeight: "bold", marginBottom: 10 },

  subtitle: { fontSize: 14, marginBottom: 20 },

  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    fontSize: 18,
    letterSpacing: 6,
    textAlign: "center",
    marginBottom: 20,
  },

  button: {
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },

  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});
