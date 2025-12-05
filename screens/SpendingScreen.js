import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useTarjetaStore } from "../store/TarjetaStore";
import Icon from "react-native-vector-icons/Ionicons";
import { useTheme } from '../context/ThemeContext'; // <-- Contexto de tema

export default function TransactionsScreen() {
  const navigation = useNavigation();
  const { isDark } = useTheme();

  const { tarjetas, listarTarjetas, tarjetaActual, selectTarjeta } = useTarjetaStore();
  const [filterType, setFilterType] = useState("todos");

  useEffect(() => {
    listarTarjetas({});
  }, []);

  const totalGlobal = tarjetas.reduce(
    (acc, t) => acc + (t.saldo || 0),
    0
  );

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#121212' : '#F5F5F5' }]}>
      
      <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
        <Icon name="arrow-back" size={24} color={isDark ? '#FFF' : '#000'} />
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.selector, { backgroundColor: isDark ? '#2A2A3D' : '#e5e7eb' }]}
        onPress={() => navigation.navigate("SelectTarjetaScreen")}
      >
        <Text style={[styles.selectorText, { color: isDark ? '#FFF' : '#000' }]}>
          {tarjetaActual?.card_holder
            ? `Tarjeta: ${tarjetaActual.card_holder}`
            : "Seleccionar tarjeta"}
        </Text>
        <Icon name="chevron-down" size={20} color={isDark ? '#FFF' : '#000'} />
      </TouchableOpacity>

      {tarjetaActual?.id && (
        <View style={[styles.miniCard, { backgroundColor: isDark ? '#1e3a8a' : '#1e3a8a' }]}>
          <Text style={styles.cardTitle}>{tarjetaActual.brand}</Text>
          <Text style={styles.cardNumber}>**** **** **** {tarjetaActual.card_number?.slice(-4)}</Text>
          <Text style={styles.cardHolder}>{tarjetaActual.card_holder}</Text>
          <Text style={styles.cardBalance}>Saldo: S/ {tarjetaActual.saldo}</Text>
        </View>
      )}

      {!tarjetaActual?.id && (
        <Text style={[styles.globalTotal, { color: isDark ? '#FFF' : '#000' }]}>
          Saldo total: S/ {totalGlobal}
        </Text>
      )}

      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[styles.filterBtn, { backgroundColor: "#f87171" }]}
          onPress={() => setFilterType("gasto")}
        >
          <Text style={styles.filterText}>Gasto</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.filterBtn, { backgroundColor: "#4ade80" }]}
          onPress={() => setFilterType("ingreso")}
        >
          <Text style={styles.filterText}>Ingreso</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.filterBtn, { backgroundColor: "#facc15" }]}
          onPress={() => setFilterType("factura")}
        >
          <Text style={styles.filterText}>Factura</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.filterBtn, { backgroundColor: "#38bdf8" }]}
          onPress={() => setFilterType("ahorro")}
        >
          <Text style={styles.filterText}>Ahorro</Text>
        </TouchableOpacity>
      </View>

      <Text style={[styles.movementsText, { color: isDark ? '#FFF' : '#000' }]}>
        Aquí van los movimientos filtrados por: {filterType}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  backBtn: { marginBottom: 10 },
  selector: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 12,
    borderRadius: 10,
    marginBottom: 15,
  },
  selectorText: { fontSize: 16, fontWeight: "bold" },
  miniCard: {
    padding: 15,
    marginTop: 15,
    borderRadius: 15,
  },
  cardTitle: { color: "white", fontSize: 16 },
  cardNumber: { color: "white", marginTop: 5 },
  cardHolder: { color: "white", marginTop: 5 },
  cardBalance: { color: "white", marginTop: 10, fontSize: 16, fontWeight: "bold" },
  globalTotal: { marginTop: 15, fontSize: 18, fontWeight: "700" },
  filterContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 25,
  },
  filterBtn: {
    paddingVertical: 10,
    paddingHorizontal: 13,
    borderRadius: 10,
  },
  filterText: {
    fontSize: 15,
    fontWeight: "bold",
    color: "white",
  },
  movementsText: { marginTop: 20, textAlign: "center", fontSize: 16 },
});
