import { supabase } from "../lib/supabase";
import { useRegisterStore } from "../store/RegistroStore";
import { useNavigation } from "@react-navigation/native";
import { useEffect } from "react";

export default function CardCheckHandler() {
  const navigation = useNavigation();
  const { userId } = useRegisterStore();

  useEffect(() => {
    checkCards();
  }, []);

  const checkCards = async () => {
    const { data } = await supabase
      .from("cards")
      .select("*")
      .eq("user_id", userId);

    if (data?.length > 0) {
      navigation.replace("CardListScreen");
    } else {
      navigation.replace("AddCardIntroScreen");
    }
  };

  return null;
}
