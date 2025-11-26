import { supabase } from "./supabase.config";

export const ObtenerIdAuthSupabase = async () => {
  const { data: { session }, error } = await supabase.auth.getSession();

  if (error) {
    console.error("Error obteniendo sesión:", error);
    return null;
  }

  // No hay sesión → usuario no logueado
  if (!session) return null;

  return session.user.id;
};
