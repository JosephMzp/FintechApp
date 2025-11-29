import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import AddCardVerifyScreen from "../screens/AddCardVerifyScreen";

const navigation = { navigate: jest.fn() };

describe("AddCardVerifyScreen", () => {
  it("navigates to CardList on Continue press", () => {
    const { getByText } = render(<AddCardVerifyScreen navigation={navigation} />);
    fireEvent.press(getByText("Continue"));
    expect(navigation.navigate).toHaveBeenCalledWith("CardList");
  });
});
