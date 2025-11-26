import { create } from "zustand";

export const useRegisterStore = create((set) => ({
  telefono: "",
  password: "",
  email: "",
  pais: "",
  nombre: "",
  apellido: "",
  nacimiento: "",
  direccion: "",
  ciudad: "",
  codigo_postal: "",

  // setters
  setTelefono: (v) => set({ telefono: v }),
  setPassword: (v) => set({ password: v }),
  setEmail: (v) => set({ email: v }),
  setPais: (v) => set({ pais: v }),
  setNombre: (v) => set({ nombre: v }),
  setApellido: (v) => set({ apellido: v }),
  setNacimiento: (v) => set({ nacimiento: v }),
  setDireccion: (v) => set({ direccion: v }),
  setCiudad: (v) => set({ ciudad: v }),
  setCodigoPostal: (v) => set({ codigo_postal: v }),

  // limpiar al finalizar
  reset: () =>
    set({
      telefono: "",
      password: "",
      email: "",
      pais: "",
      nombre: "",
      apellido: "",
      nacimiento: "",
      direccion: "",
      ciudad: "",
      codigo_postal: "",
    }),
}));
