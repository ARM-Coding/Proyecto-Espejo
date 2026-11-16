export declare class TaskManager {
    private tareas;
    private filtroActual;
    private formulario;
    private inputTitulo;
    private selectPrioridad;
    private listaContenedor;
    private listaEspejo;
    private loadingState;
    private botonesFiltro;
    constructor();
    agregarTarea(): void;
    pintarTareas(): void;
    cambiarEstado(id: number): void;
    private configurarEventos;
    private inicializarApp;
    private recuperarTareas;
    private guardarTareas;
}
//# sourceMappingURL=TaskManager.d.ts.map