import { create } from "zustand";
import {
  InsertarTarjeta,
  MostrarTarjeta,
  ActualizarTarjeta,
  EliminarTarjeta,
  MostrarTarjetasTodos,
  BuscarTarjeta,
} from "../supabase/crudTarjeta";

export const useTarjetaStore = create((set, get) => ({
  buscador: "",
  setBuscador: (p) => set({ buscador: p }),

  tarjetas: [],
  tarjetaActual: [],
  parametros:{},
  listarTarjetas: async (p) => {
    console.log("LLAMANDO listarTarjetas CON:", p);
    const data = await MostrarTarjeta(p);
    console.log("Tarjeta store:", data);
    console.log("RESPUESTA SUPABASE:", data);
    set({ parametros: p });
    set({ tarjetas: data });
    return data;
  },

  selectTarjeta: (p) => set({ tarjetaActual: p }),

  insertarTarjeta: async (p) => {
    const data = await InsertarTarjeta(p);

    // 🚀 Recargar lista completa ya con todas las relaciones
    const { listarTarjetas } = get();
    await listarTarjetas(p.user_id);

    return data;
  },

  actualizarTarjeta: async (id, p) => {
    const data = await ActualizarTarjeta(id, p);
    set((state) => ({
      tarjetas: state.tarjetas.map((tar) => (tar.id === id ? data : tar)),
    }));
    return data;
  },

  eliminarTarjeta: async (id) => {
    console.log("Eliminando id:", id);
    await EliminarTarjeta(id);
    set((state) => ({
      tarjetas: state.tarjetas.filter((p) => p.id !== id),
    }));
  },

  buscarTarjeta: async (p) => {
    const response = await BuscarTarjeta(p);
    return response;
  },
}));