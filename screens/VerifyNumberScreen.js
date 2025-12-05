import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useTheme } from "../context/ThemeContext";

export default function VerifyNumberScreen({ navigation }) {
  const { isDark } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: isDark ? "#121212" : "#fff" }]}>
      <Text style={[styles.title, { color: isDark ? "#fff" : "#000" }]}>
        Verifica tu número de teléfono
      </Text>
      <Text style={[styles.subtitle, { color: isDark ? "#aaa" : "#777" }]}>
        ¿Es correcto? +51 965 89 74 06
      </Text>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: "#2E5BFF" }]}
        onPress={() => navigation.navigate("ConfirmPhoneScreen")}
      >
        <Text style={styles.buttonText}>Sí</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: isDark ? "#333" : "#eee" }]}
        onPress={() => navigation.navigate("SignUp")}
      >
        <Text style={[styles.buttonText, { color: isDark ? "#fff" : "#333" }]}>No</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 24 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 10 },
  subtitle: { marginBottom: 30, fontSize: 16 },
  button: {
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 10,
  },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});
