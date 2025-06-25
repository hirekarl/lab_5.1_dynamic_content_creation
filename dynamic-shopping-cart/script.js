const productNameInput = document.getElementById("product-name")
const productPriceInput = document.getElementById("product-price")
const addProductButton = document.getElementById("add-product")
const cart = document.getElementById("cart")
const totalPriceSpan = document.getElementById("total-price")

const shoppingCart = {
  items: [],
  addProduct: (product) => {},
  removeProduct: (product) => {},
  getTotalPrice: () => {},
  updateDisplay: () => {}
}

// Function to update the total price
function updateTotalPrice(amount) {
  totalPrice += amount
  totalPriceSpan.textContent = totalPrice.toFixed(2)
}

// Function to remove an item
function removeItem(event) {
  const item = event.target.closest("li")
  const price = parseFloat(item.dataset.price)
  updateTotalPrice(-price)
  item.remove()
}
