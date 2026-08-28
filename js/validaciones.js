
// Valida si la estructura del correo es valida
export function validarFormatoCorreo(correo) {
    const regexCorreo = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regexCorreo.test(correo);
}

// Valida contraseña: Mayúscula, minúscula, número, símbolo especial y mínimo 8 caracteres
export function validarPasswordCompleja(password) {
    const regexPasswordCompleja = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>_+\-[\]\\\/])[A-Za-z\d!@#$%^&*(),.?":{}|<>_+\-[\]\\\/]{10,}$/;
    return regexPasswordCompleja.test(password);
}