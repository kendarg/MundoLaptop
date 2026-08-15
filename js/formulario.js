const btnNuevoProducto = document.querySelector("#btnNuevoProducto");

btnNuevoProducto.addEventListener("click", () =>{
Swal.fire({
    html:`
    <form class="p-2 text-start" id="formularioModal">
        <div class="mb-10">
            <label for="nombreProducto" class="form-label">Nombre del Producto</label>
            <input type="text" class="form-control" id="nombreProducto" placeholder="Nombre del Producto">
        </div>
        <div class="mb-3">
            <label for="numeroSerie" class="form-label">Numero de serie/label>
            <input type="text" class="form-control" id="numeroSerie" placeholder="numeroSerie">
        </div>
        <div class="mb-3">
            <label for="categoria" class="form-label">Categoria</label>
            <select class="form-select" id="categoria">
                <option selected>Seleccionar...</option>
                <option value="3">Nuevos</option>
                <option value="1">Open Box</option>
                <option value="2">Usados</option>
            </select>
        </div>
        <div class="mb-3">
            <label for="marca" class="form-label">Marca</label>
            <select class="form-select" id="marca">
                <option selected>Seleccionar...</option>
                <option value="3">Lenovo</option>
                <option value="1">HP</option>
                <option value="2">Otras</option>
            </select>
        </div>
    <div class="mb-3">
        <label for="Precio" class="form-label">Precio</label>
        <input type="number" class="form-control" id="Precio">
    </div>
    <div class="mb-3">
        <label for="Stock" class="form-label">Stock</label>
        <input type="number" class="form-control" id="Stock">
    </div>
    <div class="mb-3">
        <label for="referencia" class="form-label" id="categoriatxt">Referencia</label>
        <select class="form-select" id="referencia">
                <option selected>Seleccionar...</option>
                <option value="3">Lenovo</option>
                <option value="1">HP</option>
                <option value="2">Otras</option>
        </select>
    </div>
    <hr>
    <button type="submit" class="btn btn-primary w-100">Agragar Imagen</button>
            <hr>
            <button type="submit" class="btn btn-primary w-100">Agregar</button>
            </form>
        </div>
        </form>
    `,
    showCancelButton : true,
    confirmButtonText: 'Agregar',
    cancelButtonText:'Cancelar',
    confirmButtonColor: '#0d6efd',
    focusConfirm: false,

    preConfirm: () =>{
        const nombreProducto = Swal.getPopup().querySelector("#nombreProducto");
        const numeroSerie = Swal.getPopup().querySelector("#numeroSerie");
        const categoria = Swal.getPopup().querySelector("#categoria");
        const marca = Swal.getPopup().querySelector("#marca");
        const Precio = Swal.getPopup().querySelector("#Precio");
        const Stock = Swal.getPopup().querySelector("#Stock");
        const Precio = Swal.getPopup().querySelector("#referencia");
        const referencia =[nombreProducto,numeroSerie,categoria,marca,Precio,Stock,referencia];
        let formularioValido = true;

        campos.forEach(campo =>{
            if(!campo.value.trim()){
                campo.classList.add('is-invalid');
                formularioValido = false;
            }else{
                campo.classList.remove('is-invalid');
                campo.classList.add('is-valid');
            }   
        });
        if(!formularioValido){
            Swal.showValidationMessage('Porfavor diligenciar Todos los campos obligatorios');
            return false;
        }
        return{
            nombreProducto: nombreProducto.value,
            numeroSerie: numeroSerie.value,
            categoria: categoria.value,
            marca: marca.value,
            Precio: Precio.value,
            Stock: Stock.value,
            referencia: referencia.value
        };
    }
    }).then((resultado)=>{
        if(resultado.isConfirmed){
            const datosTarea = resultado.value;
            Swal.mixin({
                toast: true,
                position: "top-end",
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true
            }).fire({
                icon: "success",
                title: `Tarea "${datosTarea.nombreProducto}" Se a Agregado`
            });
            console.log("Prueva de que si se esta mandando esto", datosTarea);
            
        }
    });

});
