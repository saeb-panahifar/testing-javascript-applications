const fs = require("fs");
const fetchMock = require("jest-fetch-mock");
const initialHtml = fs.readFileSync("index.html");
const { getByText, screen } = require("@testing-library/dom");
const {
  updateItemList,
  handleAddItem,
  checkFormValues
} = require("../js/domController");
const { API_ADDR, data } = require("../js/inventoryController.js");

beforeAll(() => {
  fetchMock.enableMocks();
});

beforeEach(() => {
  document.body.innerHTML = initialHtml;
  fetch.resetMocks();
});

describe("updateItemList", () => {
  beforeEach(() => localStorage.clear());

  test("updates the DOM with the inventory items", () => {

    let inventory = [
      { "itemName": "book", "quantity": 5 },
      { "itemName": "pen", "quantity": 2 },
      { "itemName": "paper", "quantity": 6 }
    ]

    updateItemList(inventory);

    const itemList = document.getElementById("item-list");
    expect(itemList.childNodes).toHaveLength(3);

    expect(getByText(itemList, "book - Quantity: 5")).toBeInTheDocument();
    expect(getByText(itemList, "pen - Quantity: 2")).toBeInTheDocument();
    expect(getByText(itemList, "paper - Quantity: 6")).toBeInTheDocument();
  });

  test("highlighting in red elements whose quantity is below five", () => {
    let inventory = [
      { "itemName": "book", "quantity": 5 },
      { "itemName": "pen", "quantity": 2 },
      { "itemName": "paper", "quantity": 6 }
    ];

    updateItemList(inventory);

    expect(screen.getByText("pen - Quantity: 2")).toHaveStyle({ color: "red" });
  });

  test("updates the localStorage with the inventory", () => {

    let inventory = [
      { "itemName": "book", "quantity": 5 },
      { "itemName": "pen", "quantity": 2 },
      { "itemName": "paper", "quantity": 6 }
    ];

    updateItemList(inventory);

    expect(localStorage.getItem("inventory")).toEqual(JSON.stringify(inventory));
  });

  test("does not update the inventory when passing null", () => {
    updateItemList(null);

    expect(localStorage.getItem("inventory")).toBeNull();
  });
});

describe("handleAddItem", () => {
  beforeEach(() => (data.inventory = {}));

  test("adding items to the page", async () => {

    fetch.mockResponseOnce(JSON.stringify([{ "itemName": "book", "quantity": 2 }]));

    const event = {
      preventDefault: jest.fn(),
      target: {
        elements: {
          name: { value: "book" },
          quantity: { value: "1" }
        }
      }
    };

    await handleAddItem(event);

    // Checking if the form's default reload is prevent
    expect(event.preventDefault.mock.calls).toHaveLength(1);
    expect(fetch).toHaveBeenCalledTimes(1);

    const itemList = document.getElementById("item-list");
    expect(getByText(itemList, "book - Quantity: 2")).toBeInTheDocument();

  });

});

describe("checkFormValues", () => {
  test("entering valid item values", () => {
    document.querySelector(`input[name="name"]`).value = "book";
    document.querySelector(`input[name="quantity"]`).value = "1";
    checkFormValues();
    expect(screen.getByText("Add to inventory")).toBeEnabled();
  });


  test("entering valid item values should show is valid.", () => {
    document.querySelector(`input[name="name"]`).value = "pen";
    document.querySelector(`input[name="quantity"]`).value = "1";
    checkFormValues();
    expect(screen.getByText("pen is valid!")).toBeInTheDocument();
  });

  test("entering valid item values should show is not a valid item", () => {
    document.querySelector(`input[name="name"]`).value = "keyboard";
    document.querySelector(`input[name="quantity"]`).value = "1";
    checkFormValues();
    expect(screen.getByText("keyboard is not a valid item.")).toBeInTheDocument();
  });

  test("entering invalid item names", () => {
    document.querySelector(`input[name="name"]`).value = "invalid";
    document.querySelector(`input[name="quantity"]`).value = "1";
    checkFormValues();
    expect(screen.getByText("Add to inventory")).toBeDisabled();

    document.querySelector(`input[name="name"]`).value = "cheesecake";
    document.querySelector(`input[name="quantity"]`).value = "";
    checkFormValues();
    expect(screen.getByText("Add to inventory")).toBeDisabled();
  });
});

