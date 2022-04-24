const express = require('express');
var cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;
app.use(bodyParser.json());
app.use(cors());


const inventory = new Map();

app.post("/inventory", (req, res) => {
  const { itemName } = req.query;
  const { quantity } = req.body;

  let current = inventory.get(itemName);

  const itemExists = current && current.quantity > 0;
  const newRecord = {
    itemName,
    quantity: (itemExists ? current.quantity : 0) + quantity
  };

  inventory.set(newRecord.itemName, { itemName: newRecord.itemName, quantity: newRecord.quantity });

  return res.status(200).json(Array.from(inventory.values()));
});


app.get("/inventory", (req, res) => {
  let inventoryValues = Array.from(inventory.values());
  return res.status(200).json(inventoryValues);
});

const server = app.listen(port, () => {
  console.log(`Application is running and listening to port ${port}`);
});

