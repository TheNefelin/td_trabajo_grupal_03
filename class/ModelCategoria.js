export class ModelCategoria {
    #id;
    #nombre;
    #productos;

    constructor(id, nombre) {
        this.#id = id
        this.#nombre = nombre;
        this.#productos = [];
    }

    getId() {
        return this.#id;
    }
    getNombre() {
        return this.#nombre;
    }
    getProductos() {
        return this.#productos;
    }
    setProductos(productos) {
        this.#productos.push(productos);
    }
};