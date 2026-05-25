const screens = Array.from(document.querySelectorAll("[data-screen]"));
const screenIds = screens.map((screen) => screen.id);
let lastPinScreen = "he-pin";

const routes = {
  home: "home-he",
  pin: "he-pin",
  success: "thank-you",
  error: "generic-error",
  "home-he": "home-he",
  "he-pin": "he-pin",
  "wifi-phone": "wifi-phone",
  "wifi-invalid-number": "wifi-invalid-number",
  "wifi-pin": "wifi-pin",
  "invalid-pin": "invalid-pin",
  "already-subscribed": "already-subscribed",
  "thank-you": "thank-you",
  "generic-error": "generic-error",
  "billing-error": "billing-error"
};

function resolveScreen(id) {
  return routes[id] || (screenIds.includes(id) ? id : "home-he");
}

function goTo(id, options = {}) {
  const targetId = resolveScreen(id);

  screens.forEach((screen) => {
    screen.classList.toggle("active", screen.id === targetId);
  });

  if (!options.skipHash) {
    history.replaceState(null, "", `#${targetId}`);
  }

  const heading = document.querySelector(`#${targetId} h1, #${targetId} h2`);
  if (heading) {
    heading.setAttribute("tabindex", "-1");
    heading.focus({ preventScroll: true });
  }
}

function normalizeDigits(value) {
  return value.replace(/\D/g, "");
}

function isValidPin(value) {
  const pin = normalizeDigits(value);
  return pin.length >= 4 && pin.length <= 6;
}

function isValidChileanMobile(value) {
  const digits = normalizeDigits(value);
  return /^9\d{8}$/.test(digits);
}

document.addEventListener("click", (event) => {
  const retryPin = event.target.closest("[data-retry-pin]");

  if (retryPin) {
    goTo(lastPinScreen);
    return;
  }

  const trigger = event.target.closest("[data-go]");

  if (!trigger) {
    return;
  }

  goTo(trigger.dataset.go);
});

document.addEventListener("submit", (event) => {
  const form = event.target.closest("[data-form]");

  if (!form) {
    return;
  }

  event.preventDefault();

  if (form.dataset.form === "wifi-phone") {
    const phone = form.elements.phone.value;
    goTo(isValidChileanMobile(phone) ? "wifi-pin" : "wifi-invalid-number");
    return;
  }

  if (form.dataset.form === "wifi-pin") {
    lastPinScreen = "wifi-pin";
  }

  if (form.dataset.form === "he-pin") {
    lastPinScreen = "he-pin";
  }

  if (form.dataset.form === "retry-pin") {
    const pin = form.elements.pin.value;
    goTo(isValidPin(pin) ? "thank-you" : "invalid-pin");
    return;
  }

  const pin = form.elements.pin.value;
  goTo(isValidPin(pin) ? "thank-you" : "invalid-pin");
});

window.addEventListener("hashchange", () => {
  goTo(location.hash.slice(1), { skipHash: true });
});

goTo(location.hash.slice(1) || "home-he", { skipHash: true });
