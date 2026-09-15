const API_AUTH = "https://mundolaptopbackend.onrender.com/api/auth";
const API_USUARIOS = "https://mundolaptopbackend.onrender.com/api/usuarios";

let isLoginMode = true;

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

document.addEventListener("DOMContentLoaded", () => {
    const authForm = document.getElementById("authForm");
    const toggleModeBtn = document.getElementById("toggleModeBtn");
    const panelTitle = document.getElementById("panelTitle");
    const panelSub = document.getElementById("panelSub");
    const loginBtn = document.getElementById("loginBtn");
    const camposRegistro = document.querySelectorAll(".campo-registro");
    const statusMsg = document.getElementById("statusMsg");

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
            
            // === LOGIN: Petición a AuthController (/api/auth/login) ===
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

                // Evaluación del rol devuelto por el Backend
                if (userRole === "ADMINISTRADOR" || userRole === "ROLE_ADMINISTRADOR") {
                    window.location.href = "../html/admin.html";
                } else {
                    window.location.href = "../html/productos.html";
                }
            } else {
                showStatus("Correo o contraseña incorrectos.");
            }

        } else {
            // === REGISTRO: Petición a UsuarioController (/api/usuarios) ===
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
                const nuevoUsuario = await response.json();

                localStorage.setItem("userRole", "NORMAL");
                localStorage.setItem("isAuthenticated", "true");
                localStorage.setItem("currentUser", email);
                localStorage.setItem("userName", nombre);

                // Integración de EmailJS
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

                window.location.href = "../html/productos.html";
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