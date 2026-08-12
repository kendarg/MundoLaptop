

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
            clase="bg-danger-subtle";

        }else if(producto.stock<=5){
            estado="Poco Stock";
            clase="bg-warning-subtle";

        }else{
            estado="Buen Stock";
            clase="bg-success-subtle";
        }
        //      renderizamos cada producto en la lista de tareas -html
        lista.innerHTML +=`
            <div class="tareaFondo">
            <p>${producto.nombre}</p>
            <p>${producto.categoria}</p>
            <p>${producto.marca}</p>
            <p>${producto.precio}</p>
            <p>${producto.stock}</p>
            <span class="${clase}">
                ${estado}
            </span>
            <i class="bi bi-trash" data-id="${producto.id}"></i>
            </div>
        `;
    });
}


//      evento elimina el producto por funcion-id al seleccionar icono

lista.addEventListener("click", (e) => {
    if (e.target.classList.contains("bi-trash")) {
        const id = Number(e.target.dataset.id);
        eliminarProducto(id);
    }
});

//      funcion

function eliminarProducto(id){

    const indice = inventario.findIndex(
        producto => producto.id === id
    );

    inventario.splice(indice,1);
    renderizarInventario();
    console.clear();
    console.log(inventario);
}

modal.classList.add("activo");
modal.classList.remove("activo");





