import { fireEvent, render } from "@testing-library/react";
import React from "react";
import SearchForm from "./SearchForm";

test("display search form", async () => {
  const search = jest.fn();

  const { getByLabelText, getByText } = render(<SearchForm search={search} />);

  const button = getByText(/^Search$/);
  const input = getByLabelText(/^Search tornados$/) as HTMLInputElement;

  expect(button).toBeDisabled();

  fireEvent.change(input, { target: { value: "Thetford Mines" } });

  expect(input.value).toBe("Thetford Mines");
  expect(button).toBeEnabled();

  fireEvent.click(button);

  expect(search).toHaveBeenCalled();
});
