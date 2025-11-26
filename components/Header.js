import React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { Award, Search, Bell, PlusSquare } from 'lucide-react-native';

export default function Header({ saldo = 0 }) {
  return (
    <View style={styles.header}>
      {/* Barra superior */}
      <View style={styles.topBar}>
        <Award size={24} color="white" />
        <View style={styles.searchBox}>
          <Search size={20} color="#AED6FF" />
          <TextInput
            placeholder="Buscar 'Pagos'"
            placeholderTextColor="#AED6FF"
            style={styles.searchInput}
          />
        </View>
        <Bell size={26} color="white" />
      </View>
      
      {/* Sección de Saldo */}
      <View style={styles.balanceSection}>
        <Text style={styles.balanceCurrency}>ES Soles</Text>
        <Text style={styles.balanceAmount}>S/{Number(saldo).toFixed(2)}</Text>
        <Text style={styles.balanceLabel}>Saldo disponible</Text>
      </View>

      {/* Botón de Añadir Dinero */}
      <TouchableOpacity style={styles.addMoneyButton}>
        <PlusSquare size={20} color="#347AF0" />
        <Text style={styles.addMoneyText}>Añadir dinero</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 70,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 10,
    padding: 10,
    marginHorizontal: 15,
    alignItems: 'center',
  },
  searchInput: {
    color: 'white',
    marginLeft: 10,
    flex: 1,
    fontSize: 14,
  },
  balanceSection: {
    alignItems: 'center',
    marginTop: 25,
  },
  balanceCurrency: {
    color: '#AED6FF',
    fontSize: 14,
  },
  balanceAmount: {
    color: 'white',
    fontSize: 40,
    fontWeight: 'bold',
    marginTop: 5,
  },
  balanceLabel: {
    color: '#AED6FF',
    fontSize: 14,
    marginTop: 5,
  },
  addMoneyButton: {
    flexDirection: 'row',
    backgroundColor: 'white',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  addMoneyText: {
    color: '#347AF0',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 10,
  },
});