import { create } from "zustand";
import { InsertarTransaccion, MostrarTransaccion, ActualizarTransaccion, EliminarTransaccion, ObtenerTransaccion, BuscarTransaccion } from "../supabase/crudTransferencias";

export const useTransaccionStore = create((set, get) => ({
  buscador: "",
  setBuscador: (p) => set({ buscador: p }),

  transacciones: [],
  transaccionActual: null,
  loading: false,

  listarTransacciones: async () => {
    const data = await MostrarTransaccion();
    console.log("Transaccion store:", data); 
    set({ transacciones: data });
    return data;
  },

  cargarTransacciones: async () => {
    set({ loading: true });
    
    // 1. Obtener usuario actual
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // 2. Obtener mi ID de usuario en la tabla pública
    const { data: usuarioData } = await supabase
      .from("usuarios")
      .select("id")
      .eq("idauth", user.id)
      .single();

    if (!usuarioData) {
      set({ loading: false });
      return;
    }

    // 3. Obtener MI cuenta (o cuentas)
    // Asumimos que tienes al menos una cuenta. Si tienes varias, traeríamos todas.
    const { data: misCuentas } = await supabase
      .from("cuentas")
      .select("id")
      .eq("user_id", usuarioData.id);
      
    // Creamos un Set o Array de mis IDs de cuenta para buscar rápido
    const misCuentaIds = misCuentas.map(c => c.id);

    // 4. Traer las transacciones "crudas" de la base de datos
    const dataRaw = await ObtenerTransaccion(usuarioData.id);

    // 5. 🔥 AQUÍ ESTÁ LA MAGIA: PROCESAR LOS DATOS 🔥
    // Transformamos la data para decidir si es Gasto o Ingreso visualmente
    const transaccionesProcesadas = dataRaw.map((tx) => {
      
      // ¿Soy yo el origen?
      const soyOrigen = misCuentaIds.includes(tx.cuenta_origen);
      
      // Lógica de Tipo Visual
      let tipoVisual = 'otro';
      
      if (soyOrigen) {
        // Si sale de mi cuenta, es un Gasto
        tipoVisual = 'gasto';
      } else {
        // Si no sale de mi cuenta (y la estoy viendo), es porque entra a mi cuenta -> Ingreso
        tipoVisual = 'ingreso';
      }

      // Casos especiales (Opcional):
      // Si el tipo en BD dice explícitamente "factura", lo respetamos como gasto
      if (tx.tipo === 'factura' && soyOrigen) tipoVisual = 'factura';
      // Si me transfiero a mi mismo (Ahorro)
      if (misCuentaIds.includes(tx.cuenta_origen) && misCuentaIds.includes(tx.cuenta_destino)) {
         tipoVisual = 'ahorro';
      }

      return {
        ...tx,
        tipo_visual: tipoVisual, // <--- Usaremos esto en la UI
        signo: soyOrigen ? '-' : '+', // Para poner -S/500 o +S/500
      };
    });

    set({ transacciones: transaccionesProcesadas, loading: false });
  },

  selectTransaccion: (p) => set({ transaccionActual: p }),

  insertarTransaccion: async (p) => {
  const data = await InsertarTransaccion(p);


  const { listarTransaccions } = get();
  await listarTransaccions();

  return data;
},

  actualizarTransaccion: async (id, p) => {
    const data = await ActualizarTransaccion(id, p);
    set((state) => ({
      transacciones: state.transacciones.map((prod) =>
        prod.id === id ? data : prod
      ),
    }));
    return data;
  },

  eliminarTransaccion: async (id) => {
    console.log("Eliminando id:", id);
    await EliminarTransaccion(id);
    set((state) => ({
      transacciones: state.transacciones.filter((p) => p.id !== id),
    }));
  },

  buscarTransaccion: async (p) => {
    const response = await BuscarTransaccion(p);
    set({ transacciones: response });
    return response;
  },
}));