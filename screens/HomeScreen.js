import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TextInput, 
  TouchableOpacity, 
  StatusBar 
} from 'react-native';

import { Feather, FontAwesome, MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { useNavigation } from "@react-navigation/native";
import BottomTabs from '../components/BottomTabs.js';

// --- Componente del Encabezado ---
// CAMBIO: Header ahora recibe la función 'onAddMoney' como prop
const Header = ({ onAddMoney }) => (
  <View style={styles.header}>
    <View style={styles.topBar}>
      <Feather name="award" size={24} color="white" />
      <View style={styles.searchBox}>
        <Feather name="search" size={20} color="#AED6FF" />
        <TextInput
          placeholder="Buscar 'Pagos'"
          placeholderTextColor="#AED6FF"
          style={styles.searchInput}
        />
      </View>
      <Ionicons name="notifications-outline" size={26} color="white" />
    </View>
    
    <View style={styles.balanceSection}>
      <Text style={styles.balanceCurrency}>ES Soles</Text>
      <Text style={styles.balanceAmount}>S/20,000</Text>
      <Text style={styles.balanceLabel}>Saldo disponible</Text>
    </View>

      {/* Usamos la prop 'onAddMoney' en vez de llamar a la función global */}
      <TouchableOpacity style={styles.addMoneyButton} onPress={onAddMoney}>
        <FontAwesome name="plus-square-o" size={20} color="#347AF0" />
        <Text style={styles.addMoneyText}>Añadir dinero</Text>
      </TouchableOpacity>
    </View>
);

const ActionButton = ({ icon, label, bgColor, onPress }) => (
  <TouchableOpacity style={styles.actionItem} onPress={onPress}>
    <View style={[styles.actionIconCircle, { backgroundColor: bgColor }]}>
      {icon}
    </View>
    <Text style={styles.actionLabel}>{label}</Text>
  </TouchableOpacity>
);

// CAMBIO 3: Actions ahora recibe 'onBankPress' como prop
const Actions = ({ onBankPress }) => (
  <View style={styles.actionsContainer}>
    <ActionButton 
      icon={<FontAwesome name="send" size={22} color="#347AF0" />}
      label="Enviar" 
      bgColor="#EAF2FF"
    />
    <ActionButton 
      icon={<FontAwesome name="money" size={22} color="#F5A623" />}
      label="Pedido" 
      bgColor="#FFF8E8"
    />
    {/* Usamos la prop que recibimos */}
    <ActionButton 
      icon={<MaterialCommunityIcons name="bank" size={22} color="#505050" />}
      label="Banco" 
      bgColor="#F4F4F4"
      onPress={onBankPress}
    />
  </View>
);

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

const Transactions = () => (
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

// --- Componente Principal de la App ---
export default function HomeScreen() {
  // CAMBIO 4: Movemos useNavigation ADENTRO del componente
  const navigation = useNavigation();

  // CAMBIO 5: Movemos la función checkCards ADENTRO para que pueda usar 'navigation'
  const checkCards = async () => {
    // TEMPORAL (simulación) — luego lo conectaremos a Supabase
    const hasCards = false;

    if (!hasCards) {
      navigation.navigate("AddCardIntro");
    } else {
      navigation.navigate("CardList");
    }
  };
  
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      {/* CAMBIO 6: Pasamos checkCards como prop a los hijos */}
      <Header onAddMoney={checkCards} />
      
      <ScrollView style={styles.contentArea} showsVerticalScrollIndicator={false}>
        <Actions onBankPress={checkCards} />
        <Transactions />
      </ScrollView>
      <BottomTabs />
    </View>
  );
}

// --- ESTILOS (IGUAL QUE ANTES) ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#347AF0',
  },
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
  contentArea: {
    flex: 1,
    backgroundColor: 'white',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -40,
    paddingTop: 10,
  },
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