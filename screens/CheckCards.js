import { View, ActivityIndicator } from "react-native";
import React, { useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { supabase } from "../lib/supabase";

export default function CheckCards({ route }) {
  const navigation = useNavigation();

  useEffect(() => {
    checkCards();
  }, []);

  const checkCards = async () => {
    const { data, error } = await supabase.from("cards").select("*");

    if (!data || data.length === 0) {
      navigation.replace("AddCardIntro");
    } else {
      navigation.replace("CardList");
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="large" />
    </View>
  );
}
