const { addItem, data } = require("../js/inventoryController");

const updateItemList = inventory => {
  if (inventory === null) return;

  localStorage.setItem("inventory", JSON.stringify(inventory));

  const inventoryList = window.document.getElementById("item-list");

  // Clears the list
  inventoryList.innerHTML = "";

  Object.values(inventory).forEach(item => {
    const listItem = window.document.createElement("li");
    listItem.innerHTML = `${item.itemName} - Quantity: ${item.quantity}`;

    if (item.quantity < 5) {
      listItem.className = "almost-soldout";
    }

    inventoryList.appendChild(listItem);
  });
};

const handleAddItem = async (event) => {
  // Prevent the page from reloading as it would by default
  event.preventDefault();

  const { name, quantity } = event.target.elements;
  const response = await addItem(name.value, parseInt(quantity.value, 10));
  updateItemList(response);

};

const validItems = ["book", "pen", "paper"];
const checkFormValues = () => {
  const itemName = document.querySelector(`input[name="name"]`).value;
  const quantity = document.querySelector(`input[name="quantity"]`).value;

  const itemNameIsEmpty = itemName === "";
  const itemNameIsInvalid = !validItems.includes(itemName);
  const quantityIsEmpty = quantity === "";

  const errorMsg = window.document.getElementById("error-msg");
  if (itemNameIsEmpty) {
    errorMsg.innerHTML = "";
  } else if (itemNameIsInvalid) {
    errorMsg.innerHTML = `${itemName} is not a valid item.`;
  } else {
    errorMsg.innerHTML = `${itemName} is valid!`;
  }

  const submitButton = document.querySelector(`button[type="submit"]`);
  if (itemNameIsEmpty || itemNameIsInvalid || quantityIsEmpty) {
    submitButton.disabled = true;
  } else {
    submitButton.disabled = false;
  }
};

module.exports = {
  updateItemList,
  handleAddItem,
  checkFormValues
};
