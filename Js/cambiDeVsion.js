let modo = document.getElementById("modo");
let body = document.body;
let icono = document.getElementById("icono")

modo.addEventListener("click", function(){
    let oscuro = body.classList.toggle("dark");
    localStorage.setItem("modo", oscuro)

    icono.classList.toggle("bi-moon");
    icono.classList.toggle("bi-sun-fill");
})

let v = localStorage.getItem("modo");


if (v === "true") {
    body.classList.add("dark");

    icono.classList.remove("bi-moon");
    icono.classList.add("bi-sun-fill");
    
}else{
    body.classList.remove("dark");

    icono.classList.remove("bi-moon");
    icono.classList.add("bi-sun-fill");
}


// let modo = document.getElementById("modo");
// let body = document.body;
// let icono = document.getElementById("icono");

// modo.addEventListener("click", function(){
//     let esOscuro = body.classList.toggle("dark");
//     localStorage.setItem("modo", esOscuro);

//     // Alternar solo la clase del icono sin 'bi ' ni espacios
//     icono.classList.toggle("bi-sun-fill");
//     icono.classList.toggle("bi-moon");
// });

// // Restaurar estado guardado al cargar la página
// let v = localStorage.getItem("modo");

// if (v === "true") {
//     body.classList.add("dark");
//     // Mantener el icono alineado con el tema oscuro
//     icono.classList.remove("bi-sun-fill");
//     icono.classList.add("bi-moon");
// } else {
//     body.classList.remove("dark");
//     icono.classList.add("bi-sun-fill");
//     icono.classList.remove("bi-moon");
// }