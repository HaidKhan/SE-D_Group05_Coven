/* ==========================================================================
   Coven Streetwear — Men's & Women's Collection Logic (js/collections.js)
   Depends on: js/products.js, js/cart-store.js, js/main.js
   ========================================================================== */

(function () {
  var EDIT_LABELS = {
    hoodies:   "Hoodie Haven",
    tees:      "Graphic Society",
    outerwear: "Outerwear Edit",
    utility:   "The Utility Edit"
  };

  var EDIT_MAP = {
    "men-shadow-hoodie":       { key: "hoodies",   label: "Hoodie Haven" },
    "men-dusk-tee":            { key: "tees",      label: "Graphic Society" },
    "men-heavy-overshirt":     { key: "outerwear", label: "Outerwear Edit" },
    "men-cargo-trousers":      { key: "utility",   label: "The Utility Edit" },
    "women-boxy-hoodie":       { key: "hoodies",   label: "Hoodie Haven" },
    "women-coven-tee":         { key: "tees",      label: "Graphic Society" },
    "women-utility-jacket":    { key: "outerwear", label: "Outerwear Edit" },
    "women-wide-leg-trousers": { key: "utility",   label: "The Utility Edit" }
  };

  var CUSTOM_IMAGES = {
    "men-shadow-hoodie":       "../images/men-shadow-hoodie.svg",
    "men-dusk-tee":            "../images/men-dusk-tee.svg",
    "men-cargo-trousers":      "../images/men-cargo-trousers.svg",
    "men-heavy-overshirt":     "../images/men-heavy-overshirt.svg",
    "women-boxy-hoodie":       "../images/women-boxy-hoodie.svg",
    "women-coven-tee":         "../images/women-coven-tee.svg",
    "women-wide-leg-trousers": "../images/women-wide-leg-trousers.svg",
    "women-utility-jacket":    "../images/women-utility-jacket.svg"
  };

  /* Additional collection pieces using the same categories and existing + matching SVGs */
  var EXTRA_COLLECTION_ITEMS = {
    men: [
      {
        id:          "men-cherry-hoodie",
        detailId:    "men-shadow-hoodie",
        name:        "Cherry Fleece Hoodie",
        price:       7800,
        editKey:     "hoodies",
        image:       "../images/men-cherry-hoodie.svg",
        imageAlt:    "Heavyweight cherry fleece pullover hoodie for men",
        description: "Garment-dyed cherry brushed fleece pullover with dropped shoulders and kangaroo pocket.",
        featured:    false
      },
      {
        id:          "men-archive-tee",
        detailId:    "men-dusk-tee",
        name:        "Archive Graphic Tee",
        price:       3500,
        editKey:     "tees",
        image:       "../images/men-archive-tee.svg",
        imageAlt:    "Dark wine Archive No. 04 graphic tee for men",
        description: "Relaxed dark-wine jersey tee featuring the Archive No. 04 geometric chest print.",
        featured:    false
      },
      {
        id:          "men-varsity-bomber",
        detailId:    "men-heavy-overshirt",
        name:        "Varsity Bomber",
        price:       13500,
        editKey:     "outerwear",
        image:       "../images/men-varsity-bomber.svg",
        imageAlt:    "Cherry and ivory varsity bomber jacket for men",
        description: "Heavyweight cherry wool-blend body paired with ivory sleeves and striped rib trim.",
        featured:    true
      },
      {
        id:          "men-utility-vest",
        detailId:    "men-cargo-trousers",
        name:        "Utility Field Vest",
        price:       7200,
        editKey:     "utility",
        image:       "../images/men-utility-vest.svg",
        imageAlt:    "Dark wine multi-pocket utility field vest for men",
        description: "Structured layering field vest with four bellows utility pockets and matte snap flaps.",
        featured:    false
      },
      {
        id:          "men-studio-zip-hoodie",
        detailId:    "men-shadow-hoodie",
        name:        "Studio Zip Hoodie",
        price:       8200,
        editKey:     "hoodies",
        image:       "../images/men-studio-zip-hoodie.svg",
        imageAlt:    "Ivory full-zip boxy hoodie for men",
        description: "Sun-washed ivory full-zip fleece hoodie with contrast cherry zipper and split pockets.",
        featured:    false
      },
      {
        id:          "men-rose-tee",
        detailId:    "men-dusk-tee",
        name:        "Rose Emblem Tee",
        price:       3400,
        editKey:     "tees",
        image:       "../images/men-rose-tee.svg",
        imageAlt:    "Rose red Graphic Society emblem tee for men",
        description: "Tonal rose-red crew-neck tee printed with the Coven Graphic Society crest.",
        featured:    false
      },
      {
        id:          "men-workwear-jacket",
        detailId:    "men-heavy-overshirt",
        name:        "Workwear Jacket",
        price:       11800,
        editKey:     "outerwear",
        image:       "../images/men-workwear-jacket.svg",
        imageAlt:    "Dark wine cropped canvas workwear jacket for men",
        description: "Cropped heavyweight canvas work jacket with contrast cherry collar and twin chest pockets.",
        featured:    false
      },
      {
        id:          "men-carpenter-pants",
        detailId:    "men-cargo-trousers",
        name:        "Carpenter Twill Pants",
        price:       7000,
        editKey:     "utility",
        image:       "../images/men-carpenter-pants.svg",
        imageAlt:    "Cherry double-knee carpenter twill trousers for men",
        description: "Straight-wide cotton twill carpenter trousers with reinforced double-knee panels.",
        featured:    false
      }
    ],
    women: [
      {
        id:          "women-wine-pullover",
        detailId:    "women-boxy-hoodie",
        name:        "Wine Cropped Hoodie",
        price:       7400,
        editKey:     "hoodies",
        image:       "../images/women-wine-pullover.svg",
        imageAlt:    "Cropped cherry fleece pullover hoodie for women",
        description: "Cropped heavyweight fleece hoodie in rich cherry with dropped shoulders and ribbed hem.",
        featured:    false
      },
      {
        id:          "women-studio-baby-tee",
        detailId:    "women-coven-tee",
        name:        "Studio Crest Tee",
        price:       3100,
        editKey:     "tees",
        image:       "../images/women-studio-baby-tee.svg",
        imageAlt:    "Dark wine Studio No. 01 crest tee for women",
        description: "Fitted dark-wine combed cotton tee finished with the Coven Studio No. 01 emblem.",
        featured:    false
      },
      {
        id:          "women-cropped-trench",
        detailId:    "women-utility-jacket",
        name:        "Cropped Studio Trench",
        price:       12800,
        editKey:     "outerwear",
        image:       "../images/women-cropped-trench.svg",
        imageAlt:    "Ivory double-breasted cropped trench jacket for women",
        description: "Double-breasted cropped cotton twill trench with notched lapels and belted waist.",
        featured:    true
      },
      {
        id:          "women-cargo-skirt",
        detailId:    "women-wide-leg-trousers",
        name:        "Utility Cargo Skirt",
        price:       6200,
        editKey:     "utility",
        image:       "../images/women-cargo-skirt.svg",
        imageAlt:    "Dark wine utility cargo midi skirt for women",
        description: "Structured A-line midi skirt in dark wine twill with dual side cargo flap pockets.",
        featured:    false
      },
      {
        id:          "women-rose-zip-hoodie",
        detailId:    "women-boxy-hoodie",
        name:        "Rose Zip Hoodie",
        price:       7800,
        editKey:     "hoodies",
        image:       "../images/women-rose-zip-hoodie.svg",
        imageAlt:    "Rose red cropped zip hoodie for women",
        description: "Boxy cropped zip-through hoodie in rose red with ivory zipper contrast.",
        featured:    false
      },
      {
        id:          "women-blush-oversized-tee",
        detailId:    "women-coven-tee",
        name:        "Blush Atelier Tee",
        price:       3300,
        editKey:     "tees",
        image:       "../images/women-blush-oversized-tee.svg",
        imageAlt:    "Rose blush Atelier graphic tee for women",
        description: "Relaxed-fit jersey tee with an editorial Coven Atelier back-and-chest graphic.",
        featured:    false
      },
      {
        id:          "women-cherry-bomber",
        detailId:    "women-utility-jacket",
        name:        "Cherry Cropped Bomber",
        price:       11900,
        editKey:     "outerwear",
        image:       "../images/women-cherry-bomber.svg",
        imageAlt:    "Cherry and rose cropped bomber jacket for women",
        description: "Cropped varsity-inspired bomber with tonal rose sleeves and ribbed collar.",
        featured:    false
      },
      {
        id:          "women-parachute-pants",
        detailId:    "women-wide-leg-trousers",
        name:        "Parachute Utility Pants",
        price:       6900,
        editKey:     "utility",
        image:       "../images/women-parachute-pants.svg",
        imageAlt:    "Cherry relaxed drawstring parachute trousers for women",
        description: "Volume-cut cherry nylon-cotton parachute pants with knee pleats and waist drawcord.",
        featured:    false
      }
    ]
  };

  function getEditInfo(product) {
    if (product.editKey && EDIT_LABELS[product.editKey]) {
      return { key: product.editKey, label: EDIT_LABELS[product.editKey] };
    }
    return EDIT_MAP[product.id] || { key: "all", label: "Coven Edit" };
  }

  function resolveProductImage(product) {
    if (CUSTOM_IMAGES[product.id]) return CUSTOM_IMAGES[product.id];
    if (product.image && product.image.indexOf("../") === 0) return product.image;
    return getImageSrc(product);
  }

  document.addEventListener("DOMContentLoaded", function () {
    var mainEl = document.querySelector("[data-collection-category]");
    if (!mainEl || typeof getProductsByCategory !== "function") return;

    var categoryKey = mainEl.getAttribute("data-collection-category");
    var baseProducts = getProductsByCategory(categoryKey);
    var extraProducts = EXTRA_COLLECTION_ITEMS[categoryKey] || [];
    var allProducts = baseProducts.concat(extraProducts);

    var gridEl = document.getElementById("collectionGrid");
    var countEl = document.getElementById("collectionCount");
    var pills = document.querySelectorAll(".category-pill");
    var viewEditBtn = document.getElementById("viewEditBtn");

    var activeEdit = "all";

    function renderGrid() {
      if (!gridEl) return;

      if (allProducts.length === 0) {
        gridEl.innerHTML = '<div class="empty-state"><p>No pieces are available in this collection right now.</p></div>';
        return;
      }

      gridEl.innerHTML = allProducts.map(function (product) {
        var editInfo = getEditInfo(product);
        var featuredBadge = product.featured
          ? '<span class="product-featured-badge">Featured</span>'
          : "";
        var detailTarget = product.detailId || product.id;

        return (
          '<article class="product-card" data-edit="' + editInfo.key + '">' +
            '<a href="' + getProductUrl(detailTarget) + '" class="product-card-link" aria-label="' + product.name + ' — ' + formatPrice(product.price) + '">' +
              '<div class="product-image-wrap">' +
                '<img src="' + resolveProductImage(product) + '" alt="' + product.imageAlt + '" class="product-card-img" loading="lazy">' +
                '<span class="product-edit-badge">' + editInfo.label + '</span>' +
                featuredBadge +
              '</div>' +
              '<div class="product-card-body">' +
                '<h2 class="product-card-name">' + product.name + '</h2>' +
                '<p class="product-card-desc">' + product.description + '</p>' +
                '<div class="product-card-footer">' +
                  '<span class="product-card-price">' + formatPrice(product.price) + '</span>' +
                  '<span class="product-card-cta">View Piece &rarr;</span>' +
                '</div>' +
              '</div>' +
            '</a>' +
          '</article>'
        );
      }).join("");
    }

    function applyFilter() {
      pills.forEach(function (pill) {
        var pillEdit = pill.getAttribute("data-edit");
        var isActive = pillEdit === activeEdit;
        pill.classList.toggle("is-active", isActive);
        pill.setAttribute("aria-pressed", String(isActive));
      });

      if (!gridEl) return;

      var cards = gridEl.querySelectorAll(".product-card");
      var activeCount = 0;

      cards.forEach(function (card) {
        var cardEdit = card.getAttribute("data-edit");
        var link = card.querySelector(".product-card-link");
        var isAll = activeEdit === "all";
        var matches = isAll || cardEdit === activeEdit;

        if (matches) {
          activeCount += 1;
          card.classList.remove("is-filter-dimmed");
          card.classList.toggle("is-filter-active", !isAll);
          if (link) {
            link.removeAttribute("aria-disabled");
            link.removeAttribute("tabindex");
          }
        } else {
          card.classList.remove("is-filter-active");
          card.classList.add("is-filter-dimmed");
          if (link) {
            link.setAttribute("aria-disabled", "true");
            link.setAttribute("tabindex", "-1");
          }
        }
      });

      if (countEl) {
        if (activeEdit === "all") {
          countEl.textContent = allProducts.length + (allProducts.length === 1 ? " piece" : " pieces");
        } else {
          var editTitle = EDIT_LABELS[activeEdit] || "Selected Category";
          countEl.textContent = activeCount + " of " + allProducts.length + " pieces active (" + editTitle + ")";
        }
      }
    }

    pills.forEach(function (pill) {
      pill.addEventListener("click", function (event) {
        event.preventDefault();
        var selected = pill.getAttribute("data-edit") || "all";
        activeEdit = selected;
        applyFilter();
      });
    });

    if (gridEl) {
      gridEl.addEventListener("click", function (event) {
        var dimmedCard = event.target.closest(".product-card.is-filter-dimmed");
        if (dimmedCard) {
          event.preventDefault();
        }
      });
    }

    if (viewEditBtn) {
      viewEditBtn.addEventListener("click", function () {
        activeEdit = "all";
        applyFilter();
        var target = document.getElementById("collectionEdit");
        if (target) {
          target.scrollIntoView({ behavior: "smooth" });
        }
      });
    }

    renderGrid();
    applyFilter();
  });
})();
