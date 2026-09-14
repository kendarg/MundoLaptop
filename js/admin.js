// Configuración de la URL base del Backend API
const API_URL = "http://localhost:8080/api/productos";
const API_CATEGORIAS_URL = "http://localhost:8080/api/categorias";
const API_MARCAS_URL = "http://localhost:8080/api/marcas";

// Referencias a elementos del DOM
const tablaProductosBody = document.querySelector(".tareas");
const formProducto = document.querySelector(".formulario");
const modalProducto = document.getElementById("modalProducto");
const btnAbrirModal = document.getElementById("abrirFormulario");
const btnCerrarModal = document.getElementById("cerrarFormulario");
const contenedorEspecificaciones = document.getElementById("contenedorEspecificaciones");
const btnAgregarEspec = document.getElementById("btnAgregarEspec");

// Cargar productos y catálogos al cargar el documento
document.addEventListener("DOMContentLoaded", () => {
    cargarProductos();
    cargarCategorias();
    cargarMarcas();
    configurarEventosModal();
    configurarEspecificacionesDinamicas();
});

// Función auxiliar para obtener las cabeceras con el JWT
function getAuthHeaders() {
    const token = localStorage.getItem("token");
    return {
        "Content-Type": "application/json",
        "Authorization": token ? `Bearer ${token}` : ""
    };
}

// ==========================================
// 1. OBTENER Y MOSTRAR CATÁLOGOS (GET Categorías y Marcas)
// ==========================================
async function cargarCategorias() {
    const selectCategoria = document.getElementById("Categoria");
    if (!selectCategoria) return;

    try {
        const respuesta = await fetch(API_CATEGORIAS_URL);
        if (!respuesta.ok) throw new Error("Error al obtener categorías");

        const categorias = await respuesta.json();

        selectCategoria.innerHTML = '<option value="" disabled selected>Seleccionar...</option>';

        categorias.forEach(cat => {
            const option = document.createElement("option");
            option.value = cat.id; 
            option.textContent = cat.nombre || cat.nombreCategoria;
            selectCategoria.appendChild(option);
        });
    } catch (error) {
        console.error("Error al cargar categorías:", error);
    }
}

async function cargarMarcas() {
    const selectMarca = document.getElementById("marca");
    if (!selectMarca) return;

    try {
        const respuesta = await fetch(API_MARCAS_URL);
        if (!respuesta.ok) throw new Error("Error al obtener marcas");

        const marcas = await respuesta.json();

        selectMarca.innerHTML = '<option value="" disabled selected>Seleccionar...</option>';

        marcas.forEach(m => {
            const option = document.createElement("option");
            option.value = m.id;
            option.textContent = m.nombre || m.nombreMarca;
            selectMarca.appendChild(option);
        });
    } catch (error) {
        console.error("Error al cargar marcas:", error);
    }
}

// ==========================================
// 2. OBTENER Y MOSTRAR PRODUCTOS (GET)
// ==========================================
async function cargarProductos() {
    try {
        const respuesta = await fetch(API_URL);
        if (!respuesta.ok) throw new Error("Error al consultar productos");
        
        const productos = await respuesta.json();
        renderizarTabla(productos);
    } catch (error) {
        console.error("Error al cargar productos:", error);
    }
}

function renderizarTabla(productos) {
    if (!tablaProductosBody) return;
    tablaProductosBody.innerHTML = ""; // Limpiar tabla

    productos.forEach(prod => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${prod.id}</td>
            <td>${prod.nombre}</td>
            <td>${prod.numeroSerie || 'N/A'}</td>
            <td>${prod.categoria?.nombre || prod.categoria || ''}</td>
            <td>${prod.marca?.nombre || prod.marca || ''}</td>
            <td>$${prod.precio}</td>
            <td>${prod.stock}</td>
            <td>${prod.condicion || prod.repotenciado || 'NUEVO'}</td>
            <td>
                <span class="badge ${prod.stock > 0 ? 'bg-success' : 'bg-danger'}">
                    ${prod.stock > 0 ? 'Disponible' : 'Agotado'}
                </span>
            </td>
            <td>
                <button class="btn btn-sm btn-warning me-1" onclick="prepararEdicion(${prod.id})">
                    <i class="bi bi-pencil-square"></i>
                </button>
                <button class="btn btn-sm btn-danger" onclick="eliminarProducto(${prod.id})">
                    <i class="bi bi-trash-fill"></i>
                </button>
            </td>
        `;
        tablaProductosBody.appendChild(tr);
    });
}

// ==========================================
// 3. CREAR O ACTUALIZAR PRODUCTO (POST / PUT)
// ==========================================
if (formProducto) {
    formProducto.addEventListener("submit", async (e) => {
        e.preventDefault();

        const token = localStorage.getItem("token");
        if (!token) {
            alert("No tienes una sesión activa. Por favor inicia sesión como administrador.");
            return;
        }

        const catValue = document.getElementById("Categoria")?.value;
        const marcaValue = document.getElementById("marca")?.value;

        if (!catValue || !marcaValue) {
            alert("Por favor selecciona una categoría y una marca válidas.");
            return;
        }

        const especificaciones = {};
        document.querySelectorAll(".fila-especificacion").forEach(row => {
            const clave = row.querySelector(".espec-clave")?.value.trim();
            const valor = row.querySelector(".espec-valor")?.value.trim();
            if (clave && valor) especificaciones[clave] = valor;
        });

        // Objeto construido tal como lo espera el controlador de Java
        const productoData = {
            nombre: document.getElementById("nombreProducto")?.value.trim(),
            numeroSerie: document.getElementById("numeroSerie")?.value.trim(),
            precio: parseFloat(document.getElementById("Precio")?.value || 0),
            stock: parseInt(document.getElementById("Stock")?.value || 0),
            condicion: document.getElementById("repotenciado")?.value || "NUEVO",
            especificaciones: especificaciones,
            categoriaId: parseInt(catValue),
            marcaId: parseInt(marcaValue)
        };

        const idProducto = formProducto.dataset.id;
        const metodo = idProducto ? "PUT" : "POST";
        const url = idProducto ? `${API_URL}/${idProducto}` : API_URL;

        try {
            const respuesta = await fetch(url, {
                method: metodo,
                headers: getAuthHeaders(),
                body: JSON.stringify(productoData)
            });

            if (respuesta.ok) {
                formProducto.reset();
                delete formProducto.dataset.id;
                if (modalProducto) modalProducto.style.display = "none";
                if (contenedorEspecificaciones) contenedorEspecificaciones.innerHTML = "";
                cargarProductos();
            } else {
                const errorData = await respuesta.json().catch(() => ({}));
                console.error("Error en la solicitud:", respuesta.status, errorData);
                
                if (respuesta.status === 401 || respuesta.status === 403) {
                    alert(errorData.error || "Sesión expirada o no tienes permisos de administrador.");
                } else {
                    alert("Ocurrió un error al procesar el producto (HTTP " + respuesta.status + "). Revisa los datos ingresados.");
                }
            }
        } catch (error) {
            console.error("Error al guardar el producto:", error);
        }
    });
}

// ==========================================
// 4. ELIMINAR PRODUCTO (DELETE)
// ==========================================
async function eliminarProducto(id) {
    if (!confirm("¿Estás seguro de eliminar este producto?")) return;

    const token = localStorage.getItem("token");
    if (!token) {
        alert("Debes estar autenticado para realizar esta acción.");
        return;
    }

    try {
        const respuesta = await fetch(`${API_URL}/${id}`, {
            method: "DELETE",
            headers: getAuthHeaders()
        });

        if (respuesta.ok) {
            cargarProductos();
        } else {
            const errorData = await respuesta.json().catch(() => ({}));
            alert(errorData.error || "No fue posible eliminar el producto.");
        }
    } catch (error) {
        console.error("Error en servidor al eliminar:", error);
    }
}

// ==========================================
// 5. EDICIÓN DE PRODUCTO
// ==========================================
async function prepararEdicion(id) {
    try {
        await cargarCategorias();
        await cargarMarcas();

        const respuesta = await fetch(`${API_URL}/${id}`);
        if (!respuesta.ok) throw new Error("No se pudo obtener la información del producto");

        const producto = await respuesta.json();

        if (document.getElementById("nombreProducto")) document.getElementById("nombreProducto").value = producto.nombre || "";
        if (document.getElementById("numeroSerie")) document.getElementById("numeroSerie").value = producto.numeroSerie || "";
        
        if (document.getElementById("Categoria")) document.getElementById("Categoria").value = producto.categoria?.id || producto.categoriaId || producto.categoria || "";
        if (document.getElementById("marca")) document.getElementById("marca").value = producto.marca?.id || producto.marcaId || producto.marca || "";
        
        if (document.getElementById("Precio")) document.getElementById("Precio").value = producto.precio || 0;
        if (document.getElementById("Stock")) document.getElementById("Stock").value = producto.stock || 0;
        if (document.getElementById("repotenciado")) document.getElementById("repotenciado").value = producto.condicion || producto.repotenciado || "NUEVO";

        formProducto.dataset.id = producto.id;

        if (modalProducto) modalProducto.style.display = "block";
    } catch (error) {
        console.error("Error al obtener producto para edición:", error);
    }
}

// ==========================================
// 6. MANEJO DE COMPONENTES DE LA INTERFAZ
// ==========================================
function configurarEventosModal() {
    if (btnAbrirModal) {
        btnAbrirModal.addEventListener("click", () => {
            if (formProducto) formProducto.reset();
            if (formProducto) delete formProducto.dataset.id;
            if (contenedorEspecificaciones) contenedorEspecificaciones.innerHTML = "";
            cargarCategorias();
            cargarMarcas();
            if (modalProducto) modalProducto.style.display = "block";
        });
    }

    if (btnCerrarModal) {
        btnCerrarModal.addEventListener("click", () => {
            if (modalProducto) modalProducto.style.display = "none";
        });
    }
}

function configurarEspecificacionesDinamicas() {
    if (btnAgregarEspec) {
        btnAgregarEspec.addEventListener("click", () => {
            const div = document.createElement("div");
            div.className = "d-flex gap-2 mb-2 fila-especificacion";
            div.innerHTML = `
                <input type="text" class="form-control espec-clave" placeholder="Propiedad (ej: RAM)">
                <input type="text" class="form-control espec-valor" placeholder="Valor (ej: 16GB)">
                <button type="button" class="btn btn-outline-danger btn-sm" onclick="this.parentElement.remove()">
                    <i class="bi bi-x-lg"></i>
                </button>
            `;
            if (contenedorEspecificaciones) contenedorEspecificaciones.appendChild(div);
        });
    }
}