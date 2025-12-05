import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../context/ThemeContext";   // ⭐ NUEVO

export default function AddCardIntroScreen({ navigation }) {

  const { isDark } = useTheme(); // ⭐ NUEVO

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: isDark ? "#121212" : "#FFFFFF" } // ⭐ NUEVO
      ]}
    >

      {/* 🔙 Botón para regresar */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons
          name="chevron-back"
          size={28}
          color={isDark ? "#FFF" : "#000"} // ⭐ NUEVO
        />
      </TouchableOpacity>

      <Image
        style={styles.image}
        resizeMode="contain"
        source={require("../assets/addcard.png")}
      />

      <Text
        style={[
          styles.title,
          { color: isDark ? "#FFF" : "#000" } // ⭐ NUEVO
        ]}
      >
        Agrega tu tarjeta
      </Text>

      <Text
        style={[
          styles.subtitle,
          { color: isDark ? "#CCC" : "#666" } // ⭐ NUEVO
        ]}
      >
        Disfruta de la comodidad de organizar tus pagos con nuestra plataforma.
      </Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("AddCardForm")}
      >
        <Text style={styles.buttonText}>Agregar tarjeta</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: "center", 
    alignItems: "center", 
    padding: 20,
  },

  backButton: {
    position: "absolute",
    top: 45,
    left: 20,
    zIndex: 10,
  },

  image: { width: 250, height: 250 },

  title: { 
    fontSize: 24, 
    fontWeight: "700", 
    marginTop: 20, 
    textAlign: "center"
  },

  subtitle: { 
    fontSize: 16, 
    marginTop: 10, 
    textAlign: "center"
  },

  button: {
    backgroundColor: "#3b82f6",
    padding: 15,
    borderRadius: 12,
    width: "80%",
    marginTop: 30,
  },

  buttonText: { 
    textAlign: "center", 
    color: "#fff", 
    fontWeight: "700", 
    fontSize: 16 
  },
});
