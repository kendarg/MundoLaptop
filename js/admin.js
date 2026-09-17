// Configuración de la URL base del Backend API
const API_URL = "https://mundolaptopbackend.onrender.com/api/productos";
const API_CATEGORIAS_URL = "https://mundolaptopbackend.onrender.com/api/categorias";
const API_MARCAS_URL = "https://mundolaptopbackend.onrender.com/api/marcas";
const API_USUARIOS_URL = "https://mundolaptopbackend.onrender.com/api/usuarios";

// Referencias a elementos del DOM
const tablaProductosBody = document.querySelector(".tareas");
const formProducto = document.querySelector(".formulario");
const modalProducto = document.getElementById("modalProducto");
const btnAbrirModal = document.getElementById("abrirFormulario");
const btnCerrarModal = document.getElementById("cerrarFormulario");
const contenedorEspecificaciones = document.getElementById("contenedorEspecificaciones");
const btnAgregarEspec = document.getElementById("btnAgregarEspec");


document.addEventListener("DOMContentLoaded", async () => {
    await cargarCategorias();
    await cargarMarcas();
    await cargarProductos();
    configurarEventosModal();
    configurarEspecificacionesDinamicas();

    // ==========================================
    // INICIALIZACIÓN DE LA NAVEGACIÓN DINÁMICA (SPA)
    // ==========================================
    configurarNavegacionAdmin();
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
// 1. OBTENER Y MOSTRAR CATÁLOGOS (GET Categorías y Marcas para selects)
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
        const response = await fetch("https://mundolaptopbackend.onrender.com/api/productos"); // Reemplaza con tu URL
        const data = await response.json();

        console.log("Estructura completa de la respuesta JSON:", data);
        if (data.length > 0) {
            console.log("Primer producto obtenido:", data[0]);
        }

        renderizarTabla(data);
    } catch (error) {
        console.error("Error al cargar productos:", error);
    }
}

function renderizarTabla(productos) {
    const tablaBody = document.querySelector(".tareas");
    if (!tablaBody) return;
    tablaBody.innerHTML = ""; // Limpiar tabla

    const selectCategoria = document.getElementById("Categoria");
    const selectMarca = document.getElementById("marca");

    const mapaCategorias = {};
    if (selectCategoria) {
        Array.from(selectCategoria.options).forEach(opt => {
            if (opt.value) mapaCategorias[opt.value] = opt.textContent;
        });
    }

    const mapaMarcas = {};
    if (selectMarca) {
        Array.from(selectMarca.options).forEach(opt => {
            if (opt.value) mapaMarcas[opt.value] = opt.textContent;
        });
    }

    productos.forEach(prod => {
        const serie = prod.numeroserie || prod.numeroSerie || 'N/A';

        const catId = prod.categoriaId || prod.categoria?.id || prod.categoria;
        const nombreCategoria = mapaCategorias[catId]
            || prod.categoriaNombre
            || prod.categoria?.nombre
            || `Categoría #${catId}`;

        const marcaId = prod.marcaId || prod.marca?.id || prod.marca;
        const nombreMarca = mapaMarcas[marcaId]
            || prod.marcaNombre
            || prod.marca?.nombre
            || `Marca #${marcaId}`;

        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${prod.id}</td>
            <td>${prod.nombre}</td>
            <td>${serie}</td>
            <td>${nombreCategoria}</td>
            <td>${nombreMarca}</td>
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
        tablaBody.appendChild(tr);
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
                Swal.fire({
                iconHtml: '<i class="bi bi-slash-circle text-warning     display-4"></i>',
                customClass: {
                icon: 'border-0'
                },
                title: 'Acceso Denegado',
                text: errorData.error || "Sesión expirada o no tienes permisos de administrador.",
                target: document.getElementById('modalProducto')
                });
                    // alert(errorData.error || "Sesión expirada o no tienes permisos de administrador.");
                } else {
                    Swal.fire({
                iconHtml: '<i class="bi bi-exclamation-octagon text-danger display-1"></i>',
                customClass: {
                icon: 'border-0'
                },
                title: 'Error',
                text: "Ocurrió un error al procesar el producto (HTTP " + respuesta.status + "). Revisa los datos ingresados.",
                target: document.getElementById('modalProducto')
            });
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

    const token = localStorage.getItem("token");
    if (!token) {
        Swal.fire({
            iconHtml: '<i class="bi bi-exclamation-octagon text-danger display-1"></i>',
            customClass: {
                icon: 'border-0'
            },
            text: "Debes estar autenticado para realizar esta acción.",
        });
        return;
    }

    const resultado = await Swal.fire({
        iconHtml: '<i class="bi bi-exclamation-triangle text-warning display-4"></i>',
        customClass: {
            icon: 'border-0'
        },
        title: '¿Estas seguro?',
        text: "¿Estás seguro de eliminar este producto?",
        showCancelButton: true,
        confirmButtonText: 'Si eliminar',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#dc3545',
        cancelButtonColor: '#6c757d',
    });

    if (!resultado.isConfirmed) {
        return; 
    }

    try {
        const respuesta = await fetch(`${API_URL}/${id}`, {
            method: "DELETE",
            headers: getAuthHeaders()
        });

        if (respuesta.ok) {
            Swal.fire({
                icon: 'success',
                title: '¡Eliminado!',
                text: 'El producto ha sido borrado con exito 🗑️.',
                timer: 2000,
                showConfirmButton: false,
            });
            cargarProductos();
        } else {
            const errorData = await respuesta.json().catch(() => ({}));
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: errorData.error || "No fue posible eliminar el producto.",
            });
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
        if (document.getElementById("numeroSerie")) {
            document.getElementById("numeroSerie").value = producto.numeroSerie || producto.numeroserie || "";
        }

        if (document.getElementById("Categoria")) document.getElementById("Categoria").value = producto.categoria?.id || producto.categoriaId || producto.categoria || "";
        if (document.getElementById("marca")) document.getElementById("marca").value = producto.marca?.id || producto.marcaId || producto.marca || "";

        if (document.getElementById("Precio")) document.getElementById("Precio").value = producto.precio || 0;
        if (document.getElementById("Stock")) document.getElementById("Stock").value = producto.stock || 0;
        if (document.getElementById("repotenciado")) document.getElementById("repotenciado").value = producto.condicion || producto.repotenciado || "NUEVO";

        const especificaciones = typeof producto.especificaciones === "string"
            ? JSON.parse(producto.especificaciones || "{}")
            : producto.especificaciones || {};
        renderizarEspecificaciones(especificaciones);

        formProducto.dataset.id = producto.id;

        if (modalProducto) modalProducto.style.display = "block";
    } catch (error) {
        console.error("Error al obtener producto para edición:", error);
    }
}

function crearFilaEspecificacion(clave = "", valor = "") {
    const div = document.createElement("div");
    div.className = "d-flex gap-2 mb-2 fila-especificacion";
    div.innerHTML = `
        <input type="text" class="form-control espec-clave" placeholder="Propiedad (ej: RAM)" value="${clave}">
        <input type="text" class="form-control espec-valor" placeholder="Valor (ej: 16GB)" value="${valor}">
        <button type="button" class="btn btn-outline-danger btn-sm" onclick="this.parentElement.remove()">
            <i class="bi bi-x-lg"></i>
        </button>
    `;
    return div;
}

function renderizarEspecificaciones(especificaciones) {
    if (!contenedorEspecificaciones) return;

    contenedorEspecificaciones.innerHTML = "";
    Object.entries(especificaciones).forEach(([clave, valor]) => {
        contenedorEspecificaciones.appendChild(crearFilaEspecificacion(clave, valor));
    });
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
            if (modalProducto) modalProducto.style.display = "flex";
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
            if (contenedorEspecificaciones) {
                contenedorEspecificaciones.appendChild(crearFilaEspecificacion());
            }
        });
    }
}



async function crearNuevaMarca(nombreMarca) {
    if (!nombreMarca || nombreMarca.trim() === "") {
        Swal.fire({
                iconHtml: '<i class="bi bi-exclamation-octagon text-danger display-1"></i>',
                customClass: {
                icon: 'border-0'
                },
                title: 'Error',
                text: "El nombre de la marca no puede estar vacío.",
                target: document.getElementById('modalProducto')
                });
        // alert("El nombre de la marca no puede estar vacío.");
        return;
    }

    // Estructura que espera MarcaRequestDTO en el Backend
    const marcaData = {
        nombre: nombreMarca.trim()
    };

    try {
        const respuesta = await fetch(API_MARCAS_URL, {
            method: "POST",
            headers: getAuthHeaders(),
            body: JSON.stringify(marcaData)
        });

        if (respuesta.ok) {
            // Actualizar tabla de marcas y los selectores del formulario de productos
            await cargarMarcasTabla();
            await cargarMarcas();
            Swal.fire({
                icon: 'success',
                title: 'Creacion',
                text: 'Marca creada con éxito 🎉',
                timer: 1500,
                // target: document.getElementById('modalProducto')
            });
            // alert("Marca creada con éxito 🎉");
        } else {
            const errorData = await respuesta.json().catch(() => ({}));
            console.error("Error al crear marca:", respuesta.status, errorData);
            Swal.fire({
                icon: 'error',
                title: 'Creacion',
                text: errorData.message || errorData.error || "No se pudo crear la marca. Verifica que no esté duplicada.",
                target: document.getElementById('modalProducto')
            });
            // alert(errorData.message || errorData.error || "No se pudo crear la marca. Verifica que no esté duplicada.");
        }
    } catch (error) {
        console.error("Error de red al crear la marca:", error);
        alert("Ocurrió un error al conectar con el servidor.");
    }
}
async function crearNuevaCategoria(nombreCategoria) {
    if (!nombreCategoria || nombreCategoria.trim() === "") {
        alert("El nombre de la categoría no puede estar vacío.");
        return;
    }

    // Estructura que espera CategoriaRequestDTO en el Backend
    const categoriaData = {
        nombre: nombreCategoria.trim()
    };

    try {
        const respuesta = await fetch(API_CATEGORIAS_URL, {
            method: "POST",
            headers: getAuthHeaders(),
            body: JSON.stringify(categoriaData)
        });

        if (respuesta.ok) {
            // Actualizar tabla de categorías y los selectores del formulario de productos
            await cargarCategoriasTabla();
            await cargarCategorias();
            Swal.fire({
                icon: "success",
                title: 'Creacion',
                text: "Categoría creada con éxito 🎉",
                showConfirmButton: false,
                timer: 1500
            });
            // alert("Categoría creada con éxito 🎉");
        } else {
            const errorData = await respuesta.json().catch(() => ({}));
            console.error("Error al crear categoría:", respuesta.status, errorData);
            Swal.fire({
                icon: "error",
                title: 'Error',
                text: errorData.message || errorData.error || "No se pudo crear la categoría. Verifica que no esté duplicada.",
                target: document.getElementById('modalProducto')
            });
            // alert(errorData.message || errorData.error || "No se pudo crear la categoría. Verifica que no esté duplicada.");
        }
    } catch (error) {
        console.error("Error de red al crear la categoría:", error);
        alert("Ocurrió un error al conectar con el servidor.");
    }
}




async function cargarCategoriasTabla() {
    try {
        const respuesta = await fetch(API_CATEGORIAS_URL);
        if (!respuesta.ok) throw new Error("Error al obtener categorías");
        const categorias = await respuesta.json();

        const tbody = document.getElementById("tablaCategorias");
        if (!tbody) return;
        tbody.innerHTML = "";

        categorias.forEach(cat => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${cat.id}</td>
                <td>${cat.nombre || cat.nombreCategoria}</td>
                <td>${cat.descripcion || 'General'}</td>
                <td><span class="badge bg-success">Activo</span></td>
                <td>
                    <!-- Botón Editar con atributos de datos -->
                    <button class="btn btn-sm btn-warning me-1 btn-editar-categoria" 
                            data-id="${cat.id}" 
                            data-nombre="${cat.nombre || cat.nombreCategoria}">
                        <i class="bi bi-pencil-square"></i>
                    </button>
                    <!-- Botón Eliminar con data-id -->
                    <button class="btn btn-sm btn-danger btn-eliminar-categoria" 
                            data-id="${cat.id}">
                        <i class="bi bi-trash-fill"></i>
                    </button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    } catch (error) {
        console.error("Error al cargar la tabla de categorías:", error);
    }
}

async function cargarMarcasTabla() {
    try {
        const respuesta = await fetch(API_MARCAS_URL);
        if (!respuesta.ok) throw new Error("Error al obtener marcas");
        const marcas = await respuesta.json();

        const tbody = document.getElementById("tablaMarcas");
        if (!tbody) return;
        tbody.innerHTML = "";

        marcas.forEach(marca => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${marca.id}</td>
                <td>${marca.nombre || marca.nombreMarca}</td>
                <td>${marca.descripcion || 'General'}</td>
                <td><span class="badge bg-success">Activo</span></td>
                <td>
                    <!-- Botón Editar con datos de marca -->
                    <button class="btn btn-sm btn-warning me-1 btn-editar-marca" 
                            data-id="${marca.id}" 
                            data-nombre="${marca.nombre || marca.nombreMarca}">
                        <i class="bi bi-pencil-square"></i>
                    </button>
                    <!-- Botón Eliminar corregido con marca.id -->
                    <button class="btn btn-sm btn-danger btn-eliminar-marca" 
                            data-id="${marca.id}">
                        <i class="bi bi-trash-fill"></i>
                    </button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    } catch (error) {
        console.error("Error al cargar la tabla de marcas:", error);
    }
}

async function actualizarMarca(id, nuevoNombre) {
    if (!nuevoNombre || nuevoNombre.trim() === "") return;

    try {
        const respuesta = await fetch(`${API_MARCAS_URL}/${id}`, {
            method: "PUT",
            headers: getAuthHeaders(), // Incluye Content-Type y Token JWT si aplica
            body: JSON.stringify({ nombre: nuevoNombre.trim() })
        });

        if (respuesta.ok) {
            await cargarMarcasTabla();
            if (typeof cargarMarcas === "function") await cargarMarcas(); // Refrescar selects
            Swal.fire({
                icon: "success",
                title: 'Actualizacion',
                text: "Marca actualizada correctamente 🎉",
                timer: 1500
            });
            // alert("Marca actualizada correctamente 🎉");
        } else {
            const errorData = await respuesta.json().catch(() => ({}));
            Swal.fire({
                icon: "error",
                title: 'Actualizacion',
                text: errorData.message || "Error al actualizar la marca.",
                timer: 1500
            });
            // alert(errorData.message || "Error al actualizar la marca.");
        }
    } catch (error) {
        console.error("Error al actualizar marca:", error);
    }
}

async function actualizarUsuario(id, nuevoNombre) {
    if (!nuevoNombre || nuevoNombre.trim() === "") return;

    try {
        const respuesta = await fetch(`${API_USUARIOS_URL}/${id}`, {
            method: "PUT",
            headers: getAuthHeaders(), // Incluye Content-Type y Token JWT si aplica
            body: JSON.stringify({ nombre: nuevoNombre.trim() })
        });

        if (respuesta.ok) {
            await cargarUsuariosTabla();
            if (typeof cargarUsuarios === "function") await cargarUsuarios(); // Refrescar selects
                Swal.fire({
                icon: "success",
                title: 'Actualizacion',
                text: "Usuario actualizado correctamente 🎉",
                timer: 1500
            });
            
            // alert("Usuario actualizado correctamente 🎉");
        } else {
            const errorData = await respuesta.json().catch(() => ({}));
            Swal.fire({
                icon: "error",
                title: 'Actualizacion',
                text: errorData.message || "Error al actualizar el usuario.",
                timer: 1500
            });
            // alert(errorData.message || "Error al actualizar el usuario.");
        }
    } catch (error) {
        console.error("Error al actualizar usuario:", error);
    }
}

async function actualizarCategoria(id, nuevoNombre) {
    if (!nuevoNombre || nuevoNombre.trim() === "") return;

    try {
        const respuesta = await fetch(`${API_CATEGORIAS_URL}/${id}`, {
            method: "PUT",
            headers: getAuthHeaders(), // Incluye Content-Type y Token JWT si aplica
            body: JSON.stringify({ nombre: nuevoNombre.trim() })
        });

        if (respuesta.ok) {
            await cargarCategoriasTabla();
            if (typeof cargarCategorias === "function") await cargarCategorias(); // Refrescar selects
            Swal.fire({
                icon: "success",
                title: 'Cambio de Rol',
                text: "Categoría actualizada correctamente 🎉",
                timer: 1500
            });
            // alert("Categoría actualizada correctamente 🎉");
        } else {
            const errorData = await respuesta.json().catch(() => ({}));
            alert(errorData.message || "Error al actualizar la categoría.");
        }
    } catch (error) {
        console.error("Error al actualizar categoría:", error);
    }
}


async function cambiarRolUsuario(id, nuevoRol) {
    if (!nuevoRol) return;

    try {
        const respuesta = await fetch(`${API_USUARIOS_URL}/${id}/rol`, {
            method: "PATCH",
            headers: getAuthHeaders(),
            body: JSON.stringify({ rol: nuevoRol })
        });

        if (respuesta.ok) {
            await cargarUsuariosTabla();
            Swal.fire({
                icon: "success",
                title: 'Cambio de Rol',
                text: "Rol de usuario actualizado correctamente 🎉",
            });
            // alert("Rol de usuario actualizado correctamente 🎉");
        } else {
            const errorData = await respuesta.json().catch(() => ({}));
             Swal.fire({
                icon: "error",
                title: 'Cambio de Rol',
                text: errorData.message || "Error al actualizar el rol del usuario.",
                timer: 1500
            });
            // alert(errorData.message || "Error al actualizar el rol del usuario.");
        }
    } catch (error) {
        console.error("Error al actualizar rol de usuario:", error);
    }
}

// ==========================================
// ELIMINAR USUARIO (DELETE /api/usuarios/{id})
// ==========================================
async function eliminarUsuario(id) {
    const resultado = await Swal.fire({
    iconHtml: '<i class="bi bi-exclamation-triangle text-warning display-4"></i>',
    customClass: {
        icon: 'border-0'
    },
    title: '¿Estás seguro?',
    text: "¿Deseas eliminar este usuario?",
    showCancelButton: true,
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar',
    confirmButtonColor: '#dc3545',
    cancelButtonColor: '#6c757d'
});

if (!resultado.isConfirmed) return;
    // if (!confirm("¿Deseas eliminar este usuario?")) return;

    try {
        const respuesta = await fetch(`${API_USUARIOS_URL}/${id}`, {
            method: "DELETE",
            headers: getAuthHeaders()
        });

        if (respuesta.status === 204 || respuesta.ok) {
            await cargarUsuariosTabla();
             Swal.fire({
                icon: "success",
                title: 'Eliminacion',
                text: "Usuario eliminado con éxito 🗑️",
                timer: 1500
            });
            // alert("Usuario eliminado con éxito 🗑️");
        } else {
             Swal.fire({
                icon: "error",
                title: 'Cambio de Rol',
                text: "No se pudo eliminar el usuario.",
                timer: 1500
            });
            // alert("No se pudo eliminar el usuario.");
        }
    } catch (error) {
        console.error("Error al eliminar usuario:", error);
    }
}


// ==========================================
// Categoria
// ==========================================

async function eliminarCategoria(id) {
        const resultado = await Swal.fire({
        iconHtml: '<i class="bi bi-exclamation-triangle text-warning display-4"></i>',
        customClass: {
            icon: 'border-0'
        },
        title: '¿Estás seguro?',
        text: "¿Deseas eliminar este producto?",
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#dc3545',
        cancelButtonColor: '#6c757d'
    });
    if (!resultado.isConfirmed) return;
    // if (!confirm("¿Deseas eliminar esta categoría?")) return;

    try {
        const respuesta = await fetch(`${API_CATEGORIAS_URL}/${id}`, {
            method: "DELETE",
            headers: getAuthHeaders()
        });

        if (respuesta.status === 204 || respuesta.ok) {
            await cargarCategoriasTabla();
            if (typeof cargarCategorias === "function") await cargarCategorias();
                Swal.fire({
                    icon: "success",
                    title: 'Eliminacion',
                    text: "Categoría eliminada con éxito 🗑️",
                    timer: 1500
                });
            // alert("Categoría eliminada con éxito 🗑️");
        } else {
            Swal.fire({
                    icon: "error",
                    title: 'Eliminacion',
                    text: "No se pudo eliminar la categoría (puede que tenga productos asociados).",
                    timer: 1500
                });
            // alert("No se pudo eliminar la categoría (puede que tenga productos asociados).");
        }
    } catch (error) {
        console.error("Error al eliminar categoría:", error);
    }
}




async function eliminarMarca(id) {
     const resultado = await Swal.fire({
        iconHtml: '<i class="bi bi-exclamation-triangle text-warning display-4"></i>',
        customClass: {
            icon: 'border-0'
        },
        title: '¿Estás seguro?',
        text: "¿Deseas eliminar esta marca?",
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#dc3545',
        cancelButtonColor: '#6c757d'
    });
    if (!resultado.isConfirmed) return;
    // if (!confirm("¿Deseas eliminar esta marca?")) return;

    try {
        const respuesta = await fetch(`${API_MARCAS_URL}/${id}`, {
            method: "DELETE",
            headers: getAuthHeaders()
        });

        if (respuesta.status === 204 || respuesta.ok) {
            await cargarMarcasTabla();
            if (typeof cargarMarcas === "function") await cargarMarcas();
            Swal.fire({
                icon: 'success',
                title: '¡Eliminado!',
                text: 'Marca eliminada con éxito 🗑️',
                timer: 1500,
                showConfirmButton: false,
            });
            // alert("Marca eliminada con éxito 🗑️");
        } else {
            alert("No se pudo eliminar la marca (puede que tenga productos asociados).");
        }
    } catch (error) {
        console.error("Error al eliminar marca:", error);
    }
}


async function cargarUsuariosTabla() {
    try {
        const respuesta = await fetch(API_USUARIOS_URL, {
            headers: getAuthHeaders()
        });
        if (!respuesta.ok) throw new Error("Error al obtener usuarios");
        const usuarios = await respuesta.json();

        const tbody = document.getElementById("tablaUsuarios");
        if (!tbody) return;
        tbody.innerHTML = "";

        usuarios.forEach(u => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${u.id}</td>
                <td>${u.email || u.nombre || 'Sin email'}</td>
                <td><span class="badge bg-secondary">${u.rol}</span></td>
                <td><span class="badge bg-success">Activo</span></td>
                <td>
                    <!-- Agregadas la clase btn-editar-usuario y los data attributes -->
                    <button class="btn btn-sm btn-warning me-1 btn-editar-usuario" 
                            data-id="${u.id}" 
                            data-rol="${u.rol}">
                        <i class="bi bi-pencil-square"></i>
                    </button>
                    <!-- Agregadas la clase btn-eliminar-usuario y el data-id -->
                    <button class="btn btn-sm btn-danger btn-eliminar-usuario" 
                            data-id="${u.id}">
                        <i class="bi bi-trash-fill"></i>
                    </button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    } catch (error) {
        console.error("Error al cargar la tabla de usuarios:", error);
    }
}
// ==========================================
// 8. ENRUTADOR DINÁMICO SPA (Manejo de Vista central)
// ==========================================
function configurarNavegacionAdmin() {
    const contenedorCentral = document.getElementById("contenidoDinamico");
    const linksNavegacion = document.querySelectorAll(".nav-link-admin");

    if (!contenedorCentral || linksNavegacion.length === 0) return;

    const vistas = {
        productos: `
            <div class="p-4">
                <div class="d-flex justify-content-between align-items-center">
                    <h4 class="fw-bold tituloProductos">Productos</h4>
                </div>
                <div class="d-flex justify-content-between align-items-center">
                    <p class="subtitulopanel" id="subtituloP" >Administra, agrega, edita o elimina productos.</p>
                </div>
                <div class="table-responsive">
                    <table class="tablaInventario table table-hover">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Nombre</th>
                                <th>Serie</th>
                                <th>Categoría</th>
                                <th>Marca</th>
                                <th>Precio</th>
                                <th>Stock</th>
                                <th>Repotenciado</th>
                                <th>Estado</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody class="tareas"></tbody>
                    </table>
                </div>
            </div>
        `,
        marcas: `
    <div class="p-4">
        <div class="d-flex justify-content-between align-items-center">
            <h4 class="fw-bold tituloProductos">Marcas</h4>
            <button id="btnNuevaMarca" class="btn btn-primary btn-sm">
                <i class="bi bi-plus-lg"></i> Nueva Marca
            </button>
        </div>
        <div class="d-flex justify-content-between align-items-center">
            <p class="subtitulopanel" id="subtituloP">Clasificación de productos disponibles.</p>
        </div>
        <div class="table-responsive">
            <table class="tablaInventario table table-hover">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nombre Marca</th>
                        <th>Descripción</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody id="tablaMarcas"></tbody>
            </table>
        </div>
    </div>
`,
        categorias: `
    <div class="p-4">
        <div class="d-flex justify-content-between align-items-center">
            <h4 class="fw-bold tituloProductos">Categorías</h4>
            <button id="btnNuevaCategoria" class="btn btn-primary btn-sm">
                <i class="bi bi-plus-lg"></i> Nueva Categoría
            </button>
        </div>
        <div class="d-flex justify-content-between align-items-center">
            <p class="subtitulopanel" id="subtituloP">Clasificación de productos disponibles.</p>
        </div>
        <div class="table-responsive">
            <table class="tablaInventario table table-hover">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nombre Categoría</th>
                        <th>Descripción</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody id="tablaCategorias"></tbody>
            </table>
        </div>
    </div>
`,
        usuarios: `
            <div class="p-4">
                <div class="d-flex justify-content-between align-items-center">
                    <h4 class="fw-bold tituloProductos">Usuarios</h4>
                </div>
                <div class="d-flex justify-content-between align-items-center">
                    <p class="subtitulopanel" id="subtituloP">Administración de accesos y permisos.</p>
                </div>
                <div class="table-responsive">
                    <table class="tablaInventario table table-hover">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Email / Usuario</th>
                                <th>Rol</th>
                                <th>Estado</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody id="tablaUsuarios"></tbody>
                    </table>
                </div>
            </div>
        `
    };

    linksNavegacion.forEach(link => {
        link.addEventListener("click", async (e) => {
            e.preventDefault();

            linksNavegacion.forEach(l => l.classList.remove("active"));
            link.classList.add("active");

            const nombreVista = link.getAttribute("data-vista");

            if (vistas[nombreVista]) {
                contenedorCentral.innerHTML = vistas[nombreVista];

                // Consumir el endpoint adecuado al cambiar de vista
                if (nombreVista === "productos") {
                    await cargarProductos();
                } else if (nombreVista === "marcas") {
                    await cargarMarcasTabla();
                } else if (nombreVista === "categorias") {
                    await cargarCategoriasTabla();
                } else if (nombreVista === "usuarios") {
                    await cargarUsuariosTabla();
                }
            }
        });
    });

    // Instancia del modal de Bootstrap
    const modalEditarElement = document.getElementById('modalEditarCategoria');
    const modalEditar = new bootstrap.Modal(modalEditarElement);

    // Event Listener para abrir el Modal y cargar los datos
    document.addEventListener("click", (e) => {
        const btnEditar = e.target.closest(".btn-editar-categoria");
        if (btnEditar) {
            const id = btnEditar.dataset.id;
            const nombreActual = btnEditar.dataset.nombre;

            // Asignar los valores a los inputs del modal
            document.getElementById("editCategoriaId").value = id;
            document.getElementById("editCategoriaNombre").value = nombreActual;

            // Abrir el modal
            modalEditar.show();
        }
    });

    // Listener para abrir el Modal y cargar los datos de la Marca
    document.addEventListener("click", (e) => {
        const btnEditar = e.target.closest(".btn-editar-marca");
        if (btnEditar) {
            const id = btnEditar.dataset.id;
            const nombreActual = btnEditar.dataset.nombre;

            // Obtener elementos del DOM
            const inputId = document.getElementById("editMarcaId");
            const inputNombre = document.getElementById("editMarcaNombre");
            const modalElement = document.getElementById("modalEditarMarca");

            if (inputId && inputNombre && modalElement) {
                inputId.value = id;
                inputNombre.value = nombreActual || "";

                // Obtener o crear la instancia de Bootstrap sin romper si es dinámico
                const modalEditar = bootstrap.Modal.getOrCreateInstance(modalElement);
                modalEditar.show();
            } else {
                console.error("No se encontraron los elementos del modal de editar marca en el DOM.");
            }
        }
    });

    // Listener para el botón "Guardar Cambios"
    document.getElementById("btnGuardarMarca")?.addEventListener("click", async () => {
        const inputId = document.getElementById("editMarcaId");
        const inputNombre = document.getElementById("editMarcaNombre");

        if (!inputId || !inputNombre) return;

        const id = inputId.value;
        const nuevoNombre = inputNombre.value;

        if (!nuevoNombre || !nuevoNombre.trim()) {
            alert("El nombre de la marca no puede estar vacío.");
            return;
        }

        // Petición al backend
        await actualizarMarca(id, nuevoNombre.trim());

        // Cerrar modal
        const modalElement = document.getElementById("modalEditarMarca");
        if (modalElement) {
            const modalEditar = bootstrap.Modal.getInstance(modalElement);
            modalEditar?.hide();
        }
    });


    // Event Listener para el botón "Guardar Cambios" dentro del Modal
    document.getElementById("btnGuardarCategoria").addEventListener("click", async () => {
        const id = document.getElementById("editCategoriaId").value;
        const nuevoNombre = document.getElementById("editCategoriaNombre").value;

        if (!nuevoNombre || !nuevoNombre.trim()) {
            alert("El nombre de la categoría no puede estar vacío.");
            return;
        }

        // Ejecutar la petición al backend
        await actualizarCategoria(id, nuevoNombre.trim());

        // Cerrar el modal
        modalEditar.hide();
    });


    document.addEventListener("click", async (e) => {
        const btn = e.target.closest("#btnNuevaMarca");
        if (btn) {

            const inputNombre = document.getElementById("nombreMarcaInput");
            if (inputNombre) inputNombre.value = "";

            // Abrir el modal de Bootstrap
            const modalElemento = document.getElementById("modalNuevaMarca");
            const modalInstance = bootstrap.Modal.getOrCreateInstance(modalElemento);
            modalInstance.show();
        }

        const btnEliminar = e.target.closest(".btn-eliminar-marca");
        if (btnEliminar) {
            const id = btnEliminar.dataset.id;
            await eliminarMarca(id);
        }
    });

    document.addEventListener("click", async (e) => {
        const btn = e.target.closest("#btnNuevaCategoria");
        if (btn) {

            const inputNombre = document.getElementById("nombreCategoriaInput");
            if (inputNombre) inputNombre.value = "";

            // Abrir el modal de Bootstrap
            const modalElemento = document.getElementById("modalNuevaCategoria");
            const modalInstance = bootstrap.Modal.getOrCreateInstance(modalElemento);
            modalInstance.show();
        }

        const btnEliminar = e.target.closest(".btn-eliminar-categoria");
        if (btnEliminar) {
            const id = btnEliminar.dataset.id;
            await eliminarCategoria(id);
        }
    });


    const formNuevaMarca = document.getElementById("formNuevaMarca");
    if (formNuevaMarca) {
        formNuevaMarca.addEventListener("submit", async (e) => {
            e.preventDefault();

            const inputNombre = document.getElementById("nombreMarcaInput");
            const nombreMarca = inputNombre.value.trim();

            if (nombreMarca !== "") {

                await crearNuevaMarca(nombreMarca);


                const modalElemento = document.getElementById("modalNuevaMarca");
                const modalInstance = bootstrap.Modal.getInstance(modalElemento);
                if (modalInstance) {
                    modalInstance.hide();
                }
            }
        });
    }

    const formNuevaCategoria = document.getElementById("formNuevaCategoria");
    if (formNuevaCategoria) {
        formNuevaCategoria.addEventListener("submit", async (e) => {
            e.preventDefault();

            const inputNombre = document.getElementById("nombreCategoriaInput");
            const nombreCategoria = inputNombre.value.trim();

            if (nombreCategoria !== "") {

                await crearNuevaCategoria(nombreCategoria);


                const modalElemento = document.getElementById("modalNuevaCategoria");
                const modalInstance = bootstrap.Modal.getInstance(modalElemento);
                if (modalInstance) {
                    modalInstance.hide();
                }
            }
        });
    }

    // Instancia del modal de Bootstrap para Usuario
    const modalEditarRolElement = document.getElementById('modalEditarRolUsuario');
    const modalEditarRol = new bootstrap.Modal(modalEditarRolElement);

    // Escuchar clics en los botones de Editar y Eliminar de la Tabla de Usuarios
    document.addEventListener("click", async (e) => {

        // BOTÓN EDITAR ROL (Amarillo)
        const btnEditar = e.target.closest(".btn-editar-usuario");
        if (btnEditar) {
            const id = btnEditar.dataset.id;
            const rolActual = btnEditar.dataset.rol || "NORMAL";

            // Asignar los valores al modal
            document.getElementById("editUsuarioId").value = id;
            document.getElementById("editUsuarioRolSelect").value = rolActual;

            // Abrir modal
            modalEditarRol.show();
            return;
        }

        // BOTÓN ELIMINAR (Rojo)
        const btnEliminar = e.target.closest(".btn-eliminar-usuario");
        if (btnEliminar) {
            const id = btnEliminar.dataset.id;
            await eliminarUsuario(id);
        }
    });

    // Listener para el botón "Guardar Cambios" dentro del Modal
    document.getElementById("btnGuardarRolUsuario").addEventListener("click", async () => {
        const id = document.getElementById("editUsuarioId").value;
        const nuevoRol = document.getElementById("editUsuarioRolSelect").value;

        await cambiarRolUsuario(id, nuevoRol);

        // Ocultar modal tras guardar
        modalEditarRol.hide();
    });

}

// Función para decodificar la parte Payload del JWT sin librerías externas
function obtenerRolDesdeJWT(token) {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(c => {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        const payload = JSON.parse(jsonPayload);
        // Ajusta 'role' o 'authorities' según la clave de tu JWT
        return payload.role || payload.authorities || payload.rol;
    } catch (e) {
        return null;
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem("token");
    const roleFromToken = token ? obtenerRolDesdeJWT(token) : null;

    const userRole = Array.isArray(roleFromToken) 
        ? roleFromToken.map(r => r.toUpperCase()) 
        : [String(roleFromToken).trim().toUpperCase()];

    const esAdmin = userRole.some(r => r === "ADMINISTRADOR" || r === "ROLE_ADMINISTRADOR");

    if (!token || !esAdmin) {
        window.location.href = "/404.html";
    }
});


// Detecta dinámicamente si estás en desarrollo local o en producción en GitHub Pages
const API_BASE_URL = (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1")
    ? "http://localhost:8080/api"
    : "https://mundolaptopbackend.onrender.com/api";

// Ejemplo de consumo desde el Frontend:
fetch(`${API_BASE_URL}/productos`)
    .then(response => response.json())
    .then(data => {
        console.log("Productos obtenidos:", data);
    })
    .catch(error => console.error("Error conectando con la API:", error));