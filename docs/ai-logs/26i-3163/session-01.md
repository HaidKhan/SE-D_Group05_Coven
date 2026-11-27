# Session Log 01: Initial Products, Cart Store, and Cart Page Setup

**Student:** Haid (Roll Number: 26-3163)  
**Project:** Coven Streetwear  
**Date:** 2026-11-27  
**Scope:** Shared product catalogue (`js/products.js`), cart state engine (`js/cart-store.js`), header badge synchronization fix (`js/main.js`), placeholder image (`images/placeholder.svg`), and the Cart page implementation (`pages/cart.html`, `css/cart.css`, `js/cart.js`).

---

## 1. Initial Prompt & Requirements

The user requested the creation of the shared data files and state store for the entire team:
- Plain HTML, CSS, and vanilla JS hosted on GitHub Pages (no server, database, framework, npm, or build tools).
- Strict non-colliding global architecture with clear comments explaining each function's inputs and outputs.
- Conflict check (Step 0) against existing codebase (`pages/about.html`, `js/main.js`, `css/style.css`).
- Deliverables:
  - `js/products.js`: Global `PRODUCTS` array (~18 items across 5 categories: `men`, `women`, `accessoriesmen`, `accessorieswomen`, `sneakers`). Helpers: `getProductById`, `getProductsByCategory`, `getFeaturedProducts`, `formatPrice`, `getImageSrc`, and `getProductUrl`.
  - `js/cart-store.js`: LocalStorage keys `covenCart`, `covenLastOrder`, `covenDiscount`. Max quantity 10, flat shipping PKR 250, discount code `COVEN10` (10% off). Cart functions: `getCart`, `addToCart`, `updateQuantity`, `removeFromCart`, `clearCart`, `getCartCount`, `getCartDetails`, `setDiscountCode`, `getDiscountCode`, `clearDiscountCode`, `getCartTotals`, `placeOrder`, and `getLastOrder`. Dispatches `cartchange` custom event on `window`.
  - `images/placeholder.svg`: Neutral placeholder SVG using the brand's palette.
  - Cart badge handling in the header.

---

## 2. Exploration & Conflict Analysis (Step 0)

1. Initial repository check showed repository without `pages/about.html`, `js/main.js`, and `css/style.css`.
2. After the user merged `main` into their branch, the files became available and were inspected:
   - Found collision in `js/main.js`: `main.js` had `syncCartBadge()` reading from `localStorage.getItem("coven_cart")` (snake_case) instead of `covenCart` (camelCase).
   - `main.js` did not listen for reactive custom cart change events.
3. The user (as team leader) approved fixing `main.js` to standardize on `covenCart` and listen to the `cartchange` window event.

---

## 3. Implementation of Shared Files

### `js/main.js` (Updated)
- Synchronized localStorage key to `"covenCart"`.
- Registered `window.addEventListener("cartchange", syncCartBadge);` inside `DOMContentLoaded` so all pages automatically update the badge whenever `cart-store.js` triggers a mutation.

### `images/placeholder.svg` (Created)
- SVG placeholder utilizing the site's blush-cream / dark-wine styling.

### `js/products.js` (Created)
- Defines global `PRODUCTS` array with 18 products:
  - 4 Men (`men-shadow-hoodie`, `men-dusk-tee`, `men-cargo-trousers`, `men-heavy-overshirt`)
  - 4 Women (`women-boxy-hoodie`, `women-coven-tee`, `women-wide-leg-trousers`, `women-utility-jacket`)
  - 3 Accessories Men (`accessoriesmen-6panel-cap`, `accessoriesmen-ribbed-beanie`, `accessoriesmen-belt-bag`)
  - 3 Accessories Women (`accessorieswomen-tote-bag`, `accessorieswomen-bucket-hat`, `accessorieswomen-woven-scarf`)
  - 4 Sneakers (`sneakers-low-runner`, `sneakers-high-court`, `sneakers-chunky-sole`, `sneakers-slip-on`)
- 6 featured products flagged.
- Path helpers `getImageSrc(product)` and `getProductUrl(id)` handle directory depth differences (`/pages/` vs root `index.html`).
- Format helper `formatPrice(amount)` returns formatted PKR string (e.g., `PKR 6,500`).

### `js/cart-store.js` (Created)
- LocalStorage integration with try/catch wrapping.
- Enforces quantity bounds (1 to 10).
- Automatic cart cleanup for nonexistent/orphaned products.
- Line items merge with live product info from `PRODUCTS`.
- Dispatches `window.dispatchEvent(new Event("cartchange"))` on all state mutations.

---

## 4. Implementation of Cart Page

The user requested building their assigned Cart page:
- Visual list of items in cart with product thumbnail, title, size, unit price, quantity increment/decrement/remove, and line totals.
- Order summary sidebar showing Subtotal, Delivery fee, applied Discount, and Total.
- Discount code input supporting `COVEN10`.
- Checkout button that highlights green (`--active`) when valid items exist and links to `checkout.html`, or remains disabled (`--disabled`) when empty.

### Files Created:
1. `pages/cart.html`:
   - Exact header and footer cloned from `pages/about.html`.
   - Structural container `cart-main`, `cart-wrapper`, `cart-items-section`, and `cart-summary-panel`.
   - Script load sequence: `products.js` -> `cart-store.js` -> `main.js` -> `cart.js`.
2. `css/cart.css`:
   - Scoped strictly with `cart-` prefix.
   - Leverages design tokens from `css/style.css` (`--color-dark-wine`, `--color-cherry`, `--color-blush-cream`, etc.).
   - Full responsive styles for desktop and mobile.
3. `js/cart.js`:
   - Listens to `cartchange` for automatic re-renders.
   - Event delegation on `cartItemsList` for handling quantity adjustments and removals.
   - Dispatches discount code validations and shows user feedback.

---

## 5. Cleanup & Verification

- Checked products count (4 men, 4 women, 3 acc-men, 3 acc-women, 4 sneakers = 18 total).
- Reverted temporary test adjustments on `images/placeholder.svg`.
- Removed temporary sample seed function from `js/cart.js` so cart starts in its natural clean state.
- Verified that all scripts run cleanly with zero errors in standard browser environments.
