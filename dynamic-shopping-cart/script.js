const form = document.getElementById("form")
const shoppingCartUl = document.getElementById("cart")
// const productNameInput = document.getElementById("product-name")
// const productPriceInput = document.getElementById("product-price")
// const addProductButton = document.getElementById("add-product")
// const cart = document.getElementById("cart")
const totalPriceSpan = document.getElementById("total-price")

const shoppingCart = {
  items: [],
  domElement: shoppingCartUl,
  addProduct: function (nameString, priceNumber) {
    let product = new Product(nameString, priceNumber)
    if (!product.validate()) {
      product = null
      form.reset()
    } else {
      product.createHTML()
      this.items.push(product)
      this.updateDisplay()
    }
  },
  removeProduct: function (product) {
    product.domElement.remove()
    this.items.splice(this.items.indexOf(product), 1)
    product = null
    this.updateDisplay()
  },
  getProductById: function(productId) {
    return this.items.find((product) => productId === product.id)
  },
  getTotalPrice: function () {
    const startingTotal = 0.0
    const sum = this.items.reduce(
      (accumulator, product) => accumulator + parseFloat(product.price),
      startingTotal
    )
    return sum.toFixed(2)
  },
  updateDisplay: function () {
    // filter out products that already exist on the DOM
    const existingProductNames = Array.from(this.domElement
      .querySelectorAll("product-name"))
      .map((span) => span.textContent)
    const newProducts = this.items.filter(
      (product) => !existingProductNames.includes(product.name)
    )
    // if there are new products, append them as children to this.domElement
    if (newProducts.length > 0) {
      const newProductsDocFrag = new DocumentFragment()
      newProducts.forEach((product) => newProductsDocFrag.appendChild(product.domElement))
      this.domElement.appendChild(newProductsDocFrag)
    }
    // no else needed; products are already removed from DOM on this.removeProduct()

    // update the total price
    totalPriceSpan.textContent = this.getTotalPrice()
  },
}

class Product {

  static nextId = 0

  constructor(nameString, priceNumber) {
    this.id = Product.nextId++
    this.name = nameString
    this.price = priceNumber
    this.quantity = 1
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
    productListItem.dataset.id = this.id
    this.domElement = productListItem

    productListItem.classList.add(
      "list-group-item",
      "d-flex",
      "justify-content-between",
      "align-items-start"
    )

    const productLeftContainer = document.createElement("div")
    productLeftContainer.classList.add(
      "d-flex",
      "justify-content-between",
      "gap-3",
      "align-items-center"
    )
    productListItem.appendChild(productLeftContainer)

    const productNameContainer = document.createElement("div")
    productLeftContainer.appendChild(productNameContainer)

    const productNameStrong = document.createElement("strong")
    productNameContainer.appendChild(productNameStrong)

    const productNameSpan = document.createElement("span")
    productNameSpan.classList.add("product-name")
    productNameSpan.textContent = this.name
    productNameStrong.appendChild(productNameSpan)

    const productPriceContainer = document.createElement("div")
    productPriceContainer.innerHTML = `(<span class="product-quantity">${this.quantity}</span> &times; `
    productPriceContainer.innerHTML += `$<span class="product-price">${this.price}</span>)`
    productLeftContainer.appendChild(productPriceContainer)

    const productRightContainer = document.createElement("div")
    productRightContainer.classList.add(
      "d-flex",
      "justify-content-between",
      "gap-3",
      "align-items-center"
    )
    productListItem.appendChild(productRightContainer)

    const productTotalContainer = document.createElement("div")
    productRightContainer.appendChild(productTotalContainer)

    const productTotalStrong = document.createElement("strong")
    productTotalStrong.innerHTML = `$<span class="product-total-price">${this.price}</span>`
    productTotalContainer.appendChild(productTotalStrong)

    const productRemoveButtonContainer = document.createElement("div")
    productRightContainer.appendChild(productRemoveButtonContainer)

    const productRemoveButton = document.createElement("button")
    productRemoveButton.setAttribute("type", "button")
    productRemoveButton.classList.add(
      "btn",
      "btn-close",
      "product-remove-button"
    )
    productRemoveButtonContainer.appendChild(productRemoveButton)

    return this.domElement
  }
}

// Function to update the total price
// function updateTotalPrice(amount) {
//   totalPrice += amount
//   totalPriceSpan.textContent = totalPrice.toFixed(2)
// }

// Function to remove an item
// function removeItem(event) {
//   const item = event.target.closest("li")
//   const price = parseFloat(item.dataset.price)
//   updateTotalPrice(-price)
//   item.remove()
// }

document.addEventListener("DOMContentLoaded", () => {
  form.addEventListener("submit", (event) => {
    event.preventDefault()

    const shoppingCartFormData = new FormData(form)

    const productName = shoppingCartFormData.get("product-name")
    const productPrice = shoppingCartFormData.get("product-price")

    shoppingCart.addProduct(productName, productPrice)
    form.reset()
  })

  shoppingCartUl.addEventListener("click", (event) => {
    if (event.target.classList.contains("product-remove-button")) {
      const shoppingCartListItem = event.target.closest("li")
      const productId = parseInt(shoppingCartListItem.dataset.id)
      const product = shoppingCart.getProductById(productId)
      shoppingCart.removeProduct(product)
    }
  })
})
