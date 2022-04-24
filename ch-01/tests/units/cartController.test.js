const { compliesToItemLimit } = require("../../src/controllers/cartController");

describe("compliesToItemLimit", () => {

  test("returns true for cards with no more than 3 items of a kind", () => {
    const cart = ["book", "book", "pen", "paper"];
    expect(compliesToItemLimit(cart)).toBe(true);
  });

  test("returns false for cards with no more than 3 items of a kind", () => {
    const cart = [
      "book",
      "book",
      "pen",
      "book",
      "book"
    ];
    expect(compliesToItemLimit(cart)).toBe(false);
  });
});

