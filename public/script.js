// Navbar.ejs
const toggler = document.getElementById("burgerToggle");
const collapseTarget = document.getElementById("navbarTogglerDemo02");

toggler.addEventListener("click", () => {
  toggler.classList.toggle("cross");
});

collapseTarget.addEventListener("hidden.bs.collapse", () => {
  toggler.classList.remove("cross");
});

// Transparent navbar
document.addEventListener("DOMContentLoaded", function () {
  const navbar = document.getElementById("mainNavbar");
  const hero = document.getElementById("heroSection");
  if (!navbar || !hero) return;

  const heroHeight = hero.offsetHeight;
  const onScroll = () => {
    if (window.scrollY >= heroHeight) {
      navbar.classList.add("navbar-solid");
      navbar.classList.remove("navbar-transparent");
    } else {
      navbar.classList.add("navbar-transparent");
      navbar.classList.remove("navbar-solid");
    }
  };

  // run on load and on scroll
  onScroll();
  window.addEventListener("scroll", onScroll);
});
// only visible in home page
document.addEventListener("DOMContentLoaded", function () {
  const bodyId = document.body.id;
  const navbar = document.querySelector(".navbar");

  if (bodyId === "homePage") {
    navbar.classList.add("glass-effect");
    navbar.classList.remove("bg-white", "navbar-light");
    navbar.classList.add("navbar-dark");
  } else {
    navbar.classList.remove("glass-effect");
    navbar.classList.add("bg-white", "navbar-light");
    navbar.classList.remove("navbar-dark");
  }
});

//adding countries options in new/edit.ejs
(function () {
  const select = document.getElementById("country");
  const pageType = document.body.dataset.page;
  const selectedCountry = select.getAttribute("data-selected-country");
  countries.forEach((country) => {
    const opt = document.createElement("option");
    opt.value = country;
    opt.textContent = country;
    // Only select India by default on new.ejs
    if (pageType === "new" && country === "India") {
      opt.selected = true;
    }
    // On edit listing: select the current listing.country
    if (pageType === "edit" && country === selectedCountry) {
      opt.selected = true;
    }
    select.appendChild(opt);
  });
})();

(() => {
  "use strict";

  // Select all forms needing Bootstrap validation
  const forms = document.querySelectorAll(".needs-validation");

  Array.from(forms).forEach((form) => {
    form.addEventListener(
      "submit",
      (event) => {
        // If form is invalid, prevent submission and show feedback
        if (!form.checkValidity()) {
          event.preventDefault();
          event.stopPropagation();
        }

        form.classList.add("was-validated");
      },
      false
    );
  });
})();
