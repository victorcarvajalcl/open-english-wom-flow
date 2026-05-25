document.addEventListener("DOMContentLoaded", () => {
  const groups = document.querySelectorAll(".input-group");
  const links = document.querySelectorAll("a[href]");
  const forms = document.querySelectorAll("form[data-next]");

  groups.forEach((group) => {
    const input = group.querySelector("input");

    if (!input) {
      return;
    }

    input.addEventListener("focus", () => group.classList.add("focused"));
    input.addEventListener("blur", () => group.classList.remove("focused"));
  });

  forms.forEach((form) => {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      navigateWithFade(form.dataset.next);
    });
  });

  links.forEach((link) => {
    const href = link.getAttribute("href");

    if (!href || href.startsWith("http") || href.startsWith("mailto:") || href.startsWith("tel:")) {
      return;
    }

    link.addEventListener("click", (event) => {
      event.preventDefault();
      navigateWithFade(href);
    });
  });
});

function navigateWithFade(url) {
  if (!url) {
    return;
  }

  document.body.classList.add("is-leaving");
  window.setTimeout(() => {
    window.location.href = url;
  }, 170);
}
