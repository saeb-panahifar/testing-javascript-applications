const { inventory } = require("../../src/controllers/inventoryController");
const { carts, addItemToCart } = require("../../src/controllers/cartController");
const fs = require("fs");

afterEach(() => inventory.clear());
afterEach(() => carts.clear());

describe("addItemToCart", () => {
  
  beforeEach(() => {
    fs.writeFileSync("logs.txt", "");
  });

  test("adding unavailable items to cart", () => {
    carts.set("test_user", []);
    inventory.set("book", 0);

    try {
      addItemToCart("test_user", "book");
    } catch (e) {
      const expectedError = new Error(`book is unavailable`);
      expectedError.code = 400;

      expect(e).toEqual(expectedError);
    }

    expect(carts.get("test_user")).toEqual([]);
    expect.assertions(2);
  });

  test("logging added items", () => {
    carts.set("test_user", []);
    inventory.set("book", 1);

    addItemToCart("test_user", "book");

    const logs = fs.readFileSync("logs.txt", "utf-8");
    expect(logs).toContain("book added to test_user's cart\n");
  });

});