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

export const BuscarUsuarios = async (nombre) => {
  const { data, error } = await supabase
    .from("usuarios")
    .select("*")
    .ilike("nombre", `%${nombre}%`);

  if (error) throw error;
  return data;
};
