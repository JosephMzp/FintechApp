import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ScrollView,
} from "react-native";
import { useTransaccionesStore } from "../Stores/TransaccionesStore";
import { useUsuariosStore } from "../Stores/UsuariosStore";

const SpendingScreen = () => {
  const { obtenerUsuarioActual } = useUsuariosStore();
  const { mostrarTransacciones } = useTransaccionesStore();

  const [usuario, setUsuario] = useState(null);
  const [transacciones, setTransacciones] = useState([]);

  const [filtro, setFiltro] = useState("gasto"); // filtro por defecto

  // Para totales y gráfico
  const [totalGastos, setTotalGastos] = useState(0);
  const [saldoDisponible, setSaldoDisponible] = useState(0);

  useEffect(() => {
    const cargarDatos = async () => {
      const u = await obtenerUsuarioActual();
      setUsuario(u);

      const movs = await mostrarTransacciones(u.id);
      setTransacciones(movs);

      calcularTotales(movs);
    };

    cargarDatos();
  }, []);

  const calcularTotales = (movs) => {
    const totalGasto = movs
      .filter((m) => m.tipopordescubrir === "gasto")
      .reduce((acc, m) => acc + Math.abs(m.monto), 0);

    setTotalGastos(totalGasto);

    // saldo disponible = ingresos - gastos
    const totalIngresos = movs
      .filter((m) => m.tipopordescubrir === "ingreso")
      .reduce((acc, m) => acc + Math.abs(m.monto), 0);

    setSaldoDisponible(totalIngresos - totalGasto);
  };

  const categorias = [
    { id: "gasto", nombre: "Gastos" },
    { id: "ingreso", nombre: "Ingresos" },
    { id: "factura", nombre: "Facturas" },
    { id: "ahorro", nombre: "Ahorros" },
  ];

  const transaccionesFiltradas = transacciones.filter(
    (t) => t.tipopordescubrir === filtro
  );

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Text style={styles.ref}>{item.referencia}</Text>
      <Text style={styles.fecha}>{item.fecha}</Text>
      <Text style={styles.monto}>
        {item.tipopordescubrir === "gasto" ? "-" : "+"}${item.monto}
      </Text>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.titulo}>Resumen del Mes</Text>

      {/* CUADROS DE TOTAL */}
      <View style={styles.resumenContainer}>
        <View style={styles.cuadro}>
          <Text style={styles.cuadroTitulo}>Gasto Total</Text>
          <Text style={styles.cuadroMonto}>${totalGastos.toFixed(2)}</Text>
        </View>

        <View style={[styles.cuadro, { backgroundColor: "#facc15" }]}>
          <Text style={styles.cuadroTitulo}>Saldo Disponible</Text>
          <Text style={styles.cuadroMonto}>${saldoDisponible.toFixed(2)}</Text>
        </View>
      </View>

      {/* BOTONES DE FILTRO */}
      <View style={styles.filtros}>
        {categorias.map((c) => (
          <TouchableOpacity
            key={c.id}
            style={[
              styles.filtroBtn,
              filtro === c.id && styles.filtroActivo,
            ]}
            onPress={() => setFiltro(c.id)}
          >
            <Text
              style={[
                styles.filtroTexto,
                filtro === c.id && styles.filtroTextoActivo,
              ]}
            >
              {c.nombre}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* LISTA FILTRADA */}
      <Text style={styles.listadoTitulo}>Movimientos</Text>

      <FlatList
        data={transaccionesFiltradas}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        scrollEnabled={false}
      />
    </ScrollView>
  );
};

export default SpendingScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },

  titulo: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 15,
  },

  resumenContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  cuadro: {
    width: "48%",
    backgroundColor: "#3b82f6",
    borderRadius: 15,
    padding: 15,
  },

  cuadroTitulo: {
    color: "#fff",
    fontSize: 14,
    marginBottom: 5,
  },

  cuadroMonto: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
  },

  filtros: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 20,
  },

  filtroBtn: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#ccc",
  },

  filtroActivo: {
    backgroundColor: "#3b82f6",
    borderColor: "#3b82f6",
  },

  filtroTexto: {
    fontSize: 15,
  },

  filtroTextoActivo: {
    color: "white",
  },

  listadoTitulo: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },

  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 15,
    borderBottomWidth: 0.3,
    borderColor: "#ccc",
  },

  ref: { fontSize: 16, fontWeight: "500" },
  fecha: { fontSize: 12, color: "#666" },
  monto: { fontSize: 16, fontWeight: "bold" },
});
