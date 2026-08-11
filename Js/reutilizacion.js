async function loadComponents() {
  if (window.location.protocol === "file:") {
    document.body.insertAdjacentHTML(
      "afterbegin",
      `<div style="background:#fbbf24;color:#111;padding:12px;text-align:center;font-family:sans-serif;">
        No abras el archivo directo. Usa <strong>Live Server</strong>
        o ejecuta: <code>python -m http.server 5500</code>
      </div>`
    );
    return;
  }

  const placeholders = document.querySelectorAll("[data-include]");

  await Promise.all(
    [...placeholders].map(async (el) => {
      const file = el.getAttribute("data-include");
      try {
        const response = await fetch(file);
        if (!response.ok) {
          throw new Error(`No se pudo cargar ${file}`);
        }
        el.outerHTML = await response.text();
      } catch (error) {
        console.error(error);
        el.innerHTML = `<p style="color:#f87171;text-align:center;padding:1rem;">Error al cargar: ${file}</p>`;
      }
    })
  );

  markActiveNavLink();
}

function markActiveNavLink() {
  const page = document.body.getAttribute("data-page");
  if (!page) return;

  document.querySelectorAll(".barraNavegacion a[data-page]").forEach((link) => {
    if (link.getAttribute("data-page") === page) {
      link.classList.add("active");
    }
  });
}

document.addEventListener("DOMContentLoaded", loadComponents);
