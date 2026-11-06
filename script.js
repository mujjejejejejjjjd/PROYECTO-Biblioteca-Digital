// script.js
document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("login-form");
    const loginSection = document.getElementById("login-section");
    const catalogSection = document.getElementById("catalog-section");
    const readerSection = document.getElementById("reader-section");
    const booksList = document.getElementById("books-list");
    const loginError = document.getElementById("login-error");
    
    const nextBtn = document.getElementById("next-btn");
    const prevBtn = document.getElementById("prev-btn");
    const backToCatalogBtn = document.getElementById("back-to-catalog");
    
    const pagesLeftSpan = document.getElementById("pages-left");
    const currentPageSpan = document.getElementById("current-page");
    const totalPagesSpan = document.getElementById("total-pages");
    const visitorWarning = document.getElementById("visitor-warning");
    const bookTitleHeader = document.getElementById("book-title-header");
    const bookContent = document.getElementById("book-content");

    // Simulación de "Base de Datos" de códigos válidos provistos por la bibliotecaria
    // Estos códigos se pueden usar UNA sola vez.
    let codigosValidos = JSON.parse(localStorage.getItem("codigos_biblioteca")) || [
        { codigo: "123456", usado: false },
        { codigo: "654321", usado: false },
        { codigo: "111222", usado: false }
    ];

    // Catálogo de libros (Aquí podés sumar el que digitalices con Adobe Scan)
    const catalogoLibros = [
        { id: 1, titulo: "Matemática Aplicada - 5to Año", paginas: ["Página 1: Introducción a funciones.", "Página 2: Límites y tendencias.", "Página 3: Ejercicios prácticos."] },
        { id: 2, titulo: "Antología de Poesía Urbana (¡Burzt!)", paginas: ["Página 1: Versos de asfalto.", "Página 2: Luces de neón en la ciudad.", "Página 3: Voces periféricas."] },
        { id: 3, titulo: "Historia Argentina - Daus y sus límites", paginas: ["Página 1: Espacio y territorio.", "Página 2: Configuración regional.", "Página 3: Conclusiones."] }
    ];

    let isSubscriber = false;
    let libroActual = null;
    let pageCount = 0;
    let maxPagesForVisitor = 10;

    // 1. Manejo del Login con Código Único
    loginForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const codigoIngresado = document.getElementById("codigo").value.trim();

        // Buscar el código en nuestra "base de datos" local
        let registroCodigo = codigosValidos.find(c => c.codigo === codigoIngresado);

        if (registroCodigo) {
            if (registroCodigo.usado) {
                loginError.textContent = "❌ Este código ya fue utilizado anteriormente.";
            } else {
                // Marcar como usado (Tachar / Invalidar para futuros usos)
                registroCodigo.usado = true;
                localStorage.setItem("codigos_biblioteca", JSON.stringify(codigosValidos));

                isSubscriber = true;
                loginSection.classList.add("hidden");
                catalogSection.classList.remove("hidden");
                cargarCatalogo();
            }
        } else {
            loginError.textContent = "❌ Código inválido o inexistente. Consultá a la bibliotecaria.";
        }
    });

    // 2. Cargar el menú de libros
    function cargarCatalogo() {
        booksList.innerHTML = "";
        catalogoLibros.forEach(libro => {
            const card = document.createElement("div");
            card.className = "book-card";
            card.innerHTML = `
                <h3>📖 ${libro.titulo}</h3>
                <button class="btn small" onclick="abrirLibro(${libro.id})">Leer Libro</button>
            `;
            booksList.appendChild(card);
        });
    }

    // Función global para abrir el libro seleccionado
    window.abrirLibro = function(id) {
        libroActual = catalogoLibros.find(l => l.id === id);
        pageCount = 0;
        
        catalogSection.classList.add("hidden");
        readerSection.classList.remove("hidden");
        
        bookTitleHeader.textContent = libroActual.titulo;
        totalPagesSpan.textContent = libroActual.paginas.length;
        actualizarVistaPagina();
    };

    // Volver al catálogo desde el lector
    backToCatalogBtn.addEventListener("click", () => {
        readerSection.classList.add("hidden");
        catalogSection.classList.remove("hidden");
    });

    // 3. Control de páginas
    nextBtn.addEventListener("click", () => {
        if (!isSubscriber && pageCount >= maxPagesForVisitor - 1) {
            alert("¡Alerta! Alcanzaste el límite de 10 páginas de visitante.");
            return;
        }
        if (pageCount < libroActual.paginas.length - 1) {
            pageCount++;
            actualizarVistaPagina();
        } else {
            alert("¡Llegaste al final del libro!");
        }
    });

    prevBtn.addEventListener("click", () => {
        if (pageCount > 0) {
            pageCount--;
            actualizarVistaPagina();
        }
    });

    function actualizarVistaPagina() {
        currentPageSpan.textContent = pageCount + 1;
        bookContent.textContent = libroActual.paginas[pageCount];

        if (isSubscriber) {
            visitorWarning.textContent = "✅ Acceso de Alumno Suscripto: Lectura ilimitada.";
            visitorWarning.style.color = "#27ae60";
        } else {
            let left = maxPagesForVisitor - (pageCount + 1);
            pagesLeftSpan.textContent = left >= 0 ? left : 0;
        }
    }
});
