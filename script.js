/**
 * Valentine's Page - Interactive Script
 * All key text and image URLs are configurable below.
 */

/* ============ CONFIG - Edit these easily ============ */
const CONFIG = {
  // Main heading (HTML-safe)
  mainHeading: "beep <3 will you be my Valentine?",
  // Subtext below heading
  subtext: "easiest question of ur life bee",
  // Gallery section title
  galleryTitle: "our photos 📸",

  galleryImages: [
    "https://i.ibb.co/1JnQ3kjf/fish.jpg",
    "https://i.ibb.co/kshHFwh5/fattie.jpg",
    "https://i.ibb.co/Lz4rMvLg/forehead.jpg",
    "https://i.ibb.co/4hSc0Qc/us.jpg",
  ],

  // Gallery captions
  captions: ["fish", "fattie", "forehead", "us!<3"],
  noButtonTexts: ["no", "are you sure?", "pls 😭", "don't do this", "TRY AGAIN"],
  // Success message when Yes is clicked (inline fallback)
  successMessage: "YAYYY 💘 I knew you'd say yes!!!",
  // Pop-up modal (shown when Yes is clicked)
  modal: {
    title: "YAY!",
    message: "i love you infinity babie lets have a lovely time",
    buttonText: "OKAYYYY 🤗",
  },
  // Enable confetti on Yes
  enableConfetti: true,
};

/* ============ DOM Elements ============ */
let noClickCount = 0;
const mainHeadingEl = document.getElementById("main-heading");
const subtextEl = document.getElementById("subtext");
const galleryEl = document.getElementById("gallery");
const buttonsWrapperEl = document.getElementById("buttons-wrapper");
const btnYes = document.getElementById("btn-yes");
const btnNo = document.getElementById("btn-no");
const successMessageEl = document.getElementById("success-message");
const modalOverlay = document.getElementById("modal-overlay");
const modalEl = document.getElementById("modal");
const modalMessageEl = document.getElementById("modal-message");
const modalBtn = document.getElementById("modal-btn");

/* ============ Init: Apply config text ============ */
function initText() {
  if (mainHeadingEl) mainHeadingEl.innerHTML = CONFIG.mainHeading;
  if (subtextEl) subtextEl.textContent = CONFIG.subtext;
}

/* ============ Init: Populate gallery images ============ */
function initGallery() {
  if (!galleryEl) return;
  const items = galleryEl.querySelectorAll(".gallery-item");
  items.forEach((item, i) => {
    const img = item.querySelector("img");
    const caption = item.querySelector("figcaption");
    if (img) {
      const url = CONFIG.galleryImages[i] || CONFIG.placeholderImages[i];
      img.src = url;
      img.onerror = () => {
        img.src = CONFIG.placeholderImages[i];
      };
    }
    if (caption && CONFIG.captions[i]) caption.textContent = CONFIG.captions[i];
  });
}

/* ============ No button: Runs away from cursor (can't be clicked) ============ */
const FLEE_DISTANCE = 70;   // px - cursor within this distance triggers flee
const FLEE_COOLDOWN = 120;  // ms - min time between flees

let lastFleeTime = 0;

function getPositionAwayFromCursor(btnRect, cursorX, cursorY) {
  const container = document.getElementById("answer-area");
  if (!container) return null;

  const rect = container.getBoundingClientRect();
  const padding = 10;
  const btnCenterX = btnRect.left + btnRect.width / 2;
  const btnCenterY = btnRect.top + btnRect.height / 2;

  // Direction from cursor to button = direction to flee (away from cursor)
  const dx = btnCenterX - cursorX;
  const dy = btnCenterY - cursorY;
  const dist = Math.sqrt(dx * dx + dy * dy) || 1;
  const dirX = dx / dist;
  const dirY = dy / dist;

  // New position: move further away
  const fleeAmount = 80;
  let newCenterX = btnCenterX + dirX * fleeAmount;
  let newCenterY = btnCenterY + dirY * fleeAmount;

  // Convert to container-relative coords (left, top of button)
  const newLeft = newCenterX - rect.left - btnRect.width / 2;
  const newTop = newCenterY - rect.top - btnRect.height / 2;

  // Clamp to container
  const maxX = rect.width - btnRect.width - padding;
  const maxY = rect.height - btnRect.height - padding;
  const x = Math.max(padding, Math.min(maxX, newLeft));
  const y = Math.max(padding, Math.min(maxY, newTop));

  return { x, y };
}

function initNoButtonFlee() {
  if (!btnNo || !buttonsWrapperEl) return;

  btnNo.style.position = "absolute";
  btnNo.style.pointerEvents = "none";
  btnNo.style.cursor = "default";
  btnNo.style.left = "50%";
  btnNo.style.top = "12px";
  btnNo.style.transform = "translateX(-50%)";
  btnNo.textContent = CONFIG.noButtonTexts[0];

  const container = document.getElementById("answer-area");
  if (!container) return;

  let rafId = null;
  container.addEventListener("mousemove", (e) => {
    if (rafId) return;
    rafId = requestAnimationFrame(() => {
      rafId = null;
      if (buttonsWrapperEl.classList.contains("hidden")) return;

      const now = Date.now();
      if (now - lastFleeTime < FLEE_COOLDOWN) return;

      const btnRect = btnNo.getBoundingClientRect();
      const cursorX = e.clientX;
      const cursorY = e.clientY;
      const btnCenterX = btnRect.left + btnRect.width / 2;
      const btnCenterY = btnRect.top + btnRect.height / 2;
      const dist = Math.hypot(cursorX - btnCenterX, cursorY - btnCenterY);

      if (dist < FLEE_DISTANCE) {
        lastFleeTime = now;
        const pos = getPositionAwayFromCursor(btnRect, cursorX, cursorY);
        if (pos) {
          btnNo.style.left = `${pos.x}px`;
          btnNo.style.top = `${pos.y}px`;
          btnNo.style.transform = "none";

          noClickCount++;
          btnNo.textContent = CONFIG.noButtonTexts[noClickCount % CONFIG.noButtonTexts.length];

          btnNo.classList.remove("flee");
          void btnNo.offsetWidth;
          btnNo.classList.add("flee");
          setTimeout(() => btnNo.classList.remove("flee"), 200);
        }
      }
    });
  });
}

/* ============ Yes button: Success flow ============ */
function handleYesClick() {
  buttonsWrapperEl.classList.add("hidden");
  successMessageEl.hidden = false;
  successMessageEl.querySelector("p").textContent = CONFIG.successMessage;

  if (CONFIG.enableConfetti && typeof confetti === "function") {
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.6 },
    });
    setTimeout(() => {
      confetti({
        particleCount: 60,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
      });
      confetti({
        particleCount: 60,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
      });
    }, 200);
  }

  // Show pop-up modal
  if (modalOverlay && modalEl) {
    if (modalMessageEl) modalMessageEl.textContent = CONFIG.modal.message;
    const modalTitle = modalEl.querySelector(".modal-title");
    if (modalTitle) modalTitle.textContent = CONFIG.modal.title;
    if (modalBtn) modalBtn.innerHTML = CONFIG.modal.buttonText;
    modalOverlay.hidden = false;
  }
}

function closeModal() {
  if (modalOverlay) modalOverlay.hidden = true;
}

/* ============ Event listeners ============ */
function initEvents() {
  if (btnYes) {
    btnYes.addEventListener("click", handleYesClick);
  }
  if (modalBtn) {
    modalBtn.addEventListener("click", closeModal);
  }
  if (modalOverlay) {
    modalOverlay.addEventListener("click", (e) => {
      if (e.target === modalOverlay) closeModal();
    });
  }
}

/* ============ Run on load ============ */
function init() {
  initText();
  initGallery();
  initNoButtonFlee();
  initEvents();
}

document.addEventListener("DOMContentLoaded", init);
