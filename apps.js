/**
 * TASK 1: Configuración Global e Inicialización
 */
const API_URL = "https://typicode.com"; // URL de ejemplo (simula una API)
const nombreInput = document.getElementById('nombreProd');
const precioInput = document.getElementById('precioProd');
const btnAgregar = document.getElementById('btnAgregar');
const btnSincronizar = document.getElementById('btnSincronizar');
const listaUl = document.getElementById('listaProductos');

// TASK 4: Arreglo global y persistencia inicial
let productos = JSON.parse(localStorage.getItem("productos")) || [];

// Renderizado inicial al cargar la página
document.addEventListener("DOMContentLoaded", () => {
    renderizarDOM();
    console.log(`Cargados ${productos.length} productos desde Local Storage.`);
});

/**
 * TASK 2 & 3: Captura, Validación y Manipulación del DOM
 */
btnAgregar.addEventListener('click', () => {
    const nombre = nombreInput.value.trim();
    const precio = precioInput.value.trim();

    // Validación básica
    if (!nombre || !precio) {
        alert("⚠️ Por favor, completa todos los campos.");
        return;
    }

    const nuevoProducto = {
        id: Date.now(), // ID temporal único
        title: nombre,  // Usamos 'title' para que coincida con la API de ejemplo
        precio: precio
    };

    productos.push(nuevoProducto);
    actualizarTodo();
    limpiarFormulario();
});

/**
 * TASK 3: Función para renderizar y eliminar del DOM
 */
function renderizarDOM() {
    listaUl.innerHTML = "";
    productos.forEach(prod => {
        const li = document.createElement('li');
        li.innerHTML = `
            <span><strong>${prod.title}</strong> - $${prod.precio || '0'}</span>
            <button class="btn-delete" onclick="eliminarProducto(${prod.id})">Eliminar</button>
        `;
        listaUl.appendChild(li);
    });
}

function eliminarProducto(id) {
    productos = productos.filter(p => p.id !== id);
    actualizarTodo();
    console.log(`Producto ID ${id} eliminado.`);
}

/**
 * TASK 4: Persistencia en Local Storage
 */
function actualizarTodo() {
    localStorage.setItem("productos", JSON.stringify(productos));
    renderizarDOM();
}

/**
 * TASK 5: Integración con Fetch API (Async/Await)
 */

// GET: Obtener datos de la API
btnSincronizar.addEventListener('click', async () => {
    try {
        const respuesta = await fetch(API_URL + "?_limit=5");
        const datos = await respuesta.json();
        
        // Unimos los datos de la API con los locales para la prueba
        productos = [...productos, ...datos];
        actualizarTodo();
        console.log("Sincronización GET exitosa:", datos);
    } catch (error) {
        console.error("Error en la solicitud GET:", error);
    }
});

// POST: Ejemplo de cómo enviarías un dato (Se llama internamente o por botón)
async function enviarAServidor(producto) {
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            body: JSON.stringify(producto),
            headers: { 'Content-type': 'application/json; charset=UTF-8' }
        });
        const data = await response.json();
        console.log("Respuesta POST del servidor:", data);
    } catch (error) {
        console.error("Error en POST:", error);
    }
}

function limpiarFormulario() {
    nombreInput.value = "";
    precioInput.value = "";
    nombreInput.focus();
}