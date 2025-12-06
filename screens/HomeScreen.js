import React, { useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StatusBar,
  Alert,
} from "react-native";

import {
  Feather,
  FontAwesome,
  MaterialCommunityIcons,
  Ionicons,
} from "@expo/vector-icons";
import { useNavigation,useFocusEffect } from "@react-navigation/native";
import BottomTabs from "../components/BottomTabs.js";
import Actions from "../components/Actions.js";

import { supabase } from "../supabase/supabase.config";
import { useTarjetaStore } from "../store/TarjetaStore";
import { useTransaccionStore } from "../store/TransaccionStore";
import { useTheme } from "../context/ThemeContext";

// --- HEADER ---
const Header = ({ saldo, isDark }) => (
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
      <Ionicons
        name="notifications-outline"
        size={26}
        color={isDark ? "#FFF" : "white"}
      />
    </View>

    <View style={styles(isDark).balanceSection}>
      <Text style={styles(isDark).balanceCurrency}>ES Soles</Text>
      {/* 🟢 DATO REAL DE SALDO */}
      <Text style={styles(isDark).balanceAmount}>
        S/ {parseFloat(saldo).toFixed(2)}
      </Text>
      <Text style={styles(isDark).balanceLabel}>Saldo disponible</Text>
    </View>

    {/* ... (Botón añadir dinero se mantiene igual) ... */}
  </View>
);

// --- TRANSACCIONES ---
const Transactions = ({ data, isDark }) => (
  <View style={styles(isDark).transactionsContainer}>
    <View style={styles(isDark).transactionsHeader}>
      <Text style={styles(isDark).transactionsTitle}>
        Transacciones Recientes
      </Text>
    </View>

    {/* 🟢 MAPEADO DE DATOS REALES */}
    {data.length === 0 ? (
      <Text
        style={{
          color: isDark ? "#777" : "#999",
          textAlign: "center",
          marginTop: 20,
        }}
      >
        No hay movimientos aún.
      </Text>
    ) : (
      data.slice(0, 5).map(
        (
          item // Mostramos solo las ultimas 5
        ) => (
          <TouchableOpacity key={item.id} style={styles(isDark).txItem}>
            <View
              style={[
                styles(isDark).txIconCircle,
                {
                  backgroundColor:
                    item.tipo_visual === "gasto"
                      ? isDark
                        ? "#3f1f1f"
                        : "#FFEBEE"
                      : isDark
                      ? "#1f3f2f"
                      : "#E8F5E9",
                },
              ]}
            >
              <Feather name={item.iconName} size={24} color={item.color} />
            </View>
            <View style={styles(isDark).txDetails}>
              <Text style={styles(isDark).txTitle}>
                {item.referencia || item.titulo}
              </Text>
              <Text style={{ color: isDark ? "#aaa" : "#666", fontSize: 12 }}>
                {item.fecha}
              </Text>
            </View>
            <Text style={[styles(isDark).txAmount, { color: item.color }]}>
              {item.signo} S/{item.monto}
            </Text>
          </TouchableOpacity>
        )
      )
    )}
  </View>
);

// --- HOME SCREEN PRINCIPAL ---
export default function HomeScreen() {
  const navigation = useNavigation();
  const { listarTarjetas } = useTarjetaStore();
  const { saldo, transacciones, cargarDatosReal } = useTransaccionStore();
  const { isDark } = useTheme();

useFocusEffect(
    useCallback(() => {
      cargarDatosReal();
    }, [])
  );

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
      
      {/* Pasamos el saldo real */}
      <Header saldo={saldo} isDark={isDark} onAddMoney={checkCards}/>

      <ScrollView style={styles(isDark).contentArea}>
        <Actions onBankPress={checkCards} />
        {/* Pasamos transacciones reales */}
        <Transactions data={transacciones} isDark={isDark} />
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

    header: { paddingTop: 60, paddingHorizontal: 20, paddingBottom: 70 },
    topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    searchBox: { flex: 1, flexDirection: 'row', backgroundColor: isDark ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.2)", borderRadius: 10, padding: 10, marginHorizontal: 15, alignItems: 'center' },
    searchInput: { color: isDark ? "#FFF" : 'white', marginLeft: 10, flex: 1, fontSize: 14 },
    balanceSection: { alignItems: 'center', marginTop: 25 },
    balanceCurrency: { color: isDark ? "#AAA" : '#AED6FF', fontSize: 14 },
    balanceAmount: { color: isDark ? "#FFF" : 'white', fontSize: 40, fontWeight: 'bold', marginTop: 5 },
    balanceLabel: { color: isDark ? "#AAA" : '#AED6FF', fontSize: 14, marginTop: 5 },
    contentArea: { flex: 1, backgroundColor: isDark ? "#1E1E1E" : 'white', borderTopLeftRadius: 30, borderTopRightRadius: 30, marginTop: -40, paddingTop: 10 },
    transactionsContainer: { paddingHorizontal: 20, marginTop: 10, paddingBottom: 20 },
    transactionsHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
    transactionsTitle: { fontSize: 20, fontWeight: 'bold', color: isDark ? "#FFF" : "#333" },
    txItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12 },
    txIconCircle: { width: 45, height: 45, borderRadius: 22.5, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
    txDetails: { flex: 1, justifyContent: 'center' },
    txTitle: { fontSize: 16, fontWeight: '500', color: isDark ? "#FFF" : "#222" },
    txAmount: { fontSize: 16, fontWeight: 'bold', marginRight: 10 },
  });
