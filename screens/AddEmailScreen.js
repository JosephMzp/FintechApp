import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useRegisterStore } from "../store/RegistroStore";

export default function AddEmailScreen({ navigation }) {
  const setEmail = useRegisterStore((s) => s.setEmail);
  const [email, setEmailLocal] = useState("");

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add your email</Text>
      <Text style={styles.subtitle}>
        This info needs to be accurate with your ID document.
      </Text>

      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        placeholder="name@example.com"
        value={email}
        onChangeText={setEmailLocal}
      />

      <TouchableOpacity
        style={[styles.button, { opacity: email ? 1 : 0.4 }]}
        disabled={!email}
        onPress={() => {
          setEmail(email);
          navigation.navigate("CountryResidenceScreen");
        }}
      >
        <Text style={styles.buttonText}>Continue</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 25, backgroundColor: "#fff" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 10 },
  subtitle: { color: "#666", marginBottom: 25 },
  label: { color: "#555", marginBottom: 5 },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 12,
    marginBottom: 25,
  },
  button: {
    backgroundColor: "#347AF0",
    padding: 15,
    borderRadius: 30,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontWeight: "600", fontSize: 16 },
});
