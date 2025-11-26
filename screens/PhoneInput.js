import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  TextInput,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useRegisterStore } from "../store/RegistroStore";

export default function PhoneInput({ navigation }) {
  const setTelefono = useRegisterStore((s) => s.setTelefono);
  const [phone, setPhone] = useState("");

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* 🔙 Encabezado */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={26} color="#1E1E1E" />
        </TouchableOpacity>
      </View>

      {/* 🧭 Contenido Principal */}
      <View style={styles.mainContent}>
        <Text style={styles.title}>Crea una cuenta</Text>
        <Text style={styles.subtitle}>
          Ingresa tu número de celular para verificar tu cuenta.
        </Text>

        {/* 📞 Campo de teléfono */}
        <View style={styles.inputContainer}>
          <Text style={styles.prefix}>+51</Text>
          <TextInput
            style={styles.input}
            placeholder="Número de celular"
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
          />
        </View>
      </View>

      {/* ✅ Botón */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.button,
            { backgroundColor: phone.length >= 9 ? "#347AF0" : "#ccc" },
          ]}
          onPress={() => {
            if (phone.length >= 9) {
              setTelefono(phone);
              navigation.navigate("CreatePasscodeScreen");
            }
          }}
        >
          <Text style={styles.buttonText}>Verificar tu número</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    paddingTop: 10,
    paddingHorizontal: 20,
  },
  mainContent: {
    flex: 1,
    paddingHorizontal: 30,
    justifyContent: "center",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#1E1E1E",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: "#666",
    marginBottom: 30,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#E0E0E0",
    borderRadius: 10,
    paddingHorizontal: 15,
    height: 55,
  },
  prefix: {
    fontSize: 16,
    fontWeight: "500",
    color: "#1E1E1E",
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#1E1E1E",
  },
  footer: {
    paddingHorizontal: 30,
    paddingBottom: 40,
  },
  button: {
    height: 55,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "600",
  },
});
