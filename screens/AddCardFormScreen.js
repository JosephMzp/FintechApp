import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { supabase } from "../supabase/supabase.config";
import { useTarjetaStore } from "../store/TarjetaStore";

export default function AddCardFormScreen() {
  const navigation = useNavigation();

  // Traemos la función insertar y el loading del Store
  const { insertarTarjeta, loading: storeLoading } = useTarjetaStore();
  
  // Estado local para loading interno de la validación
  const [validating, setValidating] = useState(false);

  const [holderName, setHolderName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");

  // --- FORMATO NÚMERO (Espacios cada 4) ---
  const handleCardNumberChange = (text) => {
    const cleaned = text.replace(/[^0-9]/g, "");
    const formatted = cleaned.match(/.{1,4}/g)?.join(" ") || cleaned;
    if (cleaned.length <= 16) setCardNumber(formatted);
  };

  // --- FORMATO FECHA (MM/YY) ---
  const handleExpiryChange = (text) => {
    const cleaned = text.replace(/[^0-9]/g, "");
    if (cleaned.length >= 3) {
      setExpiry(`${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}`);
    } else {
      setExpiry(cleaned);
    }
  };

  const saveCard = async () => {
    // 1. Validaciones básicas
    if (!cardNumber || cardNumber.replace(/\s/g, '').length < 16)
      return Alert.alert("Error", "Número de tarjeta incompleto");
    if (!expiry || expiry.length < 5) 
      return Alert.alert("Error", "Fecha de vencimiento incompleta (MM/YY)");
    if (!cvv || cvv.length < 3) 
      return Alert.alert("Error", "CVV incompleto");
    if (!holderName) 
      return Alert.alert("Error", "Falta el nombre del titular");

    setValidating(true);

    try {
      // 2. Obtener usuario de Auth (UUID)
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        Alert.alert("Sesión expirada", "Por favor inicia sesión de nuevo.");
        setValidating(false);
        return;
      }

      // 3. EL PUENTE: Buscar el ID numérico en la tabla 'usuarios'
      const { data: datosUsuario, error: errorUser } = await supabase
        .from("usuarios")
        .select("id")
        .eq("idauth", user.id) // Buscamos por el UUID de Auth
        .single();

      if (errorUser || !datosUsuario) {
        console.error("Error buscando usuario:", errorUser);
        Alert.alert("Error", "No se encontró el perfil del usuario en la base de datos.");
        setValidating(false);
        return;
      }

      // (Opcional) Intentar buscar una cuenta asociada para llenar 'cuenta_id'
      // Si no tienes cuentas creadas, esto devolverá null, pero el código seguirá funcionando
      const { data: datosCuenta } = await supabase
         .from("cuentas")
         .select("id")
         .eq("user_id", datosUsuario.id)
         .limit(1)
         .maybeSingle();

      // 4. Preparar datos para insertar
      // Usamos datosUsuario.id (BigInt) en lugar de user.id (UUID)
      const datosParaBD = {
        user_id: datosUsuario.id, 
        cuenta_id: datosCuenta ? datosCuenta.id : null, // Asocia a la primera cuenta si existe
        nombre: holderName,
        numero: cardNumber.replace(/\s/g, ''), // Guardamos sin espacios
        vencimiento: expiry,
        codigo: parseInt(cvv),
      };

      console.log("Intentando guardar tarjeta para User ID:", datosUsuario.id);

      // 5. Llamar al Store
      const result = await insertarTarjeta(datosParaBD);

      if (result) {
  try {
    // refrescar explicitamente la lista usando el id numerico que ya tenemos:
    if (datosUsuario && datosUsuario.id) {
      await listarTarjetas(datosUsuario.id); // <-- fuerza que el store haga la consulta y actualice `tarjetas`
    }

    Alert.alert("Éxito", "Tarjeta guardada correctamente", [
      {
        text: "OK",
        onPress: () =>
          navigation.navigate("CardList", {
            showSuccess: true,
            // pasamos timestamp para "forzar" cambio de params si fuera necesario:
            _refreshAt: Date.now(),
          }),
      },
    ]);
  } catch (err) {
    console.error("Error refrescando lista tras insertar:", err);
    // para no romper la UX, igual navegamos
    navigation.navigate("CardList", { showSuccess: true, _refreshAt: Date.now() });
  }
} else {
        // Si result es null, el store probablemente imprimió el error
        Alert.alert("Error", "No se pudo guardar la tarjeta. Verifica los datos.");
      }

    } catch (error) {
      console.error("Error crítico en saveCard:", error);
      Alert.alert("Error", "Ocurrió un error inesperado al guardar.");
    } finally {
      setValidating(false);
    }
  };

  const isLoading = validating || storeLoading;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Agregar Tarjeta</Text>

      <Text style={styles.label}>Titular de la tarjeta</Text>
      <TextInput
        style={styles.input}
        placeholder="Ej. JUAN PEREZ"
        placeholderTextColor="#aaa"
        value={holderName}
        onChangeText={setHolderName}
        autoCapitalize="characters"
      />

      <Text style={styles.label}>Número de tarjeta</Text>
      <TextInput
        style={styles.input}
        placeholder="0000 0000 0000 0000"
        placeholderTextColor="#aaa"
        value={cardNumber}
        onChangeText={handleCardNumberChange}
        keyboardType="numeric"
        maxLength={19} 
      />

      <View style={styles.row}>
        <View style={{ flex: 1, marginRight: 10 }}>
          <Text style={styles.label}>Vencimiento</Text>
          <TextInput
            style={styles.input}
            placeholder="MM/YY"
            placeholderTextColor="#aaa"
            value={expiry}
            onChangeText={handleExpiryChange}
            maxLength={5}
            keyboardType="numeric"
          />
        </View>

        <View style={{ flex: 1 }}>
          <Text style={styles.label}>CVV</Text>
          <TextInput
            style={styles.input}
            placeholder="123"
            placeholderTextColor="#aaa"
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    marginBottom: 30,
    color: "#333",
    textAlign: "center",
  },
  label: {
    fontSize: 14,
    color: "#666",
    marginBottom: 5,
    marginLeft: 5,
    fontWeight: "600",
  },
  input: {
    padding: 15,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 12,
    marginBottom: 20,
    backgroundColor: "#F9F9F9",
    fontSize: 16,
    color: "#333", 
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  button: {
    backgroundColor: "#347AF0",
    padding: 18,
    borderRadius: 15,
    marginTop: 20,
    shadowColor: "#347AF0",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  buttonDisabled: {
    backgroundColor: "#A0C4FF",
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "700",
    fontSize: 18,
  },
});