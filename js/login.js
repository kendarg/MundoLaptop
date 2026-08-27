//Credenciales únicas del Admin
const ADMIN_EMAIL = "admin@mundolaptop.com";
const ADMIN_PASS = "admin123";

document.addEventListener("DOMContentLoaded", () => {
    const authForm = document.getElementById("authForm");
    const nombreInput = document.getElementById("nombreInput");
    const emailInput = document.getElementById("emailInput");
    const passwordInput = document.getElementById("passwordInput");
    const loginBtn = document.getElementById("loginBtn");
    const toggleModeBtn = document.getElementById("toggleModeBtn");
    const panelTitle = document.getElementById("panelTitle");
    const panelSub = document.getElementById("panelSub");
    const statusMsg = document.getElementById("statusMsg");
    const olvidoLink = document.getElementById("olvidoLink");

    let isLoginMode = true;

    // Función para verificar el formato de correo mediante Expresión Regular
    function validarFormatoCorreo(correo) {
        const regexCorreo = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return regexCorreo.test(correo);
    }

    function getUsers() {
        return JSON.parse(localStorage.getItem("usersList")) || [];
    }

    function saveUser(nombre, email, password) {
        const users = getUsers();
        users.push({nombre, email, password });
        localStorage.setItem("usersList", JSON.stringify(users));
    }

    function showStatus(text, isError = true) {
        if (!statusMsg) return;
        statusMsg.style.display = "block";
        statusMsg.style.color = isError ? "#ff4d4d" : "#2e7d32";
        statusMsg.textContent = text;
    }

    function clearInputs() {
        nombreInput.value = "";
        emailInput.value = "";
        passwordInput.value = "";
        if (statusMsg) statusMsg.style.display = "none";
    }

    function handleSubmit(e) {
        if (e) e.preventDefault();

        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();
        const nombre = nombreInput.value.trim();

        // 1. Validar campos vacíos
        if (!email || !password) {
            showStatus("Por favor completa todos los campos.");
            return;
        }

        // 2. Validar estructura correcta de correo electrónico (@ y extensión)
        if (!validarFormatoCorreo(email)) {
            showStatus("Ingresa un correo electrónico válido (ejemplo@dominio.com).");
            return;
        }

        if (isLoginMode) {
            // --- MODO LOGIN ---
            if (email === ADMIN_EMAIL && password === ADMIN_PASS) {
                localStorage.setItem("userRole", "admin");
                localStorage.setItem("isAuthenticated", "true");
                window.location.href = "../html/admin.html";
                return;
            }

            const users = getUsers();
            const userExists = users.find(u => u.email === email && u.password === password);

            if (userExists) {
                localStorage.setItem("userRole", "client");
                localStorage.setItem("isAuthenticated", "true");
                localStorage.setItem("currentUser", email);
                localStorage.setItem("currentUserName",userExists.nombre);
                window.location.href = "../html/productos.html";
            } else {
                showStatus("Correo o contraseña incorrectos.");
            }

        } else {
            // --- MODO REGISTRO ---
            const users = getUsers();

            if (email === ADMIN_EMAIL || users.some(u => u.email === email)) {
                showStatus("Este correo ya está registrado.");
                return;
            }

            loginBtn.disabled = true;
            showStatus("Creando cuenta y enviando correo...", false);

            saveUser(nombre, email, password);

            const templateParams = {
                user_email: email,
                user_password: password,
                date: new Date().toLocaleString()
            };

            if (typeof emailjs !== "undefined") {
                emailjs.send('service_mundolaptop', 'template_qucojzk', templateParams)
                    .then(function(response) {
                        console.log('Correo enviado con éxito:', response.status);
                        localStorage.setItem("userRole", "client");
                        localStorage.setItem("isAuthenticated", "true");
                        localStorage.setItem("currentUser", email);
                            localStorage.setItem("currentUserName", nombre);
                        window.location.href = "../html/productos.html";
                    })
                    .catch(function(error) {
                        console.error('Error al enviar con EmailJS:', error);
                        showStatus("Cuenta creada, pero ocurrió un problema al enviar el correo.");
                        setTimeout(() => {
                            localStorage.setItem("userRole", "client");
                            localStorage.setItem("isAuthenticated", "true");
                            localStorage.setItem("currentUser", email);
                            localStorage.setItem("currentUserName", nombre)
                            window.location.href = "../html/productos.html";
                        }, 2000);
                    })
                    .finally(() => {
                        loginBtn.disabled = false;
                    });
            } else {
                console.error("El SDK de EmailJS no se ha cargado correctamente.");
                showStatus("Error al cargar el servicio de correos.");
                loginBtn.disabled = false;
            }
        }
    }

    if (authForm) {
        authForm.addEventListener("submit", handleSubmit);
    }

    toggleModeBtn.addEventListener("click", () => {
        isLoginMode = !isLoginMode;
        clearInputs();

        if (isLoginMode) {
            panelTitle.textContent = "Iniciar sesión";
            panelSub.textContent = "Bienvenido nuevamente.";
            loginBtn.textContent = "Iniciar sesión";
            toggleModeBtn.textContent = "¿No tienes cuenta? Crear cuenta";
            if (olvidoLink) olvidoLink.style.display = "inline-block";
        } else {
            panelTitle.textContent = "Crear cuenta";
            panelSub.textContent = "Regístrate para empezar a comprar.";
            loginBtn.textContent = "Registrarse";
            toggleModeBtn.textContent = "¿Ya tienes cuenta? Iniciar sesión";
            if (olvidoLink) olvidoLink.style.display = "none";
        }
    });

    [emailInput, passwordInput].forEach(input => {
        input.addEventListener("input", () => {
            if (statusMsg) statusMsg.style.display = "none";
        });
    });
});
