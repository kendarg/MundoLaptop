
const inventario = JSON.parse(localStorage.getItem("inventario")) || [];


const contenedorProductos = document.querySelector(".section-productos-render");

function agregarProductosAdmin() {

    if (inventario.length === 0) return;
    inventario.forEach(producto => {
        const precioFormateado = Number(producto.precio).toLocaleString("es-CO");
        const imagenProducto = producto.imagen || "/img/productos/dell-xps-13-ultrabook.png";

        const cardHTML = `
            <div class="col">
                <div class="productos-destacados-card">
                    <div class="img-card">
                        <img src="${imagenProducto}" alt="${producto.nombre}">
                    </div>
                    <span><strong>${producto.marca ? producto.marca.toUpperCase() : "GENERAL"}</strong></span>
                    <span class="nombreProducto">${producto.nombre}</span>
                    <span><strong class="Valor">$ ${precioFormateado} COP</strong></span>
                    <button data-id="${producto.id}">
                        <img src="/assets/inicio/carrito.svg" alt="carrito"> Agregar al carrito
                    </button>
                </div>
            </div>
        `;
        contenedorProductos.insertAdjacentHTML("beforeend", cardHTML);
    });
}

document.addEventListener("DOMContentLoaded", agregarProductosAdmin);