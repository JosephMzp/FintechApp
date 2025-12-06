import { create } from "zustand";
import { supabase } from "../supabase/supabase.config";
import {
  InsertarUsuarios,
  MostrarUsuarios,
  MostrarUsuariosTodos,
  ActualizarUsuarios,
  EliminarUsuarios,
  BuscarUsuarios,
} from "../supabase/crudUsuarios";

export const useUsuariosStore = create((set, get) => ({

  usuarioActual: null,
  usuarios: [],
  buscador: "",
  loadingBusqueda: false,

  // ─────────────────────────────────────────────
  // REGISTRAR USUARIO CON TELÉFONO + CONTRASEÑA
  // ─────────────────────────────────────────────
  registrarUsuario: async (form) => {
    try {
      // Generar correo falso basado en el teléfono
      const fakeEmail = `${form.telefono}@miapp.com`;

      // Crear usuario en Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email: fakeEmail,
        password: form.password,
      });

      if (error) {
        console.log("❌ Error signUp:", error.message);
        return null;
      }

      // Insertar en tabla usuarios
      const nuevoUsuario = await InsertarUsuarios({
        idauth: data.user.id,
        nombre: form.nombre,
        telefono: form.telefono,
        correo: fakeEmail,
        nacimiento: form.nacimiento || null,
        direccion: form.direccion || null,
        ciudad: form.ciudad || null,
        codigo_postal: form.codigo_postal || null,
        tarjeta: form.tarjeta || null,
        foto: form.foto || null,
        pais: form.pais || null,
      });

      return nuevoUsuario;

    } catch (error) {
      console.log("Error registrarUsuario:", error);
      return null;
    }
  },

  // ─────────────────────────────────────────────
  // OBTENER DATOS DEL USUARIO LOGEADO
  // ─────────────────────────────────────────────
  idusuario: 0,
  obtenerUsuarioActual: async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return null;

    const user = await MostrarUsuarios(session.user.id);

    set({ usuarioActual: user });
    return user;
  },
  // ─────────────────────────────────────────────
  // LISTAR TODOS LOS USUARIOS
  // ─────────────────────────────────────────────
  listarUsuarios: async () => {
    const data = await MostrarUsuariosTodos();
    set({ usuarios: data });
    return data;
  },

  // ─────────────────────────────────────────────
  // BUSCAR USUARIOS POR NOMBRE
  // ─────────────────────────────────────────────
  buscarUsuario: async (telefono) => {
    // Si el campo está vacío, limpiamos la lista
    if (!telefono || telefono.length < 2) {
        set({ usuarios: [] });
        return;
    }

    set({ loadingBusqueda: true });
    
    const resultados = await BuscarUsuarios(telefono);
    
    // Filtramos para no mostrarnos a nosotros mismos en la búsqueda
    // (Asumiendo que tienes el ID del usuario actual en el store)
    const { usuarioActual } = get();
    const resultadosFiltrados = resultados.filter(u => u.id !== usuarioActual?.id);

    set({ usuarios: resultadosFiltrados, loadingBusqueda: false });
  },
  
  limpiarBusqueda: () => set({ usuarios: [] }),


  // ─────────────────────────────────────────────
  // SELECCIONAR USUARIO DE LA LISTA
  // ─────────────────────────────────────────────
  seleccionarUsuario: (u) => {
    set({ usuarioActual: u });
  },

  // ─────────────────────────────────────────────
  // ACTUALIZAR USUARIO
  // ─────────────────────────────────────────────
  actualizarUsuario: async (id, datos) => {
    const actualizado = await ActualizarUsuarios(id, datos);

    // Actualizar lista en memoria
    set((state) => ({
      usuarios: state.usuarios.map((u) =>
        u.id === id ? actualizado : u
      ),
      usuarioActual: actualizado,
    }));

    return actualizado;
  },

  // ─────────────────────────────────────────────
  // ELIMINAR USUARIO
  // ─────────────────────────────────────────────
  eliminarUsuario: async (id) => {
    await EliminarUsuarios(id);

    set((state) => ({
      usuarios: state.usuarios.filter((u) => u.id !== id),
    }));

    return true;
  },
  

}));
