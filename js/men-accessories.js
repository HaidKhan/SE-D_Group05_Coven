/* =============================================================
   COVEN — Men Accessories  (page JavaScript)
   Covers: product data, rendering, search/filter/sort,
           cart drawer, quick-view modal, contact/account modals,
           toast, keyboard accessibility.
   ============================================================= */
"use strict";

// ─────────────────────────────────────────────────────────────
// 1. PRODUCT DATA  — 10 products, 5 categories × 2
// ─────────────────────────────────────────────────────────────
const ACCESSORIES = [
  /* ── WATCHES ── */
  {
    id: "watch-01",
    name: "Classic Silver Watch",
    category: "Watches",
    material: "Stainless Steel / Mineral Crystal",
    pricePkr: 8500,
    isNew: false,
    image: "../images/men-accessories/classic-silver-watch.jpg",
    alt: "Classic silver stainless-steel dress watch with white dial on a dark surface",
    description: "Timeless silver-tone dress watch with 40 mm brushed steel case, white dial, and a hand-stitched leather strap."
  },
  {
    id: "watch-02",
    name: "Black Chronograph",
    category: "Watches",
    material: "PVD Black Steel / Sapphire Crystal",
    pricePkr: 12500,
    isNew: true,
    image: "../images/men-accessories/black-chronograph.jpg",
    alt: "Black PVD chronograph watch with sub-dials on dark background",
    description: "Bold 44 mm black PVD chronograph with sapphire crystal, luminous hands, and a durable vulcanized rubber strap."
  },

  /* ── WALLETS ── */
  {
    id: "wallet-01",
    name: "Executive Bifold Wallet",
    category: "Wallets",
    material: "Full-Grain Italian Leather",
    pricePkr: 3500,
    isNew: false,
    image: "../images/men-accessories/executive-bifold-wallet.jpg",
    alt: "Executive dark-brown full-grain leather bifold wallet open showing card slots",
    description: "Hand-stitched Italian calfskin bifold with 8 card slots, 2 currency sections and built-in RFID blocking."
  },
  {
    id: "wallet-02",
    name: "Slim Leather Cardholder",
    category: "Wallets",
    material: "Pebbled Genuine Leather",
    pricePkr: 2200,
    isNew: true,
    image: "../images/men-accessories/slim-leather-cardholder.jpg",
    alt: "Slim minimalist pebbled-leather cardholder wallet in charcoal",
    description: "Ultra-slim pebbled leather cardholder holds up to 6 cards with a centre cash slot — fits any front pocket."
  },

  /* ── SUNGLASSES ── */
  {
    id: "sunglass-01",
    name: "Classic Aviator",
    category: "Sunglasses",
    material: "Metal Frame / Polarized UV400",
    pricePkr: 3000,
    isNew: false,
    image: "../images/men-accessories/classic-aviator.jpg",
    alt: "Classic gold-frame aviator sunglasses with green polarized lenses",
    description: "Iconic double-bridge aviator in polished gold with CR-39 polarized gradient lenses and silicone nose pads."
  },
  {
    id: "sunglass-02",
    name: "Black Wayfarer",
    category: "Sunglasses",
    material: "Matte Acetate / UV400 Lenses",
    pricePkr: 2500,
    isNew: true,
    image: "../images/men-accessories/black-wayfarer.jpg",
    alt: "Matte black acetate wayfarer sunglasses with dark lenses",
    description: "Hand-finished matte black acetate wayfarer frame with UV400-rated lenses and spring-loaded steel hinges."
  },

  /* ── PERFUMES ── */
  {
    id: "perfume-01",
    name: "Oud Noir",
    category: "Perfumes",
    material: "100 ml EDP — Oud, Leather, Amber",
    pricePkr: 4500,
    isNew: false,
    image: "../images/men-accessories/oud-noir.jpg",
    alt: "Oud Noir eau de parfum bottle with dark glass and gold cap",
    description: "Deep and magnetic fragrance built on rare oud, smoky leather and warm amber — a commanding evening signature."
  },
  {
    id: "perfume-02",
    name: "Fresh Blue Eau de Parfum",
    category: "Perfumes",
    material: "75 ml EDT — Bergamot, Vetiver, Cedar",
    pricePkr: 3500,
    isNew: true,
    image: "../images/men-accessories/fresh-blue-perfume.jpg",
    alt: "Fresh Blue cologne bottle with clean geometric design",
    description: "Bright aquatic EDT with Calabrian bergamot, Haitian vetiver and Atlas cedarwood — the perfect daytime companion."
  },

  /* ── BELTS ── */
  {
    id: "belt-01",
    name: "Classic Black Leather Belt",
    category: "Belts",
    material: "Full-Grain Calfskin / Brass Buckle",
    pricePkr: 2500,
    isNew: false,
    image: "../images/men-accessories/black-leather-belt.jpg",
    alt: "Classic black full-grain calfskin dress belt with polished brass pin buckle",
    description: "32 mm black calfskin belt with hand-polished brass pin buckle and clean edge-stitching — a wardrobe essential."
  },
  {
    id: "belt-02",
    name: "Brown Leather Belt",
    category: "Belts",
    material: "Vegetable-Tanned Leather / Silver Buckle",
    pricePkr: 2800,
    isNew: true,
    image: "../images/men-accessories/brown-leather-belt.jpg",
    alt: "Rich brown vegetable-tanned leather belt with brushed silver buckle",
    description: "Reversible cognac leather belt in vegetable-tanned hide with a rotating brushed-silver buckle for two looks in one."
  }
];

const CART_KEY     = "coven_accessories_cart";
const MEMBER_KEY   = "coven_member_profile";
const FREE_SHIP    = 25000;
const SHIP_FEE     = 350;

// ─────────────────────────────────────────────────────────────
// 2. STATE
// ─────────────────────────────────────────────────────────────
const state = {
  category : "All",
  query    : "",
  sort     : "featured",
  cart     : load(CART_KEY, []),
  member   : load(MEMBER_KEY, { name: "" })
};

// ─────────────────────────────────────────────────────────────
// 3. DOM REFS
// ─────────────────────────────────────────────────────────────
const gridEl          = document.getElementById("accessories-grid");
const emptyEl         = document.getElementById("empty-state");
const emptyMsgEl      = document.getElementById("empty-state-message");
const countEl         = document.getElementById("results-count");
const searchInput     = document.getElementById("catalog-search-input");
const clearSearchBtn  = document.getElementById("clear-search-btn");
const sortSelect      = document.getElementById("sort-select");
const resetBtn        = document.getElementById("reset-filters-btn");
const catBtns         = document.querySelectorAll(".ma-cat-btn");

const cartBadge       = document.getElementById("cart-count-badge");
const cartBtn         = document.getElementById("header-cart-btn");
const cartDrawer      = document.getElementById("cart-drawer");
const backdrop        = document.getElementById("drawer-backdrop");
const closeCartBtn    = document.getElementById("close-cart-btn");
const cartWrap        = document.getElementById("cart-items-wrap");
const shipBanner      = document.getElementById("shipping-banner");
const subtotalEl      = document.getElementById("cart-subtotal");
const shipEl          = document.getElementById("cart-shipping");
const totalEl         = document.getElementById("cart-total");
const clearCartBtn    = document.getElementById("clear-cart-btn");
const checkoutBtn     = document.getElementById("open-checkout-btn");
const checkoutForm    = document.getElementById("checkout-form");
const cancelChkBtn    = document.getElementById("cancel-checkout-btn");
const chkErrorEl      = document.getElementById("checkout-error");

const qvModal         = document.getElementById("quickview-modal");
const qvContent       = document.getElementById("qv-content");
const closeQvBtn      = document.getElementById("close-quickview-btn");

const contactModal    = document.getElementById("contact-modal");
const contactForm     = document.getElementById("contact-form");
const contactErrorEl  = document.getElementById("contact-error");

const accountModal    = document.getElementById("account-modal");
const accountForm     = document.getElementById("account-form");
const accountErrorEl  = document.getElementById("account-error");

const shopDDBtn       = document.getElementById("shop-dropdown-btn");
const shopDDMenu      = document.getElementById("shop-dropdown-menu");
const mobMenuBtn      = document.getElementById("mobile-menu-btn");
const primaryNav      = document.getElementById("primary-nav");
const hdrSearchBtn    = document.getElementById("header-search-btn");
const hdrAccountBtn   = document.getElementById("header-account-btn");
const navContactBtn   = document.getElementById("nav-contact-btn");
const ftrContactBtn   = document.getElementById("footer-contact-btn");
const toastEl         = document.getElementById("toast");

let toastTimer = null;

// ─────────────────────────────────────────────────────────────
// 4. HELPERS
// ─────────────────────────────────────────────────────────────
function load(key, fallback) {
  try { const r = localStorage.getItem(key); return r ? JSON.parse(r) : fallback; }
  catch { return fallback; }
}
function save(key, val) {
  try { localStorage.setItem(key, JSON.stringify(val)); } catch {}
}
function pkr(n) { return "Rs. " + Number(n).toLocaleString("en-PK"); }
function toast(msg) {
  if (!toastEl) return;
  toastEl.textContent = msg;
  toastEl.hidden = false;
  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { toastEl.hidden = true; }, 3200);
}

// ─────────────────────────────────────────────────────────────
// 5. FILTER + SORT
// ─────────────────────────────────────────────────────────────
function getFiltered() {
  const q = state.query.trim().toLowerCase();
  let list = ACCESSORIES.filter(p => {
    const catOk  = state.category === "All" || p.category === state.category;
    const qOk    = !q || [p.name, p.category, p.material, p.description].some(s => s.toLowerCase().includes(q));
    return catOk && qOk;
  });
  if      (state.sort === "price-asc")  list.sort((a,b) => a.pricePkr - b.pricePkr);
  else if (state.sort === "price-desc") list.sort((a,b) => b.pricePkr - a.pricePkr);
  else if (state.sort === "newest")     list.sort((a,b) => (b.isNew?1:0) - (a.isNew?1:0));
  return list;
}

// ─────────────────────────────────────────────────────────────
// 6. RENDER GRID
// ─────────────────────────────────────────────────────────────
function renderGrid() {
  const items = getFiltered();
  gridEl.innerHTML = "";
  countEl.textContent = `Showing ${items.length} ${items.length === 1 ? "item" : "items"}`;

  if (!items.length) {
    gridEl.hidden = true;
    emptyEl.hidden = false;
    const trimmedQuery = state.query.trim();
    emptyMsgEl.textContent = trimmedQuery
      ? `We couldn't find anything matching "${trimmedQuery}". Try another search.`
      : "No products available in this category. Clear filters to view all accessories.";
    return;
  }
  gridEl.hidden = false;
  emptyEl.hidden = true;

  items.forEach(p => {
    const card = document.createElement("article");
    card.className = "ma-card";
    card.dataset.id = p.id;
    card.innerHTML = `
      <div class="ma-card__media">
        <button type="button" class="ma-card__img-btn" aria-label="Quick view ${p.name}">
          <img
            class="ma-card__img"
            src="${p.image}"
            alt="${p.alt}"
            loading="lazy"
          >
          <div class="ma-card__img-placeholder">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" stroke-width="1.4"/>
              <circle cx="8.5" cy="8.5" r="1.5" stroke="currentColor" stroke-width="1.4"/>
              <path d="M21 15l-5-5L5 21" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span>Image coming soon</span>
          </div>
        </button>
        <button type="button" class="ma-card__qv" aria-label="Quick view ${p.name}">Quick View</button>
      </div>
      <div class="ma-card__body">
        <p class="ma-card__cat">${p.category}</p>
        <h3 class="ma-card__name">${p.name}</h3>
        <p class="ma-card__desc">${p.description}</p>
        <p class="ma-card__price">${pkr(p.pricePkr)}</p>
        <button type="button" class="ma-card__add">Add to Cart</button>
      </div>`;

    // Image error → show placeholder
    const img = card.querySelector(".ma-card__img");
    const placeholder = card.querySelector(".ma-card__img-placeholder");
    img.addEventListener("error", () => {
      img.classList.add("is-broken");
      placeholder.classList.add("is-visible");
    });

    // Quick view triggers (image button + chip)
    card.querySelector(".ma-card__img-btn").addEventListener("click", () => openQV(p.id));
    card.querySelector(".ma-card__qv").addEventListener("click", () => openQV(p.id));

    // Add to cart
    card.querySelector(".ma-card__add").addEventListener("click", () => addToCart(p.id));

    gridEl.appendChild(card);
  });
}

// ─────────────────────────────────────────────────────────────
// 7. CART
// ─────────────────────────────────────────────────────────────
function addToCart(id) {
  const p = ACCESSORIES.find(x => x.id === id);
  if (!p) return;
  const ex = state.cart.find(x => x.id === id);
  if (ex) ex.qty += 1;
  else state.cart.push({ id: p.id, name: p.name, category: p.category, price: p.pricePkr, image: p.image, qty: 1 });
  save(CART_KEY, state.cart);
  renderCart();
  toast(`${p.name} added to your bag.`);
}

function changeQty(id, delta) {
  const idx = state.cart.findIndex(x => x.id === id);
  if (idx === -1) return;
  state.cart[idx].qty += delta;
  if (state.cart[idx].qty <= 0) state.cart.splice(idx, 1);
  save(CART_KEY, state.cart);
  renderCart();
}

function removeItem(id) {
  state.cart = state.cart.filter(x => x.id !== id);
  save(CART_KEY, state.cart);
  renderCart();
}

function totals() {
  const count    = state.cart.reduce((s,x) => s + x.qty, 0);
  const subtotal = state.cart.reduce((s,x) => s + x.price * x.qty, 0);
  const ship     = subtotal === 0 ? 0 : subtotal >= FREE_SHIP ? 0 : SHIP_FEE;
  const total    = subtotal + ship;
  const toFree   = Math.max(0, FREE_SHIP - subtotal);
  return { count, subtotal, ship, total, toFree };
}

function renderCart() {
  const { count, subtotal, ship, total, toFree } = totals();
  cartBadge.textContent = String(count);
  cartBtn.setAttribute("aria-label", `Open shopping cart (${count} items)`);

  if (subtotal === 0)        shipBanner.textContent = `Free nationwide delivery on orders above ${pkr(FREE_SHIP)}.`;
  else if (toFree > 0)       shipBanner.textContent = `Add ${pkr(toFree)} more for complimentary delivery.`;
  else                       shipBanner.textContent = "Complimentary nationwide delivery unlocked!";

  subtotalEl.textContent = pkr(subtotal);
  shipEl.textContent     = subtotal === 0 ? "Rs. 0" : ship === 0 ? "FREE" : pkr(ship);
  totalEl.textContent    = pkr(total);
  checkoutBtn.disabled   = !state.cart.length;
  clearCartBtn.disabled  = !state.cart.length;
  if (!state.cart.length) { checkoutForm.hidden = true; checkoutBtn.hidden = false; }

  cartWrap.innerHTML = "";
  if (!state.cart.length) {
    const p = document.createElement("p");
    p.className = "cart-empty";
    p.textContent = "Your bag is empty — browse our accessories to get started.";
    cartWrap.appendChild(p);
    return;
  }

  state.cart.forEach(item => {
    const row = document.createElement("div");
    row.className = "cart-item";
    row.innerHTML = `
      <img src="${item.image}" alt="${item.name}" onerror="this.style.background='var(--color-blush-cream)'">
      <div class="cart-item-info">
        <h3>${item.name}</h3>
        <p class="cart-item-meta">${item.category} &bull; ${pkr(item.price)} each</p>
        <div class="cart-item-controls">
          <div class="qty-group">
            <button type="button" class="qty-btn" aria-label="Decrease quantity">-</button>
            <span class="qty-value">${item.qty}</span>
            <button type="button" class="qty-btn" aria-label="Increase quantity">+</button>
          </div>
          <button type="button" class="remove-item-btn">Remove</button>
        </div>
      </div>`;
    const [dec, inc] = row.querySelectorAll(".qty-btn");
    dec.addEventListener("click", () => changeQty(item.id, -1));
    inc.addEventListener("click", () => changeQty(item.id,  1));
    row.querySelector(".remove-item-btn").addEventListener("click", () => removeItem(item.id));
    cartWrap.appendChild(row);
  });
}

// ─────────────────────────────────────────────────────────────
// 8. QUICK VIEW
// ─────────────────────────────────────────────────────────────
function openQV(id) {
  const p = ACCESSORIES.find(x => x.id === id);
  if (!p) return;
  qvContent.innerHTML = "";

  // Image box
  const imgBox = document.createElement("div");
  imgBox.className = "qv-image-box";
  const img = document.createElement("img");
  img.src = p.image; img.alt = p.alt;
  img.addEventListener("error", () => { img.style.display = "none"; });
  imgBox.appendChild(img);

  // Details
  const details = document.createElement("div");
  details.className = "qv-details";
  details.innerHTML = `
    <p class="hero-eyebrow" style="margin-bottom:0.5rem">${p.category}</p>
    <h2 id="qv-title">${p.name}</h2>
    <p class="card-price">${pkr(p.pricePkr)}</p>
    <p class="modal-subtitle">${p.description}</p>
    <div class="ma-qv-specs">
      <div class="ma-qv-spec-row"><span class="ma-qv-spec-label">Material</span><span class="ma-qv-spec-value">${p.material}</span></div>
      <div class="ma-qv-spec-row"><span class="ma-qv-spec-label">Category</span><span class="ma-qv-spec-value">${p.category}</span></div>
      <div class="ma-qv-spec-row"><span class="ma-qv-spec-label">Delivery</span><span class="ma-qv-spec-value">Nationwide (Pakistan)</span></div>
    </div>`;
  const addBtn = document.createElement("button");
  addBtn.type = "button";
  addBtn.className = "btn btn-primary btn-full";
  addBtn.textContent = "Add to Bag";
  addBtn.addEventListener("click", () => { addToCart(p.id); closeModal(qvModal); });
  details.appendChild(addBtn);

  qvContent.appendChild(imgBox);
  qvContent.appendChild(details);
  openModal(qvModal);
}

// ─────────────────────────────────────────────────────────────
// 9. MODALS / DRAWER HELPERS
// ─────────────────────────────────────────────────────────────
function openDrawer()  { cartDrawer.hidden = false; backdrop.hidden = false; cartBtn.setAttribute("aria-expanded","true");  closeCartBtn.focus(); }
function closeDrawer() { cartDrawer.hidden = true;  backdrop.hidden = true;  cartBtn.setAttribute("aria-expanded","false"); }

function openModal(el)  { if(!el) return; el.hidden = false; el.querySelector(".close-btn")?.focus(); }
function closeModal(el) { if(!el) return; el.hidden = true; }

function closeAll() {
  closeDrawer();
  [qvModal, contactModal, accountModal].forEach(m => closeModal(m));
  if (!shopDDMenu.hidden) { shopDDMenu.hidden = true; shopDDBtn.setAttribute("aria-expanded","false"); }
}

// ─────────────────────────────────────────────────────────────
// 10. EVENT LISTENERS
// ─────────────────────────────────────────────────────────────

/* Search */
function handleSearchUpdate() {
  clearSearchBtn.hidden = searchInput.value.length === 0;
  state.query = searchInput.value;
  renderGrid();
}
searchInput.addEventListener("input", handleSearchUpdate);
searchInput.addEventListener("search", handleSearchUpdate);
clearSearchBtn.addEventListener("click", () => {
  searchInput.value = "";
  state.query = "";
  clearSearchBtn.hidden = true;
  renderGrid();
  searchInput.focus();
});

/* Category pills */
catBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    state.category = btn.dataset.category;
    catBtns.forEach(b => {
      const active = b === btn;
      b.classList.toggle("ma-cat-btn--active", active);
      b.setAttribute("aria-pressed", active ? "true" : "false");
    });
    renderGrid();
  });
});

/* Sort */
sortSelect.addEventListener("change", () => { state.sort = sortSelect.value; renderGrid(); });

/* Reset */
resetBtn.addEventListener("click", () => {
  state.category = "All"; state.query = ""; state.sort = "featured";
  searchInput.value = ""; clearSearchBtn.hidden = true; sortSelect.value = "featured";
  catBtns.forEach(b => {
    const isAll = b.dataset.category === "All";
    b.classList.toggle("ma-cat-btn--active", isAll);
    b.setAttribute("aria-pressed", isAll ? "true" : "false");
  });
  renderGrid();
});

/* Cart drawer */
cartBtn.addEventListener("click", openDrawer);
closeCartBtn.addEventListener("click", closeDrawer);
backdrop.addEventListener("click", closeDrawer);
clearCartBtn.addEventListener("click", () => {
  state.cart = []; save(CART_KEY, []); renderCart();
  checkoutForm.hidden = true; checkoutBtn.hidden = false;
  toast("Your COVEN bag has been cleared.");
});
checkoutBtn.addEventListener("click", () => {
  if (!state.cart.length) return;
  checkoutForm.hidden = false; checkoutBtn.hidden = true;
  if (state.member.name) document.getElementById("checkout-name").value = state.member.name;
  document.getElementById("checkout-name").focus();
});
cancelChkBtn.addEventListener("click", () => { checkoutForm.hidden = true; checkoutBtn.hidden = false; chkErrorEl.textContent = ""; });

checkoutForm.addEventListener("submit", e => {
  e.preventDefault();
  const name  = document.getElementById("checkout-name").value.trim();
  const phone = document.getElementById("checkout-phone").value.trim();
  const city  = document.getElementById("checkout-city").value.trim();
  if (name.length < 2)                              { chkErrorEl.textContent = "Please enter your full name."; return; }
  if (!/^\d{10,13}$/.test(phone.replace(/\D/g,""))) { chkErrorEl.textContent = "Please enter a valid Pakistan phone number."; return; }
  if (city.length < 5)                              { chkErrorEl.textContent = "Please enter your city and address."; return; }
  chkErrorEl.textContent = "";
  const ref = "CVN-ACC-" + Math.floor(1000 + Math.random() * 9000);
  const { total } = totals();
  state.cart = []; save(CART_KEY, []);
  checkoutForm.reset(); checkoutForm.hidden = true; checkoutBtn.hidden = false;
  renderCart(); closeDrawer();
  toast(`Order ${ref} confirmed for ${name} (${pkr(total)}).`);
});

/* Quick view modal */
closeQvBtn.addEventListener("click", () => closeModal(qvModal));
qvModal.addEventListener("click", e => { if (e.target === qvModal) closeModal(qvModal); });

/* Shop dropdown */
shopDDBtn.addEventListener("click", e => {
  e.stopPropagation();
  const open = !shopDDMenu.hidden;
  shopDDMenu.hidden = open;
  shopDDBtn.setAttribute("aria-expanded", open ? "false" : "true");
});
document.querySelectorAll("[data-coming-soon]").forEach(btn => {
  btn.addEventListener("click", () => { shopDDMenu.hidden = true; shopDDBtn.setAttribute("aria-expanded","false"); toast(`${btn.dataset.comingSoon} is coming soon.`); });
});
document.addEventListener("click", e => {
  if (!shopDDMenu.hidden && !e.target.closest(".nav-item-dropdown")) {
    shopDDMenu.hidden = true; shopDDBtn.setAttribute("aria-expanded","false");
  }
});

/* Mobile menu */
mobMenuBtn.addEventListener("click", () => {
  const open = primaryNav.classList.toggle("primary-nav--open");
  mobMenuBtn.setAttribute("aria-expanded", open ? "true" : "false");
});

/* Header search → scroll to search box */
hdrSearchBtn.addEventListener("click", () => {
  searchInput.scrollIntoView({ behavior: "smooth", block: "center" });
  setTimeout(() => searchInput.focus(), 280);
});

/* Contact modal */
navContactBtn.addEventListener("click", () => { primaryNav.classList.remove("primary-nav--open"); mobMenuBtn.setAttribute("aria-expanded","false"); openModal(contactModal); });
ftrContactBtn.addEventListener("click", () => openModal(contactModal));
contactModal.addEventListener("click", e => { if (e.target === contactModal) closeModal(contactModal); });

contactForm.addEventListener("submit", e => {
  e.preventDefault();
  const name    = document.getElementById("contact-name").value.trim();
  const email   = document.getElementById("contact-email").value.trim();
  const message = document.getElementById("contact-message").value.trim();
  if (name.length < 2)             { contactErrorEl.textContent = "Please enter your name."; return; }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { contactErrorEl.textContent = "Please enter a valid email."; return; }
  if (message.length < 5)          { contactErrorEl.textContent = "Please enter a message."; return; }
  contactErrorEl.textContent = "";
  contactForm.reset(); closeModal(contactModal);
  toast(`Thanks ${name}! Your message has been received.`);
});

/* Account modal */
hdrAccountBtn.addEventListener("click", () => {
  document.getElementById("member-name").value = state.member.name || "";
  accountErrorEl.textContent = ""; openModal(accountModal);
});
accountModal.addEventListener("click", e => { if (e.target === accountModal) closeModal(accountModal); });
accountForm.addEventListener("submit", e => {
  e.preventDefault();
  const name = document.getElementById("member-name").value.trim();
  if (name.length < 2) { accountErrorEl.textContent = "Please enter your name."; return; }
  state.member = { name }; save(MEMBER_KEY, state.member);
  closeModal(accountModal); toast(`Profile saved for ${name}.`);
});

/* Close modal X buttons via data-close-modal */
document.querySelectorAll("[data-close-modal]").forEach(btn => {
  btn.addEventListener("click", () => closeModal(document.getElementById(btn.dataset.closeModal)));
});

/* Nav about link */
document.getElementById("nav-about-link").addEventListener("click", () => {
  primaryNav.classList.remove("primary-nav--open"); mobMenuBtn.setAttribute("aria-expanded","false");
});

/* Footer social */
document.querySelectorAll("[data-social]").forEach(btn => {
  btn.addEventListener("click", () => toast(`Follow @coven.streetwear on ${btn.dataset.social}.`));
});

/* Escape key */
document.addEventListener("keydown", e => { if (e.key === "Escape") closeAll(); });

// ─────────────────────────────────────────────────────────────
// 11. INIT
// ─────────────────────────────────────────────────────────────
renderGrid();
renderCart();
