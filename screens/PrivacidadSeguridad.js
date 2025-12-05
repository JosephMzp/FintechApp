import React from "react";
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "../context/ThemeContext";   // 🌙 IMPORTANTE

const PrivacidadSeguridad = () => {
  const navigation = useNavigation();
  const { isDark } = useTheme();  // 🌙 ACTIVAR MODO OSCURO

  return (
    <View style={[styles.container, { backgroundColor: isDark ? "#121212" : "#F8F9FD" }]}>

      {/* Header */}
      <View
        style={[
          styles.header,
          { backgroundColor: isDark ? "#1E1E1E" : "#FFFFFF" }
        ]}
      >
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather name="chevron-left" size={28} color={isDark ? "#FFF" : "#333"} />
        </TouchableOpacity>

        <Text style={[styles.headerTitle, { color: isDark ? "#FFF" : "#1A1A1A" }]}>
          Privacidad y Seguridad
        </Text>

        <View style={{ width: 28 }} />
      </View>

      {/* Contenido */}
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { backgroundColor: isDark ? "#121212" : "#F8F9FD" }
        ]}
      >
        <Text style={[styles.sectionTitle, { color: isDark ? "#FFF" : "#333" }]}>
          Términos y Condiciones
        </Text>
        <Text style={[styles.paragraph, { color: isDark ? "#CCC" : "#555" }]}>
          Bienvenido a nuestra aplicación bancaria móvil. El uso de esta
          plataforma implica la aceptación plena de los términos y condiciones
          establecidos en este documento.
        </Text>

        <Text style={[styles.sectionTitle, { color: isDark ? "#FFF" : "#333" }]}>
          1. Protección de Datos
        </Text>
        <Text style={[styles.paragraph, { color: isDark ? "#CCC" : "#555" }]}>
          Toda la información personal proporcionada por el usuario será tratada
          de manera confidencial y utilizada únicamente para fines relacionados
          con la gestión de servicios financieros dentro de la aplicación.
        </Text>

        <Text style={[styles.sectionTitle, { color: isDark ? "#FFF" : "#333" }]}>
          2. Seguridad de la Cuenta
        </Text>
        <Text style={[styles.paragraph, { color: isDark ? "#CCC" : "#555" }]}>
          El usuario es responsable de mantener la seguridad de sus credenciales
          de acceso. La aplicación implementa cifrado de datos y protocolos de
          seguridad para proteger la información almacenada.
        </Text>

        <Text style={[styles.sectionTitle, { color: isDark ? "#FFF" : "#333" }]}>
          3. Uso Aceptable
        </Text>
        <Text style={[styles.paragraph, { color: isDark ? "#CCC" : "#555" }]}>
          El usuario se compromete a utilizar la aplicación de manera legal,
          ética y conforme a las normas establecidas. Cualquier uso indebido o
          intento de fraude será motivo de suspensión definitiva.
        </Text>

        <Text style={[styles.sectionTitle, { color: isDark ? "#FFF" : "#333" }]}>
          4. Responsabilidad
        </Text>
        <Text style={[styles.paragraph, { color: isDark ? "#CCC" : "#555" }]}>
          La empresa no se responsabiliza por pérdidas derivadas del uso
          incorrecto de la cuenta por parte del usuario o por compartir sus datos
          de acceso con terceros.
        </Text>

        <Text style={[styles.sectionTitle, { color: isDark ? "#FFF" : "#333" }]}>
          5. Actualizaciones
        </Text>
        <Text style={[styles.paragraph, { color: isDark ? "#CCC" : "#555" }]}>
          La empresa podrá actualizar estos términos en cualquier momento. Los
          cambios serán notificados dentro de la aplicación.
        </Text>

        <Text style={[styles.sectionTitle, { color: isDark ? "#FFF" : "#333" }]}>
          6. Soporte
        </Text>
        <Text style={[styles.paragraph, { color: isDark ? "#CCC" : "#555" }]}>
          Para consultas sobre privacidad o seguridad, el usuario puede contactar
          al servicio de soporte directamente desde la sección de ayuda.
        </Text>

        <Text style={[styles.footer, { color: isDark ? "#777" : "#999" }]}>
          © 2025 FintechApp – Todos los derechos reservados.
        </Text>
      </ScrollView>

    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 15,
    elevation: 3,
  },
  headerTitle: { fontSize: 18, fontWeight: "bold" },

  content: {
    padding: 20,
    paddingBottom: 40
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 6,
  },
  paragraph: {
    fontSize: 14,
    lineHeight: 20
  },
  footer: {
    textAlign: "center",
    marginTop: 30,
    fontSize: 12,
  }
});

export default PrivacidadSeguridad;
