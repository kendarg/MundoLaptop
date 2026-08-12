

//      array de productos vacia

const inventario = [];
const formulario = document.querySelector(".formulario");

formulario.addEventListener("submit",AgregarProducto);

function AgregarProducto(e){
    console.log("Entró a la función");
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

    const producto = {
        id: Date.now(),
        nombre,
        serie,
        categoria,
        marca,
        precio:Number(precio),
        stock:Number(stock),
        referencia
    };

    //      se agrega producto al array - json en console

    inventario.push(producto);
    renderizarInventario();
    console.clear();
    console.log(inventario);
    console.log(JSON.stringify(inventario,null,2));
    formulario.reset(); // formulario se deja vacio
    modalProducto.classList.remove("activo");

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
                    <i class="bi bi-pencil-square text-primary me-3"></i>
                    <i class="bi bi-trash text-danger"
                       data-id="${producto.id}"
                       style="cursor:pointer;"></i>
                </td>
            </tr>
        `;
    });
}


//      evento busca producto por funcion-id al seleccionar icono

lista.addEventListener("click", (e) => {
    if (e.target.classList.contains("bi-trash")) {
        const id = Number(e.target.dataset.id);
        eliminarProducto(id);
    }
});

//      funcion eliminar producto por id

function eliminarProducto(id){
    const indice = inventario.findIndex(
        producto => producto.id === id
    );
    inventario.splice(indice,1);
    renderizarInventario();
    console.clear();
    console.log(inventario);
}

// modal para visualizar agregar producto en ventana suspendida

const modalProducto = document.querySelector("#modalProducto");
const abrirFormulario = document.querySelector("#abrirFormulario");
const cerrarFormulario = document.querySelector("#cerrarFormulario");

abrirFormulario.addEventListener("click", () => {
    modalProducto.classList.add("activo");
});

// cerrar ventana agregar producto en X
cerrarFormulario.addEventListener("click", () => {
    modalProducto.classList.remove("activo");
});

modalProducto.addEventListener("click", (e) => {
    if(e.target === modalProducto){
        modalProducto.classList.remove("activo");
    }
});





