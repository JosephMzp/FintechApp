import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from "@react-navigation/native";

const ActionButton = ({ icon, label, bgColor,onPress }) => (
  <TouchableOpacity style={styles.actionItem} onPress={onPress}>
    <View style={[styles.actionIconCircle, { backgroundColor: bgColor }]}>
      {icon}
    </View>
    <Text style={styles.actionLabel}>{label}</Text>
  </TouchableOpacity>
);

export default function Actions({ onBankPress }) {
  const navigation = useNavigation();
  return (
    <View style={styles.actionsContainer}>
      <ActionButton 
        icon={<FontAwesome name="send" size={22} color="#347AF0" />}
        label="Enviar" 
        onPress={() => navigation.navigate("SendMoney")}
        bgColor="#EAF2FF" 
      />
      <ActionButton 
        icon={<FontAwesome name="money" size={22} color="#F5A623" />}
        label="Pedido" 
        bgColor="#FFF8E8" 
      />
      <ActionButton 
        icon={<MaterialCommunityIcons name="bank" size={22} color="#505050" />}
        label="Banco" 
        bgColor="#F4F4F4" 
        onPress={onBankPress}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 20,
  },
  actionItem: {
    alignItems: 'center',
  },
  actionIconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
});