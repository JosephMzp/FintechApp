import { supabase } from "./supabase.config";
import { detectarTipoMovimiento } from "./detectarTipoMovimiento";

// ➤ Crear transacción (auto detecta el tipo)
export const InsertarTransaccion = async (p) => {
  // Clasificación automática
  const tipoDetectado = detectarTipoMovimiento(p.referencia);

  const { data, error } = await supabase
    .from("transacciones")
    .insert({
      ...p,
      tipo: tipoDetectado, // ← Tipificación automática
    })
    .select()
    .maybeSingle();

  if (error) {
    console.error("❌ Error al insertar transacción:", error);
    return null;
  }

  return data;
};

// ➤ Listar todas las transacciones del usuario (cuenta origen o destino)
export const MostrarTransacciones = async (cuenta_id) => {
  const { data, error } = await supabase
    .from("transacciones")
    .select("*")
    .or(`cuenta_origen.eq.${cuenta_id},cuenta_destino.eq.${cuenta_id}`)
    .order("id", { ascending: false });

  if (error) {
    console.error("❌ Error al listar transacciones:", error);
    return [];
  }

  return data;
};

// ➤ Buscar por referencia
export const BuscarTransacciones = async (texto) => {
  const { data, error } = await supabase
    .from("transacciones")
    .select("*")
    .ilike("referencia", `%${texto}%`);

  if (error) return [];

  return data;
};

// ➤ Actualizar
export const ActualizarTransaccion = async (id, p) => {
  const { data, error } = await supabase
    .from("transacciones")
    .update(p)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

// ➤ Eliminar
export const EliminarTransaccion = async (id) => {
  const { error } = await supabase
    .from("transacciones")
    .delete()
    .eq("id", id);

  if (error) throw error;
  return true;
};
