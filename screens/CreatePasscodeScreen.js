import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useRegisterStore } from "../store/RegistroStore";
import Icon from "react-native-vector-icons/Ionicons";

export default function CreatePasscodeScreen({ navigation }) {
  const setPassword = useRegisterStore((s) => s.setPassword);
  const [pin, setPin] = useState("");

  const handleNumberPress = (num) => {
    if (pin.length < 6) setPin(pin + num);
  };

  const handleDelete = () => {
    setPin(pin.slice(0, -1));
  };

  return (
    <View style={styles.container}>

      {/* BOTÓN PARA REGRESAR */}
      <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
        <Icon name="arrow-back" size={28} color="#000" />
      </TouchableOpacity>

      <Text style={styles.title}>Crear código de acceso</Text>
      <Text style={styles.subtitle}>
        Esta información debe coincidir con tu documento de identidad.
      </Text>

      <View style={styles.pinContainer}>
        {Array(6)
          .fill(0)
          .map((_, i) => (
            <View
              key={i}
              style={[
                styles.dot,
                { backgroundColor: pin.length > i ? "#2E5BFF" : "#ccc" },
              ]}
            />
          ))}
      </View>

      <View style={styles.keypad}>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, "", 0, "←"].map((num, i) => (
          <TouchableOpacity
            key={i}
            style={styles.key}
            onPress={() => {
              if (num === "←") handleDelete();
              else if (num !== "") handleNumberPress(num.toString());
            }}
          >
            <Text style={styles.keyText}>{num}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {pin.length === 6 && (
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            setPassword(pin);
            navigation.navigate("AddEmailScreen");
          }}
        >
          <Text style={styles.buttonText}>Continuar</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
    backgroundColor: "#fff",
  },
  backBtn: {
    position: "absolute",
    top: 50,
    left: 20,
  },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 10, textAlign: "center" },
  subtitle: { color: "#777", marginBottom: 30, textAlign: "center" },
  pinContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 30,
  },
  dot: {
    width: 15,
    height: 15,
    borderRadius: 10,
    marginHorizontal: 10,
  },
  keypad: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  key: {
    width: 80,
    height: 80,
    alignItems: "center",
    justifyContent: "center",
  },
  keyText: { fontSize: 24, color: "#333" },
  button: {
    backgroundColor: "#2E5BFF",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});
