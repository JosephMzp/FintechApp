import { create } from "zustand";
import { supabase } from "../supabase/supabase.config";
import { InsertarTransaccion, MostrarTransaccion, ActualizarTransaccion, EliminarTransaccion, ObtenerTransaccion, BuscarTransaccion,ObtenerMovimientosCuenta } from "../supabase/crudTransferencias";
import { ObtenerMiCuenta } from "../supabase/crudUsuarios";

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
  saldo: 0,
  ingresos: 0,
  gastos: 0,
  cargarDatosReal: async () => {
    set({ loading: true });
    try {
      // 1. Obtener usuario auth
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // 2. Obtener ID de usuario en tabla pública
      const { data: usuarioData } = await supabase
        .from("usuarios")
        .select("id")
        .eq("idauth", user.id)
        .single();

      if (!usuarioData) return;

      // 3. Obtener la CUENTA (Saldo real)
      const cuenta = await ObtenerMiCuenta(usuarioData.id);
      if (!cuenta) {
        set({ saldo: 0, transacciones: [], loading: false });
        return;
      }

      // 4. Obtener Transacciones
      const rawData = await ObtenerMovimientosCuenta(cuenta.id);

      // 5. Procesar datos
      let totalIngresos = 0;
      let totalGastos = 0;

      const procesadas = rawData.map((tx) => {
        const soyOrigen = tx.cuenta_origen === cuenta.id;
        
        if (soyOrigen) {
          totalGastos += parseFloat(tx.monto);
        } else {
          totalIngresos += parseFloat(tx.monto);
        }

        return {
          ...tx,
          tipo_visual: soyOrigen ? 'gasto' : 'ingreso',
          titulo: soyOrigen ? `Envío a ...` : `Recibido de ...`, // Podrías mejorar esto con un join
          signo: soyOrigen ? '-' : '+',
          color: soyOrigen ? '#E53935' : '#4CAF50',
          iconName: soyOrigen ? 'arrow-up-right' : 'arrow-down-left'
        };
      });

      set({
        saldo: cuenta.saldo,
        transacciones: procesadas,
        ingresos: totalIngresos,
        gastos: totalGastos,
        loading: false
      });

    } catch (error) {
      console.error("Error en store:", error);
      set({ loading: false });
    }
  },
}));