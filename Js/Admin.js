const formulario = document.getElementById('formularioRegistroProducto')


formulario.addEventListener("submit", function (e) {
    e.preventDefault() //prevengo el comportamiento normal del submit

    const datosProducto = {

        nombreProducto: document.getElementById('nombreProducto').value,
        numeroDeSerie: document.getElementById('numeroSerie').value,
        categoria: document.getElementById('Categoria').value,
        marca: document.getElementById('marca').value,
        precio: document.getElementById('Precio').value,
        stock: document.getElementById('Stock').value,
        referencia: document.getElementById('referencia').value,

    }


    validarCamposRegistroProducto(datosProducto)

})



function validarCamposRegistroProducto(datos) {
    if (datos.nombreProducto.trim() == "") {
        console.log("ingrese un nombre de producto ❌")
    }
    else {
        console.log(datos);
        formulario.reset();
    }

}