import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../context/ThemeContext";

export default function Onboarding2({ navigation }) {
  const { isDark } = useTheme();

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: isDark ? "#000000" : "#FFFFFF" }
      ]}
    >
      {/* 🔙 BOTÓN DE RETROCESO */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons
          name="chevron-back"
          size={28}
          color={isDark ? "#FFFFFF" : "#333"}
        />
      </TouchableOpacity>

      <Image
        source={require('../assets/onboarding2.png')}
        style={styles.image}
        resizeMode="contain"
      />

      <Text
        style={[
          styles.title,
          { color: isDark ? "#FFFFFF" : "#000000" }
        ]}
      >
        Gasta dinero en el extranjero y controla tus gastos.
      </Text>

      <TouchableOpacity
        style={[
          styles.button,
          { backgroundColor: isDark ? "#347AF0" : "#007AFF" }
        ]}
        onPress={() => navigation.navigate('Onboarding3')}
      >
        <Text style={styles.buttonText}>Siguiente</Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },

  backButton: {
    position: "absolute",
    top: 40,
    left: 20,
    padding: 5,
    zIndex: 10,
  },

  image: {
    width: 250,
    height: 250,
    marginBottom: 30,
  },

  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },

  button: {
    paddingVertical: 12,
    paddingHorizontal: 35,
    borderRadius: 25,
    marginTop: 20,
  },

  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
