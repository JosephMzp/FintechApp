import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Platform,
} from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { useRegisterStore } from "../store/RegistroStore";
import { Ionicons } from "@expo/vector-icons"; // <-- IMPORTANTE

export default function PersonalInfoScreen({ navigation }) {
  const {
    setNombre: saveNombre,
    setApellido: saveApellido,
    setNacimiento: saveNacimiento,
  } = useRegisterStore();

  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [fechaNacimiento, setFechaNacimiento] = useState(null);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const showDatePicker = () => setDatePickerVisibility(true);
  const hideDatePicker = () => setDatePickerVisibility(false);

  const handleConfirm = (date) => {
    const fechaFormateada = date.toISOString().split("T")[0];
    setFechaNacimiento(fechaFormateada);
    hideDatePicker();
  };

  const handleContinue = () => {
    if (!nombre.trim() || !apellido.trim()) {
      Alert.alert("Faltan datos", "Por favor completa tu nombre y apellido.");
      return;
    }

    saveNombre(nombre);
    saveApellido(apellido);
    saveNacimiento(null); 

    navigation.navigate("AddressScreen");
  };

  return (
    <View style={styles.container}>

      {/* 🔙 FLECHA PARA RETROCEDER */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="chevron-back" size={28} color="#333" />
      </TouchableOpacity>

      <Text style={styles.title}>Información Personal</Text>

      <TextInput
        style={styles.input}
        placeholder="Nombre"
        value={nombre}
        onChangeText={setNombre}
      />

      <TextInput
        style={styles.input}
        placeholder="Apellido"
        value={apellido}
        onChangeText={setApellido}
      />

      <TouchableOpacity style={styles.dateInput} onPress={showDatePicker}>
        <Text style={[styles.dateText, !fechaNacimiento && { color: "#aaa" }]}>
          {fechaNacimiento ? fechaNacimiento : "Seleccione fecha (Opcional en pruebas)"}
        </Text>
      </TouchableOpacity>

      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
        maximumDate={new Date()}
      />

      <TouchableOpacity
        style={[
          styles.button,
          { opacity: nombre && apellido ? 1 : 0.5 },
        ]}
        onPress={handleContinue}
      >
        <Text style={styles.buttonText}>Continuar (Sin Fecha)</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 45,
    backgroundColor: "#fff",
  },

  /* 🔙 Estilo del botón de regreso */
  backButton: {
    position: "absolute",
    top: 20,
    left: 15,
    padding: 5,
    zIndex: 10,
  },

  title: {
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 30,
    textAlign: "center",
    color: "#333",
  },

  input: {
    width: "100%",
    padding: 14,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 15,
    fontSize: 16,
    color: "#333",
  },
  dateInput: {
    width: "100%",
    padding: 14,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 25,
    backgroundColor: "#f9f9f9",
  },
  dateText: {
    fontSize: 16,
    color: "#333",
  },
  button: {
    backgroundColor: "#347AF0",
    paddingVertical: 15,
    borderRadius: 30,
    marginTop: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    textAlign: "center",
    fontWeight: "600",
  },
});
