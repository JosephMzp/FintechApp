import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import EditUserInfoScreen from "../screens/EditUserInfoScreen";

// 📌 Mock de navegación
const mockGoBack = jest.fn();
jest.mock("@react-navigation/native", () => ({
  useNavigation: () => ({ goBack: mockGoBack })
}));

// 📌 Mock del tema (modo claro)
jest.mock("../context/ThemeContext", () => ({
  useTheme: () => ({ isDark: false })
}));

// 📌 Mock de Zustand store
const mockActualizar = jest.fn();
const mockObtener = jest.fn();

jest.mock("../store/UsuarioStore", () => ({
  useUsuariosStore: () => ({
    usuarioActual: {
      id: "user123",
      nombre: "Kevin",
      telefono: "987654321",
      direccion: "Av. Lima",
      ciudad: "Lima",
      codigo_postal: "15001",
    },
    obtenerUsuarioActual: mockObtener,
    actualizarUsuario: mockActualizar
  }),
}));

describe("EditUserInfoScreen", () => {
  it("Renderiza correctamente y permite guardar cambios", () => {
    const { getByText } = render(<EditUserInfoScreen />);

    // Verifica título principal
    expect(getByText("Editar información personal")).toBeTruthy();

    // Simula presionar el botón "Guardar cambios"
    const btn = getByText("Guardar cambios");
    fireEvent.press(btn);

    // Verifica que actualizarUsuario fue llamado
    expect(mockActualizar).toHaveBeenCalledWith("user123", expect.any(Object));
  });
});
