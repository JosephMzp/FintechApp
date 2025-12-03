import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TextInput, 
  TouchableOpacity, 
  StatusBar,
  Alert,
  ActivityIndicator
} from 'react-native';

import { Feather, FontAwesome, MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { useNavigation } from "@react-navigation/native";
import BottomTabs from '../components/BottomTabs.js';

import { supabase } from '../supabase/supabase.config'; 
import { useTarjetaStore } from '../store/TarjetaStore';

// ------------------------------------------------------
// HEADER (sin cambios funcionales)
// ------------------------------------------------------
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

      <TouchableOpacity style={styles.addMoneyButton} onPress={onAddMoney}>
        <FontAwesome name="plus-square-o" size={20} color="#347AF0" />
        <Text style={styles.addMoneyText}>Añadir dinero</Text>
      </TouchableOpacity>
    </View>
);

// ------------------------------------------------------
// ACTIONS (sin cambios funcionales)
// ------------------------------------------------------
const ActionButton = ({ icon, label, bgColor, onPress }) => (
  <TouchableOpacity style={styles.actionItem} onPress={onPress}>
    <View style={[styles.actionIconCircle, { backgroundColor: bgColor }]}>
      {icon}
    </View>
    <Text style={styles.actionLabel}>{label}</Text>
  </TouchableOpacity>
);

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
    <ActionButton 
      icon={<MaterialCommunityIcons name="bank" size={22} color="#505050" />}
      label="Banco" 
      bgColor="#F4F4F4"
      onPress={onBankPress}
    />
  </View>
);

// ------------------------------------------------------
// ITEM DE TRANSACCIÓN (usa campos reales de la tabla)
// ------------------------------------------------------
const TransactionItem = ({ tx }) => {
  // Ajusta iconos/colores por tipo
  const tipo = (tx.tipo || "gasto").toLowerCase();
  const config = {
    gasto: {
      icon: <MaterialCommunityIcons name="credit-card-outline" size={24} color="#347AF0" />,
      color: "#E53935",
      bg: "#EAF2FF"
    },
    ingreso: {
      icon: <MaterialCommunityIcons name="arrow-bottom-left" size={24} color="#4CAF50" />,
      color: "#4CAF50",
      bg: "#E8F5E9"
    },
    factura: {
      icon: <MaterialCommunityIcons name="receipt" size={24} color="#F5A623" />,
      color: "#E53935",
      bg: "#FFF8E8"
    },
    ahorro: {
      icon: <MaterialCommunityIcons name="piggy-bank-outline" size={24} color="#7E57C2" />,
      color: "#4CAF50",
      bg: "#F3E5F5"
    }
  };

  const item = config[tipo] || config.gasto;

  // Usamos `referencia` (o `descripcion`) y `monto` según tu tabla
  const title = tx.referencia || tx.descripcion || "Movimiento";
  const amount = Number(tx.monto) || 0;
  const fecha = tx.fecha ? String(tx.fecha).split("T")[0] : "";

  return (
    <TouchableOpacity style={styles.txItem}>
      <View style={[styles.txIconCircle, { backgroundColor: item.bg }]}>
        {item.icon}
      </View>

      <View style={styles.txDetails}>
        <Text style={styles.txTitle}>{title}</Text>
        <Text style={styles.txDate}>{fecha}</Text>
      </View>

      <Text style={[styles.txAmount, { color: (tipo === "ingreso" || tipo === "ahorro") ? "#16a34a" : "#ef4444" }]}>
        {(tipo === "ingreso" || tipo === "ahorro") ? `S/${amount}` : `-S/${amount}`}
      </Text>

      <Feather name="chevron-right" size={20} color="#AAA" />
    </TouchableOpacity>
  );
};

// ------------------------------------------------------
// TRANSACCIONES: ahora jaladas de Supabase por tarjetas del usuario
// ------------------------------------------------------
const Transactions = ({ transacciones, loading }) => (
  <View style={styles.transactionsContainer}>
    <View style={styles.transactionsHeader}>
      <Text style={styles.transactionsTitle}>Transacciones</Text>
      <TouchableOpacity>
        <Feather name="arrow-right" size={22} color="#555" />
      </TouchableOpacity>
    </View>

    {loading ? (
      <ActivityIndicator size="large" color="#347AF0" />
    ) : transacciones.length === 0 ? (
      <Text style={{ textAlign: "center", color: "#666", marginTop: 10 }}>
        No se encontraron transacciones
      </Text>
    ) : (
      transacciones.map((tx) => <TransactionItem key={tx.id} tx={tx} />)
    )}
  </View>
);

// ------------------------------------------------------
// HOME SCREEN PRINCIPAL (modificado para traer transacciones reales)
// ------------------------------------------------------
export default function HomeScreen() {
  const navigation = useNavigation();
  const { listarTarjetas } = useTarjetaStore();

  const [transacciones, setTransacciones] = useState([]);
  const [loadingTx, setLoadingTx] = useState(true);

  // Carga transacciones relacionadas a TODAS las tarjetas del usuario
  const loadTransacciones = async () => {
    try {
      setLoadingTx(true);

      // 1) Obtener user (UUID) desde auth
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setTransacciones([]);
        return;
      }

      // 2) Obtener id numérico desde tabla usuarios (idauth -> id)
      const { data: usuarioData, error: userError } = await supabase
        .from("usuarios")
        .select("id")
        .eq("idauth", user.id)
        .single();

      if (userError || !usuarioData) {
        console.error("No se encontró usuario público:", userError);
        setTransacciones([]);
        return;
      }

      const userId = usuarioData.id;

      // 3) Obtener todas las tarjetas del usuario (tu store)
      // listarTarjetas espera el user id (según tu implementación previa)
      const tarjetas = await listarTarjetas(userId);
      if (!tarjetas || tarjetas.length === 0) {
        setTransacciones([]);
        return;
      }

      // 4) Extraer todos los cuenta_id de las tarjetas
      const cuentaIds = tarjetas
        .map((t) => t.cuenta_id)
        .filter((v) => v !== null && v !== undefined);

      if (!cuentaIds || cuentaIds.length === 0) {
        setTransacciones([]);
        return;
      }

      // 5) Construir filtro OR para supabase: cuenta_origen IN (...) OR cuenta_destino IN (...)
      // Supabase expects in with parentheses: in.(1,2,3)
      const idsList = cuentaIds.join(",");

      // 6) Consultar transacciones asociadas a esas cuentas
      const { data, error } = await supabase
        .from("transacciones")
        .select("*")
        .or(`cuenta_origen.in.(${idsList}),cuenta_destino.in.(${idsList})`)
        .order("fecha", { ascending: false });

      if (error) {
        console.error("Error cargando transacciones:", error);
        setTransacciones([]);
        return;
      }

      // 7) Guardar
      setTransacciones(data || []);
    } catch (err) {
      console.error("Error inesperado al cargar transacciones:", err);
      setTransacciones([]);
    } finally {
      setLoadingTx(false);
    }
  };

  useEffect(() => {
    loadTransacciones();

    // opcional: re-cargar cada vez que la pantalla reciba foco
    const unsubscribe = navigation.addListener('focus', () => {
      loadTransacciones();
    });

    return unsubscribe;
  }, []);

  // ------------------------------------------------------
  // MISMA FUNCIÓN QUE YA TENÍAS PARA CHECKCARDS (no tocada)
  // ------------------------------------------------------
  const checkCards = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        Alert.alert("Sesión expirada", "Por favor inicia sesión nuevamente.");
        return;
      }

      const { data: publicUser } = await supabase
        .from("usuarios")
        .select("id")
        .eq("idauth", user.id)
        .single();

      if (!publicUser) return;

      const tarjetas = await listarTarjetas(publicUser.id);

      if (tarjetas?.length > 0) navigation.navigate("CardList");
      else navigation.navigate("AddCardIntro");
    } catch (error) {
      navigation.navigate("CardList");
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <Header onAddMoney={checkCards} />

      <ScrollView style={styles.contentArea} showsVerticalScrollIndicator={false}>
        <Actions onBankPress={checkCards} />

        {/* <-- Aquí se muestran las transacciones reales relacionadas a TODAS las tarjetas del usuario --> */}
        <Transactions data={transacciones} loading={loadingTx} />
      </ScrollView>

      <BottomTabs />
    </View>
  );
}

// ------------------------------------------------------
// ESTILOS (uso los tuyos intactos)
// ------------------------------------------------------
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
  txDate: {
    color: '#666',
    fontSize: 12,
    marginTop: 4,
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
