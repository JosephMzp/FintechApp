import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';

const TransactionItem = ({ icon, title, amount, amountColor, bgColor }) => (
  <TouchableOpacity style={styles.txItem}>
    <View style={[styles.txIconCircle, { backgroundColor: bgColor }]}>
      {icon}
    </View>
    <View style={styles.txDetails}>
      <Text style={styles.txTitle}>{title}</Text>
    </View>
    <Text style={[styles.txAmount, { color: amountColor }]}>{amount}</Text>
    <Feather name="chevron-right" size={20} color="#AAA" />
  </TouchableOpacity>
);

export default function TransactionsList() {
  return (
    <View style={styles.transactionsContainer}>
      <View style={styles.transactionsHeader}>
        <Text style={styles.transactionsTitle}>Transacciones</Text>
        <TouchableOpacity>
          <Feather name="arrow-right" size={22} color="#555" />
        </TouchableOpacity>
      </View>
      
      <TransactionItem 
        icon={<MaterialCommunityIcons name="credit-card-outline" size={24} color="#347AF0" />}
        title="Gasto"
        amount="-S/500"
        amountColor="#E53935"
        bgColor="#EAF2FF"
      />
      <TransactionItem 
        icon={<MaterialCommunityIcons name="arrow-bottom-left" size={24} color="#4CAF50" />}
        title="Ingreso"
        amount="S/3000"
        amountColor="#4CAF50"
        bgColor="#E8F5E9"
      />
      <TransactionItem 
        icon={<MaterialCommunityIcons name="receipt" size={24} color="#F5A623" />}
        title="Facturas"
        amount="-S/800"
        amountColor="#E53935"
        bgColor="#FFF8E8"
      />
      <TransactionItem 
        icon={<MaterialCommunityIcons name="piggy-bank-outline" size={24} color="#7E57C2" />}
        title="Ahorros"
        amount="S/1000"
        amountColor="#4CAF50"
        bgColor="#F3E5F5"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  transactionsContainer: {
    paddingHorizontal: 20,
    marginTop: 10,
    paddingBottom: 20,
  },
  transactionsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  transactionsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  txItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  txIconCircle: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  txDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  txTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#222',
  },
  txAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 10,
  },
});