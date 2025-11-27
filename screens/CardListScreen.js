import { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from "react-native";
import { supabase } from "../supabase/supabase.config";

export default function CardListScreen({ navigation }) {
  const [cards, setCards] = useState([]);

  const loadCards = async () => {
    const { data } = await supabase.from("cards").select("*");
    setCards(data);
  };

  useEffect(() => {
    loadCards();
  }, []);

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={styles.title}>Card List</Text>

      <FlatList
        data={cards}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text>{item.holder_name}</Text>
            <Text>{item.card_number}</Text>
          </View>
        )}
      />

      <TouchableOpacity style={styles.button}
        onPress={() => navigation.navigate("AddCardIntro")}
      >
        <Text style={styles.buttonText}>Add another card</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 22, fontWeight: "700", marginBottom: 20 },
  card: { padding: 15, borderWidth: 1, borderRadius: 12, marginBottom: 10 },
  button: { backgroundColor: "#3b82f6", padding: 15, borderRadius: 12, marginTop: 20 },
  buttonText: { color: "#fff", textAlign: "center", fontWeight: "700" }
});
