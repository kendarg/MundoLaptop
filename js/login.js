const ADMIN_EMAIL = "admin@mundolaptop.com";
const ADMIN_PASS = "admin123";

document.addEventListener("DOMContentLoaded", () => {
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

    if (buttonuser) {
        buttonuser.addEventListener("click", (e) => {
            e.preventDefault();
            panel.classList.add("active");
            overlay.classList.add("active");
        });
    }

    function cerrarLogin() {
        panel.classList.remove("active");
        overlay.classList.remove("active");
        if (statusMsg) statusMsg.style.display = "none";
    }

    if (cerrar) cerrar.addEventListener("click", cerrarLogin);
    if (overlay) overlay.addEventListener("click", cerrarLogin);

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") cerrarLogin();
    });

    if (btnCrearUsuario) {
        btnCrearUsuario.addEventListener('click', () => {
            vistalogin.style.display = 'none';
            vistaRegistro.style.display = 'block';
            if (statusMsg) statusMsg.style.display = "none";
        });
    }

    if (bntLogin) {
        bntLogin.addEventListener('click', () => {
            vistaRegistro.style.display = 'none';
            vistalogin.style.display = 'block';
            if (statusMsg) statusMsg.style.display = "none";
        });
    }

    function validarFormatoCorreo(correo) {
        const regexCorreo = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return regexCorreo.test(correo);
    }

    function getUsers() {
        return JSON.parse(localStorage.getItem("usersList")) || [];
    }

    function saveUser(email, password) {
        const users = getUsers();
        users.push({ email, password });
        localStorage.setItem("usersList", JSON.stringify(users));
    }

    function showStatus(text, isError = true) {
        if (!statusMsg) return;
        statusMsg.style.display = "block";
        statusMsg.style.color = isError ? "#ff4d4d" : "#2e7d32";
        statusMsg.textContent = text;
    }

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
                window.location.href = "../html/productos.html";
            } else {
                showStatus("Correo o contraseña incorrectos.");
            }
        });
    }

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

                // NUEVA VALIDACIÓN: Mayúscula, minúscula, número, carácter especial y mínimo 8 dígitos
                const regexPasswordCompleja = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>_+\-[\]\\\/])[A-Za-z\d!@#$%^&*(),.?":{}|<>_+\-[\]\\\/]{8,}$/;
                
                if (!regexPasswordCompleja.test(password)) {
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
                            window.location.href = "../html/productos.html";
                        })
                        .catch(function(error) {
                            console.error('Error al enviar con EmailJS:', error);
                            showStatus("Cuenta creada, pero ocurrió un problema al enviar el correo.");
                            setTimeout(() => {
                                localStorage.setItem("userRole", "client");
                                localStorage.setItem("isAuthenticated", "true");
                                localStorage.setItem("currentUser", email);
                                window.location.href = "../html/productos.html";
                            }, 2000);
                        });
                } else {
                    console.error("El SDK de EmailJS no se ha cargado correctamente.");
                    showStatus("Error al cargar el servicio de correos.");
                }
            });
        }
    }


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
