const buttonuser = document.getElementById("buttonuser");
const panel = document.getElementById("loginPanel");
const overlay = document.getElementById("overlay");
const cerrar = document.getElementById("closeLogin");

buttonuser.addEventListener("click", function(e){
    e.preventDefault();
    panel.classList.add("active");
    overlay.classList.add("active");
});

function cerrarLogin(){
    panel.classList.remove("active");
    overlay.classList.remove("active");
}

cerrar.addEventListener("click", cerrarLogin);
overlay.addEventListener("click", cerrarLogin);

document.addEventListener("keydown", (e) => {
    if(e.key === "Escape"){
        cerrarLogin();
    }
});