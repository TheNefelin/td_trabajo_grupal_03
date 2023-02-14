
export class Sucursal {
    constructor(nombre) {
        this._nombre = nombre;
        this._categorias = [];
    }
    getNombre() {
        return this._nombre;
    }
    getCategorias() {
        return this._categorias;
    }
    setCategoria(categoria) {
        this._categorias.push(categoria);
    }
};

export class ModelSucursal {
    #id
    #nombre
    #categorias

    constructor(id, nombre) {
        this.#id = id
        this.#nombre = nombre;
        this.#categorias = [];
    }

    getId() {
        return this.#id;
    }
    getNombre() {
        return this.#nombre;
    }
    getCategorias() {
        return this.#categorias;
    }
    setCategoria(categoria) {
        this.#categorias.push(categoria);
    }
};

