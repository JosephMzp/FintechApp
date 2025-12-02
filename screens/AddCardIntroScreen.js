import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";

export default function AddCardIntroScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Image
        style={styles.image}
        resizeMode="contain"
        source={require("../assets/addcard.png")}
      />
      <Text style={styles.title}>Let's add your card</Text>
      <Text style={styles.subtitle}>
        Experience the convenience of payment organization with our platform.
      </Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("AddCardForm")}
      >
        <Text style={styles.buttonText}>Add your card</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  image: { width: 250, height: 250 },
  title: { fontSize: 24, fontWeight: "700", marginTop: 20, textAlign: "center" },
  subtitle: { fontSize: 16, marginTop: 10, textAlign: "center", color: "#666" },
  button: {
    backgroundColor: "#3b82f6",
    padding: 15,
    borderRadius: 12,
    width: "80%",
    marginTop: 30,
  },
  buttonText: { textAlign: "center", color: "#fff", fontWeight: "700", fontSize: 16 },
});