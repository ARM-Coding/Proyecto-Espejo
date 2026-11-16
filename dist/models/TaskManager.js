export class TaskManager {
    // Datos de la aplicación.
    tareas = [];
    filtroActual = 'Todas';
    // Elementos del HTML.
    formulario;
    inputTitulo;
    selectPrioridad;
    listaContenedor;
    listaEspejo;
    loadingState;
    botonesFiltro;
    constructor() {
        const formulario = document.querySelector('#form-tareas');
        const inputTitulo = document.querySelector('#input-titulo');
        const selectPrioridad = document.querySelector('#select-prioridad');
        const listaContenedor = document.querySelector('#lista-tareas');
        const listaEspejo = document.querySelector('#lista-espejo');
        const loadingState = document.querySelector('#loading-state');
        if (!formulario || !inputTitulo || !selectPrioridad ||
            !listaContenedor || !listaEspejo || !loadingState) {
            throw new Error('No se han encontrado los elementos del HTML.');
        }
        this.formulario = formulario;
        this.inputTitulo = inputTitulo;
        this.selectPrioridad = selectPrioridad;
        this.listaContenedor = listaContenedor;
        this.listaEspejo = listaEspejo;
        this.loadingState = loadingState;
        this.botonesFiltro = document.querySelectorAll('.btn-filtro');
        this.recuperarTareas();
        this.configurarEventos();
        void this.inicializarApp();
    }
    // Añade una tarea nueva.
    agregarTarea() {
        const titulo = this.inputTitulo.value.trim();
        const prioridad = this.selectPrioridad.value;
        if (titulo === '') {
            return;
        }
        if (prioridad !== 'Alta' && prioridad !== 'Media' && prioridad !== 'Baja') {
            return;
        }
        const nuevaTarea = {
            id: Date.now(),
            titulo: titulo,
            prioridad: prioridad,
            completada: false
        };
        this.tareas = [...this.tareas, nuevaTarea];
        this.guardarTareas();
        this.pintarTareas();
        this.formulario.reset();
    }
    // Muestra las tareas en la lista principal y en la lista espejo.
    pintarTareas() {
        this.listaContenedor.replaceChildren();
        this.listaEspejo.replaceChildren();
        let tareasFiltradas = [];
        switch (this.filtroActual) {
            case 'Todas':
                tareasFiltradas = [...this.tareas];
                break;
            case 'Pendientes':
                tareasFiltradas = this.tareas.filter(tarea => !tarea.completada);
                break;
            case 'Completadas':
                tareasFiltradas = this.tareas.filter(tarea => tarea.completada);
                break;
        }
        tareasFiltradas.forEach(tarea => {
            // Lista interactiva.
            const liOriginal = document.createElement('li');
            const textoTarea = document.createElement('span');
            const botonEstado = document.createElement('button');
            textoTarea.textContent = `${tarea.titulo} | ${tarea.prioridad}`;
            botonEstado.type = 'button';
            botonEstado.classList.add('button', 'btn-accion');
            botonEstado.dataset.id = String(tarea.id);
            botonEstado.textContent = tarea.completada ? 'Pendiente' : 'Completar';
            liOriginal.appendChild(textoTarea);
            liOriginal.appendChild(botonEstado);
            liOriginal.classList.add('item-tarea', tarea.prioridad);
            if (tarea.completada) {
                liOriginal.classList.add('completada');
            }
            this.listaContenedor.appendChild(liOriginal);
            // Lista espejo, que solo muestra la información.
            const liEspejo = document.createElement('li');
            const textoEspejo = document.createElement('span');
            const estadoEspejo = document.createElement('strong');
            liEspejo.classList.add(tarea.completada ? 'completada' : 'pendiente');
            textoEspejo.textContent = `[RÉPLICA] ${tarea.titulo} — Prioridad: ${tarea.prioridad} — Estado: `;
            estadoEspejo.textContent = tarea.completada ? 'Hecho' : 'Pendiente';
            textoEspejo.appendChild(estadoEspejo);
            liEspejo.appendChild(textoEspejo);
            this.listaEspejo.appendChild(liEspejo);
        });
    }
    // Cambia el estado de una tarea.
    cambiarEstado(id) {
        this.tareas = this.tareas.map(tarea => tarea.id === id
            ? { ...tarea, completada: !tarea.completada }
            : tarea);
        this.guardarTareas();
        this.pintarTareas();
    }
    // Prepara los eventos del formulario, los botones y la lista.
    configurarEventos() {
        this.formulario.addEventListener('submit', event => {
            event.preventDefault();
            this.agregarTarea();
        });
        this.listaContenedor.addEventListener('click', event => {
            if (!(event.target instanceof HTMLElement)) {
                return;
            }
            const boton = event.target.closest('.btn-accion');
            if (boton) {
                this.cambiarEstado(Number(boton.dataset.id));
            }
        });
        this.botonesFiltro.forEach(boton => {
            boton.addEventListener('click', () => {
                const filtro = boton.dataset.filtro;
                if (filtro === 'Todas' || filtro === 'Pendientes' || filtro === 'Completadas') {
                    this.filtroActual = filtro;
                    this.botonesFiltro.forEach(botonFiltro => {
                        botonFiltro.classList.remove('active');
                    });
                    boton.classList.add('active');
                    this.pintarTareas();
                }
            });
        });
    }
    // Espera 1,5 segundos y muestra las tareas.
    async inicializarApp() {
        await new Promise(resolve => {
            setTimeout(resolve, 1500);
        });
        this.loadingState.hidden = true;
        this.pintarTareas();
    }
    // Recupera las tareas guardadas. Si no hay ninguna, carga las iniciales.
    recuperarTareas() {
        const datosGuardados = localStorage.getItem('devtask-tareas');
        if (datosGuardados !== null) {
            try {
                this.tareas = JSON.parse(datosGuardados);
                return;
            }
            catch {
                // Si los datos no se pueden leer, se cargan las tareas iniciales.
            }
        }
        this.tareas = [
            { id: 1, titulo: 'Aprender la sintaxis de ES6', prioridad: 'Alta', completada: true },
            { id: 2, titulo: 'Dominar la asincronía y Fetch', prioridad: 'Media', completada: false },
            { id: 3, titulo: 'Migrar el proyecto a Angular', prioridad: 'Baja', completada: false }
        ];
        this.guardarTareas();
    }
    // Guarda las tareas en el navegador.
    guardarTareas() {
        localStorage.setItem('devtask-tareas', JSON.stringify(this.tareas));
    }
}
//# sourceMappingURL=TaskManager.js.map