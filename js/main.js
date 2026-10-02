const NOM = "Alexandre Pech--Rossell";

const PAGES = [
  ["index.html", "Accueil"],
  ["a-propos.html", "À propos"],
  ["projets.html", "Projets"],
  ["construction.html", "Numérique responsable"],
  ["cv.html", "CV"],
  ["contact.html", "Contact"]
];

const current = location.pathname.split("/").pop() || "index.html";
const inProjectsFolder = location.pathname.includes("/projets/");
const root = inProjectsFolder ? "../" : "";


/* ================================
   HEADER + FOOTER
================================ */

function renderShell() {

  const links = PAGES.map(([href, label]) => {

    const active =
      href === current ||
      (inProjectsFolder && href === "projets.html");

    return `
      <li class="nav-item">
        <a
          class="nav-link ${active ? "active" : ""}"
          href="${root}${href}"
          ${active ? 'aria-current="page"' : ""}
        >
          ${label}
        </a>
      </li>
    `;

  }).join("");


  document.querySelector("#site-header").innerHTML = `

    <a class="skip-link" href="#contenu">
      Aller au contenu
    </a>

    <div id="scroll-progress"></div>

    <header class="site-nav">

      <nav
        class="navbar navbar-expand-lg px-3"
        aria-label="Navigation principale"
      >

        <div class="container-fluid px-0">

          <a class="navbar-brand logo" href="${root}index.html">
            ${NOM}
            <span class="logo-dot"></span>
          </a>

          <div class="d-flex align-items-center gap-2 order-lg-3">

            <button
              class="theme-toggle"
              id="themeToggle"
              type="button"
              aria-label="Changer de thème"
              title="Changer de thème"
            >
              ☼
            </button>

            <button
              class="navbar-toggler border-0"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#mainMenu"
              aria-controls="mainMenu"
              aria-expanded="false"
              aria-label="Ouvrir le menu"
            >
              <span class="navbar-toggler-icon"></span>
            </button>

          </div>

          <div
            class="collapse navbar-collapse justify-content-end"
            id="mainMenu"
          >

            <ul class="navbar-nav align-items-lg-center gap-lg-1 mt-3 mt-lg-0">
              ${links}
            </ul>

          </div>

        </div>

      </nav>

    </header>
  `;


  document.querySelector("#site-footer").innerHTML = `

    <footer>

      <div class="container footer-inner">

        <span>
          © ${new Date().getFullYear()}
          ${NOM}
          — Développeur logiciel
        </span>

        <span>

          <a
            href="https://github.com/alexph45"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub ↗
          </a>

          <br>

          <a
            href="https://www.linkedin.com/in/alexandre-pech--rossell/"
            target="_blank"
            rel="noopener noreferrer"
          >
            LinkedIn ↗
          </a>

        </span>

      </div>

    </footer>
  `;
}


/* ================================
   THÈME CLAIR / SOMBRE
================================ */

function initTheme() {

  const saved = localStorage.getItem("portfolio-theme");

  const preferred =
    window.matchMedia("(prefers-color-scheme: dark)").matches;

  const theme =
    saved || (preferred ? "dark" : "light");

  document.documentElement.dataset.theme = theme;


  const button =
    document.querySelector("#themeToggle");


  const update = () => {

    const dark =
      document.documentElement.dataset.theme === "dark";

    button.textContent =
      dark ? "☾" : "☼";

    button.setAttribute(
      "aria-label",
      dark
        ? "Activer le thème clair"
        : "Activer le thème sombre"
    );

  };


  update();


  button.addEventListener("click", () => {

    const next =
      document.documentElement.dataset.theme === "dark"
        ? "light"
        : "dark";

    document.documentElement.dataset.theme = next;

    localStorage.setItem(
      "portfolio-theme",
      next
    );

    update();

  });
}


/* ================================
   BARRE DE PROGRESSION
================================ */

function initScrollProgress() {

  const bar =
    document.querySelector("#scroll-progress");


  const update = () => {

    const max =
      document.documentElement.scrollHeight -
      innerHeight;

    bar.style.width =
      `${max > 0 ? (scrollY / max) * 100 : 0}%`;

  };


  addEventListener(
    "scroll",
    update,
    { passive: true }
  );

  update();
}


/* ================================
   ANIMATIONS REVEAL
================================ */

function initReveal() {

  const items =
    document.querySelectorAll(".reveal");


  if (!("IntersectionObserver" in window)) {

    items.forEach(el =>
      el.classList.add("visible")
    );

    return;
  }


  const observer =
    new IntersectionObserver(
      entries => {

        entries.forEach(entry => {

          if (entry.isIntersecting) {

            entry.target.classList.add("visible");

            observer.unobserve(
              entry.target
            );

          }

        });

      },
      {
        threshold: .12
      }
    );


  items.forEach(el =>
    observer.observe(el)
  );
}


/* ================================
   CURSEUR LUMINEUX
================================ */

function initCursorGlow() {

  if (
    matchMedia("(pointer: coarse)").matches
  ) {
    return;
  }


  const glow =
    document.createElement("div");

  glow.className =
    "cursor-glow";

  document.body.appendChild(glow);


  addEventListener(
    "pointermove",
    e => {

      glow.style.left =
        `${e.clientX}px`;

      glow.style.top =
        `${e.clientY}px`;

    }
  );
}


/* ================================
   ANIMATION CODE
================================ */

function initCodeTyping() {

  const target =
    document.querySelector("[data-typing]");


  if (!target) {
    return;
  }


  const text =
    target.textContent;


  target.textContent = "";


  let i = 0;


  const tick = () => {

    target.textContent =
      text.slice(0, i++);


    if (i <= text.length) {

      setTimeout(
        tick,
        12
      );

    }

  };


  setTimeout(
    tick,
    450
  );
}


/* ================================
   FORMULAIRE DE CONTACT
================================ */

function initContactForm() {

  const form =
    document.querySelector("#contactForm");


  if (!form) {
    return;
  }


  form.addEventListener(
    "submit",
    e => {

      e.preventDefault();


      const data =
        new FormData(form);


      const subject =
        encodeURIComponent(
          `Contact portfolio — ${data.get("nom")}`
        );


      const body =
        encodeURIComponent(
          `Nom : ${data.get("nom")}
Email : ${data.get("email")}

${data.get("message")}`
        );


      window.location.href =
        `mailto:alexandrepech45@gmail.com?subject=${subject}&body=${body}`;

    }
  );
}


/* ================================
   LIGHTBOX DES IMAGES
================================ */

function initImageLightbox() {

  const images =
    document.querySelectorAll(
      ".image-card img"
    );


  if (!images.length) {
    return;
  }


  const lightbox =
    document.createElement("div");

  lightbox.className =
    "image-lightbox";


  lightbox.innerHTML = `

    <button
      class="image-lightbox-close"
      type="button"
      aria-label="Fermer l'image"
    >
      &times;
    </button>

    <img
      src=""
      alt=""
    >

  `;


  document.body.appendChild(
    lightbox
  );


  const lightboxImage =
    lightbox.querySelector("img");


  const closeButton =
    lightbox.querySelector(
      ".image-lightbox-close"
    );


  const closeLightbox = () => {

    lightbox.classList.remove(
      "active"
    );

    document.body.classList.remove(
      "lightbox-open"
    );

  };


  images.forEach(image => {

    image.addEventListener(
      "click",
      () => {

        lightboxImage.src =
          image.src;

        lightboxImage.alt =
          image.alt ||
          "Image agrandie";


        lightbox.classList.add(
          "active"
        );

        document.body.classList.add(
          "lightbox-open"
        );

      }
    );

  });


  closeButton.addEventListener(
    "click",
    closeLightbox
  );


  lightbox.addEventListener(
    "click",
    event => {

      if (
        event.target === lightbox
      ) {
        closeLightbox();
      }

    }
  );


  document.addEventListener(
    "keydown",
    event => {

      if (
        event.key === "Escape" &&
        lightbox.classList.contains("active")
      ) {
        closeLightbox();
      }

    }
  );
}


/* ================================
   INITIALISATION
================================ */

document.addEventListener(
  "DOMContentLoaded",
  () => {

    renderShell();

    initTheme();

    initScrollProgress();

    initReveal();

    initCursorGlow();

    initCodeTyping();

    initContactForm();

    initImageLightbox();

  }
);