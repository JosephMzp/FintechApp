import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { supabase } from "../supabase/supabase.config";
import { ObtenerIdAuthSupabase } from "../supabase/GlobalSupabase";
import { useTheme } from '../context/ThemeContext';

export default function SpendingScreen() {
  const navigation = useNavigation();
  const { isDark } = useTheme();

  const [movimientos, setMovimientos] = useState([]);
  const [filtro, setFiltro] = useState("gasto");

  const opciones = [
    { key: "gasto", label: "Gastos" },
    { key: "ingreso", label: "Ingresos" },
    { key: "factura", label: "Facturas" },
    { key: "ahorro", label: "Ahorro" },
  ];

  const cargarMovimientos = async () => {
    const idauth = await ObtenerIdAuthSupabase();
    if (!idauth) return;

    const { data, error } = await supabase
      .from("movimientos")
      .select("*")
      .eq("idauth", idauth)
      .order("fecha", { ascending: false });

    if (!error) setMovimientos(data);
  };

  useEffect(() => {
    cargarMovimientos();
  }, []);

  const filtrados = movimientos.filter((m) => m.tipo === filtro);
  const total = filtrados.reduce((sum, item) => sum + (parseFloat(item.monto) || 0), 0);

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#121212' : '#fff' }]}>

      {/* 🔙 BOTÓN DE REGRESO */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={[styles.backText, { color: isDark ? '#347AF0' : '#3b82f6' }]}>← Volver</Text>
      </TouchableOpacity>

      {/* TABS */}
      <View style={[styles.tabs, { backgroundColor: isDark ? '#1e1e1e' : '#f1f1f1' }]}>
        {opciones.map((o) => (
          <TouchableOpacity
            key={o.key}
            style={[styles.tab, filtro === o.key && { backgroundColor: '#347AF0' }]}
            onPress={() => setFiltro(o.key)}
          >
            <Text style={[styles.tabText, filtro === o.key ? { color: '#fff', fontWeight: 'bold' } : { color: isDark ? '#ccc' : '#555' }]}>
              {o.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* TOTAL */}
      <Text style={[styles.totalText, { color: isDark ? '#fff' : '#000' }]}>
        Total: S/ {total.toFixed(2)}
      </Text>

      {/* LISTA */}
      <FlatList
        data={filtrados}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={[styles.card, { backgroundColor: isDark ? '#1e1e1e' : '#f9f9f9' }]}>
            <Text style={[styles.ref, { color: isDark ? '#fff' : '#000' }]}>{item.referencia}</Text>
            <Text style={[styles.monto, { color: isDark ? '#fff' : '#000' }]}>S/ {item.monto}</Text>
            <Text style={[styles.fecha, { color: isDark ? '#aaa' : '#888' }]}>{item.fecha}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },

  backButton: { marginBottom: 10, paddingVertical: 6 },
  backText: { fontSize: 18, fontWeight: "bold" },

  tabs: { flexDirection: "row", justifyContent: "space-between", marginBottom: 15, borderRadius: 10, padding: 5 },
  tab: { flex: 1, padding: 10, borderRadius: 8, alignItems: "center" },

  totalText: { fontSize: 20, fontWeight: "bold", marginBottom: 15 },

  card: { padding: 15, borderRadius: 10, marginBottom: 12 },
  ref: { fontSize: 16, fontWeight: "600" },
  monto: { fontSize: 16, marginTop: 5 },
  fecha: { fontSize: 12, marginTop: 5 },
});
