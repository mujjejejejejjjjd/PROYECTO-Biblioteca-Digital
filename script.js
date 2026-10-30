// script.js
document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("login-form");
    const loginSection = document.getElementById("login-section");
    const readerSection = document.getElementById("reader-section");
    const nextBtn = document.getElementById("next-btn");
    const pagesLeftSpan = document.getElementById("pages-left");
    const currentPageSpan = document.getElementById("current-page");
    const visitorWarning = document.getElementById("visitor-warning");

    let pageCount = 1;
    let maxPagesForVisitor = 10;
    let isSubscriber = false;

    // Simular el inicio de sesión con el código de 6 dígitos
    loginForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const codigoInput = document.getElementById("codigo").value;

        // Aquí el código real haría una consulta (fetch) al servidor de la escuela
        if (codigoInput.length === 6) {
            isSubscriber = true; // Alumno autenticado con éxito
            loginSection.classList.add("hidden");
            readerSection.classList.remove("hidden");
            visitorWarning.textContent = "✅ Acceso de Alumno Suscriptores: Lectura ilimitada.";
            visitorWarning.style.color = "#27ae60";
        } else {
            alert("Por favor, ingresá un código válido de 6 dígitos.");
        }
    });

    // Lógica para pasar las páginas y controlar el límite de visitantes
    nextBtn.addEventListener("click", () => {
        if (!isSubscriber) {
            // Si es visitante, controlamos el límite de 10 páginas
            if (pageCount >= maxPagesForVisitor) {
                alert("¡Alerta! Has alcanzado el límite de 10 páginas de visitante este mes. Por favor, iniciá sesión con tu código de alumno para continuar leyendo.");
                return;
            }
        }

        pageCount++;
        currentPageSpan.textContent = pageCount;

        if (!isSubscriber) {
            let left = maxPagesForVisitor - pageCount;
            pagesLeftSpan.textContent = left >= 0 ? left : 0;
        }
    });
});
