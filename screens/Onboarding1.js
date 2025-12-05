import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useTheme } from "../context/ThemeContext";

export default function Onboarding1({ navigation }) {
  const { isDark, setIsDark } = useTheme(); // <-- usamos setIsDark directamente

  return (
    <View style={[
      styles.container,
      { backgroundColor: isDark ? "#121212" : "#FFFFFF" }
    ]}>

      {/* --- Botones de modo oscuro / claro --- */}
      <View style={styles.themeSwitcher}>
        <TouchableOpacity
          style={[styles.themeButton, isDark && styles.themeSelected]}
          onPress={() => setIsDark(true)} // activar modo oscuro
        >
          <Text style={[styles.themeIcon, { color: isDark ? "#fff" : "#000" }]}>🌙</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.themeButton, !isDark && styles.themeSelected]}
          onPress={() => setIsDark(false)} // activar modo claro
        >
          <Text style={[styles.themeIcon, { color: !isDark ? "#fff" : "#000" }]}>☀️</Text>
        </TouchableOpacity>
      </View>

      <Image
        source={require('../assets/onboarding1.png')}
        style={styles.image}
        resizeMode="contain"
      />

      <Text
        style={[
          styles.title,
          { color: isDark ? "#FFFFFF" : "#000000" }
        ]}
      >
        Bienvenido a Fintech Mobile App
      </Text>

      <Text
        style={[
          styles.subtitle,
          { color: isDark ? "#CCCCCC" : "#555" }
        ]}
      >
        Confiado por millones de personas, parte de una parte.
      </Text>

      <TouchableOpacity
        style={[
          styles.button,
          { backgroundColor: isDark ? "#347AF0" : "#007AFF" }
        ]}
        onPress={() => navigation.navigate('Onboarding2')}
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
  themeSwitcher: {
    flexDirection: 'row',
    position: 'absolute',
    top: 50,
    right: 30,
  },
  themeButton: {
    padding: 10,
    borderRadius: 20,
    marginLeft: 10,
    borderWidth: 1,
    borderColor: '#888',
    justifyContent: 'center',
    alignItems: 'center',
  },
  themeSelected: {
    backgroundColor: '#347AF0',
  },
  themeIcon: {
    fontSize: 18,
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
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 40,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 35,
    borderRadius: 25,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
