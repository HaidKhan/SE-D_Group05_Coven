/* ==========================================================================
   Coven Streetwear — Shared Navigation, Search & Cart State
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  initMobileMenu();
  initShopDropdown();
  initSearchToggle();
  syncCartBadge();
});

function initMobileMenu() {
  const toggleBtn = document.getElementById("mobileMenuToggle");
  const primaryNav = document.getElementById("primaryNav");

  if (!toggleBtn || !primaryNav) return;

  toggleBtn.addEventListener("click", () => {
    const isOpen = primaryNav.classList.toggle("is-open");
    toggleBtn.setAttribute("aria-expanded", String(isOpen));
  });
}

function initShopDropdown() {
  const dropdownBtn = document.getElementById("shopDropdownBtn");
  const dropdownItem = dropdownBtn ? dropdownBtn.closest(".nav-dropdown") : null;

  if (!dropdownBtn || !dropdownItem) return;

  dropdownBtn.addEventListener("click", (event) => {
    event.stopPropagation();
    const isOpen = dropdownItem.classList.toggle("open");
    dropdownBtn.setAttribute("aria-expanded", String(isOpen));
  });

  document.addEventListener("click", (event) => {
    if (!dropdownItem.contains(event.target)) {
      dropdownItem.classList.remove("open");
      dropdownBtn.setAttribute("aria-expanded", "false");
    }
  });
}

function initSearchToggle() {
  const searchBtn = document.getElementById("searchToggleBtn");
  const searchPanel = document.getElementById("searchBarPanel");

  if (!searchBtn || !searchPanel) return;

  searchBtn.addEventListener("click", () => {
    const isHidden = searchPanel.hasAttribute("hidden");
    if (isHidden) {
      searchPanel.removeAttribute("hidden");
      searchBtn.setAttribute("aria-expanded", "true");
      const input = searchPanel.querySelector("input");
      if (input) input.focus();
    } else {
      searchPanel.setAttribute("hidden", "");
      searchBtn.setAttribute("aria-expanded", "false");
    }
  });
}

function syncCartBadge() {
  const badge = document.getElementById("cartBadge");
  if (!badge) return;

  try {
    const rawCart = localStorage.getItem("coven_cart");
    if (!rawCart) {
      badge.textContent = "0";
      return;
    }

    const items = JSON.parse(rawCart);
    if (!Array.isArray(items)) {
      badge.textContent = "0";
      return;
    }

    const totalCount = items.reduce((sum, item) => {
      const qty = Number(item.quantity);
      return sum + (Number.isFinite(qty) && qty > 0 ? qty : 1);
    }, 0);

    badge.textContent = String(totalCount);
  } catch {
    badge.textContent = "0";
  }
}
