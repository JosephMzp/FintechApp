import { create } from "zustand";

export const useCardStore = create((set) => ({
  card_number: "",
  card_holder: "",
  expiry_month: "",
  expiry_year: "",
  cvv: "",
  brand: "", // Visa / MasterCard / etc.

  // SETTERS
  setCardNumber: (v) => set({ card_number: v }),
  setCardHolder: (v) => set({ card_holder: v }),
  setExpiryMonth: (v) => set({ expiry_month: v }),
  setExpiryYear: (v) => set({ expiry_year: v }),
  setCVV: (v) => set({ cvv: v }),
  setBrand: (v) => set({ brand: v }),

  // RESET
  reset: () =>
    set({
      card_number: "",
      card_holder: "",
      expiry_month: "",
      expiry_year: "",
      cvv: "",
      brand: "",
    }),
}));
