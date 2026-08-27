document.addEventListener("DOMContentLoaded", () => {
  // 1. Cargar el carrito guardado en localStorage o iniciar vacío
  let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

  // 2. Selección de elementos del DOM
  const cartContainer = document.getElementById("cart-items");
  const cartCount = document.getElementById("cart-count");
  const cartItemCount = document.getElementById("cart-item-count");

  const cartTotals = document.querySelectorAll(".cart-total");
  const selectsEnvio = document.querySelectorAll(".tipo-envio");
  const cartShippingCosts = document.querySelectorAll(".cart-shipping-cost");

  const btnProcederPago =
    document.getElementById("btn-proceder-pago-offcanvas") ||
    document.getElementById("btn-proceder-pago");

  const offcanvasCarritoElement = document.getElementById("offcanvasCarrito");
  const modalCheckoutElement = document.getElementById("modalCheckout");

  const checkoutTotalPrice = document.getElementById("checkout-total-price");
  const formCheckout = document.getElementById("form-checkout");

  // 3. Guardar en localStorage y re-renderizar la vista
  function actualizarCarrito() {
    localStorage.setItem("carrito", JSON.stringify(carrito));
    renderizarCarrito();
  }

  // 4. Formatear precios en pesos colombianos
  function formatearPrecio(valor) {
    return `$ ${Number(valor).toLocaleString("es-CO")}`;
  }

  // 5. Función principal de renderizado
  function renderizarCarrito() {
    if (!cartContainer) return;

    cartContainer.innerHTML = "";
    let sumaProductos = 0;
    let totalUnidades = 0;

    // Caso: Carrito vacío
    if (carrito.length === 0) {
      cartContainer.innerHTML = '<p class="text-center text-muted my-5">El carrito está vacío.</p>';

      cartShippingCosts.forEach((el) => {
        el.innerText = "Gratis";
        el.className = "fw-semibold text-success";
      });
      cartTotals.forEach((el) => (el.innerText = "$ 0"));
      if (cartCount) cartCount.innerText = "0";
      if (cartItemCount) cartItemCount.innerText = "0 productos";
      return;
    }

    // Dibujar cada producto en la lista
    carrito.forEach((producto, index) => {
      const subtotalProducto = producto.precio * producto.cantidad;
      sumaProductos += subtotalProducto;
      totalUnidades += producto.cantidad;

      const itemElement = document.createElement("div");
      itemElement.classList.add("cart-product-item", "d-flex", "align-items-center", "gap-2", "mb-3");
      itemElement.innerHTML = `
        <div class="cart-img-wrapper" style="width: 60px; height: 60px; flex-shrink: 0;">
          <img src="${producto.imagen}" alt="${producto.nombre}" class="img-fluid rounded w-100 h-100 object-fit-cover">
        </div>
        <div class="flex-grow-1">
          <h6 class="cart-product-title mb-1 fw-semibold">${producto.nombre}</h6>
          <div class="cart-product-price text-primary fw-bold">${formatearPrecio(producto.precio)}</div>
          <div class="cart-quantity-controls d-flex align-items-center gap-2 mt-1">
            <button class="btn btn-sm btn-outline-secondary btn-qty btn-restar" data-index="${index}">-</button>
            <span class="qty-number fw-semibold">${producto.cantidad}</span>
            <button class="btn btn-sm btn-outline-secondary btn-qty btn-sumar" data-index="${index}">+</button>
          </div>
        </div>
        <div>
          <button class="btn btn-sm btn-outline-danger btn-eliminar" data-index="${index}" title="Eliminar producto">
            <i class="bi bi-trash"></i>
          </button>
        </div>
      `;
      cartContainer.appendChild(itemElement);
    });

    // Costo de envío según el select activo
    const costoEnvio = selectsEnvio.length > 0 ? Number(selectsEnvio[0].value) || 0 : 0;
    const totalFinal = sumaProductos + costoEnvio;

    // Sincronizar todos los selectores de envío
    selectsEnvio.forEach((select) => {
      select.value = String(costoEnvio);
    });

    // Mostrar costo de envío
    cartShippingCosts.forEach((el) => {
      if (costoEnvio === 0) {
        el.innerText = "Gratis";
        el.className = "fw-semibold text-success";
      } else {
        el.innerText = formatearPrecio(costoEnvio);
        el.className = "fw-semibold text-dark";
      }
    });

    // Totales y contadores
    cartTotals.forEach((el) => (el.innerText = formatearPrecio(totalFinal)));
    if (cartCount) cartCount.innerText = totalUnidades;
    if (cartItemCount) {
      cartItemCount.innerText = `${totalUnidades} ${totalUnidades === 1 ? "producto" : "productos"}`;
    }
  }

  // 6. Cambio en tipo de envío
  selectsEnvio.forEach((select) => {
    select.addEventListener("change", (e) => {
      selectsEnvio.forEach((s) => (s.value = e.target.value));
      renderizarCarrito();
    });
  });

  // 7. Sumar, restar, eliminar productos del carrito
  if (cartContainer) {
    cartContainer.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-index]");
      if (!btn) return;

      const index = parseInt(btn.dataset.index, 10);

      if (btn.classList.contains("btn-sumar")) {
        carrito[index].cantidad++;
      } else if (btn.classList.contains("btn-restar")) {
        if (carrito[index].cantidad > 1) {
          carrito[index].cantidad--;
        } else {
          carrito.splice(index, 1);
        }
      } else if (btn.classList.contains("btn-eliminar")) {
        carrito.splice(index, 1);
      }

      actualizarCarrito();
    });
  }

  // 8. Añadir producto al carrito desde las tarjetas

    document.addEventListener("click", (e) => {
      const card = e.target.closest(".productos-destacados-card");
      if (!card) return;

      const nombreEl = card.querySelector(".nombreProducto") || card.querySelector("span");
      const nombre = nombreEl ? nombreEl.innerText.trim() : "Producto";

      const precioEl = card.querySelector(".Valor") || card.querySelector("strong");
      const precio = precioEl ? Number(precioEl.innerText.replace(/\D/g, "")) || 0 : 0;

      const imgEl = card.querySelector(".img-card img");
      const imagen = imgEl ? imgEl.src : "";

      const existente = carrito.find((item) => item.nombre === nombre);
      if (existente) {
        existente.cantidad++;
      } else {
        carrito.push({ nombre, precio, imagen, cantidad: 1 });
      }

      actualizarCarrito();
    });

  // 9. Botón "Proceder al pago" -> cerrar offcanvas y abrir modal de checkout
  // getOrCreateInstance evita duplicar instancias de Bootstrap (causa de backdrops huérfanos)
  if (btnProcederPago) {
    btnProcederPago.addEventListener("click", () => {
      if (carrito.length === 0) {
        alert("Tu carrito está vacío. Agrega productos para proceder al pago.");
        return;
      }

      if (offcanvasCarritoElement) {
        const bsOffcanvas = bootstrap.Offcanvas.getOrCreateInstance(offcanvasCarritoElement);
        bsOffcanvas.hide();
      }

      if (checkoutTotalPrice && cartTotals.length > 0) {
        checkoutTotalPrice.innerText = cartTotals[0].innerText;
      }

      // Esperamos a que el offcanvas termine de cerrarse antes de abrir
      // el modal, para que Bootstrap no maneje dos backdrops a la vez.
      const abrirModalCheckout = () => {
        if (modalCheckoutElement) {
          const bsModal = bootstrap.Modal.getOrCreateInstance(modalCheckoutElement);
          bsModal.show();
        }
        offcanvasCarritoElement?.removeEventListener("hidden.bs.offcanvas", abrirModalCheckout);
      };

      if (offcanvasCarritoElement) {
        offcanvasCarritoElement.addEventListener("hidden.bs.offcanvas", abrirModalCheckout);
      } else if (modalCheckoutElement) {
        bootstrap.Modal.getOrCreateInstance(modalCheckoutElement).show();
      }
    });
  }

  // 10. Confirmar compra
  if (formCheckout) {
    formCheckout.addEventListener("submit", (e) => {
      e.preventDefault();
      const nombreInput = document.getElementById("nombreCliente");
      const nombre = nombreInput ? nombreInput.value : "Cliente";
      alert(`¡Gracias por tu compra, ${nombre}! En breve nos pondremos en contacto para gestionar el envío.`);

      carrito = [];
      actualizarCarrito();
      formCheckout.reset();

      if (modalCheckoutElement) {
        bootstrap.Modal.getOrCreateInstance(modalCheckoutElement).hide();
      }
    });
  }

  // Carga inicial
  renderizarCarrito();
});

