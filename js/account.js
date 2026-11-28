/* ==========================================================================
   Coven Streetwear — My Account Page Interactions
   Kept separate from js/main.js so shared scripts remain untouched.
   ========================================================================== */

const COVEN_USER_STORAGE_KEY = "coven_user";
const DEFAULT_ACCOUNT_NAME = "Muhammad Hassan";

document.addEventListener("DOMContentLoaded", () => {
  syncAccountProfileName();
  initAccountSidebar();
  initLogoutAction();
});

function syncAccountProfileName() {
  const nameLink = document.getElementById("accountProfileName");
  if (!nameLink) return;

  try {
    const rawUser = localStorage.getItem(COVEN_USER_STORAGE_KEY);
    if (!rawUser) {
      nameLink.textContent = DEFAULT_ACCOUNT_NAME;
      return;
    }

    const user = JSON.parse(rawUser);
    const displayName = user && typeof user.name === "string" ? user.name.trim() : "";
    nameLink.textContent = displayName || DEFAULT_ACCOUNT_NAME;
  } catch {
    nameLink.textContent = DEFAULT_ACCOUNT_NAME;
  }
}

function initAccountSidebar() {
  const navButtons = document.querySelectorAll(".account-nav-btn[data-section]");
  const panels = document.querySelectorAll(".account-panel[data-panel]");

  if (!navButtons.length || !panels.length) return;

  navButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const targetSection = button.getAttribute("data-section");

      navButtons.forEach((btn) => {
        const isSelected = btn === button;
        btn.classList.toggle("is-active", isSelected);
        btn.setAttribute("aria-pressed", String(isSelected));
      });

      // Both "account" and "orders" show the Your order section by default, matching the draft.
      const panelKey = targetSection === "account" ? "orders" : targetSection;
      panels.forEach((panel) => {
        const matches = panel.getAttribute("data-panel") === panelKey;
        if (matches) {
          panel.removeAttribute("hidden");
        } else {
          panel.setAttribute("hidden", "");
        }
      });
    });
  });
}

function initLogoutAction() {
  const logoutBtn = document.getElementById("logoutBtn");
  if (!logoutBtn) return;

  logoutBtn.addEventListener("click", () => {
    try {
      localStorage.removeItem(COVEN_USER_STORAGE_KEY);
    } catch {
      // Ignore storage failures in restricted contexts
    }
    window.location.href = "login.html";
  });
}
