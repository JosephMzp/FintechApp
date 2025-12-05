import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';

export default function BottomTabs() {
  const navigation = useNavigation();
  
  let routeName = "";
  try {
    const route = useRoute();
    routeName = route.name;
  } catch (e) {
    routeName = "Home"; // Fallback
  }

  // Función auxiliar para determinar el color
  const getColor = (tabName) => {
    return routeName === tabName ? "#347AF0" : "#AAA";
  };

  return (
    <View style={styles.bottomTabs}>
      
      {/* HOME TAB */}
      <TouchableOpacity 
        style={styles.tabItem} 
        onPress={() => navigation.navigate('Home')}
      >
        <Feather name="home" size={28} color={getColor("Home")} />
      </TouchableOpacity>

      {/* ACTIVITY / CLOCK TAB  */}
      <TouchableOpacity style={styles.tabItem}>
        <Feather name="clock" size={28} color="#AAA" /> 
      </TouchableOpacity>
      
      {/* CENTER BUTTON (Siempre blanco sobre azul) */}
      <TouchableOpacity style={styles.centralTabButton}>
        <Feather name="grid" size={28} color="white" />
      </TouchableOpacity>
      
      {/* SUPPORT TAB */}
      <TouchableOpacity 
        style={styles.tabItem} 
        onPress={() => navigation.navigate("SupportChat")}
      >
        <Feather name="message-square" size={28} color={getColor("SupportChat")} />
      </TouchableOpacity>

      {/* PROFILE TAB */}
      <TouchableOpacity 
        style={styles.tabItem} 
        onPress={() => navigation.navigate("ProfileSreen")}
      >
        <Feather name="user" size={28} color={getColor("ProfileSreen")} />
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  bottomTabs: {
    flexDirection: 'row',
    height: 90,
    borderTopWidth: 1,
    borderTopColor: '#EEE',
    backgroundColor: 'white',
    alignItems: 'center',
    paddingBottom: 20,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centralTabButton: {
    width: 60,
    height: 60,
    borderRadius: 15,
    backgroundColor: '#347AF0',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -30,
    shadowColor: '#347AF0',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
});