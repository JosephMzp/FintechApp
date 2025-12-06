import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import LoginScreen from '../LoginScreen';

// Mock navigation
const mockReplace = jest.fn();
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    replace: mockReplace,
    goBack: jest.fn(),
  }),
}));

// Mock Theme
jest.mock('../../context/ThemeContext', () => ({
  useTheme: () => ({ isDark: false })
}));

// Mock AuthStore
const mockLogin = jest.fn();
jest.mock('../../store/AuthStore', () => ({
  useAuthStore: () => ({
    login: mockLogin,
    loading: false,
  }),
}));

describe("LoginScreen", () => {
  test("Permite login con numero y contraseña correctos", async () => {
    const { getByPlaceholderText, getByText } = render(<LoginScreen />);

    fireEvent.changeText(getByPlaceholderText("Número de celular"), "123456789");
    fireEvent.changeText(getByPlaceholderText("Contraseña"), "123456");

    fireEvent.press(getByText("Iniciar Sesión"));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith("123456789", "123456");
      expect(mockReplace).toHaveBeenCalledWith("Home");
    });
  });
});
