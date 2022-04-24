const inventory = new Map();
inventory.set('book', 10);
inventory.set('pen', 10);

const removeFromInventory = item => {
  if (!inventory.has(item) || !inventory.get(item) > 0) {
    const err = new Error(`${item} is unavailable`);
    err.code = 400;
    throw err;
  }

  inventory.set(item, inventory.get(item) - 1);
};

module.exports = { removeFromInventory, inventory };