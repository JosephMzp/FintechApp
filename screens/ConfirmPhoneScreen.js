import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";

export default function ConfirmPhoneScreen({ navigation }) {
  const [code, setCode] = useState("");

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Confirm your phone</Text>
      <Text style={styles.subtitle}>We sent a 6-digit code to your number</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter code"
        keyboardType="number-pad"
        value={code}
        onChangeText={setCode}
        maxLength={6}
      />

      <TouchableOpacity
        style={[
          styles.button,
          { backgroundColor: code.length === 6 ? "#2E5BFF" : "#ccc" },
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
  container: { flex: 1, justifyContent: "center", padding: 24, backgroundColor: "#fff" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 10 },
  subtitle: { color: "#777", marginBottom: 20 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
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