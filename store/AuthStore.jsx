import { create } from "zustand";
import { supabase } from "../supabase/supabase.config";

export const useAuthStore = create((set) => ({
  loading: false,
  user: null,

  // Función para iniciar sesión usando el "truco" del email falso
  login: async (telefono, password) => {
    set({ loading: true });
    
    try {
      // 1. Reconstruimos el email falso con el que se registró
      // Nota: Si en el registro usaste solo el número (ej: 999...), aquí también debe ser solo el número.
      const fakeEmail = `${telefono}@miapp.com`;

      const { data, error } = await supabase.auth.signInWithPassword({
        email: fakeEmail,
        password: password,
      });

      if (error) throw error;

      set({ user: data.user, loading: false });
      return true; // Login exitoso

    } catch (error) {
      set({ loading: false });
      console.log("Error en login:", error.message);
      throw error; // Lanzamos el error para que la pantalla lo capture
    }
  },

  signOut: async () => {
    set({ loading: true });
    const { error } = await supabase.auth.signOut();
    if (error) throw new Error("Ocurrió un error: " + error);
    set({ user: null, loading: false });
  },
}));