import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { supabase } from "../supabase/supabase.config";
import { ObtenerIdAuthSupabase } from "../supabase/GlobalSupabase";
import { useTheme } from '../context/ThemeContext';
// 1. Importamos el store de suscripciones
import { useSubscription } from '../store/SubscriptionStore';
import { Ionicons } from '@expo/vector-icons'; // Importamos iconos para el botón

export default function TransacScreen() {
  // 2. Obtenemos el estado de la suscripción
  const { isPro } = useSubscription();
  const navigation = useNavigation();
  const { isDark } = useTheme();

  const [movimientos, setMovimientos] = useState([]);
  const [filtro, setFiltro] = useState("gasto");

  // --- LÓGICA DE BLOQUEO PREMIUM ---
  const handleTransferencia = () => {
    // Si NO es pro, mostramos la alerta y detenemos la ejecución
    if (!isPro) {
      Alert.alert(
        "💎 Función Premium",
        "Necesitas una suscripción para realizar transferencias ilimitadas.",
        [
          { text: "Cancelar", style: "cancel" },
          { 
            text: "Ir a la Tienda", 
            // Asegúrate que 'SubscriptionScreen' esté registrado en tu App.js
            onPress: () => navigation.navigate('SubscriptionScreen') 
          }
        ]
      );
      return; 
    }

    // SI ES PRO, continuamos con la lógica normal
    console.log("Usuario es PRO, permitiendo acceso...");
    // Aquí navegarías a la pantalla de crear transferencia real:
    // navigation.navigate('CrearTransferenciaScreen');
  };
  // --------------------------------

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
            <View>
                <Text style={[styles.ref, { color: isDark ? '#fff' : '#000' }]}>{item.referencia}</Text>
                <Text style={[styles.fecha, { color: isDark ? '#aaa' : '#888' }]}>{item.fecha}</Text>
            </View>
            <Text style={[styles.monto, { color: isDark ? '#fff' : '#000' }]}>S/ {item.monto}</Text>
          </View>
        )}
      />

      {/* BOTÓN FLOTANTE PARA AGREGAR (CON PROTECCIÓN PREMIUM) */}
      <TouchableOpacity 
        style={[styles.fab, { backgroundColor: isDark ? '#347AF0' : '#3b82f6' }]} 
        onPress={handleTransferencia}
      >
        <Ionicons name="add" size={30} color="white" />
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },

  backButton: { marginBottom: 10, paddingVertical: 6 },
  backText: { fontSize: 18, fontWeight: "bold" },

  tabs: { flexDirection: "row", justifyContent: "space-between", marginBottom: 15, borderRadius: 10, padding: 5 },
  tab: { flex: 1, padding: 10, borderRadius: 8, alignItems: "center" },
  tabText: { fontSize: 14 },

  totalText: { fontSize: 20, fontWeight: "bold", marginBottom: 15 },

  card: { padding: 15, borderRadius: 10, marginBottom: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  ref: { fontSize: 16, fontWeight: "600" },
  monto: { fontSize: 16, fontWeight: 'bold' },
  fecha: { fontSize: 12, marginTop: 5 },

  // Estilo del botón flotante
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  }
});