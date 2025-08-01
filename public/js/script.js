// public/js/script.js

document.addEventListener("DOMContentLoaded", () => {
  ("use strict");
  // ────────────────────────────────────────────────────────────────────────────
  // Page pre-loader
  const loaderContainer = document.querySelector(".loader-container");

  // Hide loader once the page and all its content (images, etc.) are fully loaded.
  if (loaderContainer) {
    window.addEventListener("load", () => {
      loaderContainer.classList.add("hidden");
    });
  }

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
        } else {
          // On valid submission, show the loader while the server processes the request.
          if (loaderContainer) {
            loaderContainer.classList.remove("hidden");
          }
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
      } else {
        // Also show loader for review submission
        if (loaderContainer) {
          loaderContainer.classList.remove("hidden");
        }
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

  // ────────────────────────────────────────────────────────────────────────────
  // Read more section in comment in show.ejs
  const toggles = document.querySelectorAll(".read-more-toggle");

  toggles.forEach((btn) => {
    btn.addEventListener("click", () => {
      const p = btn.previousElementSibling;
      const fullText = p.getAttribute("data-full");

      if (btn.textContent === "Read more") {
        p.textContent = fullText;
        btn.textContent = "Read less";
      } else {
        p.textContent = fullText.slice(0, 200) + "...";
        btn.textContent = "Read more";
      }
    });
  });

  // ────────────────────────────────────────────────────────────────────────────
  // Map
  const mapEl = document.getElementById("map");
  if (!mapEl) return;

  const lat = parseFloat(mapEl.dataset.lat);
  const lng = parseFloat(mapEl.dataset.lng);
  const title = mapEl.dataset.title;
  const location = mapEl.dataset.location;

  if (isNaN(lat) || isNaN(lng)) {
    console.error("Invalid coordinates provided for map.");
    return;
  }

  const map = L.map("map", { scrollWheelZoom: false }).setView([lat, lng], 10);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap contributors",
    maxZoom: 18,
  }).addTo(map);

  L.marker([lat, lng])
    .addTo(map)
    .bindPopup(`<strong>${title}</strong><br>${location}`)
    .openPopup();
});
