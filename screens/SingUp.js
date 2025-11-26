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
import { Feather } from "@expo/vector-icons";

export default function SingUp({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* --- Encabezado con flecha de retroceso --- */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate("Onboarding3")}>
          <Feather name="arrow-left" size={26} color="#1E1E1E" />
        </TouchableOpacity>
      </View>

      <View style={styles.mainContent}>
        <Image
          source={require("../assets/Registro.png")}
          style={styles.illustration}
          resizeMode="contain"
        />

        <Text style={styles.title}>Crea tu cuenta</Text>

        <Text style={styles.subtitle}>
          Potente herramienta que te permite enviar, recibir y rastrear fácilmente todas tus transacciones.
        </Text>
      </View>

      {/* --- Contenedor de Botones y Footer --- */}
      <View style={styles.footerContainer}>
        {/* ✅ Botón que lleva a la pantalla PhoneInput */}
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => navigation.navigate("PhoneInput")}
        >
          <Text style={styles.primaryButtonText}>Registrarse</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => navigation.navigate("Login")}
        >
          <Text style={styles.secondaryButtonText}>Iniciar Sesión</Text>
        </TouchableOpacity>

        <Text style={styles.footerText}>
          Al continuar aceptas nuestros
          <Text style={styles.linkText}> Términos de servicio </Text>
          y
          <Text style={styles.linkText}> Política de privacidad</Text>.
        </Text>
      </View>
    </SafeAreaView>
  );
}

// --- Estilos ---
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
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 30,
    marginTop: -50,
  },
  illustration: {
    width: "100%",
    height: 250,
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1E1E1E",
    textAlign: "center",
    marginBottom: 15,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    lineHeight: 24,
  },
  footerContainer: {
    paddingHorizontal: 30,
    paddingBottom: 40,
  },
  primaryButton: {
    backgroundColor: "#347AF0",
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: "center",
    marginBottom: 15,
  },
  primaryButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
  secondaryButton: {
    backgroundColor: "white",
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#347AF0",
  },
  secondaryButtonText: {
    color: "#347AF0",
    fontSize: 18,
    fontWeight: "600",
  },
  footerText: {
    fontSize: 13,
    color: "#888",
    textAlign: "center",
    marginTop: 25,
    lineHeight: 20,
  },
  linkText: {
    color: "#347AF0",
    textDecorationLine: "underline",
  },
});