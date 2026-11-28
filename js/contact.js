/* ==========================================================================
   Coven Streetwear — Contact Us Page Logic
   EmailJS (https://www.emailjs.com) sends emails directly from the browser.

   ── SETUP STEPS (one-time, done by the site owner) ──────────────────────
   1. Sign up free at https://www.emailjs.com
   2. Add an Email Service (Gmail recommended → "Connect Account")
   3. Create TWO Email Templates:

      Template A — "coven_contact"
        Subject : add this user in custumers that needs info
        Body    :
          Name:    {{from_name}}
          Email:   {{reply_to}}
          Phone:   {{phone}}

          Message:
          {{message}}

      Template B — "coven_return"
        Subject : return
        Body    :
          Return Request
          Delivery Date : {{delivery_date}}
          Customer Email: {{reply_to}}

          Reason:
          {{reason}}

   4. Copy your PUBLIC KEY from Account → API Keys
   5. Replace the three placeholder strings below.
   ─────────────────────────────────────────────────────────────────────── */

const EMAILJS_PUBLIC_KEY    = "YOUR_PUBLIC_KEY";       // ← paste here
const EMAILJS_SERVICE_ID    = "YOUR_SERVICE_ID";       // ← e.g. "service_abc123"
const EMAILJS_CONTACT_TPL   = "coven_contact";         // ← Template A ID
const EMAILJS_RETURN_TPL    = "coven_return";          // ← Template B ID

const CONTACT_DRAFT_KEY = "coven_contact_draft";

/* ── Phone directory rendered from data ─────────────────────────────────── */
const CALL_DIRECTORY = [
  { label: "All Time Available (24 / 7)", numbers: ["03302241213"] },
  { label: "9:00 AM – 6:00 PM Available", numbers: ["03329187475", "03359993205"] },
  { label: "Join Us",                     numbers: ["03709189791"] },
];

/* ── Size guide data ────────────────────────────────────────────────────── */
const SIZE_GUIDES = {
  clothes: {
    note: "Coven garments are cut in a relaxed heavyweight streetwear fit. Measurements are garment dimensions.",
    headers: {
      in: ["Size", "Chest (in)", "Length (in)", "Shoulder (in)"],
      cm: ["Size", "Chest (cm)", "Length (cm)", "Shoulder (cm)"],
    },
    rows: [
      { size: "S",   chestIn: 42, lengthIn: 27,   shoulderIn: 20.5 },
      { size: "M",   chestIn: 44, lengthIn: 28,   shoulderIn: 21.5 },
      { size: "L",   chestIn: 47, lengthIn: 29.5, shoulderIn: 22.5 },
      { size: "XL",  chestIn: 50, lengthIn: 30.5, shoulderIn: 23.5 },
      { size: "XXL", chestIn: 53, lengthIn: 31.5, shoulderIn: 24.5 },
    ],
  },
  shoes: {
    note: "Measure heel to longest toe while standing. If between sizes, choose the larger size.",
    headers: {
      in: ["EU", "UK", "US", "Foot Length (in)"],
      cm: ["EU", "UK", "US", "Foot Length (cm)"],
    },
    rows: [
      { eu: "38", uk: "5",    us: "6",    footCm: 24.0 },
      { eu: "39", uk: "6",    us: "7",    footCm: 24.7 },
      { eu: "40", uk: "6.5",  us: "7.5",  footCm: 25.4 },
      { eu: "41", uk: "7.5",  us: "8.5",  footCm: 26.0 },
      { eu: "42", uk: "8",    us: "9",    footCm: 26.7 },
      { eu: "43", uk: "9",    us: "10",   footCm: 27.3 },
      { eu: "44", uk: "9.5",  us: "10.5", footCm: 28.0 },
      { eu: "45", uk: "10.5", us: "11.5", footCm: 28.7 },
    ],
  },
};

let activeSizeCategory = "clothes";
let activeUnit         = "in";

/* ════════════════════════════════════════════════════════════════════════
   BOOT
   ════════════════════════════════════════════════════════════════════════ */
document.addEventListener("DOMContentLoaded", () => {
  // Initialise EmailJS with the public key
  emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });

  renderCallDirectory();
  initContactForm();
  initModals();
  initReturnFlow();
  initSizeGuide();
});

/* ── Render Call Directory ───────────────────────────────────────────────── */
function renderCallDirectory() {
  const container = document.getElementById("callListContainer");
  if (!container) return;
  container.innerHTML = "";

  CALL_DIRECTORY.forEach((group) => {
    const item = document.createElement("div");
    item.className = "call-item";

    const label = document.createElement("span");
    label.className = "call-label";
    label.textContent = group.label;

    const numbersRow = document.createElement("div");
    numbersRow.className = "call-numbers";

    group.numbers.forEach((num) => {
      const link = document.createElement("a");
      link.className = "call-link";
      link.href = `tel:${num}`;
      link.textContent = num;
      numbersRow.appendChild(link);
    });

    item.appendChild(label);
    item.appendChild(numbersRow);
    container.appendChild(item);
  });
}

/* ════════════════════════════════════════════════════════════════════════
   GET IN TOUCH FORM  →  sends via EmailJS (Template: coven_contact)
   ════════════════════════════════════════════════════════════════════════ */
function initContactForm() {
  const form          = document.getElementById("contactForm");
  const nameInput     = document.getElementById("fullName");
  const emailInput    = document.getElementById("emailAddress");
  const phoneInput    = document.getElementById("phoneNumber");
  const messageInput  = document.getElementById("userMessage");
  const clearBtn      = document.getElementById("clearAllBtn");
  const submitBtn     = document.getElementById("submitContactBtn");
  const statusBox     = document.getElementById("contactFormStatus");

  if (!form) return;

  // Restore saved draft
  restoreContactDraft({ nameInput, emailInput, phoneInput, messageInput });

  // Live-save draft on input + clear validation error
  [nameInput, emailInput, phoneInput, messageInput].forEach((f) => {
    f.addEventListener("input", () => {
      clearFieldError(f);
      saveContactDraft({ nameInput, emailInput, phoneInput, messageInput });
    });
  });

  // Clear All
  clearBtn.addEventListener("click", () => {
    form.reset();
    [nameInput, emailInput, phoneInput, messageInput].forEach(clearFieldError);
    localStorage.removeItem(CONTACT_DRAFT_KEY);
    hideStatus(statusBox);
    nameInput.focus();
  });

  // Submit → WhatsApp
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const name    = nameInput.value.trim();
    const email   = emailInput.value.trim();
    const phone   = phoneInput.value.trim();
    const message = messageInput.value.trim();

    // Validate
    let ok = true;
    if (name.length < 2)      { setFieldError(nameInput,    "fullNameError",     "Please enter your full name (at least 2 characters)."); ok = false; }
    if (!isValidEmail(email)) { setFieldError(emailInput,   "emailAddressError", "Please enter a valid email address.");                   ok = false; }
    if (!isValidPhone(phone)) { setFieldError(phoneInput,   "phoneNumberError",  "Please enter a valid phone number (7–15 digits).");      ok = false; }
    if (message.length < 5)   { setFieldError(messageInput, "userMessageError",  "Please write a message (at least 5 characters).");       ok = false; }
    if (!ok) return;

    // Build WhatsApp message
    const waText = [
      "🛍 *New Coven Customer Inquiry*",
      "",
      `*Name:*    ${name}`,
      `*Email:*   ${email}`,
      `*Phone:*   ${phone}`,
      "",
      `*Message:*`,
      message,
    ].join("\n");

    // Open WhatsApp chat with 03302241213 (Pakistan +92)
    const waUrl = `https://wa.me/923302241213?text=${encodeURIComponent(waText)}`;
    window.open(waUrl, "_blank", "noopener,noreferrer");

    form.reset();
    localStorage.removeItem(CONTACT_DRAFT_KEY);
    showStatus(statusBox, "✓ Opening WhatsApp — your details are pre-filled and ready to send!", false);
  });
}

/* ── Draft helpers ──────────────────────────────────────────────────────── */
function saveContactDraft({ nameInput, emailInput, phoneInput, messageInput }) {
  try {
    localStorage.setItem(CONTACT_DRAFT_KEY, JSON.stringify({
      name:    nameInput.value,
      email:   emailInput.value,
      phone:   phoneInput.value,
      message: messageInput.value,
    }));
  } catch {}
}

function restoreContactDraft({ nameInput, emailInput, phoneInput, messageInput }) {
  try {
    const raw = localStorage.getItem(CONTACT_DRAFT_KEY);
    if (!raw) return;
    const d = JSON.parse(raw);
    if (d.name)    nameInput.value    = d.name;
    if (d.email)   emailInput.value   = d.email;
    if (d.phone)   phoneInput.value   = d.phone;
    if (d.message) messageInput.value = d.message;
  } catch {}
}

/* ════════════════════════════════════════════════════════════════════════
   MODALS — open / close / keyboard escape
   ════════════════════════════════════════════════════════════════════════ */
function initModals() {
  document.getElementById("openReturnModalBtn")
    ?.addEventListener("click", () => openModal("returnModal"));

  document.getElementById("openSizeGuideBtn")
    ?.addEventListener("click", () => openModal("sizeGuideModal"));

  document.querySelectorAll("[data-close-modal]").forEach((btn) => {
    btn.addEventListener("click", () => closeModal(btn.getAttribute("data-close-modal")));
  });

  document.querySelectorAll(".modal-overlay").forEach((overlay) => {
    overlay.addEventListener("click", (ev) => {
      if (ev.target === overlay) closeModal(overlay.id);
    });
  });

  document.addEventListener("keydown", (ev) => {
    if (ev.key !== "Escape") return;
    document.querySelectorAll(".modal-overlay:not([hidden])").forEach((m) => closeModal(m.id));
  });
}

function openModal(id) {
  const el = document.getElementById(id);
  if (!el) return;
  if (id === "returnModal") resetReturnModalView();
  el.removeAttribute("hidden");
  document.body.style.overflow = "hidden";
  el.querySelector(".modal-close-btn")?.focus();
}

function closeModal(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.setAttribute("hidden", "");
  document.body.style.overflow = "";
}

/* ════════════════════════════════════════════════════════════════════════
   RETURN FLOW  →  sends via EmailJS (Template: coven_return)
   ════════════════════════════════════════════════════════════════════════ */
function initReturnFlow() {
  const policyView  = document.getElementById("returnPolicyView");
  const formView    = document.getElementById("returnFormView");
  const modalTitle  = document.getElementById("returnModalTitle");
  const showFormBtn = document.getElementById("showReturnFormBtn");
  const backBtn     = document.getElementById("backToPolicyBtn");
  const returnForm  = document.getElementById("returnApplyForm");
  const dateInput   = document.getElementById("deliveryDate");
  const reasonInput = document.getElementById("returnReason");
  const emailInput  = document.getElementById("returnEmail");
  const sendBtn     = document.getElementById("sendToCovenBtn");
  const statusBox   = document.getElementById("returnFormStatus");

  if (!returnForm) return;

  // Cap date picker at today
  if (dateInput) dateInput.setAttribute("max", getTodayISO());

  showFormBtn?.addEventListener("click", () => {
    policyView?.setAttribute("hidden", "");
    formView?.removeAttribute("hidden");
    if (modalTitle) modalTitle.textContent = "Apply for Return";
    dateInput?.focus();
  });

  backBtn?.addEventListener("click", resetReturnModalView);

  [dateInput, reasonInput, emailInput].forEach((f) => {
    f?.addEventListener("input", () => clearFieldError(f));
  });

  returnForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const date   = dateInput?.value       ?? "";
    const reason = reasonInput?.value.trim() ?? "";
    const email  = emailInput?.value.trim()  ?? "";

    // Validate
    let ok = true;
    const dateCheck = validateDeliveryDate(date);
    if (!dateCheck.valid)     { setFieldError(dateInput,   "deliveryDateError", dateCheck.message);                        ok = false; }
    if (reason.length < 5)   { setFieldError(reasonInput, "returnReasonError", "Please explain why you want to return."); ok = false; }
    if (!isValidEmail(email)) { setFieldError(emailInput,  "returnEmailError",  "Please enter a valid email address.");    ok = false; }
    if (!ok) return;

    // Build WhatsApp message for return
    const waText = [
      "🔄 *Coven Return Request*",
      "",
      `*Delivery Date:*  ${date}`,
      `*Customer Email:* ${email}`,
      "",
      "*Reason for Return:*",
      reason,
    ].join("\n");

    const waUrl = `https://wa.me/923302241213?text=${encodeURIComponent(waText)}`;
    window.open(waUrl, "_blank", "noopener,noreferrer");

    returnForm.reset();
    showStatus(statusBox, "✓ Opening WhatsApp — your return details are pre-filled. Coven will contact you through email.", false);
  });
}

function resetReturnModalView() {
  document.getElementById("returnPolicyView")?.removeAttribute("hidden");
  document.getElementById("returnFormView")?.setAttribute("hidden", "");
  const title = document.getElementById("returnModalTitle");
  if (title) title.textContent = "Return Policy";

  const form = document.getElementById("returnApplyForm");
  if (form) {
    form.reset();
    form.querySelectorAll(".form-rect").forEach(clearFieldError);
  }

  hideStatus(document.getElementById("returnFormStatus"));
}

function validateDeliveryDate(value) {
  if (!value) return { valid: false, message: "Please select your product delivery date." };

  const [y, m, d] = value.split("-").map(Number);
  const selected  = new Date(y, m - 1, d);
  const today     = new Date(); today.setHours(0, 0, 0, 0);
  const diffDays  = Math.round((today - selected) / 864e5);

  if (diffDays < 0) return { valid: false, message: "Delivery date cannot be in the future." };
  if (diffDays > 3) return { valid: false, message: "Return is only applicable within 3 days after delivery." };

  return { valid: true, message: "" };
}

/* ════════════════════════════════════════════════════════════════════════
   SIZE GUIDE MODAL
   ════════════════════════════════════════════════════════════════════════ */
function initSizeGuide() {
  document.querySelectorAll("[data-size-tab]").forEach((btn) => {
    btn.addEventListener("click", () => {
      activeSizeCategory = btn.getAttribute("data-size-tab");
      document.querySelectorAll("[data-size-tab]").forEach((t) => {
        t.classList.toggle("active",        t === btn);
        t.setAttribute("aria-selected", String(t === btn));
      });
      renderSizeTable();
    });
  });

  document.querySelectorAll("[data-unit]").forEach((btn) => {
    btn.addEventListener("click", () => {
      activeUnit = btn.getAttribute("data-unit");
      document.querySelectorAll("[data-unit]").forEach((u) => u.classList.toggle("active", u === btn));
      renderSizeTable();
    });
  });

  renderSizeTable();
}

function renderSizeTable() {
  const noteEl  = document.getElementById("sizeGuideNote");
  const wrapper = document.getElementById("sizeGuideTableWrapper");
  if (!noteEl || !wrapper) return;

  const guide = SIZE_GUIDES[activeSizeCategory];
  noteEl.textContent = guide.note;

  const table = document.createElement("table");
  table.className = "size-table";

  // Header
  const thead   = document.createElement("thead");
  const headRow = document.createElement("tr");
  guide.headers[activeUnit].forEach((h) => {
    const th = Object.assign(document.createElement("th"), { scope: "col", textContent: h });
    headRow.appendChild(th);
  });
  thead.appendChild(headRow);

  // Body
  const tbody = document.createElement("tbody");
  guide.rows.forEach((row) => {
    const tr   = document.createElement("tr");
    let cells  = [];

    if (activeSizeCategory === "clothes") {
      cells = activeUnit === "in"
        ? [row.size, row.chestIn, row.lengthIn, row.shoulderIn]
        : [row.size, toCm(row.chestIn), toCm(row.lengthIn), toCm(row.shoulderIn)];
    } else {
      cells = [row.eu, row.uk, row.us, activeUnit === "cm" ? row.footCm.toFixed(1) : toIn(row.footCm)];
    }

    cells.forEach((v) => {
      const td = Object.assign(document.createElement("td"), { textContent: String(v) });
      tr.appendChild(td);
    });
    tbody.appendChild(tr);
  });

  table.appendChild(thead);
  table.appendChild(tbody);
  wrapper.innerHTML = "";
  wrapper.appendChild(table);
}

/* ════════════════════════════════════════════════════════════════════════
   SHARED HELPERS
   ════════════════════════════════════════════════════════════════════════ */
function toCm(inches)  { return (inches * 2.54).toFixed(1); }
function toIn(cm)      { return (cm / 2.54).toFixed(1); }

function isValidEmail(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v); }
function isValidPhone(v) { const d = v.replace(/\D/g, ""); return d.length >= 7 && d.length <= 15; }

function getTodayISO() {
  const n = new Date();
  return `${n.getFullYear()}-${String(n.getMonth()+1).padStart(2,"0")}-${String(n.getDate()).padStart(2,"0")}`;
}

function setFieldError(input, spanId, msg) {
  input?.classList.add("is-invalid");
  const el = document.getElementById(spanId);
  if (el) el.textContent = msg;
}

function clearFieldError(input) {
  input?.classList.remove("is-invalid");
  const group = input?.closest(".form-group");
  const errorEl = group?.querySelector(".field-error");
  if (errorEl) errorEl.textContent = "";
}

function setButtonState(btn, loading, label) {
  if (!btn) return;
  btn.disabled    = loading;
  btn.textContent = label;
}

function hideStatus(el) {
  if (!el) return;
  el.hidden = true;
  el.textContent = "";
  el.classList.remove("is-error");
}

function showStatus(el, msg, isError) {
  if (!el) return;
  el.textContent = msg;
  el.classList.toggle("is-error", Boolean(isError));
  el.hidden = false;
}
