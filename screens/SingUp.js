import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import SingUp from "../SingUp";

// Mock del contexto de Theme
jest.mock("../../context/ThemeContext", () => ({
  useTheme: () => ({ isDark: false }),
}));

describe("SingUp Screen", () => {
  const mockNavigation = {
    navigate: jest.fn(),
    goBack: jest.fn(),
  };

  test("Navega a PhoneInput cuando se presiona 'Registrarse'", () => {
    const { getByText } = render(<SingUp navigation={mockNavigation} />);

    const btn = getByText("Registrarse");
    fireEvent.press(btn);

    expect(mockNavigation.navigate).toHaveBeenCalledWith("PhoneInput");
  });

  test("Navega a Login cuando se presiona 'Iniciar Sesión'", () => {
    const { getByText } = render(<SingUp navigation={mockNavigation} />);

    const btn = getByText("Iniciar Sesión");
    fireEvent.press(btn);

    expect(mockNavigation.navigate).toHaveBeenCalledWith("Login");
  });

  test("Ejecuta goBack al presionar 'Volver atrás'", () => {
    const { getByText } = render(<SingUp navigation={mockNavigation} />);

    const btn = getByText("Volver atrás");
    fireEvent.press(btn);

    expect(mockNavigation.goBack).toHaveBeenCalled();
  });
});
