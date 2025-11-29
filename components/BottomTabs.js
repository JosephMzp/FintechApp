import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function BottomTabs() {
  const navigation = useNavigation();
  return (
    <View style={styles.bottomTabs}>
      <TouchableOpacity style={styles.tabItem} onPress={() => navigation.navigate('Home')}>
        <Feather name="home" size={28} color="#347AF0" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.tabItem}>
        <Feather name="clock" size={28} color="#AAA" />
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.centralTabButton}>
        <Feather name="grid" size={28} color="white" />
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.tabItem} onPress={() => navigation.navigate("SupportChat")}>
        <Feather name="message-square" size={28} color="#AAA" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.tabItem} onPress={() => navigation.navigate("ProfileSreen")}>
        <Feather name="user" size={28} color="#AAA" />
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