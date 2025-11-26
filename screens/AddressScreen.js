import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert, // Importamos Alert para mostrar errores
  ActivityIndicator // Importamos para feedback visual
} from "react-native";
import { useRegisterStore } from "../store/RegistroStore";
import { useUsuariosStore } from "../store/UsuarioStore";

export default function AddressScreen({ navigation }) {
  // Estados locales donde se guarda lo que escribe el usuario
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [postcode, setPostcode] = useState("");
  const [loading, setLoading] = useState(false); // Estado para bloquear el botón mientras carga

  const canContinue = address && city && postcode;

  // Obtenemos los datos previos del Store
  const {
    telefono,
    password,
    email,
    pais,
    nombre,
    apellido,
    nacimiento,
    reset,
  } = useRegisterStore();

  const registrarUsuario = useUsuariosStore((s) => s.registrarUsuario);

  const handleFinish = async () => {
    if (loading) return;
    setLoading(true);

    // Llamamos a la función pasando los datos del estado local (address, city, postcode)
    // junto con los datos acumulados del store.
    const user = await registrarUsuario({
      telefono,
      password,
      correo: email,
      pais,
      nombre: `${nombre} ${apellido}`,
      nacimiento,
      direccion: address,      // CORRECCIÓN: Usar variable local
      ciudad: city,            // CORRECCIÓN: Usar variable local
      codigo_postal: postcode, // CORRECCIÓN: Usar variable local
    });

    setLoading(false);

    if (user) {
      reset(); // Limpiamos el store
      navigation.replace("Home"); // Navegamos solo si hubo éxito
    } else {
      Alert.alert("Error", "No se pudo registrar el usuario. Verifica tu conexión o datos.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Home address</Text>
      <Text style={styles.subtitle}>
        This info needs to be accurate with your ID document.
      </Text>

      <Text style={styles.label}>Address Line</Text>
      <TextInput
        style={styles.input}
        value={address}
        onChangeText={setAddress}
        placeholder="Ej. Av. Larco 123"
      />

      <Text style={styles.label}>City</Text>
      <TextInput 
        style={styles.input} 
        value={city} 
        onChangeText={setCity} 
        placeholder="Ej. Lima"
      />

      <Text style={styles.label}>Postcode</Text>
      <TextInput
        style={styles.input}
        value={postcode}
        onChangeText={setPostcode}
        placeholder="Ej. 15036"
        keyboardType="numeric"
      />

      <TouchableOpacity
        style={[styles.button, { opacity: canContinue ? 1 : 0.4 }]}
        disabled={!canContinue || loading}
        onPress={handleFinish} // CORRECCIÓN: Solo llamamos a handleFinish
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Continue</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 25, backgroundColor: "#fff" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 10 },
  subtitle: { color: "#666", marginBottom: 20 },
  label: { color: "#555", marginBottom: 5 },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 12,
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#347AF0",
    padding: 15,
    borderRadius: 30,
    alignItems: "center",
    marginTop: 10
  },
  buttonText: { color: "#fff", fontWeight: "600", fontSize: 16 },
});