// 1. Estado de la aplicación (Datos iniciales que simulan venir de una base de datos)
let tareas = [
  { id: 1, titulo: 'Aprender la sintaxis de ES6', prioridad: 'Alta', completada: true },
  { id: 2, titulo: 'Dominar la asincronía y Fetch', prioridad: 'Media', completada: false },
  { id: 3, titulo: 'Migrar el proyecto a Angular', prioridad: 'Baja', completada: false }
];

// Estado del filtro activo actual ('Todas', 'Pendientes', 'Completadas')
let filtroActual = 'Todas';

// 2. Selectores del DOM principales
const formulario = document.querySelector('#form-tareas');
const inputTitulo = document.querySelector('#input-titulo');
const selectPrioridad = document.querySelector('#select-prioridad');
const listaContenedor = document.querySelector('#lista-tareas');
const loadingState = document.querySelector('#loading-state');
const botonesFiltro = document.querySelectorAll('.btn-filtro');
const listaEspejo = document.querySelector("#lista-espejo");

// 3. FUNCIÓN ASÍNCRONA (AJAX simulado): Debe ejecutarse al arrancar la web
async function inicializarApp() {
  // TODO: Simular una espera de 1.5 segundos usando una Promesa (setTimeout)
  // TODO: Una vez pasada la espera, ocultar el div #loading-state
  // TODO: Invocar a la función pintarTareas()
  await new Promise(resolve => {
    setTimeout(resolve, 1500);
  });
  loadingState.innerHTML = "";
  pintarTareas();
}

// 4. FUNCIÓN DE RENDERIZADO: Encargada de pintar los nodos en el HTML
function pintarTareas() {
    // Limpiar ambos contenedores
    listaContenedor.replaceChildren();
    listaEspejo.replaceChildren();

    // Aplicar el filtro actual
    let tareasFiltradas = [];

    switch (filtroActual) {
        case "Todas":
            tareasFiltradas = [...tareas];
            break;

        case "Pendientes":
            tareasFiltradas = tareas.filter(
                tarea => !tarea.completada
            );
            break;

        case "Completadas":
            tareasFiltradas = tareas.filter(
                tarea => tarea.completada
            );
            break;
    }

    tareasFiltradas.forEach(tarea => {
        // 1. LISTA INTERACTIVA
        const liOriginal = document.createElement("li");
        const textoTarea = document.createElement("span");
        const botonEstado = document.createElement("button");

        textoTarea.textContent =
            tarea.titulo + " | " + tarea.prioridad;

        botonEstado.type = "button";
        botonEstado.classList.add("button", "btn-accion");
        botonEstado.dataset.id = tarea.id;
        botonEstado.textContent = tarea.completada
            ? "Pendiente"
            : "Completar";

        liOriginal.appendChild(textoTarea);
        liOriginal.appendChild(botonEstado);

        // Clases según prioridad
        liOriginal.classList.add("item-tarea", tarea.prioridad);

        if (tarea.completada) {
            liOriginal.classList.add("completada");
        }

        listaContenedor.appendChild(liOriginal);

        // 2. LISTA ESPEJO (SOLO LECTURA)
        const liEspejo = document.createElement("li");
        const textoEspejo = document.createElement("span");
        const estadoEspejo = document.createElement("strong");

        liEspejo.classList.add(
            tarea.completada ? "completada" : "pendiente"
        );

        textoEspejo.textContent =
            `[RÉPLICA] ${tarea.titulo} — Prioridad: ${tarea.prioridad} — Estado: `;

        estadoEspejo.textContent =
            tarea.completada ? "Hecho" : "Pendiente";

        textoEspejo.appendChild(estadoEspejo);
        liEspejo.appendChild(textoEspejo);

        listaEspejo.appendChild(liEspejo);
    });
}


listaContenedor.addEventListener("click", (event) => {
    const boton = event.target.closest(".btn-accion");

    if (!boton || !listaContenedor.contains(boton)) {
        return;
    }

    const idBuscar = Number(boton.dataset.id);

    tareas = tareas.map(tarea =>
        tarea.id === idBuscar
            ? { ...tarea, completada: !tarea.completada }
            : tarea
    );

    pintarTareas();
});

// 5. MANEJO DE EVENTOS: Captura de formulario
formulario.addEventListener('submit', (event) => {
  event.preventDefault();
  
  // TODO: Capturar los valores de los inputs de forma segura
  // TODO: Crear un nuevo objeto tarea inmutable con un id único (Date.now())
  // TODO: Añadir el objeto al array global de tareas de forma inmutable (operador spread)
  // TODO: Volver a invocar pintarTareas() y resetear el formulario

  const tituloNuevaTarea = document.getElementById("input-titulo").value;
  const prioridadNuevaTarea = document.getElementById("select-prioridad").value;

  const TareaNueva = {
    id: Date.now(), 
    titulo: tituloNuevaTarea, 
    prioridad: prioridadNuevaTarea, 
    completada: false
  }

  tareas = [...tareas, TareaNueva];

  pintarTareas();

});

// 6. MANEJO DE EVENTOS: Captura de botones de filtrado
botonesFiltro.forEach(boton => {
  boton.addEventListener('click', (event) => {
    // Quitar clase active al botón anterior y ponérsela al pulsado
    document.querySelector('.btn-filtro.active').classList.remove('active');
    event.target.classList.add('active');

    // TODO: Actualizar la variable 'filtroActual' con el atributo 'data-filtro' del botón
    // TODO: Invocar pintarTareas() para refrescar la pantalla

    let botonEnSeleccion = event.target;
    let filtroSeleccionado = botonEnSeleccion.dataset.filtro;
    filtroActual = filtroSeleccionado;
    pintarTareas();

  });
});

// Arrancar la aplicación
inicializarApp();