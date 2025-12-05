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
import { useTheme } from "../context/ThemeContext";   // 🔥 IMPORTANTE

export default function PhoneInput({ navigation }) {
  const { isDark } = useTheme(); // 🔥 ACTIVAMOS MODO OSCURO
  const setTelefono = useRegisterStore((s) => s.setTelefono);
  const [phone, setPhone] = useState("");

  const handlePhoneChange = (text) => {
    let onlyNumbers = text.replace(/[^0-9]/g, "");
    if (onlyNumbers.length > 9) {
      onlyNumbers = onlyNumbers.slice(0, 9);
    }
    setPhone(onlyNumbers);
  };

  const isValidPhone = phone.length === 9 && phone.startsWith("9");

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: isDark ? "#000000" : "#FFFFFF" }
      ]}
    >
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

      {/* 🔙 Encabezado */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather
            name="arrow-left"
            size={26}
            color={isDark ? "#FFFFFF" : "#1E1E1E"}
          />
        </TouchableOpacity>
      </View>

      {/* 🧭 Contenido */}
      <View style={styles.mainContent}>
        <Text
          style={[
            styles.title,
            { color: isDark ? "#FFFFFF" : "#1E1E1E" }
          ]}
        >
          Crea una cuenta
        </Text>

        <Text
          style={[
            styles.subtitle,
            { color: isDark ? "#BBBBBB" : "#666" }
          ]}
        >
          Ingresa tu número de celular para verificar tu cuenta.
        </Text>

        {/* 📞 Input */}
        <View
          style={[
            styles.inputContainer,
            {
              borderColor: isDark ? "#444" : "#E0E0E0",
              backgroundColor: isDark ? "#1A1A1A" : "#FFFFFF",
            },
          ]}
        >
          <Text
            style={[
              styles.prefix,
              { color: isDark ? "#FFFFFF" : "#1E1E1E" }
            ]}
          >
            +51
          </Text>

          <TextInput
            style={[
              styles.input,
              { color: isDark ? "#FFFFFF" : "#1E1E1E" }
            ]}
            placeholder="Número de celular"
            placeholderTextColor={isDark ? "#777" : "#999"}
            keyboardType="phone-pad"
            value={phone}
            onChangeText={handlePhoneChange}
          />
        </View>
      </View>

      {/* ✔ Botón */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.button,
            {
              backgroundColor: isValidPhone
                ? "#347AF0"
                : isDark
                ? "#333"
                : "#ccc",
            },
          ]}
          disabled={!isValidPhone}
          onPress={() => {
            if (isValidPhone) {
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
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    marginBottom: 30,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
    borderRadius: 10,
    paddingHorizontal: 15,
    height: 55,
  },
  prefix: {
    fontSize: 16,
    fontWeight: "500",
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
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
