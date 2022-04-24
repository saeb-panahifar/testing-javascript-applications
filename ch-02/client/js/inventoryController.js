const data = { inventory: {} };

const API_ADDR = "http://localhost:3000";

const addItem = async (itemName, quantity) => {
  // const currentQuantity = data.inventory[itemName] || 0;
  // data.inventory[itemName] = currentQuantity + quantity;

  const response = await fetch(`${API_ADDR}/inventory/?itemName=${itemName}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ quantity })
  });

  return await response.json();
};

module.exports = { API_ADDR, data, addItem };
