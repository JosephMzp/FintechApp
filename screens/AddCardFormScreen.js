import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Modal,
  Pressable,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { supabase } from "../supabase/supabase.config";
import { useTarjetaStore } from "../store/TarjetaStore";
import { useTheme } from "../context/ThemeContext";

export default function AddCardFormScreen() {
  const navigation = useNavigation();
  const { isDark } = useTheme();
  const { insertarTarjeta, loading: storeLoading } = useTarjetaStore();
  const [validating, setValidating] = useState(false);
  const [holderName, setHolderName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const showModal = (msg) => {
    setModalMessage(msg);
    setModalVisible(true);
  };

  const handleHolderNameChange = (text) => {
    let cleaned = text.replace(/[^A-Za-zÁÉÍÓÚÜÑáéíóúüñ\s]/g, "").toUpperCase();
    const words = cleaned.trim().split(/\s+/);
    if (words.length > 2) return;
    setHolderName(cleaned);
  };

  const handleCardNumberChange = (text) => {
    const cleaned = text.replace(/[^0-9]/g, "");
    const formatted = cleaned.match(/.{1,4}/g)?.join(" ") || cleaned;
    if (cleaned.length <= 16) setCardNumber(formatted);
  };

  const handleExpiryChange = (text) => {
    let cleaned = text.replace(/[^0-9]/g, "");
    if (cleaned.length > 4) return;
    if (cleaned.length >= 3) {
      const mm = cleaned.slice(0, 2);
      const yy = cleaned.slice(2, 4);
      const monthNum = parseInt(mm);
      if (monthNum < 1 || monthNum > 12) return;
      if (yy.length === 2 && parseInt(yy) < 25) return;
      setExpiry(`${mm}/${yy}`);
    } else {
      setExpiry(cleaned);
    }
  };

  const saveCard = async () => {
    if (!holderName.trim()) return showModal("Ingresa un nombre válido.");
    if (holderName.trim().split(" ").length !== 2)
      return showModal("Debes ingresar nombre y apellido (2 palabras).");
    if (!cardNumber || cardNumber.replace(/\s/g, "").length < 16)
      return showModal("Número de tarjeta incompleto.");
    if (!expiry || expiry.length < 5)
      return showModal("Fecha de vencimiento incompleta.");
    if (!cvv || cvv.length < 3) return showModal("CVV incompleto.");

    setValidating(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        showModal("Tu sesión ha expirado. Inicia sesión nuevamente.");
        setValidating(false);
        return;
      }

      const { data: datosUsuario } = await supabase
        .from("usuarios")
        .select("id")
        .eq("idauth", user.id)
        .single();

      if (!datosUsuario) {
        showModal("Error al obtener la información del usuario.");
        setValidating(false);
        return;
      }

      const numeroTarjeta = cardNumber.replace(/\s/g, "");

      const { data: tarjetaExistente } = await supabase
        .from("tarjetas")
        .select("id")
        .eq("numero", numeroTarjeta)
        .eq("user_id", datosUsuario.id)
        .maybeSingle();

      if (tarjetaExistente) {
        showModal("Esta tarjeta ya se encuentra registrada.");
        setValidating(false);
        return;
      }

      const datosParaBD = {
        user_id: datosUsuario.id,
        cuenta_id: null,
        nombre: holderName.trim(),
        numero: numeroTarjeta,
        vencimiento: expiry,
        codigo: parseInt(cvv),
      };

      const result = await insertarTarjeta(datosParaBD);

      if (result) {
        setHolderName("");
        setCardNumber("");
        setExpiry("");
        setCvv("");
        showModal("La tarjeta ha sido agregada exitosamente.");

        setTimeout(() => {
          setModalVisible(false);
          navigation.goBack();
        }, 1500);
      } else {
        showModal("No se pudo guardar la tarjeta.");
      }
    } catch (error) {
      console.error(error);
      showModal("Ocurrió un error inesperado.");
    } finally {
      setValidating(false);
    }
  };

  const isLoading = validating || storeLoading;

  const dynamicStyles = {
    container: { backgroundColor: isDark ? "#121212" : "#FFFFFF" },
    text: { color: isDark ? "#FFFFFF" : "#333" },
    label: { color: isDark ? "#CCCCCC" : "#666" },
    input: {
      backgroundColor: isDark ? "#1E1E1E" : "#F9F9F9",
      color: isDark ? "#FFFFFF" : "#333",
      borderColor: isDark ? "#555" : "#E0E0E0",
    },
    modalBox: { backgroundColor: isDark ? "#1E1E1E" : "#FFF" },
    modalText: { color: isDark ? "#FFF" : "#333" },
  };

  return (
    <View style={[styles.container, dynamicStyles.container]}>
      {/* 🔙 BOTÓN PARA RETROCEDER */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={[styles.backText, dynamicStyles.text]}>← Volver</Text>
      </TouchableOpacity>

      <Text style={[styles.title, dynamicStyles.text]}>Agregar Tarjeta</Text>

      <Text style={[styles.label, dynamicStyles.label]}>Titular de la tarjeta</Text>
      <TextInput
        style={[styles.input, dynamicStyles.input]}
        placeholder="JUAN PEREZ"
        placeholderTextColor={isDark ? "#888" : "#aaa"}
        value={holderName}
        onChangeText={handleHolderNameChange}
      />

      <Text style={[styles.label, dynamicStyles.label]}>Número de tarjeta</Text>
      <TextInput
        style={[styles.input, dynamicStyles.input]}
        placeholder="0000 0000 0000 0000"
        placeholderTextColor={isDark ? "#888" : "#aaa"}
        value={cardNumber}
        onChangeText={handleCardNumberChange}
        keyboardType="numeric"
        maxLength={19}
      />

      <View style={styles.row}>
        <View style={{ flex: 1, marginRight: 10 }}>
          <Text style={[styles.label, dynamicStyles.label]}>Vencimiento</Text>
          <TextInput
            style={[styles.input, dynamicStyles.input]}
            placeholder="MM/YY"
            placeholderTextColor={isDark ? "#888" : "#aaa"}
            value={expiry}
            onChangeText={handleExpiryChange}
            maxLength={5}
            keyboardType="numeric"
          />
        </View>

        <View style={{ flex: 1 }}>
          <Text style={[styles.label, dynamicStyles.label]}>CVV</Text>
          <TextInput
            style={[styles.input, dynamicStyles.input]}
            placeholder="123"
            placeholderTextColor={isDark ? "#888" : "#aaa"}
            value={cvv}
            onChangeText={setCvv}
            keyboardType="numeric"
            secureTextEntry
            maxLength={3}
          />
        </View>
      </View>

      <TouchableOpacity
        style={[styles.button, isLoading && styles.buttonDisabled]}
        onPress={saveCard}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Verificar y Guardar</Text>
        )}
      </TouchableOpacity>

      <Modal transparent visible={modalVisible} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalBox, dynamicStyles.modalBox]}>
            <Text style={[styles.modalText, dynamicStyles.modalText]}>
              {modalMessage}
            </Text>
            <Pressable
              style={styles.modalButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.modalButtonText}>Aceptar</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: "center" },
  backButton: { marginBottom: 15 },
  backText: { fontSize: 16, fontWeight: "600" },
  title: { fontSize: 28, fontWeight: "800", marginBottom: 30, textAlign: "center" },
  label: { fontSize: 14, marginBottom: 5, marginLeft: 5, fontWeight: "600" },
  input: { padding: 15, borderWidth: 1, borderRadius: 12, marginBottom: 20, fontSize: 16 },
  row: { flexDirection: "row", justifyContent: "space-between" },
  button: { backgroundColor: "#347AF0", padding: 18, borderRadius: 15, marginTop: 20 },
  buttonDisabled: { backgroundColor: "#A0C4FF" },
  buttonText: { color: "#fff", textAlign: "center", fontWeight: "700", fontSize: 18 },
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.4)", justifyContent: "center", alignItems: "center" },
  modalBox: { width: "80%", padding: 25, borderRadius: 20, elevation: 10 },
  modalText: { fontSize: 16, textAlign: "center", marginBottom: 20 },
  modalButton: { backgroundColor: "#347AF0", padding: 12, borderRadius: 12 },
  modalButtonText: { color: "#fff", textAlign: "center", fontWeight: "700" },
});
