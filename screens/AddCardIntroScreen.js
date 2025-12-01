import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import Icon from "react-native-vector-icons/Feather";

export default function AddCardIntroScreen({ navigation }) {
  return (
    <View style={styles.container}>

      {/* Botón volver */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Icon name="arrow-left" size={26} color="#3b82f6" />
      </TouchableOpacity>

      <Image
        style={styles.image}
        resizeMode="contain"
        source={require("../assets/addcard.png")}
      />

      <Text style={styles.title}>Añadamos tu tarjeta</Text>

      <Text style={styles.subtitle}>
        Organiza tus pagos fácilmente y disfruta una experiencia moderna y segura.
      </Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("AddCardForm")}
      >
        <Text style={styles.buttonText}>Registrar tarjeta</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  backButton: { position: "absolute", top: 20, left: 15 },
  image: { width: 250, height: 250 },
  title: { fontSize: 26, fontWeight: "800", marginTop: 20, textAlign: "center" },
  subtitle: { fontSize: 16, marginTop: 10, textAlign: "center", color: "#555", width: "90%" },
  button: {
    backgroundColor: "#3b82f6",
    padding: 15,
    borderRadius: 12,
    width: "80%",
    marginTop: 30,
  },
  buttonText: { textAlign: "center", color: "#fff", fontWeight: "800", fontSize: 17 },
});
