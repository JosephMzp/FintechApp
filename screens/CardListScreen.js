import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Image
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Ionicons, FontAwesome } from "@expo/vector-icons"; // Asegúrate de tener iconos
import { supabase } from "../supabase/supabase.config";
import { useTarjetaStore } from "../store/TarjetaStore";

export default function CardListScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  
  // Detectamos si venimos de "Agregar Tarjeta" para mostrar el mensaje verde
  const showSuccessMessage = route.params?.showSuccess || false;

  const { tarjetas, listarTarjetas, eliminarTarjeta, loading } = useTarjetaStore();
  const [userId, setUserId] = useState(null);

  // 1. Cargar las tarjetas al entrar
  useEffect(() => {
    const fetchCards = async () => {
      try {
        // A. Obtener usuario de la sesión (Auth)
        const { data: { user } } = await supabase.auth.getUser();

        if (user) {
          // B. TRADUCCIÓN: Buscar el ID numérico en tu tabla pública 'usuarios'
          // Buscamos donde la columna 'idauth' coincida con el UUID de sesión
          const { data: datosUsuario, error } = await supabase
            .from("usuarios")
            .select("id") 
            .eq("idauth", user.id) 
            .single();

          if (error || !datosUsuario) {
            console.error("No se encontró el usuario en la tabla pública usuarios", error);
            return;
          }

          // C. Ahora tenemos el ID numérico (ej: 1, 45, 100)
          const idNumerico = datosUsuario.id;
          
          setUserId(idNumerico); // Guardamos el ID numérico en el estado
          
          console.log("Usuario Auth UUID:", user.id);
          console.log("Usuario Tabla ID (BigInt):", idNumerico);

          // D. Llamamos a listarTarjetas con el NÚMERO, no el UUID
          await listarTarjetas(idNumerico);
        }
      } catch (err) {
        console.error("Error obteniendo datos:", err);
      }
    };
    
    fetchCards();
  }, []); // Se ejecuta al montar

  // 2. Función para confirmar borrado
  const handleDelete = (id) => {
    Alert.alert(
      "Eliminar tarjeta",
      "¿Estás seguro de que quieres eliminar esta tarjeta?",
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Eliminar", 
          style: "destructive", 
          onPress: async () => {
            await eliminarTarjeta(id);
            // Si quieres recargar la lista explícitamente:
            // if (userId) listarTarjetas(userId);
          } 
        }
      ]
    );
  };

  // 3. Renderizar cada tarjeta
  const renderItem = ({ item }) => {
    // Detectar tipo de tarjeta simple (4=Visa, 5=Mastercard)
    const isMaster = item.numero.startsWith("5");
    const iconName = isMaster ? "cc-mastercard" : "cc-visa";
    const iconColor = isMaster ? "#EB001B" : "#1A1F71";

    // Enmascarar número (**** **** **** 1234)
    const last4 = item.numero.slice(-4); 

    return (
      <View style={styles.cardItem}>
        {/* Icono de la tarjeta */}
        <View style={styles.cardIconContainer}>
            <FontAwesome name={iconName} size={24} color={iconColor} />
        </View>

        {/* Texto de la cuenta */}
        <View style={styles.cardInfo}>
            <Text style={styles.accountLabel}>Account</Text>
            <Text style={styles.cardNumber}>•••• •••• •••• {last4}</Text>
        </View>

        {/* Botón Eliminar (Tacho rojo) */}
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
    <View style={styles.container}>
      
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate("Home")} style={styles.backButton}>
             <Ionicons name="chevron-back" size={24} color="#333" />
        </TouchableOpacity>
        {/* Si hay mensaje de éxito, ajustamos el layout si quieres, o dejamos titulo */}
      </View>

      {/* MENSAJE DE ÉXITO (Solo si showSuccess es true) */}
      {showSuccessMessage && (
        <View style={styles.successBanner}>
            <Ionicons name="checkmark-circle" size={24} color="#15803d" />
            <Text style={styles.successText}>Your card successfully added</Text>
        </View>
      )}

      <Text style={styles.title}>Card list</Text>
      <Text style={styles.subtitle}>Enter your credit card info into the box below.</Text>

      {/* LISTA DE TARJETAS */}
      {loading && tarjetas.length === 0 ? (
        <ActivityIndicator size="large" color="#347AF0" style={{marginTop: 50}} />
      ) : (
        <FlatList
            data={tarjetas}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderItem}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={
                <Text style={styles.emptyText}>No tienes tarjetas guardadas.</Text>
            }
        />
      )}

      {/* FOOTER - BOTONES */}
      <View style={styles.footer}>
        
        {/* Botón 1: Añadir otra */}
        <TouchableOpacity 
            style={styles.addButton} 
            onPress={() => navigation.navigate("AddCardForm")} // Asegúrate que así se llama tu ruta de agregar
        >
            <Ionicons name="add" size={24} color="#fff" />
            <Text style={styles.addButtonText}>Add another card</Text>
        </TouchableOpacity>

        {/* Botón 2: Continuar (Solo visible si es flujo de éxito) */}
        {showSuccessMessage && (
            <TouchableOpacity 
                style={styles.continueButton}
                onPress={() => navigation.navigate("Home")} // O a donde deban ir después
            >
                <Text style={styles.continueButtonText}>Continue</Text>
            </TouchableOpacity>
        )}

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FD", // Color de fondo gris muy claro
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
    flexDirection: 'row',
    backgroundColor: "#DCFCE7", // Verde claro fondo
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
  },
  successText: {
    color: "#166534", // Verde oscuro texto
    fontWeight: "600",
    marginLeft: 10,
    fontSize: 14,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 20,
  },
  listContent: {
    paddingBottom: 100,
  },
  // ESTILOS DE LA TARJETA (ITEM)
  cardItem: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 15,
    alignItems: "center",
    marginBottom: 15,
    // Sombra suave
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
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
    color: "#888",
  },
  cardNumber: {
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
    marginTop: 2,
  },
  deleteButton: {
    backgroundColor: "#FEE2E2", // Rojo muy claro
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#FECACA",
  },
  deleteIcon: {
    // Si usas imagen personalizada
  },
  emptyText: {
    textAlign: "center",
    color: "#aaa",
    marginTop: 50,
  },
  // FOOTER
  footer: {
    position: "absolute",
    bottom: 30,
    left: 20,
    right: 20,
  },
  addButton: {
    backgroundColor: "#347AF0",
    borderRadius: 30, // Redondeado como en la imagen
    paddingVertical: 15,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
    shadowColor: "#347AF0",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
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
});