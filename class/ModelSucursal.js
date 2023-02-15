export class ModelSucursal {
    #id;
    #nombre;
    #categorias;

    constructor(id, nombre) {
        this.#id = id
        this.#nombre = nombre;
        this.#categorias = [];
    };

    getId() {
        return this.#id;
    };
    getNombre() {
        return this.#nombre;
    };
    getCategorias() {
        return this.#categorias;
    };
    setCategoria(categoria) {
        this.#categorias.push(categoria);
    };
};