document.addEventListener("DOMContentLoaded", function () {
    const contactForm = document.getElementById("contact-form");
    const submitBtn = document.getElementById("submit-btn");

    if (contactForm) {
        contactForm.addEventListener("submit", function (e) {
            e.preventDefault();

            submitBtn.disabled = true;
            const originalBtnText = submitBtn.innerHTML;
            submitBtn.innerHTML = "Enviando...";

            const templateParams = {
                user_name: document.getElementById("nombre").value.trim(),
                user_email: document.getElementById("correo").value.trim(),
                subject: document.getElementById("asunto").value.trim(),
                message: document.getElementById("mensaje").value.trim(),
                date: new Date().toLocaleString()
            };

            // Llamada enviada al servicio existente con el nuevo Template ID de Contacto
            emailjs.send('service_mundolaptop', 'template_0m7bb7l', templateParams)
                .then(function (response) {
                    console.log('Mensaje enviado:', response.status, response.text);
                    alert("¡Mensaje enviado con éxito!");
                    contactForm.reset();
                })
                .catch(function (error) {
                    console.error("Error al enviar con EmailJS:", error);
                    alert("Ocurrió un error al enviar el mensaje. Inténtalo de nuevo.");
                })
                .finally(function () {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalBtnText;
                });
        });
    }
});
