/* ==========================================================================
   Coven Streetwear — Shared Product Catalogue  (js/products.js)
   Owner: Haid (26-3163) — do not duplicate or override this data elsewhere.

   Functions exported as plain globals (no ES modules):
   -------------------------------------------------------
   getProductById(id)          → product object or undefined
   getProductsByCategory(cat)  → array of products in that category
   getFeaturedProducts()       → array of products where featured === true
   formatPrice(amount)         → string e.g. "PKR 6,500"
   getImageSrc(product)        → correct image path for the current page
   getProductUrl(id)           → correct link to productpage.html?id=<id>

   Category names (exact, used as filter keys):
     men | women | accessoriesmen | accessorieswomen | sneakers
   ========================================================================== */

/* ------------------------------------------------------------------
   Helper: detect whether the current page is inside pages/
   (pages/ need "../" in front of root-relative paths; index.html doesn't)
   ------------------------------------------------------------------ */
function _covenInPagesDir() {
  return window.location.pathname.indexOf("/pages/") !== -1;
}

/* ------------------------------------------------------------------
   PRODUCTS — global catalogue (18 items)
   image paths are root-relative; use getImageSrc() to get the
   correct path for the current page.
   ------------------------------------------------------------------ */
var PRODUCTS = [
  /* ---- Men (4) ---- */
  {
    id:          "men-shadow-hoodie",
    name:        "Shadow Hoodie",
    price:       7500,
    category:    "men",
    image:       "images/placeholder.svg",
    imageAlt:    "Heavyweight dark-wine boxy hoodie for men",
    sizes:       ["S", "M", "L", "XL"],
    description: "A structured boxy-fit hoodie in heavyweight cotton with a dropped shoulder and wine-toned finish.",
    featured:    true
  },
  {
    id:          "men-dusk-tee",
    name:        "Dusk Graphic Tee",
    price:       3200,
    category:    "men",
    image:       "images/placeholder.svg",
    imageAlt:    "Oversized graphic tee in sun-washed cream for men",
    sizes:       ["S", "M", "L", "XL"],
    description: "An oversized sun-washed crew-neck tee screen-printed with Coven's signature dusk motif.",
    featured:    false
  },
  {
    id:          "men-cargo-trousers",
    name:        "Cargo Trousers",
    price:       6800,
    category:    "men",
    image:       "images/placeholder.svg",
    imageAlt:    "Wide-fit utility cargo trousers for men",
    sizes:       ["S", "M", "L", "XL"],
    description: "Wide-fit utility trousers with two side cargo pockets and an elasticated back waist.",
    featured:    false
  },
  {
    id:          "men-heavy-overshirt",
    name:        "Heavy Overshirt",
    price:       8500,
    category:    "men",
    image:       "images/placeholder.svg",
    imageAlt:    "Heavyweight flannel overshirt for men in dark wine",
    sizes:       ["S", "M", "L", "XL"],
    description: "A boxy-cut heavyweight flannel overshirt designed to be worn open or buttoned as a light jacket.",
    featured:    true
  },

  /* ---- Women (4) ---- */
  {
    id:          "women-boxy-hoodie",
    name:        "Boxy Hoodie",
    price:       7200,
    category:    "women",
    image:       "images/placeholder.svg",
    imageAlt:    "Structured boxy-fit hoodie for women in blush",
    sizes:       ["S", "M", "L", "XL"],
    description: "A cropped boxy hoodie in a blush-cream colourway with a kangaroo pocket and ribbed cuffs.",
    featured:    true
  },
  {
    id:          "women-coven-tee",
    name:        "Coven Logo Tee",
    price:       2900,
    category:    "women",
    image:       "images/placeholder.svg",
    imageAlt:    "Women's relaxed-fit Coven logo tee in ivory",
    sizes:       ["S", "M", "L", "XL"],
    description: "A relaxed-fit ivory tee with a tonal Coven wordmark printed across the chest.",
    featured:    false
  },
  {
    id:          "women-wide-leg-trousers",
    name:        "Wide-Leg Trousers",
    price:       6500,
    category:    "women",
    image:       "images/placeholder.svg",
    imageAlt:    "High-rise wide-leg trousers for women",
    sizes:       ["S", "M", "L", "XL"],
    description: "High-rise wide-leg trousers in a soft blush twill with side seam pockets.",
    featured:    false
  },
  {
    id:          "women-utility-jacket",
    name:        "Utility Jacket",
    price:       11500,
    category:    "women",
    image:       "images/placeholder.svg",
    imageAlt:    "Oversized women's utility jacket in dark wine",
    sizes:       ["S", "M", "L", "XL"],
    description: "An oversized utility jacket with four front pockets and a structured collar in dark wine.",
    featured:    false
  },

  /* ---- Accessories — Men (3) ---- */
  {
    id:          "accessoriesmen-6panel-cap",
    name:        "Six-Panel Cap",
    price:       2200,
    category:    "accessoriesmen",
    image:       "images/placeholder.svg",
    imageAlt:    "Unstructured six-panel cap with Coven embroidery",
    sizes:       ["One size"],
    description: "An unstructured six-panel cap in washed canvas with a tonal Coven embroidered logo.",
    featured:    false
  },
  {
    id:          "accessoriesmen-ribbed-beanie",
    name:        "Ribbed Beanie",
    price:       1800,
    category:    "accessoriesmen",
    image:       "images/placeholder.svg",
    imageAlt:    "Heavyweight ribbed beanie in dark wine",
    sizes:       ["One size"],
    description: "A heavyweight ribbed-knit beanie in dark wine with a double-folded cuff.",
    featured:    false
  },
  {
    id:          "accessoriesmen-belt-bag",
    name:        "Canvas Belt Bag",
    price:       3500,
    category:    "accessoriesmen",
    image:       "images/placeholder.svg",
    imageAlt:    "Canvas belt bag with zip compartments for men",
    sizes:       ["One size"],
    description: "A compact canvas belt bag with two zip compartments and an adjustable webbing strap.",
    featured:    true
  },

  /* ---- Accessories — Women (3) ---- */
  {
    id:          "accessorieswomen-tote-bag",
    name:        "Heavyweight Tote",
    price:       3000,
    category:    "accessorieswomen",
    image:       "images/placeholder.svg",
    imageAlt:    "Heavyweight canvas tote bag for women",
    sizes:       ["One size"],
    description: "A heavyweight natural canvas tote with a Coven screen-print and reinforced handles.",
    featured:    false
  },
  {
    id:          "accessorieswomen-bucket-hat",
    name:        "Washed Bucket Hat",
    price:       2400,
    category:    "accessorieswomen",
    image:       "images/placeholder.svg",
    imageAlt:    "Washed cotton bucket hat for women in blush",
    sizes:       ["One size"],
    description: "A washed cotton bucket hat in blush-cream with a medium brim and contrast stitching.",
    featured:    false
  },
  {
    id:          "accessorieswomen-woven-scarf",
    name:        "Oversized Woven Scarf",
    price:       2800,
    category:    "accessorieswomen",
    image:       "images/placeholder.svg",
    imageAlt:    "Oversized woven scarf in cream and wine",
    sizes:       ["One size"],
    description: "A wide woven scarf with a cream and wine stripe pattern and fringed ends.",
    featured:    true
  },

  /* ---- Sneakers (4) ---- */
  {
    id:          "sneakers-low-runner",
    name:        "Low Runner",
    price:       12500,
    category:    "sneakers",
    image:       "images/placeholder.svg",
    imageAlt:    "Low-top runner sneaker in white and cream",
    sizes:       [40, 41, 42, 43, 44],
    description: "A low-profile runner silhouette in full-grain leather with a tonal cream rubber sole.",
    featured:    false
  },
  {
    id:          "sneakers-high-court",
    name:        "High Court",
    price:       14500,
    category:    "sneakers",
    image:       "images/placeholder.svg",
    imageAlt:    "High-top court sneaker in dark wine canvas",
    sizes:       [40, 41, 42, 43, 44],
    description: "A high-top court sneaker in dark wine canvas with a vulcanised sole and silver eyelets.",
    featured:    true
  },
  {
    id:          "sneakers-chunky-sole",
    name:        "Chunky Sole Trainer",
    price:       16000,
    category:    "sneakers",
    image:       "images/placeholder.svg",
    imageAlt:    "Chunky sole trainer in cream with layered midsole",
    sizes:       [40, 41, 42, 43, 44],
    description: "A chunky-sole trainer with a layered foam midsole, suede panels and an ivory upper.",
    featured:    false
  },
  {
    id:          "sneakers-slip-on",
    name:        "Slip-On Canvas",
    price:       9500,
    category:    "sneakers",
    image:       "images/placeholder.svg",
    imageAlt:    "Slip-on canvas sneaker in blush",
    sizes:       [40, 41, 42, 43, 44],
    description: "A clean slip-on canvas sneaker in blush with a flat rubber sole and elasticated gusset.",
    featured:    false
  }
];

/* ------------------------------------------------------------------
   getProductById(id)
   Returns the product object whose id matches, or undefined.
   ------------------------------------------------------------------ */
function getProductById(id) {
  for (var i = 0; i < PRODUCTS.length; i++) {
    if (PRODUCTS[i].id === id) return PRODUCTS[i];
  }
  return undefined;
}

/* ------------------------------------------------------------------
   getProductsByCategory(category)
   Returns an array of products in the given category.
   Valid categories: men | women | accessoriesmen | accessorieswomen | sneakers
   ------------------------------------------------------------------ */
function getProductsByCategory(category) {
  return PRODUCTS.filter(function (p) { return p.category === category; });
}

/* ------------------------------------------------------------------
   getFeaturedProducts()
   Returns all products where featured === true (about 6).
   ------------------------------------------------------------------ */
function getFeaturedProducts() {
  return PRODUCTS.filter(function (p) { return p.featured === true; });
}

/* ------------------------------------------------------------------
   formatPrice(amount)
   Formats a number as a PKR price string, e.g. "PKR 6,500".
   ------------------------------------------------------------------ */
function formatPrice(amount) {
  return "PKR " + Number(amount).toLocaleString("en-PK");
}

/* ------------------------------------------------------------------
   getImageSrc(product)
   Returns the correct image path for the page it is called from.
   Pages inside pages/ need "../" prepended to root-relative paths.
   ------------------------------------------------------------------ */
function getImageSrc(product) {
  return (_covenInPagesDir() ? "../" : "") + product.image;
}

/* ------------------------------------------------------------------
   getProductUrl(id)
   Returns the correct link to pages/productpage.html?id=<id>
   for the page it is called from.
   ------------------------------------------------------------------ */
function getProductUrl(id) {
  return (_covenInPagesDir() ? "" : "pages/") + "productpage.html?id=" + id;
}
