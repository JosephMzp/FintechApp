import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TextInput, 
  TouchableOpacity, 
  StatusBar,
  Alert
} from 'react-native';

import { Feather, FontAwesome, MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { useNavigation } from "@react-navigation/native";
import BottomTabs from '../components/BottomTabs.js';
import Actions from "../components/Actions.js"

import { supabase } from '../supabase/supabase.config'; 
import { useTarjetaStore } from '../store/TarjetaStore';

// ⬅️⬅️⬅️ **IMPORTANTE: IMPORTACIÓN PARA MODO OSCURO**
import { useTheme } from "../context/ThemeContext";


// --- HEADER ---
const Header = ({ onAddMoney, isDark }) => (
  <View style={styles(isDark).header}>
    <View style={styles(isDark).topBar}>
      <Feather name="award" size={24} color={isDark ? "#FFF" : "white"} />
      
      <View style={styles(isDark).searchBox}>
        <Feather name="search" size={20} color={isDark ? "#BBB" : "#AED6FF"} />
        <TextInput
          placeholder="Buscar 'Pagos'"
          placeholderTextColor={isDark ? "#BBB" : "#AED6FF"}
          style={styles(isDark).searchInput}
        />
      </View>

      <Ionicons name="notifications-outline" size={26} color={isDark ? "#FFF" : "white"} />
    </View>
    
    <View style={styles(isDark).balanceSection}>
      <Text style={styles(isDark).balanceCurrency}>ES Soles</Text>
      <Text style={styles(isDark).balanceAmount}>S/20,000</Text>
      <Text style={styles(isDark).balanceLabel}>Saldo disponible</Text>
    </View>

    <TouchableOpacity style={styles(isDark).addMoneyButton} onPress={onAddMoney}>
      <FontAwesome name="plus-square-o" size={20} color="#347AF0" />
      <Text style={styles(isDark).addMoneyText}>Añadir dinero</Text>
    </TouchableOpacity>
  </View>
);



// --- TRANSAC ITEM ---
const TransactionItem = ({ icon, title, amount, amountColor, bgColor, isDark }) => (
  <TouchableOpacity style={styles(isDark).txItem}>
    <View style={[styles(isDark).txIconCircle, { backgroundColor: bgColor }]}>
      {icon}
    </View>
    <View style={styles(isDark).txDetails}>
      <Text style={styles(isDark).txTitle}>{title}</Text>
    </View>
    <Text style={[styles(isDark).txAmount, { color: amountColor }]}>{amount}</Text>
    <Feather name="chevron-right" size={20} color={isDark ? "#CCC" : "#AAA"} />
  </TouchableOpacity>
);


// --- TRANSACCIONES ---
const Transactions = ({ isDark }) => (
  <View style={styles(isDark).transactionsContainer}>
    <View style={styles(isDark).transactionsHeader}>
      <Text style={styles(isDark).transactionsTitle}>Transacciones</Text>
      <TouchableOpacity>
        <Feather name="arrow-right" size={22} color={isDark ? "#FFF" : "#555"} />
      </TouchableOpacity>
    </View>

    <TransactionItem 
      isDark={isDark}
      icon={<MaterialCommunityIcons name="credit-card-outline" size={24} color="#347AF0" />}
      title="Gasto"
      amount="-S/500"
      amountColor="#E53935"
      bgColor={isDark ? "#1F2A40" : "#EAF2FF"}
    />

    <TransactionItem 
      isDark={isDark}
      icon={<MaterialCommunityIcons name="arrow-bottom-left" size={24} color="#4CAF50" />}
      title="Ingreso"
      amount="S/3000"
      amountColor="#4CAF50"
      bgColor={isDark ? "#1B3327" : "#E8F5E9"}
    />

    <TransactionItem 
      isDark={isDark}
      icon={<MaterialCommunityIcons name="receipt" size={24} color="#F5A623" />}
      title="Facturas"
      amount="-S/800"
      amountColor="#E53935"
      bgColor={isDark ? "#40361F" : "#FFF8E8"}
    />

    <TransactionItem 
      isDark={isDark}
      icon={<MaterialCommunityIcons name="piggy-bank-outline" size={24} color="#7E57C2" />}
      title="Ahorros"
      amount="S/1000"
      amountColor="#4CAF50"
      bgColor={isDark ? "#2F1F3E" : "#F3E5F5"}
    />
  </View>
);


// --- HOME SCREEN PRINCIPAL ---
export default function HomeScreen() {
  const navigation = useNavigation();
  const { listarTarjetas } = useTarjetaStore();

  // ⬅️⬅️⬅️ **ACTIVAR EL MODO OSCURO**
  const { isDark } = useTheme();


  // Lógica real
  const checkCards = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        Alert.alert("Sesión expirada", "Por favor inicia sesión nuevamente.");
        return;
      }

      const { data: publicUser } = await supabase
        .from('usuarios')
        .select('id')
        .eq('idauth', user.id)
        .single();

      if (!publicUser) return;

      const tarjetas = await listarTarjetas(publicUser.id);

      navigation.navigate(tarjetas?.length > 0 ? "CardList" : "AddCardIntro");

    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={styles(isDark).container}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

      <Header onAddMoney={checkCards} isDark={isDark} />

      <ScrollView style={styles(isDark).contentArea}>
        <Actions onBankPress={checkCards} />
        <Transactions isDark={isDark} />
      </ScrollView>

      <BottomTabs />
    </View>
  );
}



// --------------------------------------------------
//      ESTILOS CON MODO OSCURO DINÁMICO
// --------------------------------------------------

const styles = (isDark) =>
  StyleSheet.create({

    // ⬅️⬅️⬅️ **CAMBIO PARA MODO OSCURO**
    container: {
      flex: 1,
      backgroundColor: isDark ? "#000000" : "#347AF0",
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
      backgroundColor: isDark ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.2)",
      borderRadius: 10,
      padding: 10,
      marginHorizontal: 15,
      alignItems: 'center',
    },

    searchInput: {
      color: isDark ? "#FFF" : 'white',
      marginLeft: 10,
      flex: 1,
      fontSize: 14,
    },

    balanceSection: {
      alignItems: 'center',
      marginTop: 25,
    },

    balanceCurrency: {
      color: isDark ? "#AAA" : '#AED6FF',
      fontSize: 14,
    },

    balanceAmount: {
      color: isDark ? "#FFF" : 'white',
      fontSize: 40,
      fontWeight: 'bold',
      marginTop: 5,
    },

    balanceLabel: {
      color: isDark ? "#AAA" : '#AED6FF',
      fontSize: 14,
      marginTop: 5,
    },

    addMoneyButton: {
      flexDirection: 'row',
      backgroundColor: isDark ? "#111" : 'white',
      paddingVertical: 12,
      paddingHorizontal: 20,
      borderRadius: 10,
      alignItems: 'center',
      justifyContent: 'center',
      alignSelf: 'center',
      marginTop: 25,
    },

    addMoneyText: {
      color: '#347AF0',
      fontSize: 16,
      fontWeight: '600',
      marginLeft: 10,
    },

    // ⬅️⬅️⬅️ **CAMBIO PARA MODO OSCURO**
    contentArea: {
      flex: 1,
      backgroundColor: isDark ? "#1E1E1E" : 'white',
      borderTopLeftRadius: 30,
      borderTopRightRadius: 30,
      marginTop: -40,
      paddingTop: 10,
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
      color: isDark ? "#FFF" : "#333",
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
      color: isDark ? "#FFF" : "#222",
    },

    txAmount: {
      fontSize: 16,
      fontWeight: 'bold',
      marginRight: 10,
    },
  });
