import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { useRegisterStore } from "../store/RegistroStore";
import { Ionicons } from "@expo/vector-icons"; 
import { useTheme } from "../context/ThemeContext"; // 🌙 Integración Modo Oscuro

export default function PersonalInfoScreen({ navigation }) {
  const { isDark } = useTheme(); // 🌙

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
    // Formato simple YYYY-MM-DD
    const fechaFormateada = date.toISOString().split("T")[0];
    setFechaNacimiento(fechaFormateada);
    hideDatePicker();
  };

  const handleContinue = () => {
    // 1. Validar que todos los campos, incluida la fecha, estén llenos
    if (!nombre.trim() || !apellido.trim() || !fechaNacimiento) {
      Alert.alert("Faltan datos", "Por favor completa nombre, apellido y fecha de nacimiento.");
      return;
    }

    // 2. Guardar los datos reales en el store
    saveNombre(nombre);
    saveApellido(apellido);
    saveNacimiento(fechaNacimiento); // ✅ Ahora sí guardamos la fecha

    navigation.navigate("AddressScreen");
  };

  // Estilos dinámicos para modo oscuro
  const dynamicStyles = {
    container: { backgroundColor: isDark ? "#121212" : "#fff" },
    text: { color: isDark ? "#fff" : "#333" },
    input: {
      backgroundColor: isDark ? "#1E1E1E" : "#fff",
      color: isDark ? "#fff" : "#333",
      borderColor: isDark ? "#444" : "#ccc",
    },
    dateInput: {
      backgroundColor: isDark ? "#1E1E1E" : "#f9f9f9",
      borderColor: isDark ? "#444" : "#ccc",
    },
    placeholder: isDark ? "#888" : "#999"
  };

  return (
    <View style={[styles.container, dynamicStyles.container]}>

      {/* 🔙 FLECHA PARA RETROCEDER */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="chevron-back" size={28} color={isDark ? "#fff" : "#333"} />
      </TouchableOpacity>

      <Text style={[styles.title, dynamicStyles.text]}>Información Personal</Text>

      <TextInput
        style={[styles.input, dynamicStyles.input]}
        placeholder="Nombre"
        placeholderTextColor={dynamicStyles.placeholder}
        value={nombre}
        onChangeText={setNombre}
      />

      <TextInput
        style={[styles.input, dynamicStyles.input]}
        placeholder="Apellido"
        placeholderTextColor={dynamicStyles.placeholder}
        value={apellido}
        onChangeText={setApellido}
      />

      {/* Selector de Fecha */}
      <TouchableOpacity 
        style={[styles.dateInput, dynamicStyles.dateInput]} 
        onPress={showDatePicker}
      >
        <Text style={[
            styles.dateText, 
            { color: fechaNacimiento ? (isDark ? "#fff" : "#333") : "#aaa" }
        ]}>
          {fechaNacimiento ? fechaNacimiento : "Seleccione fecha de nacimiento"}
        </Text>
      </TouchableOpacity>

      {/* Modal del Calendario (Nativo) */}
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
        maximumDate={new Date()} // No permitir fechas futuras
      />

      <TouchableOpacity
        style={[
          styles.button,
          { opacity: (nombre && apellido && fechaNacimiento) ? 1 : 0.5 },
        ]}
        onPress={handleContinue}
      >
        <Text style={styles.buttonText}>Continuar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 45,
  },
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
  },
  input: {
    width: "100%",
    padding: 14,
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 15,
    fontSize: 16,
  },
  dateInput: {
    width: "100%",
    padding: 14,
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 25,
    justifyContent: 'center',
  },
  dateText: {
    fontSize: 16,
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