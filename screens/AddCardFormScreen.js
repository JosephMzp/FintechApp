import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { supabase } from "../supabase/supabase.config";
import Icon from "react-native-vector-icons/Feather";

export default function AddCardFormScreen({ navigation }) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");

  const formatCardNumber = (value) => {
    const numbers = value.replace(/\D/g, "").slice(0, 16);
    const formatted = numbers.replace(/(.{4})/g, "$1-").replace(/-$/, "");
    setCardNumber(formatted);
  };

  const formatExpiry = (value) => {
    const sanitized = value.replace(/\D/g, "").slice(0, 4);
    const formatted = sanitized.replace(/(\d{2})(\d{0,2})/, "$1/$2");
    setExpiry(formatted);
  };

  const formatCVV = (value) => {
    const sanitized = value.replace(/\D/g, "").slice(0, 4);
    setCvv(sanitized);
  };

  return (
    <View style={styles.container}>

      {/* Botón volver */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Icon name="arrow-left" size={26} color="#3b82f6" />
      </TouchableOpacity>

      <Text style={styles.title}>Registrar Tarjeta</Text>

      <TextInput
        style={styles.input}
        placeholder="Nombre"
        value={firstName}
        onChangeText={setFirstName}
      />

      <TextInput
        style={styles.input}
        placeholder="Apellidos"
        value={lastName}
        onChangeText={setLastName}
      />

      <TextInput
        style={styles.input}
        placeholder="Número de tarjeta"
        value={cardNumber}
        onChangeText={formatCardNumber}
        keyboardType="numeric"
        maxLength={19} // xxxx-xxxx-xxxx-xxxx
      />

      <TextInput
        style={styles.input}
        placeholder="MM/AA"
        value={expiry}
        onChangeText={formatExpiry}
        keyboardType="numeric"
        maxLength={5}
      />

      <TextInput
        style={styles.input}
        placeholder="CVV"
        value={cvv}
        onChangeText={formatCVV}
        keyboardType="numeric"
        secureTextEntry
        maxLength={4}
      />

      {/* botón verificar */}
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("AddCardVerify")}>
        <Text style={styles.buttonText}>Verificar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: "center" },
  backButton: { position: "absolute", top: 20, left: 15 },
  title: { fontSize: 26, fontWeight: "800", marginBottom: 25, textAlign: "center" },
  input: {
    padding: 15,
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: "#fff"
  },
  button: {
    backgroundColor: "#3b82f6",
    padding: 15,
    borderRadius: 12,
    marginTop: 10,
  },
  buttonText: { color: "#fff", textAlign: "center", fontWeight: "800", fontSize: 17 },
});
