// Constantes y variables de estado
const ADMIN_EMAIL = "admin@mundolaptop.com";
const ADMIN_PASS = "admin123";

let isLoginMode = true;

// Helper para LocalStorage
function getUsers() {
    return JSON.parse(localStorage.getItem("users") || "[]");
}

function saveUser(email, password) {
    const users = getUsers();
    users.push({ email, password });
    localStorage.setItem("users", JSON.stringify(users));
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

// Inicialización de eventos al cargar el DOM
document.addEventListener("DOMContentLoaded", () => {
    const authForm = document.getElementById("authForm");
    const toggleModeBtn = document.getElementById("toggleModeBtn");
    const panelTitle = document.getElementById("panelTitle");
    const panelSub = document.getElementById("panelSub");
    const loginBtn = document.getElementById("loginBtn");
    const camposRegistro = document.querySelectorAll(".campo-registro");
    const statusMsg = document.getElementById("statusMsg");

    // Alternar entre Login y Registro
    if (toggleModeBtn) {
        toggleModeBtn.addEventListener("click", (e) => {
            e.preventDefault();
            isLoginMode = !isLoginMode;

            if (statusMsg) statusMsg.style.display = "none";

            if (!isLoginMode) {
                // Modo Registro
                panelTitle.textContent = "Crear cuenta";
                panelSub.textContent = "Regístrate para comenzar a comprar.";
                loginBtn.textContent = "Registrarse";
                toggleModeBtn.textContent = "¿Ya tienes cuenta? Iniciar sesión";

                camposRegistro.forEach(campo => campo.style.display = "flex");
            } else {
                // Modo Login
                panelTitle.textContent = "Iniciar sesión";
                panelSub.textContent = "Bienvenido nuevamente.";
                loginBtn.textContent = "Iniciar sesión";
                toggleModeBtn.textContent = "¿No tienes cuenta? Crear cuenta";

                camposRegistro.forEach(campo => campo.style.display = "none");
            }
        });
    }

    // Manejar envío del formulario
    if (authForm) {
        authForm.addEventListener("submit", handleSubmit);
    }
});

function handleSubmit(e) {
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

    // Validaciones básicas
    if (!email || !password || (!isLoginMode && (!nombre || !numero || !confirmPassword))) {
        showStatus("Por favor completa todos los campos.");
        return;
    }

    if (!validarFormatoCorreo(email)) {
        showStatus("Ingresa un correo electrónico válido.");
        return;
    }

    if (isLoginMode) {
        // --- LOGIN ---
        if (email === ADMIN_EMAIL && password === ADMIN_PASS) {
            localStorage.setItem("userRole", "admin");
            localStorage.setItem("isAuthenticated", "true");
            window.location.href = "admin.html";
            return;
        }

        const users = getUsers();
        const userExists = users.find(u => u.email === email && u.password === password);

        if (userExists) {
            localStorage.setItem("userRole", "client");
            localStorage.setItem("isAuthenticated", "true");
            localStorage.setItem("currentUser", email);
            window.location.href = "productos.html";
        } else {
            showStatus("Correo o contraseña incorrectos.");
        }

    } else {
        // --- REGISTRO ---
        if (password !== confirmPassword) {
            showStatus("Las contraseñas no coinciden.");
            return;
        }

        if (password.length < 6) {
            showStatus("La contraseña debe tener al menos 6 caracteres.");
            return;
        }

        const users = getUsers();

        if (email === ADMIN_EMAIL || users.some(u => u.email === email)) {
            showStatus("Este correo ya está registrado.");
            return;
        }

        loginBtn.disabled = true;
        showStatus("Creando cuenta y enviando correo...", false);

        saveUser(email, password);

        const templateParams = {
            user_name: nombre,
            user_phone: numero,
            user_email: email,
            user_password: password,
            date: new Date().toLocaleString()
        };

        if (typeof emailjs !== "undefined") {
            emailjs.send('service_mundolaptop', 'template_qucojzk', templateParams)
                .then(function (response) {
                    console.log('Correo enviado:', response.status);
                    localStorage.setItem("userRole", "client");
                    localStorage.setItem("isAuthenticated", "true");
                    localStorage.setItem("currentUser", email);
                    window.location.href = "productos.html";
                })
                .catch(function (error) {
                    console.error('Error EmailJS:', error);
                    showStatus("Cuenta creada, pero hubo un error al enviar el correo.");
                    setTimeout(() => {
                        localStorage.setItem("userRole", "client");
                        localStorage.setItem("isAuthenticated", "true");
                        localStorage.setItem("currentUser", email);
                        window.location.href = "productos.html";
                    }, 2000);
                })
                .finally(() => {
                    loginBtn.disabled = false;
                });
        } else {
            showStatus("Error al cargar el servicio de correos.");
            loginBtn.disabled = false;
        }
    }
}
