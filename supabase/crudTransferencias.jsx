import { supabase } from "./supabase.config";

export async function InsertarTransaccion(p) {
  const { data, error } = await supabase
    .from("transacciones")
    .insert([
      {
        cuenta_origen: p.cuenta_origen,
        cuenta_destino: p.cuenta_destino,
        monto: p.monto,
        tipo: p.tipo,
        estado: p.estado,
        referencia: p.referencia,
        fecha: p.fecha,
        hora: p.hora,
        proposito: p.proposito,
      },
    ])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export const MostrarTransaccion = async () => {
  const { data, error } = await supabase
    .from("transacciones")
    .select(`*`)
    .order("id", { ascending: false });

  if (error) throw error;
  return data;
};

export async function ActualizarTransaccion(id, p) {
  const { data, error } = await supabase
    .from("transacciones")
    .update({
      cuenta_origen: p.cuenta_origen,
      cuenta_destino: p.cuenta_destino,
      monto: p.monto,
      tipo: p.tipo,
      estado: p.estado,
      referencia: p.referencia,
      fecha: p.fecha,
      hora: p.hora,
      proposito: p.proposito,
    })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export const EliminarTransaccion = async (id) => {
  const { error } = await supabase.from("transacciones").delete().eq("id", id);
  if (error) throw error;
  return true;
};

export const ObtenerTransaccion = async (id) => {
  const { data, error } = await supabase
    .from("transacciones")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;
  return data;
};

export async function BuscarTransaccion(p) {
  const { data, error } = await supabase
    .from("transacciones")
    .select("*")
    .ilike("tipo", `%${p.tipo}%`);

  if (error) throw error;
  return data;
}

export const ObtenerMovimientosCuenta = async (cuentaId) => {
  // Buscamos donde la cuenta sea origen O destino
  const { data, error } = await supabase
    .from("transacciones")
    .select("*")
    .or(`cuenta_origen.eq.${cuentaId},cuenta_destino.eq.${cuentaId}`)
    .order("fecha", { ascending: false }) // Más recientes primero
    .order("hora", { ascending: false });

  if (error) {
    console.error("Error trayendo movimientos:", error);
    return [];
  }
  return data;
};