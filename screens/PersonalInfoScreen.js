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

export default function PersonalInfoScreen({ navigation }) {
  const {
    setNombre: saveNombre,
    setApellido: saveApellido,
    setNacimiento: saveNacimiento,
  } = useRegisterStore();

  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  
  // Inicializamos en null
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
    // MODIFICADO: Solo validamos nombre y apellido para pruebas
    if (!nombre.trim() || !apellido.trim()) {
      Alert.alert("Faltan datos", "Por favor completa tu nombre y apellido.");
      return;
    }

    saveNombre(nombre);
    saveApellido(apellido);
    
    // MODIFICADO: Forzamos NULL para evitar errores con el calendario en Web
    saveNacimiento(null); 

    navigation.navigate("AddressScreen");
  };

  return (
    <View style={styles.container}>
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

      {/* El botón del calendario sigue ahí visualmente, pero no es obligatorio usarlo */}
      <TouchableOpacity style={styles.dateInput} onPress={showDatePicker}>
        <Text style={[styles.dateText, !fechaNacimiento && { color: "#aaa" }]}>
          {fechaNacimiento ? fechaNacimiento : "Seleccione fecha (Opcional en pruebas)"}
        </Text>
      </TouchableOpacity>

      {/* En Web esto no se abrirá correctamente, pero ya no bloquea el flujo */}
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
          // MODIFICADO: La opacidad solo depende de nombre y apellido
          { opacity: (nombre && apellido) ? 1 : 0.5 }
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
    justifyContent: "center",
    backgroundColor: "#fff",
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
    justifyContent: "center",
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