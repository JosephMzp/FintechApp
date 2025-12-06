import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import CountryResidenceScreen from "../CountryResidenceScreen";

// Mock Navigation
const mockNavigate = jest.fn();
const mockGoBack = jest.fn();

// Mock Store correctamente
const mockSetPais = jest.fn();
jest.mock("../../store/RegistroStore", () => ({
  useRegisterStore: (selector) => selector({ setPais: mockSetPais }),
}));

// Mock Theme
jest.mock("../../context/ThemeContext", () => ({
  useTheme: () => ({
    isDark: false,
  }),
}));

describe("CountryResidenceScreen", () => {
  it("muestra Perú y permite seleccionarlo", () => {
    const { getByText } = render(
      <CountryResidenceScreen navigation={{ navigate: mockNavigate, goBack: mockGoBack }} />
    );

    // Verifica que Perú esté en la lista
    const peru = getByText("Perú");
    expect(peru).toBeTruthy();

    // Selecciona Perú
    fireEvent.press(peru);

    // Presiona continuar
    const continuar = getByText("Continuar");
    fireEvent.press(continuar);

    // Verifica que setPais se llame con "Perú"
    expect(mockSetPais).toHaveBeenCalledWith("Perú");

    // Verifica que navegue a PersonalInfoScreen
    expect(mockNavigate).toHaveBeenCalledWith("PersonalInfoScreen");
  });
});
