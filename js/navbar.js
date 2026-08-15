const navLinks = document.querySelectorAll(
    ".navbar-nav .nav-link, .iconos-navbar a"
);

const navbarCollapse = document.getElementById("navbarNavDropdown");

navLinks.forEach(link => {
    link.addEventListener("click", () => {
        if (window.innerWidth < 992) {
            bootstrap.Collapse
                .getOrCreateInstance(navbarCollapse)
                .hide();
        }
    });
});