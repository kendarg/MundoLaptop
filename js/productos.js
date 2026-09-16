const contenedorProductos = document.querySelector(".section-productos-render");
const API_PRODUCTOS_URL = "https://mundolaptopbackend.onrender.com/api/productos";
const API_MARCAS_URL = "https://mundolaptopbackend.onrender.com/api/marcas";

// Array con tus URLs de imágenes
const imagenesAleatorias = [
    "https://images.unsplash.com/photo-1659135890084-930731031f40?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1555117391-6c0795768da8?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1509701852059-c221a6f1e878?q=80&w=1091&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1580522154071-c6ca47a859ad?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1594892342285-9b86df3ad47a?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDIzfHx8ZW58MHx8fHx8",
    "https://images.unsplash.com/photo-1581225218177-9a18341ec628?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDE5fHx8ZW58MHx8fHx8",
    "https://images.unsplash.com/photo-1644659306528-259903deccde?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDE3fHx8ZW58MHx8fHx8",
    "https://plus.unsplash.com/premium_photo-1723741245145-4a8cb264760d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDI4fHx8ZW58MHx8fHx8",
    "https://images.unsplash.com/photo-1629491697442-7d67fc25d897?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDU3fHx8ZW58MHx8fHx8",
    "https://images.unsplash.com/photo-1734605279008-efae97765402?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDU5fHx8ZW58MHx8fHx8",
    "https://images.unsplash.com/photo-1710787554722-c3abdde09c44?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDYzfHx8ZW58MHx8fHx8",
    "https://images.unsplash.com/photo-1620808629530-736c24a95f4b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDgxfHx8ZW58MHx8fHx8",
    "https://images.unsplash.com/photo-1675868375184-8d711f447b28?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDk4fHx8ZW58MHx8fHx8",
    "https://images.unsplash.com/photo-1634954217272-df0e830c45cc?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDExMXx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1704230972797-e0e3aba0fce7?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDEyNnx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1627513074408-192f520f2887?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDEzOXx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1697890666011-3edef3dba2a4?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDE3NXx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1583273501577-e50488d12359?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDE4M3x8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1761123044903-1671e0edc3f6?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDJ8fHxlbnwwfHx8fHw%3D",
    "https://images.unsplash.com/photo-1618245894354-283c69d5d1e6?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDExfHx8ZW58MHx8fHx8",
    "https://images.unsplash.com/photo-1544980919-e17526d4ed0a?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDQ3fHx8ZW58MHx8fHx8",
    "https://images.unsplash.com/photo-1536724609414-5f000e9a2745?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDQ5fHx8ZW58MHx8fHx8",
    "https://images.unsplash.com/photo-1763568258458-ef825ca23fdd?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDUzfHx8ZW58MHx8fHx8",
    "https://images.unsplash.com/photo-1681583721832-7260a39e88f9?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDUwfHx8ZW58MHx8fHx8",
    "https://images.unsplash.com/photo-1595234336271-178875797b4d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDU5fHx8ZW58MHx8fHx8"
];

async function agregarProductosAdmin() {
    if (!contenedorProductos) return;

    try {
        const [respuestaProductos, respuestaMarcas] = await Promise.all([
            fetch(API_PRODUCTOS_URL),
            fetch(API_MARCAS_URL)
        ]);
        if (!respuestaProductos.ok || !respuestaMarcas.ok) {
            throw new Error("No se pudieron cargar los productos y las marcas");
        }

        const productos = await respuestaProductos.json();
        const marcas = await respuestaMarcas.json();
        const marcasPorId = new Map(
            marcas.map((marca) => [String(marca.id), marca.nombre || marca.nombreMarca])
        );

        productos.forEach((producto, indice) => {
        const precioFormateado = Number(producto.precio).toLocaleString("es-CO");

        const urlAleatoria = imagenesAleatorias[indice % imagenesAleatorias.length];
        const marca = producto.marca?.nombre
            || producto.marcaNombre
            || marcasPorId.get(String(producto.marcaId))
            || (typeof producto.marca === "string" ? producto.marca : "");
        const condicion = (producto.condicion || producto.repotenciado || "nuevo")
            .toLowerCase()
            .replace("_", " ");
        const especificaciones = typeof producto.especificaciones === "string"
            ? JSON.parse(producto.especificaciones || "{}")
            : producto.especificaciones || {};
        const especificacionesHTML = Object.entries(especificaciones)
            .map(([clave, valor]) => `<span>${clave} - ${valor}</span>`)
            .join(" - ");

        const imagenProducto = producto.imagen || urlAleatoria;
        const sinStock = Number(producto.stock) === 0;

        const cardHTML = `
            <div class="col" data-source="admin" data-precio="${producto.precio}"
                        data-marca="${marca ? marca.toUpperCase() : ""}" data-categoria="${condicion}">
                <div class="productos-destacados-card${sinStock ? " sin-stock" : ""}">
                    <div class="img-card">
                        <img src="${imagenProducto}" alt="${producto.nombre}">
                    </div>
                    <div class="informacion-card">
                        ${marca ? `<span><strong class="Marcas">${marca.toUpperCase()}</strong></span>` : ""}
                        <span class="nombreProducto"><strong>${producto.nombre}</strong></span>
                        ${especificacionesHTML ? `<div class="especificaciones-card">${especificacionesHTML}</div>` : ""}
                        <div class="producto-footer">
                            <span><strong class="Valor">$ ${precioFormateado} COP</strong></span>
                            <button class="${sinStock ? "boton-no-disponible" : ""}" data-id="${producto.id}"${sinStock ? " disabled" : ""}>
                                ${sinStock ? "No disponible" : '<img src="../assets/inicio/carrito.svg" alt="carrito"> Agregar al carrito'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        contenedorProductos.insertAdjacentHTML("beforeend", cardHTML);
        });
    } catch (error) {
        console.error("Error al cargar productos del inventario:", error);
    }
}

document.addEventListener("DOMContentLoaded", agregarProductosAdmin);

document.addEventListener("click", (event) => {
    const cartButton = event.target.closest(".productos-destacados-card button:not(.boton-no-disponible)");
    if (!cartButton) return;

    cartButton.classList.remove("cart-button-shake");
    void cartButton.offsetWidth;
    cartButton.classList.add("cart-button-shake");
});

// funcion enlace para ordenar productos segun opcion ordenar pg productos
// se agrego datos en la tarjeta para ordenar

const opcionesOrden = document.querySelectorAll("[data-orden]");
const contenedor = document.querySelector(".section-productos-render");

opcionesOrden.forEach(opcion => {

    opcion.addEventListener("click", (e) => {
        e.preventDefault();

        const criterio = opcion.dataset.orden;
        const tarjetas = Array.from(
            contenedor.querySelectorAll(".col")
        );
        tarjetas.sort((a, b) => {

            switch (criterio) {
                case "menor-precio":
                    return Number(a.dataset.precio) -
                           Number(b.dataset.precio);

                case "mayor-precio":
                    return Number(b.dataset.precio) -
                           Number(a.dataset.precio);

                case "popular":
                    return Number(b.dataset.popularidad) -
                           Number(a.dataset.popularidad);

                case "recientes":
                    return new Date(b.dataset.fecha) -
                           new Date(a.dataset.fecha);

                default:
                    return 0;
            }
        });

        contenedor.innerHTML = "";
        tarjetas.forEach(tarjeta => {
            contenedor.appendChild(tarjeta);
        });
    });
});

//se agrega lectura de los checkbox para el diltro en pg productos 
//se ejecutara filtrar marca cada vez que se de click a un checkbox

const checkboxesMarca = document.querySelectorAll(
    'input[name="marca"]'
);

let categoriaSeleccionada = "";

function normalizarMarca(valor) {
    const marca = String(valor || "")
        .trim()
        .replace(/\s+/g, " ")
        .toLocaleUpperCase("es-CO");

    return marca === "ACCER" ? "ACER" : marca;
}

function normalizarCategoria(valor) {
    const categoria = String(valor || "")
        .trim()
        .toUpperCase()
        .replace(/[-\s]+/g, "_");

    return categoria === "REACONDICIONADO" ? "REPOTENCIADO" : categoria;
}

function aplicarFiltros() {
    const marcasSeleccionadas = Array.from(
        document.querySelectorAll('input[name="marca"]:checked')
    ).map((check) => normalizarMarca(check.value));
    const hayFiltrosActivos = marcasSeleccionadas.length > 0 || categoriaSeleccionada;

    document.querySelectorAll(".section-productos-render .col").forEach((producto) => {
        if (producto.dataset.source !== "admin") {
            producto.style.display = hayFiltrosActivos ? "none" : "";
            return;
        }

        const marcaProducto = normalizarMarca(producto.dataset.marca);
        const categoriaProducto = normalizarCategoria(producto.dataset.categoria);
        const coincideMarca = marcasSeleccionadas.length === 0 || marcasSeleccionadas.includes(marcaProducto);
        const coincideCategoria = !categoriaSeleccionada || categoriaProducto === categoriaSeleccionada;

        producto.style.display = coincideMarca && coincideCategoria ? "" : "none";
    });
}

checkboxesMarca.forEach(checkbox => {
    checkbox.addEventListener("change", filtrarMarcas);
});

function filtrarMarcas() {
    aplicarFiltros();
}

// funcion para filtrar por categorias , pasar a checkbox
const filtrosCategoria = document.querySelectorAll(".filtro-categoria");

filtrosCategoria.forEach(filtro => {

    filtro.addEventListener("click", (e) => {
        e.preventDefault();

        categoriaSeleccionada = normalizarCategoria(filtro.dataset.categoria);
        aplicarFiltros();
    });
});