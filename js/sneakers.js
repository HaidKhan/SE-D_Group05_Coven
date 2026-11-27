/* =========================================================
   COVEN — Sneakers Page Logic (Vanilla JavaScript)
   Covers:
   1. Data & Display       (product catalog & DOM rendering)
   2. Forms & Input        (search, filters, sort, validated forms)
   3. State & Memory       (app state + localStorage persistence)
   4. Interaction          (dropdowns, quick-view, drawer, modals, toast)
   5. Logic & Calculation  (filtering, sorting, PKR cart & shipping math)
   6. Accessibility        (ARIA states, keyboard Escape, focus handling)
   ========================================================= */

"use strict";

// ---------------------------------------------------------
// 1. PRODUCT DATA (Realistic COVEN Streetwear Sneakers)
// ---------------------------------------------------------
const SNEAKERS = [
  {
    id: "coven-apex-low",
    name: "Nike Mercurial Superfly CR7",
    category: "Low-Top",
    colorway: "Metallic Gold / White",
    pricePkr: 38500,
    sizes: ["6", "7", "8", "9", "10", "11"],
    badge: "CR7 Signature",
    badgeStyle: "cherry",
    image: "../images/sneakers/sneaker-apex-low.png",
    alt: "Nike Mercurial Superfly CR7 Cristiano Ronaldo signature shoe in metallic gold and white",
    description:
      "Cristiano Ronaldo signature edition featuring a textured metallic gold upper, white laces, and sculpted gold stud plate."
  },
  {
    id: "coven-nocturne-high",
    name: "Adidas F50 Messi",
    category: "Low-Top",
    colorway: "White / Sky Blue / Gold",
    pricePkr: 39500,
    sizes: ["7", "8", "9", "10", "11"],
    badge: "Messi Signature",
    badgeStyle: "cherry",
    image: "../images/sneakers/sneaker-nocturne-high.png",
    alt: "Adidas F50 Messi Lionel Messi signature shoe in white, sky blue, and metallic gold",
    description:
      "Lionel Messi signature edition crafted in crisp white with sky blue accents, metallic gold stripes, and an iridescent soleplate."
  },
  {
    id: "coven-velvet-runner",
    name: "Puma Future Neymar Jr.",
    category: "Runners",
    colorway: "Yellow / Orange / Teal Green",
    pricePkr: 36500,
    sizes: ["6", "7", "8", "9", "10"],
    badge: "Neymar Signature",
    badgeStyle: "rose",
    image: "../images/sneakers/sneaker-velvet-runner.png",
    alt: "Puma Future Neymar Jr. signature shoe in yellow, orange, and teal green",
    description:
      "Neymar Jr. signature edition showcasing vibrant yellow and orange graphics with bold teal green Puma branding."
  },
  {
    id: "coven-monolith-chunky",
    name: "Air Jordan 4 Retro Bred",
    category: "High-Top",
    colorway: "Black / Cement Grey / Fire Red",
    pricePkr: 23500,
    sizes: ["7", "8", "9", "10"],
    badge: "Classic",
    badgeStyle: "cherry",
    image: "../images/sneakers/sneaker-monolith-chunky.png",
    alt: "Air Jordan 4 Retro Bred sneaker in black suede with cement grey midsole and fire red outsole",
    description:
      "Iconic mid-top basketball silhouette featuring black nubuck panels, breathable side netting, cement grey wings, and fire red accents."
  },
  {
    id: "coven-solace-court",
    name: "Adidas Green Stripe Runner",
    category: "Lifestyle / Retro Runner",
    colorway: "White / Forest Green / Black",
    pricePkr: 15500,
    sizes: ["6", "7", "8", "9", "10", "11"],
    badge: "",
    badgeStyle: "",
    image: "../images/sneakers/sneaker-solace-court.png",
    alt: "Adidas retro mesh running sneaker in white with forest green overlays and black stripes",
    description:
      "Retro-tech athletic runner combining breathable white mesh, forest green structural overlays, and black 3-stripes."
  },
  {
    id: "coven-stride-knit",
    name: "Nike Air Zoom Runner",
    category: "Runners",
    colorway: "Black / Crimson Red",
    pricePkr: 17800,
    sizes: ["6", "7", "8", "9", "10", "11"],
    badge: "",
    badgeStyle: "",
    image: "../images/sneakers/sneaker-stride-knit.png",
    alt: "Nike Air Zoom running sneaker in black mesh with crimson red cushioning unit",
    description:
      "Sleek black performance runner equipped with a responsive crimson red Zoom Air sole for high-impact daily comfort."
  },
  {
    id: "coven-vanguard-low",
    name: "Puma Court Low",
    category: "Court",
    colorway: "White / Volt Yellow / Orange",
    pricePkr: 16900,
    sizes: ["6", "7", "8", "9", "10"],
    badge: "",
    badgeStyle: "",
    image: "../images/sneakers/sneaker-vanguard-low.png",
    alt: "Puma Court Low sneaker in white and pale volt yellow with bright orange formstrip",
    description:
      "Low-profile court sneaker pairing white engineered mesh and pale volt yellow collar trim with an orange Puma formstrip."
  },
  {
    id: "coven-eclipse-high",
    name: "ASICS FF Blast+ Runner",
    category: "Runners",
    colorway: "Royal Blue / Coral / Lime",
    pricePkr: 20500,
    sizes: ["7", "8", "9", "10", "11"],
    badge: "",
    badgeStyle: "",
    image: "../images/sneakers/sneaker-eclipse-high.png",
    alt: "ASICS FF Blast+ running sneaker in royal blue mesh with coral orange midsole and lime accents",
    description:
      "Cushioned road runner featuring royal blue breathable mesh, coral FF Blast+ foam midsole, and lime green outsole details."
  }
];

const CART_STORAGE_KEY = "coven_sneakers_cart";
const MEMBER_STORAGE_KEY = "coven_member_profile";
const FREE_SHIPPING_THRESHOLD = 25000;
const STANDARD_SHIPPING_PKR = 350;

// ---------------------------------------------------------
// 2. APPLICATION STATE
// ---------------------------------------------------------
const state = {
  searchQuery: "",
  category: "All",
  sizeFilter: "All",
  sortBy: "featured",
  selectedSizes: {}, // { productId: "8" }
  cart: loadFromStorage(CART_STORAGE_KEY, []),
  memberProfile: loadFromStorage(MEMBER_STORAGE_KEY, { name: "", preferredSize: "" })
};

// ---------------------------------------------------------
// 3. DOM REFERENCES
// ---------------------------------------------------------
const gridEl = document.getElementById("sneakers-grid");
const emptyStateEl = document.getElementById("empty-state");
const emptyStateMessageEl = document.getElementById("empty-state-message");
const resultsCountEl = document.getElementById("results-count");

const searchForm = document.getElementById("search-form");
const searchInput = document.getElementById("catalog-search-input");
const clearSearchBtn = document.getElementById("clear-search-btn");
const searchFeedbackEl = document.getElementById("search-feedback");
const categoryButtons = document.querySelectorAll(".pill-btn[data-category]");
const sizeFilterSelect = document.getElementById("size-filter");
const sortSelect = document.getElementById("sort-select");
const resetFiltersBtn = document.getElementById("reset-filters-btn");

const cartCountBadge = document.getElementById("cart-count-badge");
const headerCartBtn = document.getElementById("header-cart-btn");
const cartDrawer = document.getElementById("cart-drawer");
const drawerBackdrop = document.getElementById("drawer-backdrop");
const closeCartBtn = document.getElementById("close-cart-btn");
const cartItemsWrap = document.getElementById("cart-items-wrap");
const shippingBanner = document.getElementById("shipping-banner");
const cartSubtotalEl = document.getElementById("cart-subtotal");
const cartShippingEl = document.getElementById("cart-shipping");
const cartTotalEl = document.getElementById("cart-total");
const clearCartBtn = document.getElementById("clear-cart-btn");
const openCheckoutBtn = document.getElementById("open-checkout-btn");
const checkoutForm = document.getElementById("checkout-form");
const cancelCheckoutBtn = document.getElementById("cancel-checkout-btn");
const checkoutErrorEl = document.getElementById("checkout-error");

const quickViewModal = document.getElementById("quickview-modal");
const quickViewContent = document.getElementById("qv-content");
const closeQuickViewBtn = document.getElementById("close-quickview-btn");

const sizeGuideModal = document.getElementById("size-guide-modal");
const openSizeGuideBtn = document.getElementById("open-size-guide-btn");

const contactModal = document.getElementById("contact-modal");
const contactForm = document.getElementById("contact-form");
const contactErrorEl = document.getElementById("contact-error");

const accountModal = document.getElementById("account-modal");
const accountForm = document.getElementById("account-form");
const accountErrorEl = document.getElementById("account-error");

const shopDropdownBtn = document.getElementById("shop-dropdown-btn");
const shopDropdownMenu = document.getElementById("shop-dropdown-menu");
const mobileMenuBtn = document.getElementById("mobile-menu-btn");
const primaryNav = document.getElementById("primary-nav");
const headerSearchBtn = document.getElementById("header-search-btn");
const headerAccountBtn = document.getElementById("header-account-btn");
const navContactBtn = document.getElementById("nav-contact-btn");
const footerContactBtn = document.getElementById("footer-contact-btn");
const toastEl = document.getElementById("toast");

let toastTimer = null;

// ---------------------------------------------------------
// 4. STORAGE & FORMATTING HELPERS
// ---------------------------------------------------------
function loadFromStorage(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    return parsed !== null && parsed !== undefined ? parsed : fallback;
  } catch (error) {
    return fallback;
  }
}

function saveToStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    // Ignore storage errors in restricted browsing contexts
  }
}

function formatPKR(amount) {
  return "Rs. " + Number(amount).toLocaleString("en-PK");
}

function showToast(message) {
  if (!toastEl) return;
  toastEl.textContent = message;
  toastEl.hidden = false;

  if (toastTimer) {
    clearTimeout(toastTimer);
  }
  toastTimer = setTimeout(() => {
    toastEl.hidden = true;
  }, 3000);
}

// ---------------------------------------------------------
// 5. FILTERING & SORTING LOGIC
// ---------------------------------------------------------
function getFilteredAndSortedSneakers() {
  const query = state.searchQuery.trim().toLowerCase();

  // Filter by category, size, and search keyword
  const filtered = SNEAKERS.filter((item) => {
    const matchesCategory = state.category === "All" || item.category === state.category;
    const matchesSize = state.sizeFilter === "All" || item.sizes.includes(state.sizeFilter);
    const matchesSearch =
      query === "" ||
      item.name.toLowerCase().includes(query) ||
      item.category.toLowerCase().includes(query) ||
      item.colorway.toLowerCase().includes(query) ||
      item.description.toLowerCase().includes(query);

    return matchesCategory && matchesSize && matchesSearch;
  });

  // Sort a shallow copy so original SNEAKERS array stays unchanged
  const sorted = [...filtered];
  if (state.sortBy === "price-asc") {
    sorted.sort((a, b) => a.pricePkr - b.pricePkr);
  } else if (state.sortBy === "price-desc") {
    sorted.sort((a, b) => b.pricePkr - a.pricePkr);
  } else if (state.sortBy === "name-asc") {
    sorted.sort((a, b) => a.name.localeCompare(b.name));
  }

  return sorted;
}

// ---------------------------------------------------------
// 6. RENDER PRODUCT GRID
// ---------------------------------------------------------
function renderSneakers() {
  const items = getFilteredAndSortedSneakers();
  gridEl.innerHTML = "";

  resultsCountEl.textContent =
    items.length === 1 ? "Showing 1 sneaker" : `Showing ${items.length} sneakers`;

  if (items.length === 0) {
    emptyStateEl.hidden = false;
    if (state.searchQuery.trim() !== "") {
      emptyStateMessageEl.textContent = `No sneakers found for "${state.searchQuery.trim()}". Try another keyword or reset filters.`;
    } else {
      emptyStateMessageEl.textContent = "Try selecting a different category or choosing All Sizes.";
    }
    return;
  }

  emptyStateEl.hidden = true;

  items.forEach((product) => {
    const card = document.createElement("article");
    card.className = "sneaker-card";
    card.dataset.productId = product.id;

    // Determine currently selected size (or saved member preference if valid)
    const preferred = state.memberProfile.preferredSize;
    if (!state.selectedSizes[product.id] && preferred && product.sizes.includes(preferred)) {
      state.selectedSizes[product.id] = preferred;
    }
    const activeSize = state.selectedSizes[product.id] || "";

    // Media wrapper
    const media = document.createElement("div");
    media.className = "card-media";

    const imgBtn = document.createElement("button");
    imgBtn.type = "button";
    imgBtn.className = "card-image-btn";
    imgBtn.setAttribute("aria-label", `Quick view ${product.name}`);
    imgBtn.addEventListener("click", () => openQuickView(product.id));

    const img = document.createElement("img");
    img.src = product.image;
    img.alt = product.alt;
    img.loading = "lazy";
    imgBtn.appendChild(img);
    media.appendChild(imgBtn);

    if (product.badge) {
      const badge = document.createElement("span");
      badge.className =
        product.badgeStyle === "rose" ? "product-badge product-badge--rose" : "product-badge";
      badge.textContent = product.badge;
      media.appendChild(badge);
    }

    const qvChip = document.createElement("button");
    qvChip.type = "button";
    qvChip.className = "quickview-chip";
    qvChip.textContent = "Quick View";
    qvChip.setAttribute("aria-label", `Quick view details for ${product.name}`);
    qvChip.addEventListener("click", () => openQuickView(product.id));
    media.appendChild(qvChip);

    // Card body
    const body = document.createElement("div");
    body.className = "card-body";

    const meta = document.createElement("div");
    meta.className = "card-meta";
    const categorySpan = document.createElement("span");
    categorySpan.textContent = product.category;
    meta.appendChild(categorySpan);

    const titleBtn = document.createElement("button");
    titleBtn.type = "button";
    titleBtn.className = "card-title-btn";
    titleBtn.textContent = product.name;
    titleBtn.addEventListener("click", () => openQuickView(product.id));

    const colorway = document.createElement("p");
    colorway.className = "card-colorway";
    colorway.textContent = product.colorway;

    const price = document.createElement("p");
    price.className = "card-price";
    price.textContent = formatPKR(product.pricePkr);

    // Size selector
    const sizeGroup = document.createElement("div");
    sizeGroup.className = "size-selector-group";

    const sizeLabel = document.createElement("span");
    sizeLabel.className = "size-label";
    sizeLabel.textContent = activeSize ? `Selected: UK ${activeSize}` : "Select Size (UK)";

    const sizeOptions = document.createElement("div");
    sizeOptions.className = "size-options";
    sizeOptions.setAttribute("role", "group");
    sizeOptions.setAttribute("aria-label", `Select UK size for ${product.name}`);

    const cardError = document.createElement("p");
    cardError.className = "card-error";
    cardError.setAttribute("aria-live", "polite");

    product.sizes.forEach((size) => {
      const sizeBtn = document.createElement("button");
      sizeBtn.type = "button";
      sizeBtn.className = size === activeSize ? "size-btn size-btn--selected" : "size-btn";
      sizeBtn.textContent = size;
      sizeBtn.setAttribute("aria-pressed", size === activeSize ? "true" : "false");
      sizeBtn.setAttribute("aria-label", `${product.name} UK size ${size}`);

      sizeBtn.addEventListener("click", () => {
        state.selectedSizes[product.id] = size;
        cardError.textContent = "";
        sizeLabel.textContent = `Selected: UK ${size}`;

        const siblings = sizeOptions.querySelectorAll(".size-btn");
        siblings.forEach((btn) => {
          const isMatch = btn.textContent === size;
          btn.classList.toggle("size-btn--selected", isMatch);
          btn.setAttribute("aria-pressed", isMatch ? "true" : "false");
        });
      });

      sizeOptions.appendChild(sizeBtn);
    });

    sizeGroup.appendChild(sizeLabel);
    sizeGroup.appendChild(sizeOptions);

    const addBtn = document.createElement("button");
    addBtn.type = "button";
    addBtn.className = "btn btn-primary btn-full";
    addBtn.textContent = "Add to Cart";
    addBtn.addEventListener("click", () => {
      const chosenSize = state.selectedSizes[product.id];
      if (!chosenSize) {
        cardError.textContent = "Please select a UK size first.";
        showToast(`Choose a UK size for ${product.name} before adding to bag.`);
        return;
      }
      cardError.textContent = "";
      addToCart(product.id, chosenSize);
    });

    body.appendChild(meta);
    body.appendChild(titleBtn);
    body.appendChild(colorway);
    body.appendChild(price);
    body.appendChild(sizeGroup);
    body.appendChild(cardError);
    body.appendChild(addBtn);

    card.appendChild(media);
    card.appendChild(body);
    gridEl.appendChild(card);
  });
}

// ---------------------------------------------------------
// 7. CART LOGIC, CALCULATIONS & RENDERING
// ---------------------------------------------------------
function addToCart(productId, size) {
  const product = SNEAKERS.find((item) => item.id === productId);
  if (!product) return;

  const existingItem = state.cart.find((entry) => entry.id === productId && entry.size === size);
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    state.cart.push({
      id: product.id,
      name: product.name,
      colorway: product.colorway,
      size: size,
      pricePkr: product.pricePkr,
      image: product.image,
      quantity: 1
    });
  }

  saveToStorage(CART_STORAGE_KEY, state.cart);
  updateCartUI();
  showToast(`Added ${product.name} (UK ${size}) to your bag.`);
}

function updateCartQuantity(productId, size, delta) {
  const itemIndex = state.cart.findIndex((entry) => entry.id === productId && entry.size === size);
  if (itemIndex === -1) return;

  state.cart[itemIndex].quantity += delta;
  if (state.cart[itemIndex].quantity <= 0) {
    state.cart.splice(itemIndex, 1);
  }

  saveToStorage(CART_STORAGE_KEY, state.cart);
  updateCartUI();
}

function removeFromCart(productId, size) {
  state.cart = state.cart.filter((entry) => !(entry.id === productId && entry.size === size));
  saveToStorage(CART_STORAGE_KEY, state.cart);
  updateCartUI();
}

function clearCart() {
  state.cart = [];
  saveToStorage(CART_STORAGE_KEY, state.cart);
  checkoutForm.hidden = true;
  openCheckoutBtn.hidden = false;
  updateCartUI();
  showToast("Your COVEN bag has been cleared.");
}

function calculateCartTotals() {
  const totalCount = state.cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = state.cart.reduce((sum, item) => sum + item.pricePkr * item.quantity, 0);
  const shipping =
    subtotal === 0 ? 0 : subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING_PKR;
  const total = subtotal + shipping;
  const remainingForFree = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);

  return { totalCount, subtotal, shipping, total, remainingForFree };
}

function updateCartUI() {
  const { totalCount, subtotal, shipping, total, remainingForFree } = calculateCartTotals();

  cartCountBadge.textContent = String(totalCount);
  headerCartBtn.setAttribute("aria-label", `Open shopping cart (${totalCount} items)`);

  if (subtotal === 0) {
    shippingBanner.textContent = `Free nationwide delivery on orders above ${formatPKR(FREE_SHIPPING_THRESHOLD)}.`;
  } else if (remainingForFree > 0) {
    shippingBanner.textContent = `Add ${formatPKR(remainingForFree)} more for complimentary delivery.`;
  } else {
    shippingBanner.textContent = "Complimentary nationwide delivery unlocked!";
  }

  cartSubtotalEl.textContent = formatPKR(subtotal);
  cartShippingEl.textContent = subtotal === 0 ? "Rs. 0" : shipping === 0 ? "FREE" : formatPKR(shipping);
  cartTotalEl.textContent = formatPKR(total);

  openCheckoutBtn.disabled = state.cart.length === 0;
  clearCartBtn.disabled = state.cart.length === 0;
  if (state.cart.length === 0) {
    checkoutForm.hidden = true;
    openCheckoutBtn.hidden = false;
  }

  cartItemsWrap.innerHTML = "";

  if (state.cart.length === 0) {
    const emptyMsg = document.createElement("p");
    emptyMsg.className = "cart-empty";
    emptyMsg.textContent = "Your bag is currently empty. Pick a UK size on any sneaker to get started.";
    cartItemsWrap.appendChild(emptyMsg);
    return;
  }

  state.cart.forEach((item) => {
    const row = document.createElement("div");
    row.className = "cart-item";

    const img = document.createElement("img");
    img.src = item.image;
    img.alt = `${item.name} sneaker thumbnail`;

    const info = document.createElement("div");
    info.className = "cart-item-info";

    const title = document.createElement("h3");
    title.textContent = item.name;

    const meta = document.createElement("p");
    meta.className = "cart-item-meta";
    meta.textContent = `UK ${item.size} • ${formatPKR(item.pricePkr)} each`;

    const controls = document.createElement("div");
    controls.className = "cart-item-controls";

    const qtyGroup = document.createElement("div");
    qtyGroup.className = "qty-group";

    const decBtn = document.createElement("button");
    decBtn.type = "button";
    decBtn.className = "qty-btn";
    decBtn.textContent = "-";
    decBtn.setAttribute("aria-label", `Decrease quantity of ${item.name} UK ${item.size}`);
    decBtn.addEventListener("click", () => updateCartQuantity(item.id, item.size, -1));

    const qtyVal = document.createElement("span");
    qtyVal.className = "qty-value";
    qtyVal.textContent = String(item.quantity);

    const incBtn = document.createElement("button");
    incBtn.type = "button";
    incBtn.className = "qty-btn";
    incBtn.textContent = "+";
    incBtn.setAttribute("aria-label", `Increase quantity of ${item.name} UK ${item.size}`);
    incBtn.addEventListener("click", () => updateCartQuantity(item.id, item.size, 1));

    qtyGroup.appendChild(decBtn);
    qtyGroup.appendChild(qtyVal);
    qtyGroup.appendChild(incBtn);

    const removeBtn = document.createElement("button");
    removeBtn.type = "button";
    removeBtn.className = "remove-item-btn";
    removeBtn.textContent = "Remove";
    removeBtn.addEventListener("click", () => removeFromCart(item.id, item.size));

    controls.appendChild(qtyGroup);
    controls.appendChild(removeBtn);

    info.appendChild(title);
    info.appendChild(meta);
    info.appendChild(controls);

    row.appendChild(img);
    row.appendChild(info);
    cartItemsWrap.appendChild(row);
  });
}

// ---------------------------------------------------------
// 8. QUICK-VIEW MODAL & CART DRAWER CONTROLS
// ---------------------------------------------------------
function openQuickView(productId) {
  const product = SNEAKERS.find((item) => item.id === productId);
  if (!product) return;

  quickViewContent.innerHTML = "";
  let modalSelectedSize = state.selectedSizes[product.id] || "";

  const imgBox = document.createElement("div");
  imgBox.className = "qv-image-box";
  const img = document.createElement("img");
  img.src = product.image;
  img.alt = product.alt;
  imgBox.appendChild(img);

  const details = document.createElement("div");
  details.className = "qv-details";

  const eyebrow = document.createElement("p");
  eyebrow.className = "hero-eyebrow";
  eyebrow.textContent = `${product.category} • ${product.colorway}`;

  const title = document.createElement("h2");
  title.id = "qv-title";
  title.textContent = product.name;

  const price = document.createElement("p");
  price.className = "card-price";
  price.textContent = formatPKR(product.pricePkr);

  const desc = document.createElement("p");
  desc.className = "modal-subtitle";
  desc.textContent = product.description;

  const sizeLabel = document.createElement("span");
  sizeLabel.className = "size-label";
  sizeLabel.textContent = modalSelectedSize ? `Selected: UK ${modalSelectedSize}` : "Choose UK Size";

  const sizeOptions = document.createElement("div");
  sizeOptions.className = "size-options";

  const modalError = document.createElement("p");
  modalError.className = "card-error";
  modalError.setAttribute("aria-live", "polite");

  product.sizes.forEach((size) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = size === modalSelectedSize ? "size-btn size-btn--selected" : "size-btn";
    btn.textContent = size;
    btn.setAttribute("aria-pressed", size === modalSelectedSize ? "true" : "false");

    btn.addEventListener("click", () => {
      modalSelectedSize = size;
      state.selectedSizes[product.id] = size;
      modalError.textContent = "";
      sizeLabel.textContent = `Selected: UK ${size}`;

      sizeOptions.querySelectorAll(".size-btn").forEach((sBtn) => {
        const active = sBtn.textContent === size;
        sBtn.classList.toggle("size-btn--selected", active);
        sBtn.setAttribute("aria-pressed", active ? "true" : "false");
      });
      renderSneakers();
    });

    sizeOptions.appendChild(btn);
  });

  const addBtn = document.createElement("button");
  addBtn.type = "button";
  addBtn.className = "btn btn-primary btn-full";
  addBtn.textContent = "Add to Bag";
  addBtn.addEventListener("click", () => {
    if (!modalSelectedSize) {
      modalError.textContent = "Please choose a UK size first.";
      return;
    }
    addToCart(product.id, modalSelectedSize);
    closeModal(quickViewModal);
  });

  details.appendChild(eyebrow);
  details.appendChild(title);
  details.appendChild(price);
  details.appendChild(desc);
  details.appendChild(sizeLabel);
  details.appendChild(sizeOptions);
  details.appendChild(modalError);
  details.appendChild(addBtn);

  quickViewContent.appendChild(imgBox);
  quickViewContent.appendChild(details);
  openModal(quickViewModal);
}

function openCartDrawer() {
  cartDrawer.hidden = false;
  drawerBackdrop.hidden = false;
  headerCartBtn.setAttribute("aria-expanded", "true");
  closeCartBtn.focus();
}

function closeCartDrawer() {
  cartDrawer.hidden = true;
  drawerBackdrop.hidden = true;
  headerCartBtn.setAttribute("aria-expanded", "false");
}

function openModal(modalEl) {
  if (!modalEl) return;
  modalEl.hidden = false;
  const closeTrigger = modalEl.querySelector(".close-btn");
  if (closeTrigger) closeTrigger.focus();
}

function closeModal(modalEl) {
  if (!modalEl) return;
  modalEl.hidden = true;
}

function closeAllOverlays() {
  closeCartDrawer();
  [quickViewModal, sizeGuideModal, contactModal, accountModal].forEach((modal) => closeModal(modal));
  if (shopDropdownMenu && !shopDropdownMenu.hidden) {
    shopDropdownMenu.hidden = true;
    shopDropdownBtn.setAttribute("aria-expanded", "false");
  }
}

// ---------------------------------------------------------
// 9. EVENT LISTENERS & INPUT VALIDATION
// ---------------------------------------------------------
// Search input (live filtering + safe input handling)
searchInput.addEventListener("input", () => {
  const rawValue = searchInput.value;
  clearSearchBtn.hidden = rawValue.length === 0;

  // Reject search strings made purely of symbols (e.g. "@@@" or "!!!")
  const trimmed = rawValue.trim();
  const hasOnlySymbols = trimmed.length > 0 && !/[a-zA-Z0-9\s]/.test(trimmed);

  if (hasOnlySymbols) {
    searchFeedbackEl.textContent = "Please enter letters or numbers to search sneakers.";
    return;
  }

  searchFeedbackEl.textContent = "";
  state.searchQuery = rawValue;
  renderSneakers();
});

searchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const trimmed = searchInput.value.trim();
  if (trimmed === "") {
    searchFeedbackEl.textContent = "Type a sneaker name or colorway to filter the list.";
    searchInput.focus();
    return;
  }
  searchFeedbackEl.textContent = "";
  state.searchQuery = trimmed;
  renderSneakers();
});

clearSearchBtn.addEventListener("click", () => {
  searchInput.value = "";
  state.searchQuery = "";
  clearSearchBtn.hidden = true;
  searchFeedbackEl.textContent = "";
  renderSneakers();
  searchInput.focus();
});

// Category filter buttons
categoryButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    state.category = btn.dataset.category;
    categoryButtons.forEach((other) => {
      const isSelected = other === btn;
      other.classList.toggle("pill-btn--active", isSelected);
      other.setAttribute("aria-pressed", isSelected ? "true" : "false");
    });
    renderSneakers();
  });
});

// Size & Sort dropdowns
sizeFilterSelect.addEventListener("change", () => {
  state.sizeFilter = sizeFilterSelect.value;
  renderSneakers();
});

sortSelect.addEventListener("change", () => {
  state.sortBy = sortSelect.value;
  renderSneakers();
});

// Reset all filters
resetFiltersBtn.addEventListener("click", () => {
  state.searchQuery = "";
  state.category = "All";
  state.sizeFilter = "All";
  state.sortBy = "featured";

  searchInput.value = "";
  clearSearchBtn.hidden = true;
  searchFeedbackEl.textContent = "";
  sizeFilterSelect.value = "All";
  sortSelect.value = "featured";

  categoryButtons.forEach((btn) => {
    const isAll = btn.dataset.category === "All";
    btn.classList.toggle("pill-btn--active", isAll);
    btn.setAttribute("aria-pressed", isAll ? "true" : "false");
  });

  renderSneakers();
});

// Header navigation interactions
shopDropdownBtn.addEventListener("click", (event) => {
  event.stopPropagation();
  const isOpen = !shopDropdownMenu.hidden;
  shopDropdownMenu.hidden = isOpen;
  shopDropdownBtn.setAttribute("aria-expanded", isOpen ? "false" : "true");
});

document.querySelectorAll("[data-coming-soon]").forEach((btn) => {
  btn.addEventListener("click", () => {
    const name = btn.dataset.comingSoon;
    shopDropdownMenu.hidden = true;
    shopDropdownBtn.setAttribute("aria-expanded", "false");
    showToast(`${name} is coming soon — today's drop features Sneakers.`);
  });
});

document.addEventListener("click", (event) => {
  if (!shopDropdownMenu.hidden && !event.target.closest(".nav-item-dropdown")) {
    shopDropdownMenu.hidden = true;
    shopDropdownBtn.setAttribute("aria-expanded", "false");
  }
});

mobileMenuBtn.addEventListener("click", () => {
  const isOpen = primaryNav.classList.toggle("primary-nav--open");
  mobileMenuBtn.setAttribute("aria-expanded", isOpen ? "true" : "false");
});

headerSearchBtn.addEventListener("click", () => {
  searchInput.scrollIntoView({ behavior: "smooth", block: "center" });
  setTimeout(() => searchInput.focus(), 250);
});

headerCartBtn.addEventListener("click", openCartDrawer);
closeCartBtn.addEventListener("click", closeCartDrawer);
drawerBackdrop.addEventListener("click", closeCartDrawer);

clearCartBtn.addEventListener("click", clearCart);

openCheckoutBtn.addEventListener("click", () => {
  if (state.cart.length === 0) return;
  checkoutForm.hidden = false;
  openCheckoutBtn.hidden = true;
  if (state.memberProfile.name) {
    document.getElementById("checkout-name").value = state.memberProfile.name;
  }
  document.getElementById("checkout-name").focus();
});

cancelCheckoutBtn.addEventListener("click", () => {
  checkoutForm.hidden = true;
  openCheckoutBtn.hidden = false;
  checkoutErrorEl.textContent = "";
});

// Checkout validation
checkoutForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const nameVal = document.getElementById("checkout-name").value.trim();
  const phoneVal = document.getElementById("checkout-phone").value.trim();
  const cityVal = document.getElementById("checkout-city").value.trim();

  if (nameVal.length < 2) {
    checkoutErrorEl.textContent = "Please enter your full name (at least 2 characters).";
    return;
  }

  const digitsOnly = phoneVal.replace(/\D/g, "");
  if (digitsOnly.length < 10 || digitsOnly.length > 13) {
    checkoutErrorEl.textContent = "Please enter a valid Pakistan phone number (e.g. 0300-1234567).";
    return;
  }

  if (cityVal.length < 5) {
    checkoutErrorEl.textContent = "Please enter your city and street address.";
    return;
  }

  checkoutErrorEl.textContent = "";
  const { total } = calculateCartTotals();
  const orderRef = "CVN-" + Math.floor(1000 + Math.random() * 9000);

  state.cart = [];
  saveToStorage(CART_STORAGE_KEY, state.cart);
  checkoutForm.reset();
  checkoutForm.hidden = true;
  openCheckoutBtn.hidden = false;
  updateCartUI();
  closeCartDrawer();
  showToast(`Order ${orderRef} confirmed for ${nameVal} (${formatPKR(total)}).`);
});

// Modals: Quick View, Size Guide, Contact, Account
closeQuickViewBtn.addEventListener("click", () => closeModal(quickViewModal));
openSizeGuideBtn.addEventListener("click", () => openModal(sizeGuideModal));
navContactBtn.addEventListener("click", () => {
  primaryNav.classList.remove("primary-nav--open");
  mobileMenuBtn.setAttribute("aria-expanded", "false");
  openModal(contactModal);
});
document.getElementById("nav-about-link").addEventListener("click", () => {
  primaryNav.classList.remove("primary-nav--open");
  mobileMenuBtn.setAttribute("aria-expanded", "false");
});
footerContactBtn.addEventListener("click", () => openModal(contactModal));

headerAccountBtn.addEventListener("click", () => {
  document.getElementById("member-name").value = state.memberProfile.name || "";
  document.getElementById("member-size").value = state.memberProfile.preferredSize || "";
  accountErrorEl.textContent = "";
  openModal(accountModal);
});

document.querySelectorAll("[data-close-modal]").forEach((btn) => {
  btn.addEventListener("click", () => {
    const targetId = btn.dataset.closeModal;
    closeModal(document.getElementById(targetId));
  });
});

[quickViewModal, sizeGuideModal, contactModal, accountModal].forEach((modal) => {
  modal.addEventListener("click", (event) => {
    if (event.target === modal) {
      closeModal(modal);
    }
  });
});

// Contact form validation
contactForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const name = document.getElementById("contact-name").value.trim();
  const email = document.getElementById("contact-email").value.trim();
  const message = document.getElementById("contact-message").value.trim();
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (name.length < 2) {
    contactErrorEl.textContent = "Please enter your name.";
    return;
  }
  if (!emailPattern.test(email)) {
    contactErrorEl.textContent = "Please enter a valid email address.";
    return;
  }
  if (message.length < 5) {
    contactErrorEl.textContent = "Please enter a short message (at least 5 characters).";
    return;
  }

  contactErrorEl.textContent = "";
  contactForm.reset();
  closeModal(contactModal);
  showToast(`Thanks ${name}! Your message has been received by COVEN.`);
});

// Member preference form validation
accountForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const memberName = document.getElementById("member-name").value.trim();
  const preferredSize = document.getElementById("member-size").value;

  if (memberName.length < 2) {
    accountErrorEl.textContent = "Please enter your name.";
    return;
  }
  if (!preferredSize) {
    accountErrorEl.textContent = "Please select your preferred UK sneaker size.";
    return;
  }

  accountErrorEl.textContent = "";
  state.memberProfile = { name: memberName, preferredSize };
  saveToStorage(MEMBER_STORAGE_KEY, state.memberProfile);
  closeModal(accountModal);
  renderSneakers();
  showToast(`Saved UK ${preferredSize} preference for ${memberName}.`);
});

// Footer social buttons
document.querySelectorAll("[data-social]").forEach((btn) => {
  btn.addEventListener("click", () => {
    const platform = btn.dataset.social;
    showToast(`Follow @coven.streetwear on ${platform}.`);
  });
});

// Close overlays on Escape key
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeAllOverlays();
  }
});

// ---------------------------------------------------------
// 10. INITIALIZE PAGE
// ---------------------------------------------------------
renderSneakers();
updateCartUI();
