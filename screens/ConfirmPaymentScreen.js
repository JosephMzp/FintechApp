import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Image,
  FlatList,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Feather, FontAwesome } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useTarjetaStore } from "../store/TarjetaStore";
import { supabase } from "../supabase/supabase.config";
import { ObtenerCuentaPorUsuario } from "../supabase/crudUsuarios"; 

export default function ConfirmPaymentScreen() {
  const navigation = useNavigation();
  const route = useRoute();

  // Datos que vienen del flujo anterior (usuario destino, etc)
  const { usuarioDestino, purpose, amount } = route.params || {};

  // Store de tarjetas
  const { tarjetas, listarTarjetas } = useTarjetaStore();

  const [selectedCardId, setSelectedCardId] = useState(null);
  const [loadingPay, setLoadingPay] = useState(false);

  // 1. Cargar tarjetas del USUARIO EN SESIÓN (Fix: Forzar carga siempre)
  useEffect(() => {
    const cargarMisTarjetas = async () => {
      try {
        // A. Obtener el usuario autenticado (tú)
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
            console.log("No hay sesión activa");
            return;
        }

        // B. Obtener tu ID numérico de la tabla 'usuarios'
        const { data: datosMiPerfil, error } = await supabase
          .from("usuarios")
          .select("id")
          .eq("idauth", user.id)
          .single();

        if (error || !datosMiPerfil) {
            console.error("Error obteniendo perfil del usuario logueado:", error);
            return;
        }

        // C. Cargar TUS tarjetas explícitamente
        console.log("Cargando tarjetas para mi ID:", datosMiPerfil.id);
        const misTarjetas = await listarTarjetas(datosMiPerfil.id);

        // D. Seleccionar la primera por defecto si existe
        if (misTarjetas && misTarjetas.length > 0) {
          setSelectedCardId(misTarjetas[0].id);
        }

      } catch (error) {
        console.error("Error crítico cargando mis tarjetas:", error);
      }
    };

    cargarMisTarjetas();
  }, []);

  const handlePay = async () => {
    if (!selectedCardId) {
      Alert.alert("Atención", "Por favor selecciona una tarjeta para pagar.");
      return;
    }
    
    setLoadingPay(true);

    try {
      // A. Datos de la tarjeta origen (la tuya)
      const tarjetaOrigen = tarjetas.find((t) => t.id === selectedCardId);
      if (!tarjetaOrigen) throw new Error("Tarjeta no válida o no encontrada.");

      // B. Buscar ID de cuenta del destinatario
      // OJO: usuarioDestino es a quien le envías (viene de params)
      const cuentaDestino = await ObtenerCuentaPorUsuario(usuarioDestino.id);

      if (!cuentaDestino) {
        Alert.alert(
          "Error",
          "El usuario destino no tiene una cuenta configurada para recibir dinero."
        );
        setLoadingPay(false);
        return;
      }

      // C. Fechas para tu BD
      const now = new Date();
      const fecha = now.toISOString().split("T")[0]; // YYYY-MM-DD
      const hora = now.toTimeString().split(" ")[0]; // HH:MM:SS

      // D. Insertar Transacción
      const { data, error } = await supabase
        .from("transacciones")
        .insert({
          cuenta_origen: tarjetaOrigen.cuenta_id,
          cuenta_destino: cuentaDestino.id,
          monto: parseFloat(amount),
          tipo: "transferencia", 
          estado: "completado",
          referencia: `Envío a ${usuarioDestino.nombre}`,
          proposito: purpose, 
          fecha: fecha,
          hora: hora,
        })
        .select()
        .single();

      if (error) throw error;

      // E. Navegar a Éxito
      navigation.navigate("TransactionSuccess", {
        transaccionId: data.id,
        amount,
        usuarioDestino, // Para mostrar a quién le enviaste en el recibo
        tarjetaUsada: tarjetaOrigen,
        fecha,
        hora,
      });
    } catch (error) {
      console.error("Error pagando:", error);
      Alert.alert("Error", "No se pudo procesar el pago: " + error.message);
    } finally {
      setLoadingPay(false);
    }
  };

  // Renderizado de cada tarjeta
  const renderCardItem = ({ item }) => {
    const isSelected = selectedCardId === item.id;
    const isMaster = item.numero.startsWith("5");

    return (
      <TouchableOpacity
        style={[styles.cardOption, isSelected && styles.cardOptionSelected]}
        onPress={() => setSelectedCardId(item.id)}
      >
        <View style={styles.cardLeft}>
          <FontAwesome
            name={isMaster ? "cc-mastercard" : "cc-visa"}
            size={24}
            color={isMaster ? "#EB001B" : "#1A1F71"}
          />
          <Text style={styles.cardText}>
            Tarjeta ************{item.numero.slice(-4)}
          </Text>
        </View>

        {/* Radio Button */}
        <View style={styles.radioOuter}>
          {isSelected && <View style={styles.radioInner} />}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather name="chevron-left" size={28} color="#333" />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>Confirmar Pago</Text>
        <Text style={styles.subtitle}>Revisa los detalles antes de enviar</Text>

        {/* Resumen del Destinatario */}
        <View style={styles.userCard}>
          <Image
            source={{
              uri: usuarioDestino?.foto || "https://i.pravatar.cc/150?img=3",
            }}
            style={styles.avatar}
          />
          <Text style={styles.userName}>{usuarioDestino?.nombre}</Text>
          <Text style={styles.userEmail}>{usuarioDestino?.correo}</Text>
          <Text style={styles.purposeText}>Propósito: {purpose}</Text>
        </View>

        {/* Lista de Tarjetas (Tus tarjetas) */}
        <Text style={styles.sectionLabel}>Pagar con mi cuenta</Text>

        <View style={{ flex: 1 }}>
          <FlatList
            data={tarjetas}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderCardItem}
            contentContainerStyle={{ paddingBottom: 20 }}
            ListEmptyComponent={
              <Text style={styles.emptyText}>
                No tienes tarjetas registradas.
              </Text>
            }
          />
        </View>

        {/* Botón Pagar */}
        <View style={{ marginBottom: 20 }}>
          <TouchableOpacity
            style={[
              styles.payButton,
              loadingPay && { backgroundColor: "#999" },
            ]}
            onPress={handlePay}
            disabled={loadingPay}
          >
            {loadingPay ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.payButtonText}>Pagar S/{amount}</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8F9FD" },
  header: { paddingHorizontal: 20, paddingTop: 10 },
  content: { flex: 1, paddingHorizontal: 24, paddingTop: 10 },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#1A1A1A",
    marginBottom: 5,
  },
  subtitle: { fontSize: 15, color: "#757575", marginBottom: 25 },

  userCard: {
    backgroundColor: "#FFF",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
    marginBottom: 25,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 10,
    backgroundColor: "#eee",
  },
  userName: { fontSize: 18, fontWeight: "bold", color: "#1A1A1A" },
  userEmail: { fontSize: 13, color: "#888", marginTop: 2 },
  purposeText: {
    marginTop: 8,
    color: "#347AF0",
    fontWeight: "500",
    fontSize: 14,
  },

  sectionLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 15,
  },

  cardOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFF",
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "transparent",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  cardOptionSelected: { borderColor: "#347AF0", backgroundColor: "#F4F8FF" },
  cardLeft: { flexDirection: "row", alignItems: "center" },
  cardText: { marginLeft: 10, fontSize: 15, color: "#333", fontWeight: "500" },

  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: "#DDD",
    alignItems: "center",
    justifyContent: "center",
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#347AF0",
  },

  emptyText: { textAlign: "center", color: "#999", marginTop: 20 },

  payButton: {
    backgroundColor: "#347AF0",
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: "center",
    shadowColor: "#347AF0",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  payButtonText: { color: "#FFF", fontSize: 18, fontWeight: "bold" },
});