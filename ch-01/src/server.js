const express = require('express');
const bodyParser = require('body-parser');

const { carts, addItemToCart } = require("./controllers/cartController");
const { inventory } = require("./controllers/inventoryController");

const app = express();
const port = 3000;
app.use(bodyParser.json());

app.get("/carts/items", (req, res) => {
  const { username } = req.query;
  const cart = carts.get(username);
  return cart ? (res.status(200).json(cart)) : (res.status(404).send('Not found'));
});

app.post("/carts/items", (req, res) => {
  try {
    const { username, item } = req.body;
    const newItems = addItemToCart(username, item);
    return res.status(200).json(newItems);
  } catch (e) {
    return res.status(e.code).json({ message: e.message });
  }
});

app.delete("/carts/items", (req, res) => {
  const { username, item } = req.body;
  if (!carts.has(username) || !carts.get(username).includes(item)) {
    return res.status(400).send({ message: `${item} is not in the cart` });
  }

  const newItems = (carts.get(username) || []).filter(i => i !== item);
  inventory.set(item, (inventory.get(item) || 0) + 1);
  carts.set(username, newItems);
  return res.status(200).json(newItems);
});

const server = app.listen(port, () => {
  console.log(`Application is running and listening to port ${port}`);
});

module.exports = { server: server, carts, inventory };
