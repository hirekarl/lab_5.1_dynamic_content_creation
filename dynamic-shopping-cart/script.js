const form = document.getElementById("form")
// const productNameInput = document.getElementById("product-name")
// const productPriceInput = document.getElementById("product-price")
// const addProductButton = document.getElementById("add-product")
// const cart = document.getElementById("cart")
const totalPriceSpan = document.getElementById("total-price")

const shoppingCart = {
  items: [],
  domElement: document.getElementById("cart"),
  addProduct: (nameString, priceNumber) => {
    let product = new Product(nameString, priceNumber)
    if (!product.validate()) {
      product = null
      form.reset()
    } else {
      this.items.push(product)
      this.updateDisplay()
    }
  },
  removeProduct: (product) => {
    product.domElement.remove()
    this.items.splice(this.items.indexOf(product), 1)
    product = null
    // this.updateDisplay()
  },
  getTotalPrice: () => {
    const startingTotal = 0.0
    const sum = this.items.reduce(
      (accumulator, product) => accumulator + product.price,
      startingTotal
    )
    return sum
  },
  updateDisplay: () => {
    // filter out products that already exist on the DOM
    const newProducts = this.items.filter(
      (product) =>
        !this.domElement.children
          .map((child) => child.name.textContent)
          .contains(product.name)
    )
    // if there are new products, append them as children to this.domElement
    if (newProducts) {
      const newProductsDocFrag = new DocumentFragment()
      newProducts.forEach((product) => newProductsDocFrag.appendChild(product))
      this.domElement.appendChild(newProductsDocFrag)
    }
    // no else needed; products are already removed from DOM on this.removeProduct()
  },
}

class Product {
  constructor(nameString, priceNumber) {
    this.name = nameString
    this.price = priceNumber
    this.domElement = null
  }

  validate() {
    this.name = this.name.trim()
    if (
      shoppingCart.items.filter((item) => item.name === this.name).length > 0
    ) {
      return null
    } else {
      try {
        this.price = parseFloat(this.price).toFixed(2)
      } catch (error) {
        return null
      }
      return this
    }
  }

  createHTML() {
    const productListItem = document.createElement("li")

    /* */

    this.domElement = productListItem
    return productListItem
  }
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
