import React from "react";
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from "react-native";
import { useTarjetaStore } from "../store/TarjetaStore";
import { useNavigation } from "@react-navigation/native";

export default function SelectTarjetaScreen() {
  const navigation = useNavigation();
  const { tarjetas, selectTarjeta } = useTarjetaStore();

  return (
    <View style={styles.container}>
      <FlatList
        data={tarjetas}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => {
              selectTarjeta(item);
              navigation.goBack();
            }}
          >
            <Text style={styles.title}>{item.card_holder}</Text>
            <Text style={styles.num}>**** **** **** {item.card_number.slice(-4)}</Text>
            <Text style={styles.saldo}>Saldo: S/ {item.saldo}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  card: {
    backgroundColor: "#1e40af",
    padding: 20,
    borderRadius: 15,
    marginBottom: 15,
  },
  title: { color: "white", fontSize: 18, fontWeight: "bold" },
  num: { color: "white", marginTop: 5 },
  saldo: { color: "white", marginTop: 10, fontSize: 16, fontWeight: "bold" },
});
