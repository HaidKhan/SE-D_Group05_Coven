/* ==========================================================================
   Coven Streetwear — Product Details & 4-State Add-to-Cart (js/productpage.js)
   Depends on: js/products.js, js/cart-store.js, js/main.js
   ========================================================================== */

(function () {
  var PRODUCT_ASSETS = {
    "men-shadow-hoodie": {
      front: "../images/men-shadow-hoodie.svg",
      back:  "../images/men-shadow-hoodie-back.svg",
      group: "HOODIES",
      fabric: "100% Heavyweight Combed Cotton Fleece (420 GSM)"
    },
    "men-dusk-tee": {
      front: "../images/men-dusk-tee.svg",
      back:  "../images/men-dusk-tee-back.svg",
      group: "GRAPHIC TEES",
      fabric: "100% Sun-Washed Ring-Spun Jersey (260 GSM)"
    },
    "men-cargo-trousers": {
      front: "../images/men-cargo-trousers.svg",
      back:  "../images/men-cargo-trousers-back.svg",
      group: "TROUSERS",
      fabric: "100% Heavyweight Brushed Cotton Twill (340 GSM)"
    },
    "men-heavy-overshirt": {
      front: "../images/men-heavy-overshirt.svg",
      back:  "../images/men-heavy-overshirt-back.svg",
      group: "OUTERWEAR",
      fabric: "Brushed Wool-Cotton Blend Flannel (380 GSM)"
    },
    "women-boxy-hoodie": {
      front: "../images/women-boxy-hoodie.svg",
      back:  "../images/women-boxy-hoodie-back.svg",
      group: "HOODIES",
      fabric: "100% Loopback Organic Cotton Fleece (400 GSM)"
    },
    "women-coven-tee": {
      front: "../images/women-coven-tee.svg",
      back:  "../images/women-coven-tee-back.svg",
      group: "GRAPHIC TEES",
      fabric: "100% Combed Soft-Touch Jersey (240 GSM)"
    },
    "women-wide-leg-trousers": {
      front: "../images/women-wide-leg-trousers.svg",
      back:  "../images/women-wide-leg-trousers-back.svg",
      group: "TROUSERS",
      fabric: "Soft-Drape Blush Cotton Twill (310 GSM)"
    },
    "women-utility-jacket": {
      front: "../images/women-utility-jacket.svg",
      back:  "../images/women-utility-jacket-back.svg",
      group: "OUTERWEAR",
      fabric: "Heavyweight Garment-Dyed Canvas (410 GSM)"
    }
  };

  var CATEGORY_META = {
    men:              { label: "MEN", href: "men.html" },
    women:            { label: "WOMEN", href: "women.html" },
    accessoriesmen:   { label: "MEN'S ACCESSORIES", href: "shop.html?category=accessoriesmen" },
    accessorieswomen: { label: "WOMEN'S ACCESSORIES", href: "shop.html?category=accessorieswomen" },
    sneakers:         { label: "SNEAKERS", href: "shop.html?category=sneakers" }
  };

  var COLOUR_SWATCHES = [
    { name: "Dark Wine",   hex: "#241419" },
    { name: "Cherry",      hex: "#6E263B" },
    { name: "Blush Cream", hex: "#E9D5CC" }
  ];

  function getAssets(product) {
    var entry = PRODUCT_ASSETS[product.id];
    if (entry) return entry;
    var fallbackImg = getImageSrc(product);
    return {
      front: fallbackImg,
      back:  fallbackImg,
      group: product.name.toUpperCase(),
      fabric: "Heavyweight Studio-Grade Cotton Blend"
    };
  }

  document.addEventListener("DOMContentLoaded", function () {
    var root = document.getElementById("productDetailRoot");
    if (!root || typeof getProductById !== "function") return;

    var params = new URLSearchParams(window.location.search);
    var requestedId = params.get("id");
    var product = requestedId ? getProductById(requestedId) : getProductById("men-shadow-hoodie");

    if (!product) {
      root.innerHTML =
        '<div class="not-found-card">' +
          '<h1 class="product-title">Piece Not Found</h1>' +
          '<p class="product-description">We could not locate that garment in the current Coven drop.</p>' +
          '<div class="not-found-links">' +
            '<a href="men.html" class="view-cart-btn">Browse Men&rsquo;s Collection</a>' +
            '<a href="women.html" class="continue-shopping-btn">Browse Women&rsquo;s Collection</a>' +
          '</div>' +
        '</div>';
      return;
    }

    document.title = product.name + " — coven. Streetwear";

    var assets = getAssets(product);
    var catMeta = CATEGORY_META[product.category] || { label: "SHOP", href: "shop.html" };

    // State for interactive 4-step Add-to-Cart flow
    var state = {
      view: "front",
      colour: COLOUR_SWATCHES[0].name,
      size: null,
      quantity: 1
    };

    // Build Breadcrumb
    var breadcrumbEl = document.getElementById("productBreadcrumb");
    if (breadcrumbEl) {
      breadcrumbEl.innerHTML =
        '<a href="../index.html">HOME</a>' +
        '<span class="breadcrumb-sep">/</span>' +
        '<a href="' + catMeta.href + '">' + catMeta.label + '</a>' +
        '<span class="breadcrumb-sep">/</span>' +
        '<span class="breadcrumb-current">' + assets.group + '</span>';
    }

    // Build Swatches HTML
    var swatchesHtml = COLOUR_SWATCHES.map(function (c, idx) {
      return (
        '<button type="button" class="swatch-btn' + (idx === 0 ? " is-selected" : "") + '"' +
        ' data-colour="' + c.name + '"' +
        ' style="background-color: ' + c.hex + ';"' +
        ' aria-label="Select colour ' + c.name + '"' +
        ' aria-pressed="' + (idx === 0 ? "true" : "false") + '"></button>'
      );
    }).join("");

    // Build Size Pills HTML
    var sizesHtml = product.sizes.map(function (sizeVal) {
      return (
        '<button type="button" class="size-pill" data-size="' + sizeVal + '" aria-pressed="false">' +
          sizeVal +
        '</button>'
      );
    }).join("");

    root.innerHTML =
      '<div class="product-detail-layout">' +
        '<!-- Left Column: Large Product Image + Front/Back Switcher -->' +
        '<div class="product-gallery">' +
          '<div class="main-image-frame">' +
            '<img src="' + assets.front + '" alt="' + product.imageAlt + '" class="main-product-image" id="mainProductImage">' +
            '<span class="view-tag-pill" id="activeViewBadge">FRONT VIEW</span>' +
          '</div>' +
          '<div class="thumbnail-row" role="group" aria-label="Garment views">' +
            '<button type="button" class="thumb-btn is-active" data-view="front" aria-pressed="true">' +
              '<img src="' + assets.front + '" alt="Front view thumbnail of ' + product.name + '" class="thumb-preview">' +
              '<span class="thumb-label">FRONT</span>' +
            '</button>' +
            '<button type="button" class="thumb-btn" data-view="back" aria-pressed="false">' +
              '<img src="' + assets.back + '" alt="Back view thumbnail of ' + product.name + '" class="thumb-preview">' +
              '<span class="thumb-label">BACK</span>' +
            '</button>' +
          '</div>' +
        '</div>' +

        '<!-- Right Column: Specs, Size Selection, Quantity & 4-State Add to Cart -->' +
        '<div class="product-info-panel">' +
          '<div>' +
            '<p class="product-kicker">coven. Studio Uniform</p>' +
            '<h1 class="product-title">' + product.name + '</h1>' +
          '</div>' +

          '<div class="product-meta-specs">' +
            '<p class="product-price-line"><span class="spec-label">Price:</span> ' + formatPrice(product.price) + '</p>' +
            '<p class="product-fabric-line"><span class="spec-label">Fabric:</span> ' + assets.fabric + '</p>' +
          '</div>' +

          '<p class="product-description">' + product.description + '</p>' +

          '<!-- Colour Swatches -->' +
          '<div class="option-group">' +
            '<div class="option-header">' +
              '<span class="option-label">Colour</span>' +
              '<span class="option-selected-value" id="selectedColourLabel">' + state.colour + '</span>' +
            '</div>' +
            '<div class="swatch-row" id="colourSwatches">' + swatchesHtml + '</div>' +
          '</div>' +

          '<!-- Size Selector (State 1 & State 2) -->' +
          '<div class="option-group">' +
            '<div class="option-header">' +
              '<span class="option-label">Select Size</span>' +
              '<button type="button" class="size-guide-btn" id="openSizeGuideBtn">Size Guide</button>' +
            '</div>' +
            '<div class="size-grid" id="sizeGrid" role="group" aria-label="Available sizes">' + sizesHtml + '</div>' +
            '<p class="size-error-msg" id="sizeErrorMsg" role="alert" aria-live="polite"></p>' +
          '</div>' +

          '<!-- Purchase Controls (State 3: Quantity + Live Total) -->' +
          '<div id="purchasePanel">' +
            '<div class="order-summary-card">' +
              '<div class="summary-mini-row">' +
                '<img src="' + assets.front + '" alt="" class="summary-mini-thumb">' +
                '<div class="summary-mini-info">' +
                  '<span class="summary-mini-name">' + product.name + '</span>' +
                  '<span id="summarySizeLine">Size: Not selected</span>' +
                  '<span>Unit Price: ' + formatPrice(product.price) + '</span>' +
                '</div>' +
              '</div>' +

              '<div class="quantity-row">' +
                '<span class="option-label">Quantity</span>' +
                '<div class="qty-controls-wrap">' +
                  '<div class="qty-stepper">' +
                    '<button type="button" class="qty-btn" id="qtyDecBtn" aria-label="Decrease quantity">&minus;</button>' +
                    '<span class="qty-value" id="qtyValue">1</span>' +
                    '<button type="button" class="qty-btn" id="qtyIncBtn" aria-label="Increase quantity">+</button>' +
                  '</div>' +
                  '<span class="qty-item-label" id="qtyItemLabel">1 item</span>' +
                '</div>' +
              '</div>' +

              '<div class="total-row">' +
                '<span class="total-label">Total</span>' +
                '<span class="total-amount" id="liveTotalAmount">' + formatPrice(product.price) + '</span>' +
              '</div>' +
            '</div>' +

            '<div style="margin-top: 1rem;">' +
              '<button type="button" class="add-to-cart-btn" id="addToCartBtn">ADD TO CART</button>' +
            '</div>' +
          '</div>' +

          '<!-- State 4: Added to Bag Confirmation -->' +
          '<div class="cart-confirmation-card" id="cartConfirmCard" hidden aria-live="polite">' +
            '<div class="confirm-check-circle" aria-hidden="true">' +
              '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">' +
                '<polyline points="20 6 9 17 4 12"></polyline>' +
              '</svg>' +
            '</div>' +
            '<h2 class="confirm-heading">Added to your bag</h2>' +
            '<p class="confirm-summary" id="confirmSummaryText"></p>' +
            '<div class="confirm-actions">' +
              '<a href="cart.html" class="view-cart-btn">View Cart</a>' +
              '<button type="button" class="continue-shopping-btn" id="continueShoppingBtn">Continue Shopping</button>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</div>';

    // DOM References
    var mainImg = document.getElementById("mainProductImage");
    var viewBadge = document.getElementById("activeViewBadge");
    var thumbBtns = root.querySelectorAll(".thumb-btn");
    var swatchBtns = root.querySelectorAll(".swatch-btn");
    var colourLabel = document.getElementById("selectedColourLabel");
    var sizeGrid = document.getElementById("sizeGrid");
    var sizePills = root.querySelectorAll(".size-pill");
    var sizeErrorMsg = document.getElementById("sizeErrorMsg");
    var summarySizeLine = document.getElementById("summarySizeLine");
    var qtyDecBtn = document.getElementById("qtyDecBtn");
    var qtyIncBtn = document.getElementById("qtyIncBtn");
    var qtyValueEl = document.getElementById("qtyValue");
    var qtyItemLabel = document.getElementById("qtyItemLabel");
    var liveTotalAmount = document.getElementById("liveTotalAmount");
    var addToCartBtn = document.getElementById("addToCartBtn");
    var purchasePanel = document.getElementById("purchasePanel");
    var cartConfirmCard = document.getElementById("cartConfirmCard");
    var confirmSummaryText = document.getElementById("confirmSummaryText");
    var continueShoppingBtn = document.getElementById("continueShoppingBtn");

    function updateQuantityUI() {
      qtyValueEl.textContent = String(state.quantity);
      qtyItemLabel.textContent = state.quantity + (state.quantity === 1 ? " item" : " items");
      liveTotalAmount.textContent = formatPrice(product.price * state.quantity);
      qtyDecBtn.disabled = state.quantity <= 1;
      qtyIncBtn.disabled = state.quantity >= 10;
    }

    // Front / Back view switcher
    thumbBtns.forEach(function (btn) {
      btn.addEventListener("click", function () {
        var view = btn.getAttribute("data-view");
        state.view = view;
        mainImg.src = view === "back" ? assets.back : assets.front;
        viewBadge.textContent = view === "back" ? "BACK VIEW" : "FRONT VIEW";

        thumbBtns.forEach(function (t) {
          var active = t === btn;
          t.classList.toggle("is-active", active);
          t.setAttribute("aria-pressed", String(active));
        });
      });
    });

    // Colour Swatch Selection
    swatchBtns.forEach(function (btn) {
      btn.addEventListener("click", function () {
        state.colour = btn.getAttribute("data-colour");
        colourLabel.textContent = state.colour;
        swatchBtns.forEach(function (s) {
          var active = s === btn;
          s.classList.toggle("is-selected", active);
          s.setAttribute("aria-pressed", String(active));
        });
      });
    });

    // State 2: Size Selection
    sizePills.forEach(function (pill) {
      pill.addEventListener("click", function () {
        var rawSize = pill.getAttribute("data-size");
        // Keep numeric size type for sneakers if numeric
        state.size = /^\d+$/.test(rawSize) ? Number(rawSize) : rawSize;

        sizePills.forEach(function (p) {
          var active = p === pill;
          p.classList.toggle("is-selected", active);
          p.setAttribute("aria-pressed", String(active));
        });

        sizeGrid.classList.remove("has-error");
        sizeErrorMsg.textContent = "";
        summarySizeLine.textContent = "Size: " + state.size + " • " + state.colour;
      });
    });

    // State 3: Quantity Stepper
    qtyDecBtn.addEventListener("click", function () {
      if (state.quantity > 1) {
        state.quantity -= 1;
        updateQuantityUI();
      }
    });

    qtyIncBtn.addEventListener("click", function () {
      if (state.quantity < 10) {
        state.quantity += 1;
        updateQuantityUI();
      }
    });

    // State 1 & State 4: Add to Cart Validation & Confirmation
    addToCartBtn.addEventListener("click", function () {
      if (state.size === null) {
        // State 1: No Size Selected -> Prompt user
        sizeGrid.classList.add("has-error");
        sizeErrorMsg.textContent = "Please select a size before adding to cart.";
        sizeGrid.scrollIntoView({ behavior: "smooth", block: "center" });
        return;
      }

      var result = addToCart(product.id, state.size, state.quantity);
      if (!result || !result.ok) {
        sizeErrorMsg.textContent = (result && result.message) || "Unable to add item to bag.";
        return;
      }

      // State 4: Show Added to Bag confirmation
      confirmSummaryText.textContent =
        product.name + " • Size " + state.size + " • " +
        state.quantity + (state.quantity === 1 ? " item" : " items") + " • " +
        formatPrice(product.price * state.quantity);

      purchasePanel.hidden = true;
      cartConfirmCard.hidden = false;
    });

    continueShoppingBtn.addEventListener("click", function () {
      cartConfirmCard.hidden = true;
      purchasePanel.hidden = false;
    });

    updateQuantityUI();

    // Size Guide Modal
    var openGuideBtn = document.getElementById("openSizeGuideBtn");
    var sizeModalBackdrop = document.getElementById("sizeModalBackdrop");
    var closeGuideBtn = document.getElementById("closeSizeGuideBtn");

    if (openGuideBtn && sizeModalBackdrop && closeGuideBtn) {
      openGuideBtn.addEventListener("click", function () {
        sizeModalBackdrop.hidden = false;
      });
      closeGuideBtn.addEventListener("click", function () {
        sizeModalBackdrop.hidden = true;
      });
      sizeModalBackdrop.addEventListener("click", function (event) {
        if (event.target === sizeModalBackdrop) {
          sizeModalBackdrop.hidden = true;
        }
      });
    }

    // Related Products in Same Category
    var relatedSection = document.getElementById("relatedSection");
    var relatedGrid = document.getElementById("relatedGrid");
    if (relatedSection && relatedGrid) {
      var peers = getProductsByCategory(product.category).filter(function (item) {
        return item.id !== product.id;
      }).slice(0, 3);

      if (peers.length > 0) {
        relatedSection.hidden = false;
        relatedGrid.innerHTML = peers.map(function (item) {
          var itemAssets = getAssets(item);
          return (
            '<a href="' + getProductUrl(item.id) + '" class="related-card">' +
              '<div class="related-img-wrap">' +
                '<img src="' + itemAssets.front + '" alt="' + item.imageAlt + '" class="related-img" loading="lazy">' +
              '</div>' +
              '<div class="related-body">' +
                '<h3 class="related-name">' + item.name + '</h3>' +
                '<span class="related-price">' + formatPrice(item.price) + '</span>' +
              '</div>' +
            '</a>'
          );
        }).join("");
      }
    }
  });
})();
