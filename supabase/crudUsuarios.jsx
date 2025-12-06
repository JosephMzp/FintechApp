import { supabase } from "./supabase.config";
import { Alert } from "react-native";

export const InsertarUsuarios = async (p) => {
  const { data, error } = await supabase
    .from("usuarios")
    .insert(p)
    .select()
    .maybeSingle();
  if (error) {
    console.error("❌ Error CRITICO al insertar en tabla usuarios:", error);
    console.error("Detalle del error:", error.message);
    return null;
  }
  return data;
};

export const MostrarUsuarios = async (idauth) => {
  const { data, error } = await supabase
    .from("usuarios")
    .select("*")
    .eq("idauth", idauth)
    .maybeSingle();

  if (error) return null;
  return data;
};

export const MostrarUsuariosTodos = async () => {
  const { data, error } = await supabase
    .from("usuarios")
    .select("*")
    .order("id", { ascending: false });

  if (error) throw error;
  return data;
};

export const ActualizarUsuarios = async (id, p) => {
  const { data, error } = await supabase
    .from("usuarios")
    .update(p)
    .eq("id", id)
    .select("*")
    .single();

  if (error) throw error;
  return data;
};

export const EliminarUsuarios = async (id) => {
  const { error } = await supabase.from("usuarios").delete().eq("id", id);

  if (error) throw error;
  return true;
};

export const BuscarUsuarios = async (telefono) => {
  const { data, error } = await supabase
    .from("usuarios")
    .select("*")
    .ilike("telefono", `%${telefono}%`)
    .limit(10);

  if (error) throw error;
  return data;
};

export const ObtenerCuentaPorUsuario = async (userId) => {
  try {
    console.log("Buscando cuenta destino para usuario:", userId);
    const { data, error } = await supabase
      .from("cuentas")
      .select("id")
      .eq("user_id", userId)
      .eq("moneda", "S/")
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error("Error obteniendo cuenta destino:", error);
      
      return null;
    }
    return data;
  } catch (e) {
    console.error(e);
    return null;
  }
};

export const ObtenerMiCuenta = async (userId) => {
  const { data, error } = await supabase
    .from("cuentas")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle(); // Asumimos una cuenta por usuario por ahora

  if (error) {
    console.error("Error obteniendo cuenta:", error);
    return null;
  }
  return data;
};