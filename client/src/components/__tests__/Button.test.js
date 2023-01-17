import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { test, expect, jest } from "@jest/globals";
import { Button } from "../Button";
import userEvent from "@testing-library/user-event";

test("displays value as button label", () => {
  // Arrange
  const value = "Some Label";

  // Act
  render(<Button value={value} />);

  // Assert
  const button = screen.queryByText(value);
  expect(button).toBeDefined();
});

test("onClick prop triggers callback", () => {
  // Arrange
  const value = "I'm a button";
  const callbackMock = jest.fn();
  render(<Button value={value} onClick={callbackMock} />);
  const button = screen.getByRole("button");

  // Act
  userEvent.click(button);

  // Assert
  expect(callbackMock).toBeCalled();
});

test("disabled prop disables the button", () => {
  // Arrange
  const value = "I'm a button";

  // Act
  render(<Button value={value} disabled />);

  // Assert
  const button = screen.getByRole("button");
  expect(button).toBeDisabled();
});

test("class name prop changes the class", () => {
  const className = "class-special-name";
  const value = "I'm a button";

  render(<Button className={className} value={value} />);

  const button = screen.getByRole("button");
  expect(button).toHaveClass(className);
});
