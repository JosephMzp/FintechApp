import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useTarjetaStore } from "../store/TarjetaStore";
import Icon from "react-native-vector-icons/Ionicons";

export default function TransactionsScreen() {
  const navigation = useNavigation();

  const { tarjetas, listarTarjetas, tarjetaActual, selectTarjeta } = useTarjetaStore();

  const [filterType, setFilterType] = useState("todos");

  // 🔹 Cargar todas las tarjetas al entrar
  useEffect(() => {
    listarTarjetas({}); // tu función ya sabe obtener por user_id
  }, []);

  // 🔹 Total de todas las tarjetas combinadas
  const totalGlobal = tarjetas.reduce(
    (acc, t) => acc + (t.saldo || 0),
    0
  );

  return (
    <View style={styles.container}>
      
      {/* 🔙 Botón para retroceder */}
      <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
        <Icon name="arrow-back" size={24} />
      </TouchableOpacity>

      {/* 🔽 Selector de tarjeta */}
      <TouchableOpacity
        style={styles.selector}
        onPress={() => navigation.navigate("SelectTarjetaScreen")}
      >
        <Text style={styles.selectorText}>
          {tarjetaActual?.card_holder
            ? `Tarjeta: ${tarjetaActual.card_holder}`
            : "Seleccionar tarjeta"}
        </Text>
        <Icon name="chevron-down" size={20} />
      </TouchableOpacity>

      {/* 🔹 Mini tarjeta arriba */}
      {tarjetaActual?.id && (
        <View style={styles.miniCard}>
          <Text style={styles.cardTitle}>{tarjetaActual.brand}</Text>
          <Text style={styles.cardNumber}>**** **** **** {tarjetaActual.card_number?.slice(-4)}</Text>
          <Text style={styles.cardHolder}>{tarjetaActual.card_holder}</Text>
          <Text style={styles.cardBalance}>Saldo: S/ {tarjetaActual.saldo}</Text>
        </View>
      )}

      {/* 🔹 Total global si NO hay tarjeta seleccionada */}
      {!tarjetaActual?.id && (
        <Text style={styles.globalTotal}>Saldo total: S/ {totalGlobal}</Text>
      )}

      {/* 🔥 Botones filtros */}
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

      {/* Aquí iría la lista filtrada de movimientos */}
      <Text style={{ marginTop: 20, textAlign: "center", fontSize: 16 }}>
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
    backgroundColor: "#e5e7eb",
  },
  selectorText: { fontSize: 16, fontWeight: "bold" },
  miniCard: {
    backgroundColor: "#1e3a8a",
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
});
