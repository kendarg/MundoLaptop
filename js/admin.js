

//      array de productos vacia

const inventario = JSON.parse(localStorage.getItem("inventario")) || []; // recupera productos guardados o inicia con []
const formulario = document.querySelector(".formulario");

let productoEditando = null; // variable para aguegar el producto que se va editar y mostar en formulario

formulario.addEventListener("submit",AgregarProducto);

function AgregarProducto(e){
    e.preventDefault();

    //      seleccionamos input con ID#
    const nombre = document.querySelector("#nombreProducto").value.trim();
    const serie = document.querySelector("#numeroSerie").value.trim();
    const categoria = document.querySelector("#Categoria").value;
    const marca = document.querySelector("#marca").value;
    const precio = document.querySelector("#Precio").value;
    const stock = document.querySelector("#Stock").value;
    const referencia = document.querySelector("#referencia").value;

    //      se envia alert para no dejar input sin llenar en form
    if(
        nombre === "" || serie === "" || precio === "" || stock === "" ||
        categoria === "Seleccionar..." || marca === "Seleccionar..." || referencia === "Seleccionar..."
    ){
        alert("Complete todos los campos");
        return;
    }

    //      visual del objeto

    if (productoEditando) { // verifica si la variable editarproducto es dieferete de  null

        console.log("productoEditando:", productoEditando);

        productoEditando.nombre = nombre;
        productoEditando.serie = serie;
        productoEditando.categoria = categoria;
        productoEditando.marca = marca;
        productoEditando.precio = Number(precio);
        productoEditando.stock = Number(stock);
        productoEditando.referencia = referencia;
        
        //      dejamos el formulario con los botones de agregar nuevamente , ya que al editar aparecen como modificar cambios
        document.querySelector(".cabeceraFormulario h3").textContent = "Agregar producto";
        document.querySelector('button[type="submit"]').textContent = "Agregar";

        productoEditando = null;

    } else { //     de lo contrario creara el producto nuevo al ver que no se esta editandoproducto

        const producto = {
            id: Date.now(),
            nombre,
            serie,
            categoria,
            marca,
            precio: Number(precio),
            stock: Number(stock),
            referencia
        };
        inventario.push(producto);
    }

    //      se actualiza localstorage
    localStorage.setItem(
    "inventario",
    JSON.stringify(inventario)
    );

    //      se agrega producto al array - json en console
    renderizarInventario();
    console.clear();
    console.log(inventario);
    console.log(JSON.stringify(inventario,null,2));
    cerrarModalProducto();
}

//      renderizamos productos en html

const lista = document.querySelector(".tareas");

function renderizarInventario(){
    lista.innerHTML="";

    inventario.forEach(producto=>{
        //      estado del stock
        let estado="";
        let clase="";

        if(producto.stock==0){
            estado="Sin Stock";
            clase="bg-danger";

        }else if(producto.stock<=5){
            estado="Poco Stock";
            clase="bg-warning";

        }else{
            estado="Buen Stock";
            clase="bg-success";
        }
        //      renderizamos cada producto en la lista de tareas -html
        //      icono editar y borrar llama producto pot id
        lista.innerHTML +=`
            <tr>
                <td>${producto.id}</td>
                <td>${producto.nombre}</td>
                <td>${producto.serie}</td>
                <td>${producto.categoria}</td>
                <td>${producto.marca}</td>
                <td>$ ${producto.precio}</td>
                <td>${producto.stock}</td>
                <td>${producto.referencia}</td>
                <td>
                    <span class=" badge ${clase}">
                        ${estado}
                    </span>
                </td>
                <td>
                    <i class="bi bi-pencil-square text-primary me-3 iconoeditar" 
                    data-id="${producto.id}"
                    style="cursor:pointer;"></i>
                    <i class="bi bi-trash text-danger iconobotar"
                       data-id="${producto.id}"
                       style="cursor:pointer;"></i>
                </td>
            </tr>
        `;
    });
}renderizarInventario(); // llamado a renderizar nuevamente para mostrar lo que enceuntre en localstorage


//      evento busca producto por funcion-id al seleccionar icono

lista.addEventListener("click", (e) => {
    if (e.target.classList.contains("bi-trash")) {
        const id = Number(e.target.dataset.id);
        eliminarProducto(id);
    }

    if (e.target.classList.contains("bi-pencil-square")){
        const id = Number (e.target.dataset.id);
        editarProducto(id);
    }
});

//      funcion eliminar producto por id

function eliminarProducto(id){
    const indice = inventario.findIndex(
        producto => producto.id === id
    );
    inventario.splice(indice,1);
    localStorage.setItem("inventario", JSON.stringify(inventario)); // se actualiza inventario al eliminar
    renderizarInventario();
    console.clear();
    console.log(inventario);
}

// buscamos el producto dentro de la lista y trae valores al form

function editarProducto(id) {

    //      seleccion de botones en formulario , para cambiarlos al estar editando por  "guardar cambios"
    document.querySelector(".cabeceraFormulario h3").textContent = "Editar producto";
    document.querySelector('button[type="submit"]').textContent = "Guardar cambios";

    const producto = inventario.find(producto => producto.id === id);
    if (!producto) return;

    productoEditando = producto; // variable deja de estar null y pasa a el producto seleccionado por ID
    document.querySelector("#nombreProducto").value = producto.nombre;
    document.querySelector("#numeroSerie").value = producto.serie;
    document.querySelector("#Categoria").value = producto.categoria;
    document.querySelector("#marca").value = producto.marca;
    document.querySelector("#Precio").value = producto.precio;
    document.querySelector("#Stock").value = producto.stock;
    document.querySelector("#referencia").value = producto.referencia;
    modalProducto.classList.add("activo");
}

// modal para visualizar agregar producto en ventana suspendida

const modalProducto = document.querySelector("#modalProducto");
const abrirFormulario = document.querySelector("#abrirFormulario");
const cerrarFormulario = document.querySelector("#cerrarFormulario");


function cerrarModalProducto() {

    productoEditando = null;
    formulario.reset();
    document.querySelector(".cabeceraFormulario h3").textContent = "Agregar Producto";
    document.querySelector('button[type="submit"]').textContent = "Agregar";
    modalProducto.classList.remove("activo");
}

// habre el modal para llenar formulario
abrirFormulario.addEventListener("click", () => {
    modalProducto.classList.add("activo");
});

//  cerrar modal con X
cerrarFormulario.addEventListener("click", () => {
    cerrarModalProducto();
});

//  el modal se cierra al darle click fuera del formulario
modalProducto.addEventListener("click", (e) => {
    if(e.target === modalProducto){
        cerrarModalProducto();
    }
});


// aqui traigo del localstore el nombre del administrador
const nombreUsuario = localStorage.getItem("currentUserName");

if (nombreUsuario) {
    document.getElementById("admon").textContent =
        `Hola, ${nombreUsuario}`;
}

const botonPanel = document.getElementById("togglePanel");
const panel = document.querySelector(".panelAdmonIzq");

// mostrar y esconder  panelizqueirdo en responsive
botonPanel.addEventListener("click", (e) => {
    e.preventDefault();
    panel.classList.toggle("activo");
});



