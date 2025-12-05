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

// ⭐ IMPORTAR DARK MODE
import { useTheme } from "../context/ThemeContext";

export default function ConfirmPaymentScreen() {
  const navigation = useNavigation();
  const route = useRoute();

  // ⭐ DARK MODE
  const { isDark } = useTheme();

  const { usuarioDestino, purpose, amount } = route.params || {};

  const { tarjetas, listarTarjetas } = useTarjetaStore();
  const [selectedCardId, setSelectedCardId] = useState(null);
  const [loadingPay, setLoadingPay] = useState(false);

  useEffect(() => {
    const cargarMisTarjetas = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data: datosMiPerfil } = await supabase
          .from("usuarios")
          .select("id")
          .eq("idauth", user.id)
          .single();

        const misTarjetas = await listarTarjetas(datosMiPerfil.id);

        if (misTarjetas && misTarjetas.length > 0) {
          setSelectedCardId(misTarjetas[0].id);
        }

      } catch (e) {
        console.error("Error cargando tarjetas:", e);
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
      const tarjetaOrigen = tarjetas.find((t) => t.id === selectedCardId);

      const cuentaDestino = await ObtenerCuentaPorUsuario(usuarioDestino.id);
      if (!cuentaDestino) {
        Alert.alert("Error", "El destinatario no tiene una cuenta válida.");
        return setLoadingPay(false);
      }

      const now = new Date();
      const fecha = now.toISOString().split("T")[0]; 
      const hora = now.toTimeString().split(" ")[0]; 

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
          fecha,
          hora,
        })
        .select()
        .single();

      if (error) throw error;

      navigation.navigate("TransactionSuccess", {
        transaccionId: data.id,
        amount,
        usuarioDestino,
        tarjetaUsada: tarjetaOrigen,
        fecha,
        hora,
      });

    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setLoadingPay(false);
    }
  };

  const renderCardItem = ({ item }) => {
    const isSelected = selectedCardId === item.id;
    const isMaster = item.numero.startsWith("5");

    return (
      <TouchableOpacity
        style={[
          styles.cardOption,
          {
            backgroundColor: isDark ? "#1E1E1E" : "#FFF",      // ⭐
            borderColor: isSelected
              ? "#347AF0"
              : isDark
              ? "#444"
              : "transparent",
          },
          isSelected && { backgroundColor: isDark ? "#2A3B5F" : "#F4F8FF" },
        ]}
        onPress={() => setSelectedCardId(item.id)}
      >
        <View style={styles.cardLeft}>
          <FontAwesome
            name={isMaster ? "cc-mastercard" : "cc-visa"}
            size={24}
            color={isMaster ? "#EB001B" : "#1A1F71"}
          />
          <Text
            style={[
              styles.cardText,
              { color: isDark ? "#EEE" : "#333" },   // ⭐
            ]}
          >
            Tarjeta ************{item.numero.slice(-4)}
          </Text>
        </View>

        <View
          style={[
            styles.radioOuter,
            { borderColor: isDark ? "#AAA" : "#DDD" }, // ⭐
          ]}
        >
          {isSelected && (
            <View
              style={[
                styles.radioInner,
                { backgroundColor: "#347AF0" },
              ]}
            />
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView
      style={[
        styles.container,
        {
          backgroundColor: isDark ? "#121212" : "#F8F9FD", // ⭐
        },
      ]}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather
            name="chevron-left"
            size={28}
            color={isDark ? "#FFF" : "#333"} // ⭐
          />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <Text style={[styles.title, { color: isDark ? "#FFF" : "#1A1A1A" }]}>
          Confirmar Pago
        </Text>

        <Text style={[styles.subtitle, { color: isDark ? "#BBB" : "#757575" }]}>
          Revisa los detalles antes de enviar
        </Text>

        <View
          style={[
            styles.userCard,
            {
              backgroundColor: isDark ? "#1E1E1E" : "#FFF", // ⭐
              shadowOpacity: isDark ? 0 : 0.05,
            },
          ]}
        >
          <Image
            source={{
              uri: usuarioDestino?.foto || "https://i.pravatar.cc/150?img=3",
            }}
            style={styles.avatar}
          />
          <Text
            style={[
              styles.userName,
              { color: isDark ? "#FFF" : "#1A1A1A" }, // ⭐
            ]}
          >
            {usuarioDestino?.nombre}
          </Text>
          <Text style={[styles.userEmail, { color: isDark ? "#AAA" : "#888" }]}>
            {usuarioDestino?.correo}
          </Text>
          <Text
            style={[
              styles.purposeText,
              { color: isDark ? "#78A7FF" : "#347AF0" }, // ⭐
            ]}
          >
            Propósito: {purpose}
          </Text>
        </View>

        <Text
          style={[
            styles.sectionLabel,
            { color: isDark ? "#DDD" : "#333" }, // ⭐
          ]}
        >
          Pagar con mi cuenta
        </Text>

        <View style={{ flex: 1 }}>
          <FlatList
            data={tarjetas}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderCardItem}
            contentContainerStyle={{ paddingBottom: 20 }}
            ListEmptyComponent={
              <Text style={[styles.emptyText, { color: isDark ? "#AAA" : "#999" }]}>
                No tienes tarjetas registradas.
              </Text>
            }
          />
        </View>

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
  container: { flex: 1 },
  header: { paddingHorizontal: 20, paddingTop: 10 },
  content: { flex: 1, paddingHorizontal: 24, paddingTop: 10 },

  title: { fontSize: 26, fontWeight: "bold", marginBottom: 5 },
  subtitle: { fontSize: 15, marginBottom: 25 },

  userCard: {
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 2,
    marginBottom: 25,
  },

  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 10,
  },

  userName: { fontSize: 18, fontWeight: "bold" },
  userEmail: { fontSize: 13 },
  purposeText: { marginTop: 8, fontWeight: "500", fontSize: 14 },

  sectionLabel: { fontSize: 16, fontWeight: "600", marginBottom: 15 },

  cardOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
  },

  cardLeft: { flexDirection: "row", alignItems: "center" },

  cardText: { marginLeft: 10, fontSize: 15, fontWeight: "500" },

  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },

  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },

  emptyText: { textAlign: "center", marginTop: 20 },

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
