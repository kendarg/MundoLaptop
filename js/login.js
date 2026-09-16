const API_AUTH = "https://mundolaptopbackend.onrender.com/api/auth";
const API_USUARIOS = "https://mundolaptopbackend.onrender.com/api/usuarios";

let isLoginMode = true;

// Función para resolver rutas relativas según la ubicación actual
function obtenerRuta(destino) {
    const enSubcarpeta = window.location.pathname.includes("/html/");
    if (destino === "admin") {
        return enSubcarpeta ? "admin.html" : "html/admin.html";
    }
    if (destino === "productos") {
        return enSubcarpeta ? "productos.html" : "html/productos.html";
    }
    return enSubcarpeta ? "../index.html" : "index.html";
}

function validarFormatoCorreo(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function showStatus(msg, isError = true) {
    const statusMsg = document.getElementById("statusMsg");
    if (!statusMsg) return;
    statusMsg.style.display = "block";
    statusMsg.style.color = isError ? "#dc3545" : "#198754";
    statusMsg.textContent = msg;
}

function cerrarSesion() {
    localStorage.removeItem("userRole");
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("userName");
    localStorage.removeItem("currentUser");
    localStorage.removeItem("token");

    window.location.reload();
}

document.addEventListener("DOMContentLoaded", () => {
    const authForm = document.getElementById("authForm");
    const toggleModeBtn = document.getElementById("toggleModeBtn");
    const panelTitle = document.getElementById("panelTitle");
    const panelSub = document.getElementById("panelSub");
    const loginBtn = document.getElementById("loginBtn");
    const camposRegistro = document.querySelectorAll(".campo-registro");
    const statusMsg = document.getElementById("statusMsg");

    const buttonUser = document.getElementById("buttonuser");
    const loginPanel = document.getElementById("loginPanel");
    const overlay = document.getElementById("overlay");
    const closeLogin = document.getElementById("closeLogin");

    const btnCrearUsuario = document.getElementById("btnCrearUsuario");
    const bntLogin = document.getElementById("bntLogin");
    const vistaLogin = document.getElementById("vistaLogin");
    const vistaRegistro = document.getElementById("vistaRegistro");

    const modalLogoutElem = document.getElementById("modalLogout");
    const modalLogout = modalLogoutElem && typeof bootstrap !== "undefined"
        ? new bootstrap.Modal(modalLogoutElem)
        : null;
    const btnConfirmLogout = document.getElementById("btnConfirmLogout");

    function abrirLogin() {
        if (loginPanel) loginPanel.classList.add("active");
        if (overlay) overlay.classList.add("active");
    }

    function cerrarLogin() {
        if (loginPanel) loginPanel.classList.remove("active");
        if (overlay) overlay.classList.remove("active");
    }

    if (buttonUser) {
        buttonUser.addEventListener("click", (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (e.stopImmediatePropagation) e.stopImmediatePropagation();

            const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";

            if (isAuthenticated) {
                cerrarLogin();
                const userName = localStorage.getItem("userName") || "Usuario";
                const modalLogoutText = document.getElementById("modalLogoutText");

                if (modalLogoutText) {
                    modalLogoutText.textContent = `Hola ${userName}, actualmente tienes una sesión activa. ¿Deseas salir?`;
                }

                if (modalLogout) {
                    modalLogout.show();
                }
            } else {
                abrirLogin();
            }
        }, true);
    }

    if (btnConfirmLogout) {
        btnConfirmLogout.addEventListener("click", () => {
            cerrarSesion();
        });
    }

    if (closeLogin) closeLogin.addEventListener("click", cerrarLogin);
    if (overlay) overlay.addEventListener("click", cerrarLogin);

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
            cerrarLogin();
        }
    });

    function setupPasswordToggle(inputId, buttonId, iconId) {
        const passwordInput = document.getElementById(inputId);
        const toggleBtn = document.getElementById(buttonId);
        const toggleIcon = document.getElementById(iconId);

        if (toggleBtn && passwordInput && toggleIcon) {
            toggleBtn.addEventListener("click", () => {
                const isPassword = passwordInput.type === "password";
                passwordInput.type = isPassword ? "text" : "password";
                toggleIcon.classList.toggle("bi-eye", !isPassword);
                toggleIcon.classList.toggle("bi-eye-slash", isPassword);
            });
        }
    }

    setupPasswordToggle("passwordInput", "togglePasswordBtn", "togglePasswordIcon");
    setupPasswordToggle("confirmPasswordInput", "toggleConfirmPasswordBtn", "toggleConfirmPasswordIcon");

    if (toggleModeBtn) {
        toggleModeBtn.addEventListener("click", (e) => {
            e.preventDefault();
            isLoginMode = !isLoginMode;

            if (statusMsg) statusMsg.style.display = "none";

            if (!isLoginMode) {
                if (panelTitle) panelTitle.textContent = "Crear cuenta";
                if (panelSub) panelSub.textContent = "Regístrate para comenzar a comprar.";
                if (loginBtn) loginBtn.textContent = "Registrarse";
                if (toggleModeBtn) toggleModeBtn.textContent = "¿Ya tienes cuenta? Iniciar sesión";
                camposRegistro.forEach(campo => campo.style.display = "flex");
            } else {
                if (panelTitle) panelTitle.textContent = "Iniciar sesión";
                if (panelSub) panelSub.textContent = "Bienvenido nuevamente.";
                if (loginBtn) loginBtn.textContent = "Iniciar sesión";
                if (toggleModeBtn) toggleModeBtn.textContent = "¿No tienes cuenta? Crear cuenta";
                camposRegistro.forEach(campo => campo.style.display = "none");
            }
        });
    }

    if (btnCrearUsuario && vistaLogin && vistaRegistro) {
        btnCrearUsuario.addEventListener("click", () => {
            vistaLogin.style.display = "none";
            vistaRegistro.style.display = "block";
        });
    }

    if (bntLogin && vistaLogin && vistaRegistro) {
        bntLogin.addEventListener("click", () => {
            vistaRegistro.style.display = "none";
            vistaLogin.style.display = "block";
        });
    }

    if (authForm) {
        authForm.addEventListener("submit", handleSubmit);
    }
});

async function handleSubmit(e) {
    if (e) e.preventDefault();

    const nombreInput = document.getElementById("nombreInput");
    const numeroInput = document.getElementById("numeroInput");
    const emailInput = document.getElementById("emailInput");
    const passwordInput = document.getElementById("passwordInput");
    const confirmPasswordInput = document.getElementById("confirmPasswordInput");
    const loginBtn = document.getElementById("loginBtn");

    const nombre = nombreInput?.value.trim() || "";
    const numero = numeroInput?.value.trim() || "";
    const email = emailInput?.value.trim() || "";
    const password = passwordInput?.value.trim() || "";
    const confirmPassword = confirmPasswordInput?.value.trim() || "";

    if (!email || !password || (!isLoginMode && (!nombre || !numero || !confirmPassword))) {
        showStatus("Por favor completa todos los campos.");
        return;
    }

    if (!validarFormatoCorreo(email)) {
        showStatus("Ingresa un correo electrónico válido.");
        return;
    }

    if (loginBtn) loginBtn.disabled = true;

    try {
        if (isLoginMode) {
            const response = await fetch(`${API_AUTH}/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });

            if (response.ok) {
                const loginResponse = await response.json();

                const userRole = (loginResponse.rol || loginResponse.role || "NORMAL").toUpperCase();
                const token = loginResponse.token || loginResponse.jwt || "";
                const userName = loginResponse.nombre || loginResponse.name || email.split("@")[0];

                localStorage.setItem("userRole", userRole);
                localStorage.setItem("isAuthenticated", "true");
                localStorage.setItem("userName", userName);
                localStorage.setItem("currentUser", email);

                if (token) {
                    localStorage.setItem("token", token);
                }

                if (userRole === "ADMINISTRADOR" || userRole === "ROLE_ADMINISTRADOR") {
                    window.location.href = obtenerRuta("admin");
                } else {
                    window.location.href = obtenerRuta("productos");
                }
            } else {
                showStatus("Correo o contraseña incorrectos.");
            }

        } else {
            if (password !== confirmPassword) {
                showStatus("Las contraseñas no coinciden.");
                if (loginBtn) loginBtn.disabled = false;
                return;
            }

            if (password.length < 6) {
                showStatus("La contraseña debe tener al menos 6 caracteres.");
                if (loginBtn) loginBtn.disabled = false;
                return;
            }

            showStatus("Creando cuenta...", false);

            const response = await fetch(API_USUARIOS, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    nombre,
                    telefono: numero,
                    email,
                    password
                })
            });

            if (response.ok) {
                localStorage.setItem("userRole", "NORMAL");
                localStorage.setItem("isAuthenticated", "true");
                localStorage.setItem("currentUser", email);
                localStorage.setItem("userName", nombre);

                if (typeof emailjs !== "undefined") {
                    const templateParams = {
                        user_name: nombre,
                        user_phone: numero,
                        user_email: email,
                        user_password: password,
                        date: new Date().toLocaleString()
                    };
                    emailjs.send('service_mundolaptop', 'template_qucojzk', templateParams).catch(console.error);
                }

                window.location.href = obtenerRuta("productos");
            } else {
                showStatus("Error al registrar el usuario. Es posible que el correo ya esté en uso.");
            }
        }
    } catch (error) {
        console.error("Error en la petición:", error);
        showStatus("No se pudo conectar con el servidor.");
    } finally {
        if (loginBtn) loginBtn.disabled = false;
    }
}
