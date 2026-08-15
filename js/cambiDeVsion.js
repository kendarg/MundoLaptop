// MODO OSCURO Independiente
//Toco pasarlo a una funcion
function inicializarModoOscuro() {
    let modo = document.getElementById("modo");
    let body = document.body;
    let icono = document.getElementById("icono");
    let logo = document.getElementById("logo");

    if (!modo) return;

    let v = localStorage.getItem("modo");

    if (v === "true") {
        body.classList.add("dark");
        if (logo) logo.classList.add("dark-logo");
        if (icono) {
            icono.classList.remove("bi-moon");
            icono.classList.add("bi-sun");
        }
    } else {
        body.classList.remove("dark");
        body.classList.add("claro");
        if (logo) logo.classList.remove("dark-logo");
        if (icono) {
            icono.classList.add("bi-moon");
            icono.classList.remove("bi-sun");
        }
    }

    modo.addEventListener("click", function () {
        let oscuro = body.classList.toggle("dark");
        localStorage.setItem("modo", oscuro);

        if (icono) {
            icono.classList.toggle("bi-moon");
            icono.classList.toggle("bi-sun");
        }
        if (logo) {
            logo.classList.toggle("dark-logo");
        }
    });
}

const observer = new MutationObserver((mutations, obs) => {
    const modo = document.getElementById("modo");
    if (modo) {
        inicializarModoOscuro();
        obs.disconnect();
    }
});

observer.observe(document.body, {
    childList: true,
    subtree: true
});