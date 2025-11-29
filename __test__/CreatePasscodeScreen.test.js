import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import CreatePasscodeScreen from "../screens/CreatePasscodeScreen";

// Mock de Zustand store
jest.mock("../store/RegistroStore", () => ({
  useRegisterStore: (cb) =>
    cb({
      setPassword: jest.fn(),
    }),
}));

describe("CreatePasscodeScreen", () => {
  it("should update pin when numbers are pressed", () => {
    const navigation = { navigate: jest.fn() };

    const { getByText, queryByText } = render(
      <CreatePasscodeScreen navigation={navigation} />
    );

    const key1 = getByText("1");
    fireEvent.press(key1);
    fireEvent.press(key1);
    fireEvent.press(key1);

    // Mientras el PIN es < 6 Continue NO debe aparecer
    expect(queryByText("Continue")).toBeNull();
  });

  it("should show Continue button when pin reaches 6 digits and navigate", () => {
    const navigation = { navigate: jest.fn() };

    const { getByText } = render(
      <CreatePasscodeScreen navigation={navigation} />
    );

    const digits = ["1", "2", "3", "4", "5", "6"];
    digits.forEach((n) => fireEvent.press(getByText(n)));

    const continueBtn = getByText("Continue");
    expect(continueBtn).toBeTruthy();

    fireEvent.press(continueBtn);
    expect(navigation.navigate).toHaveBeenCalledWith("AddEmailScreen");
  });

  it("should delete numbers when delete key is pressed", () => {
    const navigation = { navigate: jest.fn() };

    const { getByText, queryByText } = render(
      <CreatePasscodeScreen navigation={navigation} />
    );

    fireEvent.press(getByText("1"));
    fireEvent.press(getByText("1"));
    fireEvent.press(getByText("←")); // eliminar

    // Todavía debe estar oculto Continue
    expect(queryByText("Continue")).toBeNull();
  });
});
