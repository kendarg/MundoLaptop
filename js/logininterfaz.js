document.addEventListener("DOMContentLoaded", () => {
    const buttonuser = document.getElementById("buttonuser");
    const panel = document.getElementById("loginPanel");
    const overlay = document.getElementById("overlay");
    const cerrar = document.getElementById("closeLogin");

    if (buttonuser && panel && overlay) {
        buttonuser.addEventListener("click", function (e) {
            e.preventDefault();
            panel.classList.add("active");
            overlay.classList.add("active");
        });
    }

    function cerrarLogin() {
        if (panel) panel.classList.remove("active");
        if (overlay) overlay.classList.remove("active");
    }

    if (cerrar) cerrar.addEventListener("click", cerrarLogin);
    if (overlay) overlay.addEventListener("click", cerrarLogin);

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
            cerrarLogin();
        }
    });
});