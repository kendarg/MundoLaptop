let modo = document.getElementById("modo");
let body = document.body;
let icono = document.getElementById("icono")

modo.addEventListener("click", function(){
    body.classList.toggle("dark");

    icono.classList.toggle("fa-toggle-off");
    icono.classList.toggle("fa-toggle-on");
})