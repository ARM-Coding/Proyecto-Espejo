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

    }
}