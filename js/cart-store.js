/* ==========================================================================
   Coven Streetwear — Shared Cart Store  (js/cart-store.js)
   Owner: Haid (26-3163) — do not duplicate cart logic elsewhere.

   Depends on: js/products.js  (must be loaded first)
   Badge update: handled by main.js via the "cartchange" event.

   Load order on every page:
     <script src="../js/products.js"></script>
     <script src="../js/cart-store.js"></script>
     <script src="../js/main.js"></script>
     <script src="../js/<your-page>.js"></script>

   Functions exported as plain globals (no ES modules):
   -------------------------------------------------------
   getCart()                              → array of {productId, size, quantity}
   addToCart(productId, size, quantity)   → {ok, message}
   updateQuantity(productId, size, qty)   → {ok, message}
   removeFromCart(productId, size)        → {ok, message}
   clearCart()                            → {ok, message}
   getCartCount()                         → number (total qty across all items)
   getCartDetails()                       → array of cart items merged with
                                            product info + lineTotal
   setDiscountCode(code)                  → {ok, message}
   getDiscountCode()                      → string or null
   clearDiscountCode()                    → {ok, message}
   getCartTotals()                        → {subtotal, discount, delivery, total}
   placeOrder(customer)                   → {ok, message, order?}
   getLastOrder()                         → order object or null

   Events:
     "cartchange" fired on window after every change so other scripts
     (like main.js's syncCartBadge) can react without polling.
   ========================================================================== */

/* ------------------------------------------------------------------
   Constants
   ------------------------------------------------------------------ */
var CART_KEY      = "covenCart";       // localStorage key for cart items
var ORDER_KEY     = "covenLastOrder";  // localStorage key for last placed order
var DISCOUNT_KEY  = "covenDiscount";   // localStorage key for active discount code
var MAX_QTY       = 10;                // maximum quantity per line item
var DELIVERY_FEE  = 250;               // flat delivery fee in PKR
var DISCOUNT_CODE = "COVEN10";         // the one valid discount code
var DISCOUNT_RATE = 0.10;              // 10 % off the subtotal

/* ------------------------------------------------------------------
   _fireCartChange()  (private)
   Dispatches a "cartchange" event on window so any listener
   (e.g. main.js's syncCartBadge) can update the UI.
   ------------------------------------------------------------------ */
function _fireCartChange() {
  window.dispatchEvent(new Event("cartchange"));
}

/* ------------------------------------------------------------------
   _isValidQty(qty)  (private)
   Returns true only if qty is a whole number between 1 and MAX_QTY.
   ------------------------------------------------------------------ */
function _isValidQty(qty) {
  return (
    typeof qty === "number" &&
    Number.isFinite(qty) &&
    Math.floor(qty) === qty &&
    qty >= 1 &&
    qty <= MAX_QTY
  );
}

/* ------------------------------------------------------------------
   _saveCart(items)  (private)
   Writes the cart array to localStorage. Returns true on success.
   ------------------------------------------------------------------ */
function _saveCart(items) {
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
    return true;
  } catch (e) {
    return false;
  }
}

/* ------------------------------------------------------------------
   getCart()
   Reads the cart from localStorage.
   • Returns an array of {productId, size, quantity}.
   • Silently drops any item whose product no longer exists in PRODUCTS.
   • Returns [] if data is missing or corrupted.
   ------------------------------------------------------------------ */
function getCart() {
  try {
    var raw = localStorage.getItem(CART_KEY);
    if (!raw) return [];

    var items = JSON.parse(raw);
    if (!Array.isArray(items)) return [];

    // Keep only items that refer to existing products and have valid shapes
    return items.filter(function (item) {
      return (
        item &&
        typeof item.productId === "string" &&
        item.size !== undefined &&
        typeof item.quantity === "number" &&
        item.quantity > 0 &&
        getProductById(item.productId) !== undefined
      );
    });
  } catch (e) {
    return [];
  }
}

/* ------------------------------------------------------------------
   addToCart(productId, size, quantity)
   Adds a new line item, or increases the quantity if the same
   productId + size already exists (capped at MAX_QTY).
   Returns {ok, message}.
   ------------------------------------------------------------------ */
function addToCart(productId, size, quantity) {
  if (!getProductById(productId)) {
    return { ok: false, message: "Product not found." };
  }
  if (!_isValidQty(quantity)) {
    return { ok: false, message: "Enter a quantity from 1 to 10." };
  }

  var items = getCart();

  // Look for an existing line with the same id + size
  var found = false;
  for (var i = 0; i < items.length; i++) {
    if (items[i].productId === productId && items[i].size === size) {
      var newQty = items[i].quantity + quantity;
      if (newQty > MAX_QTY) newQty = MAX_QTY; // cap at limit
      items[i].quantity = newQty;
      found = true;
      break;
    }
  }

  if (!found) {
    items.push({ productId: productId, size: size, quantity: quantity });
  }

  if (!_saveCart(items)) {
    return { ok: false, message: "Could not save cart." };
  }
  _fireCartChange();
  return { ok: true, message: "Item added to cart." };
}

/* ------------------------------------------------------------------
   updateQuantity(productId, size, quantity)
   Sets the quantity for an existing line item.
   quantity must be 1–10; pass 0 to remove (use removeFromCart instead).
   Returns {ok, message}.
   ------------------------------------------------------------------ */
function updateQuantity(productId, size, quantity) {
  if (!_isValidQty(quantity)) {
    return { ok: false, message: "Enter a quantity from 1 to 10." };
  }

  var items = getCart();
  var found = false;

  for (var i = 0; i < items.length; i++) {
    if (items[i].productId === productId && items[i].size === size) {
      items[i].quantity = quantity;
      found = true;
      break;
    }
  }

  if (!found) {
    return { ok: false, message: "Item not found in cart." };
  }

  if (!_saveCart(items)) {
    return { ok: false, message: "Could not save cart." };
  }
  _fireCartChange();
  return { ok: true, message: "Quantity updated." };
}

/* ------------------------------------------------------------------
   removeFromCart(productId, size)
   Removes the line item with the given productId + size.
   Returns {ok, message}.
   ------------------------------------------------------------------ */
function removeFromCart(productId, size) {
  var items = getCart();
  var before = items.length;

  items = items.filter(function (item) {
    return !(item.productId === productId && item.size === size);
  });

  if (items.length === before) {
    return { ok: false, message: "Item not found in cart." };
  }

  if (!_saveCart(items)) {
    return { ok: false, message: "Could not save cart." };
  }
  _fireCartChange();
  return { ok: true, message: "Item removed from cart." };
}

/* ------------------------------------------------------------------
   clearCart()
   Empties the cart entirely.
   Returns {ok, message}.
   ------------------------------------------------------------------ */
function clearCart() {
  try {
    localStorage.removeItem(CART_KEY);
  } catch (e) {
    return { ok: false, message: "Could not clear cart." };
  }
  _fireCartChange();
  return { ok: true, message: "Cart cleared." };
}

/* ------------------------------------------------------------------
   getCartCount()
   Returns the total number of items (sum of all quantities).
   ------------------------------------------------------------------ */
function getCartCount() {
  var items = getCart();
  return items.reduce(function (sum, item) { return sum + item.quantity; }, 0);
}

/* ------------------------------------------------------------------
   getCartDetails()
   Returns each cart item merged with its product data, plus a lineTotal.
   Shape: [{productId, size, quantity, name, price, image, imageAlt, lineTotal}]
   ------------------------------------------------------------------ */
function getCartDetails() {
  var items = getCart();
  return items.map(function (item) {
    var product = getProductById(item.productId);
    return {
      productId: item.productId,
      size:      item.size,
      quantity:  item.quantity,
      name:      product.name,
      price:     product.price,
      image:     getImageSrc(product),    // correct path for the current page
      imageAlt:  product.imageAlt,
      lineTotal: product.price * item.quantity
    };
  });
}

/* ------------------------------------------------------------------
   setDiscountCode(code)
   Validates and saves a discount code.
   Only "COVEN10" is accepted (case-insensitive).
   Returns {ok, message}.
   ------------------------------------------------------------------ */
function setDiscountCode(code) {
  if (
    typeof code !== "string" ||
    code.trim().toUpperCase() !== DISCOUNT_CODE
  ) {
    return { ok: false, message: "That code isn't valid." };
  }

  try {
    localStorage.setItem(DISCOUNT_KEY, DISCOUNT_CODE);
  } catch (e) {
    return { ok: false, message: "Could not save discount code." };
  }
  _fireCartChange();
  return { ok: true, message: "Discount applied: 10% off your order." };
}

/* ------------------------------------------------------------------
   getDiscountCode()
   Returns the currently saved discount code string, or null.
   ------------------------------------------------------------------ */
function getDiscountCode() {
  try {
    return localStorage.getItem(DISCOUNT_KEY) || null;
  } catch (e) {
    return null;
  }
}

/* ------------------------------------------------------------------
   clearDiscountCode()
   Removes any active discount code.
   Returns {ok, message}.
   ------------------------------------------------------------------ */
function clearDiscountCode() {
  try {
    localStorage.removeItem(DISCOUNT_KEY);
  } catch (e) {
    return { ok: false, message: "Could not clear discount code." };
  }
  _fireCartChange();
  return { ok: true, message: "Discount code removed." };
}

/* ------------------------------------------------------------------
   getCartTotals()
   Calculates and returns cart totals.
   • subtotal  — sum of all line totals
   • discount  — 10% of subtotal if COVEN10 is applied, else 0
   • delivery  — PKR 250 flat if cart is not empty, else 0
   • total     — subtotal - discount + delivery
   ------------------------------------------------------------------ */
function getCartTotals() {
  var details  = getCartDetails();
  var subtotal = details.reduce(function (sum, item) {
    return sum + item.lineTotal;
  }, 0);

  var discount = 0;
  if (getDiscountCode() === DISCOUNT_CODE) {
    discount = Math.round(subtotal * DISCOUNT_RATE);
  }

  var delivery = subtotal > 0 ? DELIVERY_FEE : 0;

  return {
    subtotal: subtotal,
    discount: discount,
    delivery: delivery,
    total:    subtotal - discount + delivery
  };
}

/* ------------------------------------------------------------------
   placeOrder(customer)
   Creates an order from the current cart, saves it, then clears
   the cart and any active discount.
   • customer  — object with customer details (name, address, etc.)
   Returns {ok, message} on failure, or {ok, message, order} on success.
   Order number format: CVN-XXXX (random 4-digit suffix).
   ------------------------------------------------------------------ */
function placeOrder(customer) {
  var items = getCart();

  if (items.length === 0) {
    return { ok: false, message: "Your cart is empty." };
  }

  var order = {
    orderNumber: "CVN-" + (1000 + Math.floor(Math.random() * 9000)),
    date:        new Date().toISOString(),
    items:       getCartDetails(),
    totals:      getCartTotals(),
    customer:    customer || {}
  };

  try {
    localStorage.setItem(ORDER_KEY, JSON.stringify(order));
    localStorage.removeItem(CART_KEY);
    localStorage.removeItem(DISCOUNT_KEY);
  } catch (e) {
    return { ok: false, message: "Could not save order. Please try again." };
  }

  _fireCartChange(); // badge goes to 0
  return { ok: true, message: "Order placed!", order: order };
}

/* ------------------------------------------------------------------
   getLastOrder()
   Returns the last placed order object, or null if none exists.
   ------------------------------------------------------------------ */
function getLastOrder() {
  try {
    var raw = localStorage.getItem(ORDER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}
