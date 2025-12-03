import { create } from "zustand";
import {
  InsertarTransaccion,
  MostrarTransacciones,
  ActualizarTransaccion,
  EliminarTransaccion,
  BuscarTransacciones,
} from "../supabase/crudTransacciones";

export const useTransaccionesStore = create((set) => ({
  transacciones: [],
  buscando: "",

  // ➤ Cargar transacciones de una cuenta
  cargarTransacciones: async (cuenta_id) => {
    const data = await MostrarTransacciones(cuenta_id);
    set({ transacciones: data });
    return data;
  },

  // ➤ Insertar nueva transacción
  agregarTransaccion: async (p) => {
    const nueva = await InsertarTransaccion(p);
    if (nueva) {
      set((state) => ({
        transacciones: [nueva, ...state.transacciones],
      }));
    }
    return nueva;
  },

  // ➤ Buscar
  buscarTransacciones: async (texto) => {
    set({ buscando: texto });
    const data = await BuscarTransacciones(texto);
    set({ transacciones: data });
    return data;
  },

  // ➤ Actualizar
  actualizarTransaccion: async (id, p) => {
    const nueva = await ActualizarTransaccion(id, p);

    set((state) => ({
      transacciones: state.transacciones.map((t) =>
        t.id === id ? nueva : t
      ),
    }));

    return nueva;
  },

  // ➤ Eliminar
  eliminarTransaccion: async (id) => {
    await EliminarTransaccion(id);

    set((state) => ({
      transacciones: state.transacciones.filter((t) => t.id !== id),
    }));

    return true;
  },
}));
