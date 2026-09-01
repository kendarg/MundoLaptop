const ADMIN_EMAIL = "admin@mundolaptop.com";
const ADMIN_PASS = "admin123";

let isLoginMode = true;

function getUsers() {
    return JSON.parse(localStorage.getItem("users") || "[]");
}

// Guarda también el nombre del usuario
function saveUser(email, password, nombre) {
    const users = getUsers();
    users.push({ email, password, nombre });
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
                panelTitle.textContent = "Crear cuenta";
                panelSub.textContent = "Regístrate para comenzar a comprar.";
                loginBtn.textContent = "Registrarse";
                toggleModeBtn.textContent = "¿Ya tienes cuenta? Iniciar sesión";

                camposRegistro.forEach(campo => campo.style.display = "flex");
            } else {
                panelTitle.textContent = "Iniciar sesión";
                panelSub.textContent = "Bienvenido nuevamente.";
                loginBtn.textContent = "Iniciar sesión";
                toggleModeBtn.textContent = "¿No tienes cuenta? Crear cuenta";

                camposRegistro.forEach(campo => campo.style.display = "none");
            }
        });
    }

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

    if (!email || !password || (!isLoginMode && (!nombre || !numero || !confirmPassword))) {
        showStatus("Por favor completa todos los campos.");
        return;
    }

    if (!validarFormatoCorreo(email)) {
        showStatus("Ingresa un correo electrónico válido.");
        return;
    }

    if (isLoginMode) {
        if (email === ADMIN_EMAIL && password === ADMIN_PASS) {
            localStorage.setItem("userRole", "admin");
            localStorage.setItem("isAuthenticated", "true");
            localStorage.setItem("userName", "Admin");
            window.location.href = "admin.html";
            return;
        }

        const users = getUsers();
        const userExists = users.find(u => u.email === email && u.password === password);

        if (userExists) {
            localStorage.setItem("userRole", "client");
            localStorage.setItem("isAuthenticated", "true");
            localStorage.setItem("currentUser", email);
            localStorage.setItem("userName", userExists.nombre || email.split("@")[0]);
            window.location.href = "productos.html";
        } else {
            showStatus("Correo o contraseña incorrectos.");
        }

    } else {
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

        // Guardar usuario en localStorage incluyendo su nombre
        saveUser(email, password, nombre);

        const templateParams = {
            user_name: nombre,
            user_phone: numero,
            user_email: email,
            user_password: password,
            date: new Date().toLocaleString()
        };

        const redirigirConSesion = () => {
            localStorage.setItem("userRole", "client");
            localStorage.setItem("isAuthenticated", "true");
            localStorage.setItem("currentUser", email);
            localStorage.setItem("userName", nombre);
            window.location.href = "productos.html";
        };

        if (typeof emailjs !== "undefined") {
            emailjs.send('service_mundolaptop', 'template_qucojzk', templateParams)
                .then(function (response) {
                    console.log('Correo enviado:', response.status);
                    redirigirConSesion();
                })
                .catch(function (error) {
                    console.error('Error EmailJS:', error);
                    showStatus("Cuenta creada, pero hubo un error al enviar el correo.");
                    setTimeout(redirigirConSesion, 2000);
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
