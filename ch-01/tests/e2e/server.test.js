const { server, carts, inventory } = require("../../src/server.js");

const fetch = require("isomorphic-fetch");

const apiRoot = "http://localhost:3000";

afterAll(() => server.close());

afterEach(() => inventory.clear());
afterEach(() => carts.clear());

describe("add items to a cart", () => {

  test("adding available items", async () => {
    inventory.set("book", 1);

    const response = await fetch(`${apiRoot}/carts/items`,
      {
        method: "POST",
        body: JSON.stringify({ username: 'test_user', item: 'book' }),
        headers: { "Content-Type": "application/json" }
      }
    );

    expect(response.status).toEqual(200);
    expect(await response.json()).toEqual(["book"]);
    expect(inventory.get("book")).toEqual(0);
    expect(carts.get("test_user")).toEqual(["book"]);
  });

  test("adding unavailable items", async () => {
    carts.set("test_user", []);
    const response = await fetch(`${apiRoot}/carts/items`,
      {
        method: "POST",
        body: JSON.stringify({ username: 'test_user', item: 'book' }),
        headers: { "Content-Type": "application/json" }
      }
    );

    expect(response.status).toEqual(400);
    expect(await response.json()).toEqual({ message: "book is unavailable" });
    expect(carts.get("test_user")).toEqual([]);
  });
});

describe("removing items from a cart", () => {
  test("removing existing items", async () => {
    carts.set("test_user", ["book"]);
    const response = await fetch(`${apiRoot}/carts/items`,
      {
        method: "DELETE",
        body: JSON.stringify({ username: 'test_user', item: 'book' }),
        headers: { "Content-Type": "application/json" }
      }
    );

    expect(response.status).toEqual(200);
    expect(await response.json()).toEqual([]);
    expect(carts.get("test_user")).toEqual([]);
    expect(inventory.get("book")).toEqual(1);
  });

  test("removing non-existing items", async () => {
    inventory.set("book", 0);
    carts.set("test_user", []);
    const response = await fetch(`${apiRoot}/carts/items`,
      {
        method: "DELETE",
        body: JSON.stringify({ username: 'test_user', item: 'book' }),
        headers: { "Content-Type": "application/json" }
      }
    );

    expect(response.status).toEqual(400);
    expect(await response.json()).toEqual({ message: "book is not in the cart" });
    expect(inventory.get("book")).toEqual(0);
  });
});