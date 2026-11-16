import type { Tarea } from '../interfaces/tarea.interface.js';

type FiltroTareas = 'Todas' | 'Pendientes' | 'Completadas';

export class TaskManager {
    // Datos de la aplicación.
    private tareas: Tarea[] = [];
    private filtroActual: FiltroTareas = 'Todas';

    // Elementos del HTML.
    private formulario: HTMLFormElement;
    private inputTitulo: HTMLInputElement;
    private selectPrioridad: HTMLSelectElement;
    private listaContenedor: HTMLElement;
    private listaEspejo: HTMLElement;
    private loadingState: HTMLElement;
    private botonesFiltro: NodeListOf<HTMLButtonElement>;

    constructor() {
        const formulario = document.querySelector<HTMLFormElement>('#form-tareas');
        const inputTitulo = document.querySelector<HTMLInputElement>('#input-titulo');
        const selectPrioridad = document.querySelector<HTMLSelectElement>('#select-prioridad');
        const listaContenedor = document.querySelector<HTMLElement>('#lista-tareas');
        const listaEspejo = document.querySelector<HTMLElement>('#lista-espejo');
        const loadingState = document.querySelector<HTMLElement>('#loading-state');

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
        this.botonesFiltro = document.querySelectorAll<HTMLButtonElement>('.btn-filtro');

        this.recuperarTareas();
        this.configurarEventos();
        void this.inicializarApp();

    }

    // Añade una tarea nueva.
    public agregarTarea(): void {
        const titulo = this.inputTitulo.value.trim();
        const prioridad = this.selectPrioridad.value;

        if (titulo === '') {
            return;
        }

        if (prioridad !== 'Alta' && prioridad !== 'Media' && prioridad !== 'Baja') {
            return;
        }

        const nuevaTarea: Tarea = {
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
    public pintarTareas(): void {
        this.listaContenedor.replaceChildren();
        this.listaEspejo.replaceChildren();

        let tareasFiltradas: Tarea[] = [];

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
    public cambiarEstado(id: number): void {
        this.tareas = this.tareas.map(tarea =>
            tarea.id === id
                ? { ...tarea, completada: !tarea.completada }
                : tarea
        );

        this.guardarTareas();
        this.pintarTareas();
    }

    // Prepara los eventos del formulario, los botones y la lista.
    private configurarEventos(): void {
        this.formulario.addEventListener('submit', event => {
            event.preventDefault();
            this.agregarTarea();
        });

        this.listaContenedor.addEventListener('click', event => {
            if (!(event.target instanceof HTMLElement)) {
                return;
            }

            const boton = event.target.closest<HTMLButtonElement>('.btn-accion');

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
    private async inicializarApp(): Promise<void> {
        await new Promise<void>(resolve => {
            setTimeout(resolve, 1500);
        });

        this.loadingState.hidden = true;
        this.pintarTareas();
    }

    // Recupera las tareas guardadas. Si no hay ninguna, carga las iniciales.
    private recuperarTareas(): void {
        const datosGuardados = localStorage.getItem('devtask-tareas');

        if (datosGuardados !== null) {
            try {
                this.tareas = JSON.parse(datosGuardados) as Tarea[];
                return;
            } catch {
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
    private guardarTareas(): void {
        localStorage.setItem('devtask-tareas', JSON.stringify(this.tareas));
    }

}