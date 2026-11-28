/* ==========================================================================
   Coven Streetwear — Auth Page Interactions (Login & Sign Up)
   Kept separate from js/main.js so shared scripts remain untouched.
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  initPasswordToggles();
  initLoginForm();
  initSignupForm();
});

function initPasswordToggles() {
  const toggleButtons = document.querySelectorAll("[data-password-toggle]");

  toggleButtons.forEach((toggleBtn) => {
    const targetId = toggleBtn.getAttribute("data-password-toggle");
    const passwordInput = targetId ? document.getElementById(targetId) : null;
    if (!passwordInput) return;

    toggleBtn.addEventListener("click", () => {
      const isHidden = passwordInput.type === "password";
      passwordInput.type = isHidden ? "text" : "password";
      toggleBtn.setAttribute("aria-label", isHidden ? "Hide password" : "Show password");
      toggleBtn.setAttribute("aria-pressed", String(isHidden));
    });
  });
}

function setAuthStatus(statusEl, message, isSuccess) {
  statusEl.classList.remove("is-error", "is-success");
  statusEl.textContent = message;
  if (message) {
    statusEl.classList.add(isSuccess ? "is-success" : "is-error");
  }
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

    if (!email || !emailInput.checkValidity()) {
      setAuthStatus(statusEl, "Please enter a valid email address.", false);
      emailInput.focus();
      return;
    }

    if (!password) {
      setAuthStatus(statusEl, "Please enter your password.", false);
      passwordInput.focus();
      return;
    }

    setAuthStatus(statusEl, "Welcome back! Signing you in...", true);
  });
}

function initSignupForm() {
  const form = document.getElementById("signupForm");
  const nameInput = document.getElementById("signupName");
  const emailInput = document.getElementById("signupEmail");
  const passwordInput = document.getElementById("signupPassword");
  const confirmInput = document.getElementById("signupConfirmPassword");
  const statusEl = document.getElementById("signupStatus");

  if (!form || !nameInput || !emailInput || !passwordInput || !confirmInput || !statusEl) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const fullName = nameInput.value.trim();
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    const confirmPassword = confirmInput.value;

    if (!fullName) {
      setAuthStatus(statusEl, "Please enter your full name.", false);
      nameInput.focus();
      return;
    }

    if (!email || !emailInput.checkValidity()) {
      setAuthStatus(statusEl, "Please enter a valid email address.", false);
      emailInput.focus();
      return;
    }

    if (password.length < 6) {
      setAuthStatus(statusEl, "Password must be at least 6 characters.", false);
      passwordInput.focus();
      return;
    }

    if (password !== confirmPassword) {
      setAuthStatus(statusEl, "Passwords do not match.", false);
      confirmInput.focus();
      return;
    }

    saveUserSession(fullName, email);
    setAuthStatus(statusEl, "Account created! Welcome to Coven.", true);
    window.setTimeout(() => {
      window.location.href = "account.html";
    }, 450);
  });
}

function saveUserSession(name, email) {
  try {
    localStorage.setItem("coven_user", JSON.stringify({ name, email }));
  } catch {
    // Ignore storage failures in restricted contexts
  }
}
