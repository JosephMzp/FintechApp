import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

export default function VerifyNumberScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Verify your phone number</Text>
      <Text style={styles.subtitle}>Is this correct? +880 1965 89 74 06</Text>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: "#2E5BFF" }]}
        onPress={() => navigation.navigate("ConfirmPhoneScreen")}
      >
        <Text style={styles.buttonText}>Yes</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: "#eee" }]}
        onPress={() => navigation.navigate("SignUp")}
      >
        <Text style={[styles.buttonText, { color: "#333" }]}>No</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 24, backgroundColor: "#fff" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 10 },
  subtitle: { color: "#777", marginBottom: 30 },
  button: {
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 10,
  },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});