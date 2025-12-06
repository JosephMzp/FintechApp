import React from 'react';
import { View, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';

const { width } = Dimensions.get('window');

export default function BottomTabs() {
  const navigation = useNavigation();
  
  let routeName = "";
  try {
    const route = useRoute();
    routeName = route.name;
  } catch (e) {
    routeName = "Home"; 
  }

  const getColor = (tabName) => {
    return routeName === tabName ? "#347AF0" : "#AAA";
  };

  return (
    <View style={styles.container} pointerEvents="box-none">
      
      {/* 1. La Barra Blanca de Fondo (Botones normales) */}
      <View style={styles.barBackground}>
        <TouchableOpacity style={styles.tabItem} onPress={() => navigation.navigate('Home')}>
          <Feather name="home" size={26} color={getColor("Home")} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.tabItem} onPress={() => navigation.navigate('Spending')}>
          <Feather name="clock" size={26} color={getColor("Spending")} /> 
        </TouchableOpacity>

        {/* ESPACIO VACÍO PARA EL BOTÓN FLOTANTE */}
        <View style={{ width: 70 }} />

        <TouchableOpacity style={styles.tabItem} onPress={() => navigation.navigate("SupportChat")}>
          <Feather name="message-square" size={26} color={getColor("SupportChat")} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.tabItem} onPress={() => navigation.navigate("ProfileSreen")}>
          <Feather name="user" size={26} color={getColor("ProfileSreen")} />
        </TouchableOpacity>
      </View>

      {/* 2. El Botón Flotante (Copiado de SendMoneyScreen) */}
      {/* Se posiciona absolutamente sobre la barra */}
      <View style={styles.fabContainer} pointerEvents="box-none">
        <TouchableOpacity 
          style={styles.scanButton}
          onPress={() => navigation.navigate('QRScanner')}
          activeOpacity={0.8}
        >
          {/* Usamos el mismo icono que en tu pantalla funcional */}
          <MaterialCommunityIcons name="qrcode-scan" size={28} color="white" />
        </TouchableOpacity>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  // Contenedor principal invisible que ocupa el espacio
  container: {
    position: 'absolute',
    bottom: 0,
    width: width,
    height: 90, // Altura suficiente para la barra + botón
    justifyContent: 'flex-end',
    elevation: 0,
    zIndex: 9999, // Asegura que esté por encima de todo
  },
  
  // Estilo de la barra blanca
  barBackground: {
    height: 70, // Altura de la barra
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    // Sombras suaves
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 5,
  },
  
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },

  // Contenedor absoluto para centrar el botón flotante
  fabContainer: {
    position: 'absolute',
    bottom: 25, // Ajusta esto para subir/bajar el botón
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10000, // Z-index máximo para asegurar el toque
  },

  // ESTILOS COPIADOS DE TU PANTALLA FUNCTIONAL (SendMoneyScreen)
  scanButton: {
    width: 65, 
    height: 65, 
    borderRadius: 32.5, 
    backgroundColor: '#347AF0',
    justifyContent: 'center', 
    alignItems: 'center',
    // Sombras idénticas a tu diseño
    shadowColor: "#347AF0", 
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, 
    shadowRadius: 8, 
    elevation: 8,
  },
});