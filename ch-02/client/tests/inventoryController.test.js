const fetchMock = require("jest-fetch-mock");
const { API_ADDR, addItem, data } = require("../js/inventoryController.js");

beforeAll(() => {
  fetchMock.enableMocks();
});

describe("addItem", () => {
  test("adding new items to the inventory", async () => {

    const itemName = 'book';
    const quantity = 6;

    fetch.mockResponseOnce(JSON.stringify([{ "itemName": "book", "quantity": 6 }]));

    const response = await addItem(itemName, quantity);
    expect(response[0].quantity).toBe(6);
  });
});
