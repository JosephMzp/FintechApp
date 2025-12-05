import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useTheme } from "../context/ThemeContext";

export default function Onboarding3({ navigation }) {
  const { isDark } = useTheme();

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: isDark ? "#000000" : "#FFFFFF" }
      ]}
    >
      {/* Botón de retroceso */}
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Text
          style={[
            styles.backText,
            { color: isDark ? "#FFFFFF" : "#000000" }
          ]}
        >
          ←
        </Text>
      </TouchableOpacity>

      <Image
        source={require('../assets/onboarding3.png')}
        style={styles.image}
        resizeMode="contain"
      />

      <Text
        style={[
          styles.title,
          { color: isDark ? "#FFFFFF" : "#000000" }
        ]}
      >
        Recibe dinero desde cualquier parte del mundo.
      </Text>

      <TouchableOpacity
        style={[
          styles.button,
          { backgroundColor: isDark ? "#347AF0" : "#007AFF" }
        ]}
        onPress={() => navigation.navigate('SingUp')}
      >
        <Text style={styles.buttonText}>Empezar</Text>
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
    position: 'absolute',
    top: 40,
    left: 20,
    padding: 10,
  },

  backText: {
    fontSize: 28,
    fontWeight: 'bold',
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
