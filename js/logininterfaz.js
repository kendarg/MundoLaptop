import { validarFormatoCorreo, validarPasswordCompleja } from '../js/validaciones.js';
import { ADMIN_EMAIL, ADMIN_PASS, getUsers, saveUser, guardarSesion, enviarCorreoBienvenida } from '../js/login.js';

document.addEventListener("DOMContentLoaded", () => {
    // Selección de elementos
    const buttonuser = document.getElementById("buttonuser");
    const panel = document.getElementById("loginPanel");
    const overlay = document.getElementById("overlay");
    const cerrar = document.getElementById("closeLogin");
    const vistalogin = document.getElementById('vistalogin');
    const vistaRegistro = document.getElementById('vistaRegistro');
    const btnCrearUsuario = document.getElementById('btnCrearUsuario');
    const bntLogin = document.getElementById('bntLogin');
    const formLogin = document.getElementById("authForm");
    const formRegistro = document.getElementById("authFormRegistro");
    const loginEmailInput = document.getElementById("emailInput");
    const loginPasswordInput = document.getElementById("passwordInput");
    const regNombre = document.getElementById("nombreInput");
    const regNumero = document.getElementById("numeroInput");
    const regEmail = document.getElementById("emailInputRegistro");
    const regPassword = document.getElementById("passwordInputRegistro");
    const regConfirmPassword = document.getElementById("passwordInputregistro");
    const statusMsg = document.getElementById("statusMsg");
    const ojosClanes = document.querySelectorAll('.toggle-password');

    // Muestra mensajes de estado
    function showStatus(text, isError = true) {
        if (!statusMsg) return;
        statusMsg.style.display = "block";
        statusMsg.style.color = isError ? "#ff4d4d" : "#2e7d32";
        statusMsg.textContent = text;
    }

    // Cierra el modal de login
    function cerrarLogin() {
        if (panel) panel.classList.remove("active");
        if (overlay) overlay.classList.remove("active");
        if (statusMsg) statusMsg.style.display = "none";
    }

    // Abrir modal
    if (buttonuser) {
        buttonuser.addEventListener("click", (e) => {
            e.preventDefault();
            if (panel) panel.classList.add("active");
            if (overlay) overlay.classList.add("active");
        });
    }

    if (cerrar) cerrar.addEventListener("click", cerrarLogin);
    if (overlay) overlay.addEventListener("click", cerrarLogin);

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") cerrarLogin();
    });

    // Cambiar vistas de formulario
    if (btnCrearUsuario) {
        btnCrearUsuario.addEventListener('click', () => {
            if (vistalogin) vistalogin.style.display = 'none';
            if (vistaRegistro) vistaRegistro.style.display = 'block';
            if (statusMsg) statusMsg.style.display = "none";
        });
    }

    if (bntLogin) {
        bntLogin.addEventListener('click', () => {
            if (vistaRegistro) vistaRegistro.style.display = 'none';
            if (vistalogin) vistalogin.style.display = 'block';
            if (statusMsg) statusMsg.style.display = "none";
        });
    }

    // PROCESO DE INICIO DE SESION
    if (formLogin) {
        formLogin.addEventListener("submit", (e) => {
            e.preventDefault();
            const email = loginEmailInput.value.trim();
            const password = loginPasswordInput.value.trim();

            if (!email || !password) {
                showStatus("Por favor completa todos los campos del login.");
                return;
            }

            if (!validarFormatoCorreo(email)) {
                showStatus("Ingresa un correo electrónico válido.");
                return;
            }

            if (email === ADMIN_EMAIL && password === ADMIN_PASS) {
                guardarSesion("admin");
                window.location.href = "../html/admin.html";
                return;
            }

            const users = getUsers();
            const userExists = users.find(u => u.email === email && u.password === password);

            if (userExists) {
                guardarSesion("client", email);
                window.location.href = "../html/productos.html";
            } else {
                showStatus("Correo o contraseña incorrectos.");
            }
        });
    }

    // PROCESO DE REGISTRO DE USUARIOS
    if (formRegistro) {
        const btnEnviarRegistro = formRegistro.querySelector("button[type='button'].google");
        
        if (btnEnviarRegistro) {
            btnEnviarRegistro.addEventListener("click", () => {
                const nombre = regNombre.value.trim();
                const numero = regNumero.value.trim();
                const email = regEmail.value.trim();
                const password = regPassword.value.trim();
                const confirmPassword = regConfirmPassword.value.trim();

                if (!nombre || !numero || !email || !password || !confirmPassword) {
                    showStatus("Por favor completa todos los campos de registro.");
                    return;
                }

                if (!validarFormatoCorreo(email)) {
                    showStatus("Ingresa un correo electrónico válido para el registro.");
                    return;
                }

                if (!validarPasswordCompleja(password)) {
                    showStatus("La contraseña debe tener mínimo 8 caracteres, una mayúscula, una minúscula, un número y un símbolo especial.");
                    return;
                }

                if (password !== confirmPassword) {
                    showStatus("Las contraseñas no coinciden.");
                    return;
                }

                const users = getUsers();
                if (email === ADMIN_EMAIL || users.some(u => u.email === email)) {
                    showStatus("Este correo ya está registrado.");
                    return;
                }

                showStatus("Creando cuenta y enviando correo...", false);
                saveUser(email, password);

                enviarCorreoBienvenida(email, password)
                    .then(function(response) {
                        console.log('Correo enviado con éxito:', response.status);
                        guardarSesion("client", email);
                        window.location.href = "../html/productos.html";
                    })
                    .catch(function(error) {
                        console.error('Error al enviar con EmailJS:', error);
                        showStatus("Cuenta creada, pero ocurrió un problema al enviar el correo.");
                        setTimeout(() => {
                            guardarSesion("client", email);
                            window.location.href = "../html/productos.html";
                        }, 2000);
                    });
            });
        }
    }

    // Mostrar u ocultar contraseña (ojo)
    ojosClanes.forEach(ojo => {
        ojo.addEventListener('click', function() {
            const targetId = this.getAttribute('data-target');
            const inputContrasena = document.getElementById(targetId);

            if (inputContrasena) {
                if (inputContrasena.type === 'password') {
                    inputContrasena.type = 'text';
                    this.classList.remove('bi-eye');
                    this.classList.add('bi-eye-slash');
                } else {
                    inputContrasena.type = 'password';
                    this.classList.remove('bi-eye-slash');
                    this.classList.add('bi-eye');
                }
            }
        });
    });
});