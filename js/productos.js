const inventario = JSON.parse(localStorage.getItem("inventario")) || [];
const contenedorProductos = document.querySelector(".section-productos-render");

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

function agregarProductosAdmin() {
    if (inventario.length === 0) return;

    inventario.forEach(producto => {
        const precioFormateado = Number(producto.precio).toLocaleString("es-CO");

        // Selecciona una URL al azar del array
        const urlAleatoria = imagenesAleatorias[Math.floor(Math.random() * imagenesAleatorias.length)];

        const imagenProducto = producto.imagen || urlAleatoria || "/img/pc2.png";

        const cardHTML = `
            <div class="col" data-precio="${producto.precio}"
                        data-marca="${producto.marca?.toUpperCase() || 'GENERAL'}" data-categoria="${producto.categoria?.toLowerCase() || 'nuevo'}">
                <div class="productos-destacados-card">
                    <div class="img-card">
                        <img src="${imagenProducto}" alt="${producto.nombre}">
                    </div>
                    <div class="informacion-card">
                        <span><strong>${producto.marca ? producto.marca.toUpperCase() : "GENERAL"}<p class="nombreProducto">${producto.nombre}</p></strong></span>
                        
                        <span><strong class="Valor">$ ${precioFormateado} COP</strong></span>
                        <button data-id="${producto.id}">
                            <img src="../assets/inicio/carrito.svg" alt="carrito"> Agregar al carrito
                        </button>
                    </div>
                </div>
            </div>
        `;
        contenedorProductos.insertAdjacentHTML("beforeend", cardHTML);
    });
}

document.addEventListener("DOMContentLoaded", agregarProductosAdmin);

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

checkboxesMarca.forEach(checkbox => {
    checkbox.addEventListener("change", filtrarMarcas);
});

function filtrarMarcas() {

    // Marcas seleccionadas con checkbox
    const marcasSeleccionadas = Array.from(
        document.querySelectorAll(
            'input[name="marca"]:checked'
        )
    ).map(check => check.value.toUpperCase());

    // Todas las tarjetas
    const productos = document.querySelectorAll(".col");


    // funcion para filtrar por checkbox
    productos.forEach(producto => {

        const marcaProducto =
            producto.dataset.marca;

        producto.style.display =
            marcasSeleccionadas.length === 0 ||
            marcasSeleccionadas.includes(marcaProducto)
                ? ""
                : "none";
    });

    //   ↓↓↓  ESTA FUNCION DEBERIA SER ELIMINADA SI EL INVENTARIO SOLO TIENE
    // PRODUCTOS LLAMADOS DESDE LA TABLA EN ADMIN, YA QUE ESTA FUNCION ES  PARA FILTRAR
    // LOS PRODUCTOS QUE FUERON HARCODEADOS POR WALTER 
    productos.forEach(producto => {

        const marcaProducto = producto
            .querySelector(".Marcas")
            .textContent
            .trim()
            .toUpperCase();

        // Si no hay filtros seleccionados, mostrar todo en pg productos
        if (marcasSeleccionadas.length === 0) {
            producto.style.display = "";
            return;
        }

        // Mostrar solo las marcas seleccionadas con checkbox
        if (marcasSeleccionadas.includes(marcaProducto)) {
            producto.style.display = "";
        } else {
            producto.style.display = "none";
        }
    });
}

// funcion para filtrar por categorias , pasar a checkbox
const filtrosCategoria = document.querySelectorAll(".filtro-categoria");

filtrosCategoria.forEach(filtro => {

    filtro.addEventListener("click", (e) => {
        e.preventDefault();

        const categoriaSeleccionada = filtro.dataset.categoria;
        const productos = document.querySelectorAll(".col");

        productos.forEach(producto => {
            const categoriaProducto =
                producto.dataset.categoria;
            if (categoriaProducto === categoriaSeleccionada) {
                producto.style.display = "";
            } else {
                producto.style.display = "none";
            }
        });
    });
});