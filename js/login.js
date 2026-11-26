/* ==========================================================================
   Coven Streetwear — Login Page Interactions
   Kept separate from js/main.js so shared scripts remain untouched.
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  initPasswordToggle();
  initLoginForm();
});

function initPasswordToggle() {
  const toggleBtn = document.getElementById("passwordToggleBtn");
  const passwordInput = document.getElementById("loginPassword");

  if (!toggleBtn || !passwordInput) return;

  toggleBtn.addEventListener("click", () => {
    const isHidden = passwordInput.type === "password";
    passwordInput.type = isHidden ? "text" : "password";
    toggleBtn.setAttribute("aria-label", isHidden ? "Hide password" : "Show password");
    toggleBtn.setAttribute("aria-pressed", String(isHidden));
  });
}

function initLoginForm() {
  const form = document.getElementById("loginForm");
  const emailInput = document.getElementById("loginEmail");
  const passwordInput = document.getElementById("loginPassword");
  const statusEl = document.getElementById("loginStatus");

  if (!form || !emailInput || !passwordInput || !statusEl) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const email = emailInput.value.trim();
    const password = passwordInput.value;

    statusEl.classList.remove("is-error", "is-success");

    if (!email || !emailInput.checkValidity()) {
      statusEl.textContent = "Please enter a valid email address.";
      statusEl.classList.add("is-error");
      emailInput.focus();
      return;
    }

    if (!password) {
      statusEl.textContent = "Please enter your password.";
      statusEl.classList.add("is-error");
      passwordInput.focus();
      return;
    }

    statusEl.textContent = "Welcome back! Signing you in...";
    statusEl.classList.add("is-success");
  });
}
