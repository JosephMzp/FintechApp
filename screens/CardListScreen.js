import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  Pressable,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import { supabase } from "../supabase/supabase.config";
import { useTarjetaStore } from "../store/TarjetaStore";
import { useFocusEffect } from "@react-navigation/native";
import { useTheme } from "../context/ThemeContext";   // ⭐ NUEVO

export default function CardListScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { isDark } = useTheme();   // ⭐ NUEVO

  const showSuccessMessage = route?.params?.showSuccess ?? false;

  const { tarjetas, listarTarjetas, eliminarTarjeta, loading } = useTarjetaStore();
  const [userId, setUserId] = useState(null);

  const [modalVisible, setModalVisible] = useState(false);
  const [tarjetaAEliminar, setTarjetaAEliminar] = useState(null);

  useFocusEffect(
    useCallback(() => {
      const fetchCards = async () => {
        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) return;

          const { data: datosUsuario } = await supabase
            .from("usuarios")
            .select("id")
            .eq("idauth", user.id)
            .single();

          if (!datosUsuario) return;

          const idNumerico = datosUsuario.id;
          setUserId(idNumerico);

          await listarTarjetas(idNumerico);
        } catch (e) {
          console.log("Error cargando tarjetas", e);
        }
      };

      fetchCards();
    }, [route?.params?._refreshAt])
  );

  const handleDelete = (id) => {
    setTarjetaAEliminar(id);
    setModalVisible(true);
  };

  const confirmarEliminacion = async () => {
    await eliminarTarjeta(tarjetaAEliminar);
    setModalVisible(false);
    setTarjetaAEliminar(null);
  };

  const renderItem = ({ item }) => {
    const isMaster = item.numero.startsWith("5");
    const iconName = isMaster ? "cc-mastercard" : "cc-visa";
    const iconColor = isMaster ? "#EB001B" : "#1A1F71";

    const last4 = item.numero.slice(-4);

    return (
      <View
        style={[
          styles.cardItem,
          { backgroundColor: isDark ? "#1A1A1A" : "#FFF" } // ⭐ NUEVO
        ]}
      >

        <View style={styles.cardIconContainer}>
          <FontAwesome name={iconName} size={24} color={iconColor} />
        </View>

        <View style={styles.cardInfo}>
          <Text
            style={[
              styles.accountLabel,
              { color: isDark ? "#AAA" : "#888" } // ⭐ NUEVO
            ]}
          >
            Cuenta
          </Text>

          <Text
            style={[
              styles.cardNumber,
              { color: isDark ? "#FFF" : "#333" } // ⭐ NUEVO
            ]}
          >
            •••• •••• •••• {last4}
          </Text>
        </View>

        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDelete(item.id)}
        >
          <Ionicons name="trash-outline" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: isDark ? "#0D0D0D" : "#F8F9FD" } // ⭐ NUEVO
      ]}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color={isDark ? "#FFF" : "#333"} /> 
        </TouchableOpacity>
      </View>

      {showSuccessMessage && (
        <View style={styles.successBanner}>
          <Ionicons name="checkmark-circle" size={24} color="#15803d" />
          <Text style={styles.successText}>Tu tarjeta fue agregada correctamente</Text>
        </View>
      )}

      <Text
        style={[
          styles.title,
          { color: isDark ? "#FFF" : "#333" } // ⭐ NUEVO
        ]}
      >
        Lista de tarjetas
      </Text>

      <Text
        style={[
          styles.subtitle,
          { color: isDark ? "#AAA" : "#666" } // ⭐ NUEVO
        ]}
      >
        Ingresa la información de tu tarjeta en la caja de abajo.
      </Text>

      {loading && tarjetas.length === 0 ? (
        <ActivityIndicator size="large" color="#347AF0" style={{ marginTop: 50 }} />
      ) : (
        <FlatList
          data={tarjetas}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <Text style={[styles.emptyText, { color: isDark ? "#777" : "#aaa" }]}>
              No tienes tarjetas guardadas.
            </Text>
          }
        />
      )}

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate("AddCardForm")}
        >
          <Ionicons name="add" size={24} color="#fff" />
          <Text style={styles.addButtonText}>Agregar otra tarjeta</Text>
        </TouchableOpacity>

        {showSuccessMessage && (
          <TouchableOpacity
            style={styles.continueButton}
            onPress={() => navigation.navigate("Home")}
          >
            <Text style={styles.continueButtonText}>Continuar</Text>
          </TouchableOpacity>
        )}
      </View>

      <Modal transparent visible={modalVisible} animationType="fade">
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.modalBox,
              { backgroundColor: isDark ? "#1A1A1A" : "#FFF" } // ⭐ NUEVO
            ]}
          >
            <Text
              style={[
                styles.modalTitle,
                { color: isDark ? "#FFF" : "#111" } // ⭐ NUEVO
              ]}
            >
              Eliminar tarjeta
            </Text>

            <Text
              style={[
                styles.modalText,
                { color: isDark ? "#DDD" : "#444" } // ⭐ NUEVO
              ]}
            >
              ¿Estás seguro de que deseas eliminar esta tarjeta?
            </Text>

            <View style={styles.modalButtons}>
              <Pressable
                style={[styles.modalBtn, { backgroundColor: "#e5e7eb" }]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={[styles.modalBtnText, { color: "#374151" }]}>No</Text>
              </Pressable>

              <Pressable
                style={[styles.modalBtn, { backgroundColor: "#EF4444" }]}
                onPress={confirmarEliminacion}
              >
                <Text style={[styles.modalBtnText, { color: "#fff" }]}>Sí</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  header: {
    marginBottom: 10,
  },
  backButton: {
    marginBottom: 10,
  },
  successBanner: {
    flexDirection: "row",
    backgroundColor: "#DCFCE7",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 20,
  },
  successText: {
    color: "#166534",
    fontWeight: "600",
    marginLeft: 10,
    fontSize: 14,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 20,
  },
  listContent: {
    paddingBottom: 100,
  },
  cardItem: {
    flexDirection: "row",
    borderRadius: 16,
    padding: 15,
    alignItems: "center",
    marginBottom: 15,
    elevation: 2,
  },
  cardIconContainer: {
    width: 40,
    alignItems: "center",
  },
  cardInfo: {
    flex: 1,
    marginLeft: 10,
  },
  accountLabel: {
    fontSize: 12,
  },
  cardNumber: {
    fontSize: 16,
    fontWeight: "500",
    marginTop: 2,
  },
  deleteButton: {
    backgroundColor: "#EF4444",
    padding: 10,
    borderRadius: 8,
  },
  emptyText: {
    textAlign: "center",
    marginTop: 50,
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 20,
    right: 20,
  },
  addButton: {
    backgroundColor: "#347AF0",
    borderRadius: 30,
    paddingVertical: 15,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
    elevation: 5,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  continueButton: {
    backgroundColor: "#fff",
    borderRadius: 30,
    paddingVertical: 15,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#347AF0",
  },
  continueButtonText: {
    color: "#347AF0",
    fontSize: 16,
    fontWeight: "600",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: {
    width: "80%",
    padding: 25,
    borderRadius: 20,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 10,
  },
  modalText: {
    fontSize: 15,
    textAlign: "center",
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  modalBtn: {
    flex: 1,
    paddingVertical: 12,
    marginHorizontal: 5,
    borderRadius: 12,
    alignItems: "center",
  },
  modalBtnText: {
    fontSize: 16,
    fontWeight: "600",
  },
});
