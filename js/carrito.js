document.addEventListener("DOMContentLoaded", () => {
  // 1. Cargar el carrito guardado en localStorage o iniciar vacío
  let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

  // Verificar si el usuario está autenticado/registrado
  function esUsuarioRegistrado() {
    return localStorage.getItem("isAuthenticated") === "true";
  }

  // 2. Formatear precios en pesos colombianos
  function formatearPrecio(valor) {
    return `$ ${Number(valor).toLocaleString("es-CO")}`;
  }

  // 3. Guardar en localStorage y re-renderizar la vista
  function actualizarCarrito() {
    localStorage.setItem("carrito", JSON.stringify(carrito));
    renderizarCarrito();
  }

  // 4. Función principal de renderizado
  function renderizarCarrito() {
    const cartContainer = document.getElementById("cart-items");
    const cartCount = document.getElementById("cart-count");
    const cartItemCount = document.getElementById("cart-item-count");
    const cartTotals = document.querySelectorAll(".cart-total");
    const selectsEnvio = document.querySelectorAll(".tipo-envio");
    const cartShippingCosts = document.querySelectorAll(".cart-shipping-cost");

    // Seleccionar la etiqueta del título del Offcanvas
    const cartTitle = document.getElementById("offcanvasCarritoLabel") || document.querySelector("#offcanvasCarrito .offcanvas-title");

    if (!cartContainer) return; // el include del navbar aún no cargó

    // Cambiar dinámicamente el título si hay un usuario logueado
    const usuarioLogueado = esUsuarioRegistrado();
    const nombreUsuario = localStorage.getItem("userName");

    if (cartTitle) {
      if (usuarioLogueado && nombreUsuario) {
        const nombreFormateado = nombreUsuario.charAt(0).toUpperCase() + nombreUsuario.slice(1);
        cartTitle.innerHTML = `<i class="bi bi-cart3 me-2"></i>Carrito de ${nombreFormateado}`;
      } else {
        cartTitle.innerHTML = `<i class="bi bi-cart3 me-2"></i>Tu Carrito`;
      }
    }

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

      const avisoViejo = document.getElementById("aviso-descuento");
      if (avisoViejo) avisoViejo.remove();
      return;
    }

    // Dibujar cada producto en la lista
    carrito.forEach((producto, index) => {
      // Aplicar 10% de descuento solo a usuarios registrados
      const precioConDescuento = usuarioLogueado ? producto.precio * 0.90 : producto.precio;
      const subtotalProducto = precioConDescuento * producto.cantidad;

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
          <div class="cart-product-price  fw-bold">
            ${
              usuarioLogueado
                ? `<span class="text-decoration-line-through text-muted me-1 small">${formatearPrecio(producto.precio)}</span>
                   <span>${formatearPrecio(precioConDescuento)}</span>
                   <span class="badge bg-success ms-1">-10%</span>`
                : formatearPrecio(producto.precio)
            }
          </div>
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

    // Mostrar banner informativo del 10% de descuento
    let avisoDescuento = document.getElementById("aviso-descuento");
    if (usuarioLogueado) {
      if (!avisoDescuento) {
        avisoDescuento = document.createElement("div");
        avisoDescuento.id = "aviso-descuento";
        avisoDescuento.className = "alert alert-success py-2 px-3 mb-3 text-center small fw-semibold";
        avisoDescuento.innerHTML = '<i class="bi bi-tag-fill me-1"></i> ¡Descuento del 10% aplicado por estar registrado!';
        cartContainer.prepend(avisoDescuento);
      }
    } else if (avisoDescuento) {
      avisoDescuento.remove();
    }

    // Costo de envío según el select activo
    const costoEnvio = selectsEnvio.length > 0 ? Number(selectsEnvio[0].value) || 0 : 0;
    const totalFinal = sumaProductos + costoEnvio;

    // Sincronizar selectores de envío
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

  // 5. Cambio en tipo de envío (delegado en document)
  document.addEventListener("change", (e) => {
    if (!e.target.classList.contains("tipo-envio")) return;
    document.querySelectorAll(".tipo-envio").forEach((s) => (s.value = e.target.value));
    renderizarCarrito();
  });

  // 6. Listener único delegado en document para clics
  document.addEventListener("click", (e) => {
    // Sumar / restar / eliminar dentro del carrito
    const btnQty = e.target.closest("[data-index]");
    if (btnQty && btnQty.closest("#cart-items")) {
      const index = parseInt(btnQty.dataset.index, 10);

      if (btnQty.classList.contains("btn-sumar")) {
        carrito[index].cantidad++;
      } else if (btnQty.classList.contains("btn-restar")) {
        if (carrito[index].cantidad > 1) {
          carrito[index].cantidad--;
        } else {
          carrito.splice(index, 1);
        }
      } else if (btnQty.classList.contains("btn-eliminar")) {
        carrito.splice(index, 1);
      }

      actualizarCarrito();
      return;
    }

    // Añadir producto desde las tarjetas
    const card = e.target.closest(".productos-destacados-card");
    if (card) {
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
      return;
    }

   // Botón "Proceder al pago"
    const btnPago = e.target.closest("#btn-proceder-pago-offcanvas, #btn-proceder-pago");
    if (btnPago) {
      if (carrito.length === 0) {
        Swal.fire({
          position: "top",
          icon: "warning",
          title: "Tu carrito está vacío",
          text: "Agrega productos para proceder al pago.",
          showConfirmButton: false,
          timer: 2000
        });
        return;
      }

      const offcanvasCarritoElement = document.getElementById("offcanvasCarrito");
      const modalCheckoutElement = document.getElementById("modalCheckout");
      const checkoutTotalPrice = document.getElementById("checkout-total-price");
      const cartTotals = document.querySelectorAll(".cart-total");

      if (checkoutTotalPrice && cartTotals.length > 0) {
        checkoutTotalPrice.innerText = cartTotals[0].innerText;
      }

      const abrirModalCheckout = () => {
        if (modalCheckoutElement) {
          const bsModal = bootstrap.Modal.getOrCreateInstance(modalCheckoutElement);
          bsModal.show();
        }
        offcanvasCarritoElement?.removeEventListener("hidden.bs.offcanvas", abrirModalCheckout);
      };

      if (offcanvasCarritoElement && offcanvasCarritoElement.classList.contains("show")) {
        offcanvasCarritoElement.addEventListener("hidden.bs.offcanvas", abrirModalCheckout);
        const bsOffcanvas = bootstrap.Offcanvas.getOrCreateInstance(offcanvasCarritoElement);
        bsOffcanvas.hide();
      } else if (modalCheckoutElement) {
        bootstrap.Modal.getOrCreateInstance(modalCheckoutElement).show();
      }
    }
  });

  // 7. Confirmar compra
  document.addEventListener("submit", (e) => {
    if (e.target.id !== "form-checkout") return;
    e.preventDefault();

    const nombreInput = document.getElementById("nombreCliente");
    const nombre = nombreInput ? nombreInput.value : "Cliente";

    const modalCheckoutElement = document.getElementById("modalCheckout");
    if (modalCheckoutElement) {
      bootstrap.Modal.getOrCreateInstance(modalCheckoutElement).hide();
    }

    Swal.fire({
     iconHtml: '<i class="bi bi-truck text-success display-4"></i>', // Icono de furgón/camión
      customClass: {
        icon: 'border-0' // Quita el borde circular predeterminado
      },
      title: `Gracias por tu compra ${nombre}`,
      html: `
        <p class="mb-1">En breve nos pondremos en contacto para gestionar el envio</p>
        <div class="mt-3 p-2 bg-light rounded text-muted small">
          <i class="bi bi-box-seam me-1"></i> Tu pedido ya esta listo para ser procesado
        </div>
      `,
      confirmButtonText: 'Excelente',
      confirmButtonColor: "#198754"
    });

    carrito = [];
    actualizarCarrito();
    e.target.reset();
  });

  // 8. Carga inicial
  renderizarCarrito();

  // 9. Observer para navbar inyectado asíncronamente
  if (!document.getElementById("cart-items")) {
    const observer = new MutationObserver(() => {
      if (document.getElementById("cart-items")) {
        renderizarCarrito();
        observer.disconnect();
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });
  }
});