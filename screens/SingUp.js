import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Image,
} from "react-native";
import { useTheme } from "../context/ThemeContext";

export default function SingUp({ navigation }) {
  const { isDark } = useTheme();

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: isDark ? "#000000" : "#FFFFFF" }]}
    >
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

      <View style={styles.mainContent}>
        <Image
          source={require("../assets/Registro.png")}
          style={styles.illustration}
          resizeMode="contain"
        />

        <Text style={[styles.title, { color: isDark ? "#FFFFFF" : "#1E1E1E" }]}>
          Crea tu cuenta
        </Text>

        <Text style={[styles.subtitle, { color: isDark ? "#CCCCCC" : "#666" }]}>
          Potente herramienta que te permite enviar, recibir y rastrear fácilmente todas tus transacciones.
        </Text>
      </View>

      <View style={styles.footerContainer}>
        <TouchableOpacity
          style={[
            styles.primaryButton,
            { backgroundColor: isDark ? "#347AF0" : "#347AF0" },
          ]}
          onPress={() => navigation.navigate("PhoneInput")}
        >
          <Text style={styles.primaryButtonText}>Registrarse</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.secondaryButton,
            { backgroundColor: isDark ? "#1E1E1E" : "#FFFFFF" },
          ]}
          onPress={() => navigation.navigate("Login")}
        >
          <Text
            style={[
              styles.secondaryButtonText,
              { color: isDark ? "#347AF0" : "#347AF0" },
            ]}
          >
            Iniciar Sesión
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.backButton,
            { backgroundColor: isDark ? "#333333" : "#E5E5E5" },
          ]}
          onPress={() => navigation.goBack()}
        >
          <Text
            style={[styles.backButtonText, { color: isDark ? "#FFFFFF" : "#333" }]}
          >
            Volver atrás
          </Text>
        </TouchableOpacity>

        <Text style={[styles.footerText, { color: isDark ? "#AAAAAA" : "#888" }]}>
          Al continuar aceptas nuestros
          <Text style={styles.linkText}> Términos de servicio </Text>
          y
          <Text style={styles.linkText}> Política de privacidad</Text>.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  mainContent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 30,
    marginTop: -50,
  },
  illustration: { width: "100%", height: 250, marginBottom: 40 },
  title: { fontSize: 28, fontWeight: "bold", textAlign: "center", marginBottom: 15 },
  subtitle: { fontSize: 16, textAlign: "center", lineHeight: 24 },
  footerContainer: { paddingHorizontal: 30, paddingBottom: 40 },
  primaryButton: {
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: "center",
    marginBottom: 15,
  },
  primaryButtonText: { color: "white", fontSize: 18, fontWeight: "600" },
  secondaryButton: {
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#347AF0",
    marginBottom: 15,
  },
  secondaryButtonText: { fontSize: 18, fontWeight: "600" },
  backButton: { paddingVertical: 12, borderRadius: 30, alignItems: "center", marginBottom: 20 },
  backButtonText: { fontSize: 16, fontWeight: "600" },
  footerText: { fontSize: 13, textAlign: "center", lineHeight: 20 },
  linkText: { color: "#347AF0", textDecorationLine: "underline" },
});
