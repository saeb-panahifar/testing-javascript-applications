const fetchMock = require("jest-fetch-mock");
const fs = require("fs");
const initialHtml = fs.readFileSync("index.html");
const { screen, findByText, fireEvent, waitForElement, wait } = require("@testing-library/dom");

beforeEach(() => {
  localStorage.clear();
});

beforeEach(async () => {
  document.body.innerHTML = initialHtml;
  jest.resetModules();
  fetchMock.enableMocks();
  await require("../main.js");
  jest.spyOn(window, "addEventListener");
});


describe("adding items", () => {
  test("updating the item list", async () => {

    fetch.mockResponseOnce(JSON.stringify([{ "itemName": "book", "quantity": 6 }]));

    const itemField = screen.getByPlaceholderText("Item name");
    fireEvent.input(itemField, { target: { value: "book" }, bubbles: true });

    const quantityField = screen.getByPlaceholderText("Quantity");
    fireEvent.input(quantityField, { target: { value: "6" }, bubbles: true });

    const submitBtn = screen.getByText("Add to inventory");
    fireEvent.click(submitBtn);

    expect(fetch).toHaveBeenCalledTimes(2);

    setTimeout(() => {
      const itemList = document.getElementById("item-list");
      expect(getByText(itemList, "book - Quantity: 6")).toBeInTheDocument()
    });

  });

});

describe("item name validation", () => {
  test("entering valid item names ", () => {

    const itemField = screen.getByPlaceholderText("Item name");

    fireEvent.input(itemField, { target: { value: "book" }, bubbles: true });

    expect(screen.getByText("book is valid!")).toBeInTheDocument();
  });

  test("entering invalid item names ", () => {

    const itemField = screen.getByPlaceholderText("Item name");

    fireEvent.input(itemField, { target: { value: "book1" }, bubbles: true });

    expect(screen.getByText("book1 is not a valid item.")).toBeInTheDocument();
  });
});
