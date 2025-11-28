import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

export default function AddCardVerifyScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your card was successfully added</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("CardList")}
      >
        <Text style={styles.buttonText}>Continue</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { 
    fontSize: 22, 
    fontWeight: "700", 
    marginBottom: 20, 
    textAlign: "center",
    paddingHorizontal: 20
  },
  button: { 
    backgroundColor: "#3b82f6", 
    padding: 16, 
    borderRadius: 12, 
    width: "70%",
    marginTop: 20,
  },
  buttonText: { 
    textAlign: "center", 
    color: "white", 
    fontWeight: "700", 
    fontSize: 16 
  },
});
