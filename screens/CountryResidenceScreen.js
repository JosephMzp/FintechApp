import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from "react-native";
import { useRegisterStore } from "../store/RegistroStore";
import { useTheme } from "../context/ThemeContext";
import Icon from "react-native-vector-icons/Ionicons";

const COUNTRIES = ["Perú", "México", "Estados Unidos", "Colombia", "Argentina"];

export default function CountryResidenceScreen({ navigation }) {
  const setPais = useRegisterStore((s) => s.setPais);
  const [selected, setSelected] = useState(null);

  const { isDark } = useTheme(); // ⬅️ MODO OSCURO

  const dynamicStyles = styles(isDark);

  return (
    <View style={dynamicStyles.container}>
      {/* BOTÓN REGRESAR */}
      <TouchableOpacity
        style={dynamicStyles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Icon name="arrow-back" size={24} color={isDark ? "#fff" : "#000"} />
      </TouchableOpacity>

      <Text style={dynamicStyles.title}>País de residencia</Text>
      <Text style={dynamicStyles.subtitle}>
        Esta información debe coincidir con tu documento de identidad.
      </Text>

      <FlatList
        data={COUNTRIES}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              dynamicStyles.item,
              selected === item && dynamicStyles.selected,
            ]}
            onPress={() => setSelected(item)}
          >
            <Text
              style={[
                dynamicStyles.itemText,
                selected === item && { color: "#fff" },
              ]}
            >
              {item}
            </Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item}
      />

      <TouchableOpacity
        style={[dynamicStyles.button, { opacity: selected ? 1 : 0.4 }]}
        disabled={!selected}
        onPress={() => {
          setPais(selected);
          navigation.navigate("PersonalInfoScreen");
        }}
      >
        <Text style={dynamicStyles.buttonText}>Continuar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = (isDark) =>
  StyleSheet.create({
    container: {
      flex: 1,
      padding: 25,
      backgroundColor: isDark ? "#121212" : "#fff",
    },
    backButton: { marginBottom: 10 },
    title: {
      fontSize: 22,
      fontWeight: "bold",
      marginBottom: 10,
      color: isDark ? "#fff" : "#000",
    },
    subtitle: {
      color: isDark ? "#bbb" : "#666",
      marginBottom: 20,
    },
    item: {
      padding: 15,
      borderRadius: 10,
      backgroundColor: isDark ? "#1E1E1E" : "#f4f4f4",
      marginBottom: 10,
    },
    selected: {
      backgroundColor: "#347AF0",
    },
    itemText: {
      color: isDark ? "#eee" : "#333",
    },
    button: {
      marginTop: 20,
      backgroundColor: "#347AF0",
      padding: 15,
      borderRadius: 30,
      alignItems: "center",
    },
    buttonText: {
      color: "#fff",
      fontWeight: "600",
      fontSize: 16,
    },
  });
