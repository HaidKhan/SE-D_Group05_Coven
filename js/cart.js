/* ==========================================================================
   Coven Streetwear — Cart Page Script  (js/cart.js)
   Owner: Haid (26-3163)

   Depends on (loaded before this file, in order):
     ../js/products.js    → PRODUCTS, getProductById, formatPrice, getImageSrc
     ../js/cart-store.js  → getCart, getCartDetails, getCartTotals,
                            getCartCount, addToCart, updateQuantity,
                            removeFromCart, setDiscountCode, clearDiscountCode
     ../js/main.js        → syncCartBadge (runs on cartchange)

   This file never touches localStorage directly.
   It never redefines anything from the shared scripts.
   Every class/id it touches starts with "cart-".
   ========================================================================== */

/* ------------------------------------------------------------------
   DOM references — grabbed once at startup
   ------------------------------------------------------------------ */
var cartItemsList        = document.getElementById("cartItemsList");
var cartEmptyState       = document.getElementById("cartEmptyState");
var cartContinueLink     = document.getElementById("cartContinueLink");
var cartItemCount        = document.getElementById("cartItemCount");
var cartSubtotal         = document.getElementById("cartSubtotal");
var cartDiscountRow      = document.getElementById("cartDiscountAppliedRow");
var cartDiscountAmount   = document.getElementById("cartDiscountAmount");
var cartDelivery         = document.getElementById("cartDelivery");
var cartTotal            = document.getElementById("cartTotal");
var cartCheckoutBtn      = document.getElementById("cartCheckoutBtn");
var cartDiscountInput    = document.getElementById("cartDiscountInput");
var cartApplyDiscountBtn = document.getElementById("cartApplyDiscount");
var cartDiscountMsg      = document.getElementById("cartDiscountMsg");

/* ------------------------------------------------------------------
   renderCart()
   Master render function. Called on first load and on every
   "cartchange" event (fired by cart-store.js after every change).
   ------------------------------------------------------------------ */
function renderCart() {
  var details = getCartDetails(); // merges cart items with product data
  var count   = getCartCount();

  // ── Item count label ──────────────────────────────────────────
  cartItemCount.textContent = count > 0
    ? count + (count === 1 ? " item" : " items")
    : "";

  // ── Empty vs populated ────────────────────────────────────────
  if (details.length === 0) {
    cartEmptyState.removeAttribute("hidden");
    cartContinueLink.setAttribute("hidden", "");
    cartItemsList.innerHTML = "";
    setCheckoutActive(false);
  } else {
    cartEmptyState.setAttribute("hidden", "");
    cartContinueLink.removeAttribute("hidden");
    renderItems(details);
    setCheckoutActive(true);
  }

  // ── Summary panel ─────────────────────────────────────────────
  updateSummary(getCartTotals());
}

/* ------------------------------------------------------------------
   renderItems(details)
   Builds the HTML for each cart item row.
   Sizes can be strings ("M") or numbers (42); we JSON-encode them
   into the data attribute so the event handler can read back the
   exact original type when calling cart-store functions.
   ------------------------------------------------------------------ */
function renderItems(details) {
  cartItemsList.innerHTML = details.map(function (item) {
    // Encode size as JSON so we can restore its type (string vs number)
    // e.g. "M" → %22M%22,  42 → 42
    var sizeEncoded = encodeURIComponent(JSON.stringify(item.size));

    return (
      '<div class="cart-item" role="listitem"' +
        ' data-id="'   + item.productId   + '"' +
        ' data-size="' + sizeEncoded      + '">' +

        /* Thumbnail */
        '<img class="cart-item-img"' +
          ' src="'  + item.image    + '"' +
          ' alt="'  + item.imageAlt + '">' +

        /* Info: name, size, unit price */
        '<div class="cart-item-info">' +
          '<p class="cart-item-name">'       + item.name                   + '</p>' +
          '<p class="cart-item-size">Size: ' + item.size                   + '</p>' +
          '<p class="cart-item-unit-price">' + formatPrice(item.price)     + '</p>' +
        '</div>' +

        /* Quantity controls */
        '<div class="cart-item-controls" aria-label="Quantity">' +
          '<button class="cart-qty-btn" data-action="decrease" aria-label="Decrease quantity">&#8722;</button>' +
          '<span class="cart-qty-value">' + item.quantity + '</span>' +
          '<button class="cart-qty-btn" data-action="increase" aria-label="Increase quantity">+</button>' +
        '</div>' +

        /* Line total */
        '<p class="cart-item-line-total">' + formatPrice(item.lineTotal) + '</p>' +

        /* Remove button */
        '<button class="cart-remove-btn" data-action="remove"' +
          ' aria-label="Remove ' + item.name + ' from cart">&times;</button>' +

      '</div>'
    );
  }).join("");
}

/* ------------------------------------------------------------------
   updateSummary(totals)
   Updates the right-side panel with current price breakdown.
   ------------------------------------------------------------------ */
function updateSummary(totals) {
  cartSubtotal.textContent = formatPrice(totals.subtotal);
  cartTotal.textContent    = formatPrice(totals.total);
  cartDelivery.textContent = totals.delivery > 0 ? formatPrice(totals.delivery) : "Free";

  // Show or hide the discount row
  if (totals.discount > 0) {
    cartDiscountRow.removeAttribute("hidden");
    cartDiscountAmount.textContent = "− " + formatPrice(totals.discount);
  } else {
    cartDiscountRow.setAttribute("hidden", "");
  }
}

/* ------------------------------------------------------------------
   setCheckoutActive(active)
   Switches the checkout button between its green (active) and
   greyed-out (disabled) states.
   ------------------------------------------------------------------ */
function setCheckoutActive(active) {
  if (active) {
    // Green and clickable
    cartCheckoutBtn.classList.add("cart-checkout-btn--active");
    cartCheckoutBtn.classList.remove("cart-checkout-btn--disabled");
    cartCheckoutBtn.removeAttribute("aria-disabled");
    cartCheckoutBtn.href = "checkout.html"; // links to checkout page
  } else {
    // Greyed out, not clickable
    cartCheckoutBtn.classList.add("cart-checkout-btn--disabled");
    cartCheckoutBtn.classList.remove("cart-checkout-btn--active");
    cartCheckoutBtn.setAttribute("aria-disabled", "true");
    cartCheckoutBtn.removeAttribute("href");
  }
}

/* ------------------------------------------------------------------
   Item controls — event delegation
   One listener on the list handles +, − and × for every item.
   We read the product id and size from the parent .cart-item element.
   ------------------------------------------------------------------ */
cartItemsList.addEventListener("click", function (event) {
  // Find the clicked [data-action] element (the button itself)
  var btn = event.target.closest("[data-action]");
  if (!btn) return;

  var card     = btn.closest(".cart-item");
  var productId = card.dataset.id;

  // Restore the original size type (string "M" or number 42)
  var size     = JSON.parse(decodeURIComponent(card.dataset.size));
  var action   = btn.dataset.action;

  if (action === "remove") {
    removeFromCart(productId, size);

  } else if (action === "increase") {
    var current = parseInt(card.querySelector(".cart-qty-value").textContent, 10);
    if (current < 10) {
      updateQuantity(productId, size, current + 1);
    }

  } else if (action === "decrease") {
    var currentQty = parseInt(card.querySelector(".cart-qty-value").textContent, 10);
    if (currentQty <= 1) {
      // Removing the last unit removes the whole item
      removeFromCart(productId, size);
    } else {
      updateQuantity(productId, size, currentQty - 1);
    }
  }
  // cart-store fires "cartchange" after each call → renderCart() runs automatically
});

/* ------------------------------------------------------------------
   Discount code form
   ------------------------------------------------------------------ */
cartApplyDiscountBtn.addEventListener("click", function () {
  var code   = cartDiscountInput.value.trim();
  var result = setDiscountCode(code);

  // Show success or error message
  cartDiscountMsg.textContent = result.message;
  cartDiscountMsg.className   = "cart-discount-msg " +
    (result.ok ? "cart-discount-msg--ok" : "cart-discount-msg--err");

  if (result.ok) {
    cartDiscountInput.value = ""; // clear input on success
  }
  // cartchange fires inside setDiscountCode → summary updates automatically
});

// Also allow pressing Enter in the discount input
cartDiscountInput.addEventListener("keydown", function (e) {
  if (e.key === "Enter") cartApplyDiscountBtn.click();
});

/* ------------------------------------------------------------------
   Re-render whenever cart-store.js fires a cartchange event.
   This covers: addToCart, updateQuantity, removeFromCart, clearCart,
   setDiscountCode, clearDiscountCode, placeOrder.
   ------------------------------------------------------------------ */
window.addEventListener("cartchange", renderCart);

/* ------------------------------------------------------------------
   Initial render — DOM is already ready because this script tag
   is at the bottom of <body>.
   ------------------------------------------------------------------ */
renderCart();
