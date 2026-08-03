// MODO OSCURO

let modo = document.getElementById("modo");
let body = document.body;
let icono = document.getElementById("icono");

modo.addEventListener("click", function(){
    let oscuro = body.classList.toggle("dark");
    localStorage.setItem("modo", oscuro);

    icono.classList.toggle("bi-moon");
    icono.classList.toggle("bi-sun");
});

let v = localStorage.getItem("modo");


if (v === "true") {
    body.classList.add("dark");

    icono.classList.remove("bi-moon");
    icono.classList.add("bi-sun");

}else{
    body.classList.remove("dark");

    icono.classList.add("bi-moon");
    icono.classList.remove("bi-sun");
}

