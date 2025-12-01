import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from "react-native";
import Icon from "react-native-vector-icons/Feather";
import { useUsuariosStore } from "../store/UsuarioStore";
import { useNavigation } from "@react-navigation/native";

const EditUserInfoScreen = () => {
  const navigation = useNavigation();
  const { usuarioActual, obtenerUsuarioActual, actualizarUsuario } =
    useUsuariosStore();

  const [form, setForm] = useState({
    nombre: "",
    telefono: "",
    direccion: "",
    ciudad: "",
    codigo_postal: "",
  });

  useEffect(() => {
    obtenerUsuarioActual(); // cargar desde la BD
  }, []);

  useEffect(() => {
    if (usuarioActual) {
      setForm({
        nombre: usuarioActual.nombre || "",
        telefono: usuarioActual.telefono || "",
        direccion: usuarioActual.direccion || "",
        ciudad: usuarioActual.ciudad || "",
        codigo_postal: usuarioActual.codigo_postal || "",
      });
    }
  }, [usuarioActual]);

  const handleSave = async () => {
    try {
      await actualizarUsuario(usuarioActual.id, form);
      Alert.alert("✔️ Éxito", "Información actualizada correctamente");
      navigation.goBack();
    } catch (err) {
      Alert.alert("❌ Error", "Ocurrió un problema al guardar");
      console.log(err);
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* HEADER CON BOTÓN ATRÁS */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={26} />
        </TouchableOpacity>
        <Text style={styles.title}>Editar información personal</Text>
      </View>

      {/* CAMPOS DE EDICIÓN */}
      <Text style={styles.label}>Nombre completo</Text>
      <TextInput
        style={styles.input}
        value={form.nombre}
        onChangeText={(v) => setForm({ ...form, nombre: v })}
      />

      <Text style={styles.label}>Teléfono</Text>
      <TextInput
        style={styles.input}
        value={form.telefono}
        onChangeText={(v) => setForm({ ...form, telefono: v })}
        keyboardType="phone-pad"
      />

      <Text style={styles.label}>Dirección</Text>
      <TextInput
        style={styles.input}
        value={form.direccion}
        onChangeText={(v) => setForm({ ...form, direccion: v })}
      />

      <Text style={styles.label}>Ciudad</Text>
      <TextInput
        style={styles.input}
        value={form.ciudad}
        onChangeText={(v) => setForm({ ...form, ciudad: v })}
      />

      <Text style={styles.label}>Código Postal</Text>
      <TextInput
        style={styles.input}
        value={form.codigo_postal}
        onChangeText={(v) => setForm({ ...form, codigo_postal: v })}
        keyboardType="number-pad"
      />

      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>Guardar cambios</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default EditUserInfoScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f9ff", padding: 20 },
  header: { flexDirection: "row", alignItems: "center", marginBottom: 20 },
  title: { fontSize: 20, fontWeight: "bold", marginLeft: 10 },
  label: { fontSize: 15, marginTop: 10, color: "#333" },
  input: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 10,
    marginTop: 5,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  button: {
    backgroundColor: "#3b82f6",
    padding: 15,
    borderRadius: 12,
    marginTop: 30,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontSize: 18, fontWeight: "600" },
});
