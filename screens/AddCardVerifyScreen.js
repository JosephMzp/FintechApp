import React, { useEffect, useState, useRef } from "react";
import { View, Text, TouchableOpacity, TextInput, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/Feather";
import { supabase } from "../supabase/supabase.config";

export default function AddCardVerifyScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState(["", "", "", ""]);
  const inputs = useRef([]);

  // Obtener correo real del usuario logueado
  useEffect(() => {
    const fetchUserEmail = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (!error && data?.user) {
        setEmail(data.user.email); // <-- correo real de Supabase
      }
    };
    fetchUserEmail();
  }, []);

  const handleChange = (value, index) => {
    const digit = value.replace(/\D/g, "").slice(0, 1); // solo números
    const newCode = [...code];
    newCode[index] = digit;
    setCode(newCode);

    // mover al siguiente input
    if (digit && index < 3) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleVerify = () => {
    // No validamos nada, solo navegamos como pediste
    navigation.navigate("CardList");
  };

  return (
    <View style={styles.container}>
      {/* Botón volver */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Icon name="arrow-left" size={26} color="black" />
      </TouchableOpacity>

      <Text style={styles.title}>Verificación</Text>

      <Text style={styles.subtitle}>Ingresa el código de 4 dígitos enviado a:</Text>
      <Text style={styles.emailText}>{email || "Cargando correo..."}</Text>

      {/* Inputs del código */}
      <View style={styles.codeContainer}>
        {code.map((val, i) => (
          <TextInput
            key={i}
            ref={(ref) => (inputs.current[i] = ref)}
            style={styles.codeInput}
            keyboardType="numeric"
            maxLength={1}
            value={val}
            onChangeText={(t) => handleChange(t, i)}
          />
        ))}
      </View>

      {/* Botón verificar */}
      <TouchableOpacity style={styles.verifyButton} onPress={handleVerify}>
        <Text style={styles.verifyText}>Verificar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 70, paddingHorizontal: 24, backgroundColor: "#fff" },
  backButton: { position: "absolute", top: 30, left: 16 },
  title: { fontSize: 26, fontWeight: "700", marginBottom: 6 },
  subtitle: { fontSize: 15, color: "#555", marginBottom: 4 },
  emailText: { fontSize: 17, fontWeight: "700", color: "#111", marginBottom: 28 },
  codeContainer: { flexDirection: "row", justifyContent: "space-between", marginBottom: 30 },
  codeInput: {
    width: 60,
    height: 60,
    borderWidth: 1.5,
    borderColor: "#ccc",
    borderRadius: 12,
    textAlign: "center",
    fontSize: 22,
    fontWeight: "700",
    backgroundColor: "#fafafa",
  },
  verifyButton: {
    backgroundColor: "#3b82f6",
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: "center",
  },
  verifyText: { color: "white", fontWeight: "700", fontSize: 17 },
});
