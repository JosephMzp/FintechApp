import { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/Feather";
import { supabase } from "../supabase/supabase.config";

export default function CardListScreen({ navigation }) {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadCards = async () => {
    setLoading(true);

    // Obtener usuario logueado actual
    const { data: sessionData } = await supabase.auth.getUser();
    const userId = sessionData?.user?.id;

    if (!userId) {
      setCards([]);
      setLoading(false);
      return;
    }

    // Cargar tarjetas que pertenezcan a este usuario
    const { data, error } = await supabase
      .from("cards")
      .select("*")
      .eq("idauth", userId)   // ← muy importante para que jale tus tarjetas reales
      .order("id", { ascending: false });

    if (!error) setCards(data || []);

    setLoading(false);
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", loadCards);
    return unsubscribe;
  }, [navigation]);

  const renderCard = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.cardBrand}>{item.brand}</Text>
      <Text style={styles.cardNumber}>
        **** **** **** {item.card_number?.slice(-4)}
      </Text>
      <Text style={styles.cardHolder}>{item.card_holder}</Text>
      <Text style={styles.cardExpire}>{item.expiry_month}/{item.expiry_year}</Text>
    </View>
  );

  return (
    <View style={styles.container}>

      {/* botón volver */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Icon name="arrow-left" size={26} color="black" />
      </TouchableOpacity>

      <Text style={styles.title}>Tus Tarjetas</Text>

      {loading ? (
        <Text style={styles.loadingText}>Cargando tarjetas...</Text>
      ) : cards.length === 0 ? (
        <Text style={styles.emptyText}>No tienes tarjetas registradas.</Text>
      ) : (
        <FlatList
          data={cards}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderCard}
          contentContainerStyle={{ paddingBottom: 50 }}
        />
      )}

      {/* botón añadir nueva tarjeta */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate("AddCardIntro")}
      >
        <Text style={styles.addText}>Añadir nueva tarjeta</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", paddingHorizontal: 20, paddingTop: 70 },
  backButton: { position: "absolute", top: 30, left: 16 },
  title: { fontSize: 26, fontWeight: "700", marginBottom: 18 },
  loadingText: { textAlign: "center", marginTop: 20, color: "#666" },
  emptyText: { textAlign: "center", marginTop: 25, fontSize: 18, color: "#666" },

  card: {
    padding: 18,
    borderRadius: 14,
    backgroundColor: "#3b82f6",
    marginBottom: 15,
  },
  cardBrand: { color: "#fff", fontSize: 14, fontWeight: "600", marginBottom: 5 },
  cardNumber: { color: "#fff", fontSize: 22, fontWeight: "800", marginBottom: 5 },
  cardHolder: { color: "#fff", fontSize: 15, marginBottom: 2 },
  cardExpire: { color: "#eee", fontSize: 14 },

  addButton: {
    backgroundColor: "#111",
    paddingVertical: 15,
    borderRadius: 14,
    marginTop: 15,
  },
  addText: { color: "#fff", textAlign: "center", fontWeight: "700", fontSize: 16 },
});
