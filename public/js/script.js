// public/js/script.js

document.addEventListener("DOMContentLoaded", () => {
  ("use strict");

  // ────────────────────────────────────────────────────────────────────────────
  // Navbar toggle icon animation
  const toggler = document.getElementById("burgerToggle");
  const collapseTarget = document.getElementById("navbarTogglerDemo02");
  if (toggler && collapseTarget) {
    toggler.addEventListener("click", () => toggler.classList.toggle("cross"));
    collapseTarget.addEventListener("hidden.bs.collapse", () =>
      toggler.classList.remove("cross")
    );
  }

  // ────────────────────────────────────────────────────────────────────────────
  // Transparent ↔ Solid navbar on scroll
  const navbar = document.getElementById("mainNavbar");
  const hero = document.getElementById("heroSection");
  const userIcon = document.querySelector(".user-icon");

  if (navbar && hero) {
    const heroHeight = hero.offsetHeight;
    const onScroll = () => {
      navbar.classList.toggle("navbar-solid", window.scrollY >= heroHeight);
      navbar.classList.toggle(
        "navbar-transparent",
        window.scrollY < heroHeight
      );
      // Toggle icon color
      if (userIcon) {
        userIcon.classList.toggle("text-dark", window.scrollY >= heroHeight);
        userIcon.classList.toggle("text-white", window.scrollY < heroHeight);
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll);
  }

  // ────────────────────────────────────────────────────────────────────────────
  // Glass‑effect on home page
  if (navbar) {
    if (document.body.id === "homePage") {
      navbar.classList.add("glass-effect", "navbar-dark");
      navbar.classList.remove("bg-white", "navbar-light");
    } else {
      navbar.classList.remove("glass-effect", "navbar-dark");
      navbar.classList.add("bg-white", "navbar-light");
    }
  }

  // ────────────────────────────────────────────────────────────────────────────
  // Populate country dropdown on new/edit listings
  const select = document.getElementById("country");
  if (select && Array.isArray(countries)) {
    const pageType = document.body.dataset.page;
    const selectedCountry = select.getAttribute("data-selected-country");

    countries.forEach((country) => {
      const opt = document.createElement("option");
      opt.value = country;
      opt.textContent = country;

      // Default selection logic
      if (pageType === "new" && country === "India") {
        opt.selected = true;
      }
      if (pageType === "edit" && country === selectedCountry) {
        opt.selected = true;
      }

      select.appendChild(opt);
    });
  }

  // ────────────────────────────────────────────────────────────────────────────
  // Bootstrap form validation (all .needs-validation)
  const forms = document.querySelectorAll(".needs-validation");
  Array.from(forms).forEach((form) => {
    form.addEventListener(
      "submit",
      (e) => {
        if (!form.checkValidity()) {
          e.preventDefault();
          e.stopPropagation();
        }
        form.classList.add("was-validated");
      },
      false
    );
  });

  // ────────────────────────────────────────────────────────────────────────────
  // Review‑form custom validation (on show.ejs)
  const reviewForm = document.getElementById("reviewForm");
  if (reviewForm) {
    const feedback = document.getElementById("reviewFeedback");
    reviewForm.addEventListener("submit", (e) => {
      const rating = reviewForm.querySelector(
        'input[name="review[rating]"]:checked'
      );
      const comment = reviewForm.querySelector("#comment").value.trim();
      if (!rating || comment === "") {
        e.preventDefault();
        e.stopPropagation();
        feedback.style.display = "block";
      }
      reviewForm.classList.add("was-validated");
    });
    // hide feedback as soon as user interacts
    reviewForm
      .querySelectorAll('input[name="review[rating]"], #comment')
      .forEach((input) =>
        input.addEventListener("input", () => (feedback.style.display = "none"))
      );
  }
});
