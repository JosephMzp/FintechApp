import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import CreatePasscodeScreen from "../CreatePasscodeScreen";

// Mock navegación
const mockNavigation = {
  goBack: jest.fn(),
  navigate: jest.fn(),
};

// Mock del store
const mockSetPassword = jest.fn();

jest.mock("../../store/RegistroStore", () => ({
  useRegisterStore: (cb) =>
    cb({
      setPassword: mockSetPassword,
    }),
}));

describe("CreatePasscodeScreen", () => {
  test("permite ingresar un PIN de 6 dígitos y navegar", () => {
    const { getByText, queryByText } = render(
      <CreatePasscodeScreen navigation={mockNavigation} />
    );

    // Antes de escribir, el botón “Continuar” NO debe existir
    expect(queryByText("Continuar")).toBeNull();

    // Presionar números del 1 al 6
    fireEvent.press(getByText("1"));
    fireEvent.press(getByText("2"));
    fireEvent.press(getByText("3"));
    fireEvent.press(getByText("4"));
    fireEvent.press(getByText("5"));
    fireEvent.press(getByText("6"));

    // Ahora el botón debe aparecer
    const continueButton = getByText("Continuar");
    expect(continueButton).toBeTruthy();

    // Presionar continuar
    fireEvent.press(continueButton);

    // Debe guardar el pin
    expect(mockSetPassword).toHaveBeenCalledWith("123456");

    // Debe navegar a AddEmailScreen
    expect(mockNavigation.navigate).toHaveBeenCalledWith("AddEmailScreen");
  });

  test("el botón borrar ← elimina el último dígito", () => {
    const { getByText, queryByText } = render(
      <CreatePasscodeScreen navigation={mockNavigation} />
    );

    fireEvent.press(getByText("1"));
    fireEvent.press(getByText("2"));
    fireEvent.press(getByText("3"));

    // Borrar 1 dígito
    fireEvent.press(getByText("←"));

    // Aún no debe aparecer el botón "Continuar"
    expect(queryByText("Continuar")).toBeNull();
  });
});
