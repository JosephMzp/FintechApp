import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { supabase } from "../supabase/supabase.config";


export default function AddCardFormScreen({ navigation }) {
  const [holderName, setHolderName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");

  const saveCard = async () => {
    const { data: { user } } = await supabase.auth.getUser();

    const { error } = await supabase.from("cards").insert([
      {
        user_id: user.id,
        holder_name: holderName,
        card_number: cardNumber,
        expiry,
        cvv,
      },
    ]);

    if (!error) navigation.navigate("AddCardVerify");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add card</Text>

      <TextInput style={styles.input} placeholder="Account holder name"
        value={holderName} onChangeText={setHolderName} />

      <TextInput style={styles.input} placeholder="Card number"
        value={cardNumber} onChangeText={setCardNumber} keyboardType="numeric" />

      <TextInput style={styles.input} placeholder="MM/YY"
        value={expiry} onChangeText={setExpiry} />

      <TextInput style={styles.input} placeholder="CVV"
        value={cvv} onChangeText={setCvv} keyboardType="numeric" secureTextEntry />

      <TouchableOpacity style={styles.button} onPress={saveCard}>
        <Text style={styles.buttonText}>Verify</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: "center" },
  title: { fontSize: 24, fontWeight: "700", marginBottom: 20 },
  input: { padding: 15, borderWidth: 1, borderRadius: 10, marginBottom: 15 },
  button: { backgroundColor: "#3b82f6", padding: 15, borderRadius: 12, marginTop: 15 },
  buttonText: { color: "#fff", textAlign: "center", fontWeight: "700", fontSize: 16 },
});
