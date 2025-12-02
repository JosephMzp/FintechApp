import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from "react-native";
import { useRegisterStore } from "../store/RegistroStore";
import Icon from "react-native-vector-icons/Ionicons";

const COUNTRIES = ["Perú", "México", "Estados Unidos", "Colombia", "Argentina"];

export default function CountryResidenceScreen({ navigation }) {
  const setPais = useRegisterStore((s) => s.setPais);
  const [selected, setSelected] = useState(null);

  return (
    <View style={styles.container}>
      {/* BOTÓN REGRESAR */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Icon name="arrow-back" size={24} color="#000" />
      </TouchableOpacity>

      <Text style={styles.title}>País de residencia</Text>
      <Text style={styles.subtitle}>
        Esta información debe coincidir con tu documento de identidad.
      </Text>

      <FlatList
        data={COUNTRIES}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.item, selected === item && styles.selected]}
            onPress={() => setSelected(item)}
          >
            <Text style={[styles.itemText, selected === item && { color: "#fff" }]}>
              {item}
            </Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item}
      />

      <TouchableOpacity
        style={[styles.button, { opacity: selected ? 1 : 0.4 }]}
        disabled={!selected}
        onPress={() => {
          setPais(selected);
          navigation.navigate("PersonalInfoScreen");
        }}
      >
        <Text style={styles.buttonText}>Continuar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 25, backgroundColor: "#fff" },
  backButton: { marginBottom: 10 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 10 },
  subtitle: { color: "#666", marginBottom: 20 },
  item: {
    padding: 15,
    borderRadius: 10,
    backgroundColor: "#f4f4f4",
    marginBottom: 10,
  },
  selected: { backgroundColor: "#347AF0" },
  itemText: { color: "#333" },
  button: {
    marginTop: 20,
    backgroundColor: "#347AF0",
    padding: 15,
    borderRadius: 30,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontWeight: "600", fontSize: 16 },
});
