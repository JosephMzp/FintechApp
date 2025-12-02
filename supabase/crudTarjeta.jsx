import { supabase } from "./supabase.config";
import { Alert } from "react-native";

export const InsertarTarjeta = async (p) => {
  const { data, error } = await supabase
    .from("tarjeta_credito")
    .insert([{
        nombre:p.nombre,
        numero:p.numero,
        vencimiento:p.vencimiento,
        codigo:p.codigo,
        user_id:p.user_id,
        cuenta_id:p.cuenta_id
    }])
    .select()
    .single();
  if (error) {
    console.error("❌ Error CRITICO al insertar tarjeta de credito", error);
    console.error("Detalle del error:", error.message);
    return null;
  }
  return data;
};

export const MostrarTarjeta = async (user_id) => {
  const { data, error } = await supabase
    .from("tarjeta_credito")
    .select("*")
    .eq("user_id", user_id)
    .order("id", { ascending: false });

  if (error) {
    console.error("❌ Error al mostrar tarjetas:", error);
    return null;
  }

  return data;
};

export const MostrarTarjetasTodos = async () => {
  const { data, error } = await supabase
    .from("tarjeta_credito")
    .select("*")
    .order("id", { ascending: false });

  if (error) throw error;
  return data;
};

export const ActualizarTarjeta = async (id, p) => {
  const { data, error } = await supabase
    .from("tarjeta_credito")
    .update(p)
    .eq("id", id)
    .select("*")
    .single();

  if (error) throw error;
  return data;
};

export const EliminarTarjeta = async (id) => {
  const { error } = await supabase.from("tarjeta_credito").delete().eq("id", id);

  if (error) throw error;
  return true;
};

export const BuscarTarjeta = async (nombre) => {
  const { data, error } = await supabase
    .from("tarjeta_credito")
    .select("*")
    .ilike("nombre", `%${nombre}%`);

  if (error) throw error;
  return data;
};
