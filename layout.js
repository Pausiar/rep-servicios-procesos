const NAV_ITEMS = [
  { page: "dashboard", href: "index.html", label: "Panel" },
  { page: "practice", href: "ejercicios.html", label: "Ejercicios" },
  { page: "temario", href: "temario.html", label: "Temario" },
  { page: "patterns", href: "patrones.html", label: "Patrones" },
  { page: "exam", href: "simulacro.html", label: "Simulacro" },
  { page: "mistakes", href: "fallos.html", label: "Fallos" },
];

const TEMARIO_LINKS = [
  { id: "streams", label: "Streams" },
  { id: "method", label: "Method ref" },
  { id: "atomic", label: "Atomic" },
  { id: "concurrent", label: "Concurrent" },
  { id: "socket", label: "ServerSocket" },
];

function initLayout() {
  const page = document.body.dataset.page;
  const nav = document.getElementById("main-nav");
  const sideLinks = document.getElementById("side-links");
  const root = window.APP_ROOT || "";

  if (nav) {
    nav.innerHTML = NAV_ITEMS.map(
      (item) => `
        <a class="nav-button${item.page === page ? " is-active" : ""}" href="${root}${item.href}">
          ${item.label}
        </a>
      `
    ).join("");
  }

  if (sideLinks) {
    sideLinks.innerHTML = TEMARIO_LINKS.map(
      (item) => `<a href="${root}temario.html#${item.id}">${item.label}</a>`
    ).join("");
  }
}

initLayout();
