const form = document.getElementById("form")
const shoppingCartUl = document.getElementById("cart")
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
  getProductById: function (productId) {
    return this.items.find((product) => productId === product.id)
  },
  getTotalPrice: function () {
    const startingTotal = 0.0
    const sum = this.items.reduce(
      (accumulator, product) =>
        accumulator + parseFloat(product.getTotalPrice()),
      startingTotal
    )

    return sum.toFixed(2)
  },
  updateDisplay: function () {
    // set decrement button for all products
    this.items.forEach((product) => product.setDecrementButton())

    // filter out products that already exist on the DOM
    const existingProductNames = Array.from(
      this.domElement.querySelectorAll(".product-name")
    ).map((span) => span.textContent.toLowerCase())
    const newProducts = this.items.filter(
      (product) => !existingProductNames.includes(product.name.toLowerCase())
    )

    // if there are new products, append them as children to this.domElement
    if (newProducts.length > 0) {
      const newProductsDocFrag = new DocumentFragment()
      newProducts.forEach((product) =>
        newProductsDocFrag.appendChild(product.domElement)
      )
      this.domElement.appendChild(newProductsDocFrag)
    }

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
    this.quantitySpan = null
    this.totalPriceSpan = null
    this.decrementButton = null
  }

  setDecrementButton() {
    if (this.quantity > 1) {
      this.decrementButton.disabled = false
    } else {
      this.decrementButton.disabled = true
    }
  }

  decrementQuantity() {
    if (this.quantity > 1) {
      this.quantity--

      this.quantitySpan.textContent = this.quantity
      this.totalPriceSpan.textContent = this.getTotalPrice()

      shoppingCart.updateDisplay()
    }
  }

  incrementQuantity() {
    this.quantity++

    this.quantitySpan.textContent = this.quantity
    this.totalPriceSpan.textContent = this.getTotalPrice()

    shoppingCart.updateDisplay()
  }

  getTotalPrice() {
    const totalPrice = parseFloat(this.price) * this.quantity
    return totalPrice.toFixed(2)
  }

  validate() {
    this.name = this.name.trim()
    if (
      shoppingCart.items.filter(
        (item) => item.name.toLowerCase() === this.name.toLowerCase()
      ).length > 0
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
    this.domElement = productListItem

    productListItem.dataset.id = this.id

    productListItem.classList.add(
      "list-group-item",
      "d-flex",
      "justify-content-between",
      "align-items-center"
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

    const productAdjustQuantityContainer = document.createElement("div")
    productAdjustQuantityContainer.classList.add("btn-group")
    productAdjustQuantityContainer.setAttribute("role", "group")
    productLeftContainer.appendChild(productAdjustQuantityContainer)

    const productDecrementQuantityButton = document.createElement("button")
    productDecrementQuantityButton.setAttribute("type", "button")
    productDecrementQuantityButton.setAttribute("disabled", "true")
    productDecrementQuantityButton.classList.add(
      "btn",
      "btn-sm",
      "btn-danger",
      "decrement-quantity-button"
    )
    productDecrementQuantityButton.textContent = "-"
    productAdjustQuantityContainer.appendChild(productDecrementQuantityButton)

    const productIncrementQuantityButton = document.createElement("button")
    productIncrementQuantityButton.setAttribute("type", "button")
    productIncrementQuantityButton.classList.add(
      "btn",
      "btn-sm",
      "btn-success",
      "increment-quantity-button"
    )
    productIncrementQuantityButton.textContent = "+"
    productAdjustQuantityContainer.appendChild(productIncrementQuantityButton)

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
    productTotalStrong.innerHTML = `$<span class="product-total-price">${this.getTotalPrice()}</span>`
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

    this.quantitySpan = productListItem.querySelector(".product-quantity")
    this.totalPriceSpan = productListItem.querySelector(".product-total-price")
    this.decrementButton = productListItem.querySelector(
      ".decrement-quantity-button"
    )
  }
}

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
    const shoppingCartListItem = event.target.closest("li")

    const productId = parseInt(shoppingCartListItem.dataset.id)
    const product = shoppingCart.getProductById(productId)

    if (event.target.classList.contains("product-remove-button")) {
      shoppingCart.removeProduct(product)
    }

    if (event.target.classList.contains("decrement-quantity-button")) {
      product.decrementQuantity()
    }

    if (event.target.classList.contains("increment-quantity-button")) {
      product.incrementQuantity()
    }
  })
})
