export class ModelProducto {
    #id;
    #nombre;
    #precio;
    #dercripcion;
    #stock;
    #link;
    #etiqueta;

    constructor(id, nombre, precio, dercripcion, stock, link, etiqueta) {
        this.#id = id
        this.#nombre = nombre;
        this.#precio = precio;
        this.#dercripcion = dercripcion;
        this.#stock = stock;
        this.#link = link;
        this.#etiqueta = etiqueta;
    }
    getId() {
        return this.#id;
    }
    getNombre() {
        return this.#nombre;
    }
    getPrecio() {
        return this.#precio;
    }
    getDercripcion() {
        return this.#dercripcion;
    }
    getStock() {
        return this.#stock;
    }
    getLink() {
        return this.#link;
    }
    getEtiqueta() {
        return this.#etiqueta;
    }
    setNombre(nombre) {
        this.#nombre = nombre;
    }
    setPrecio(precio) {
        this.#precio = precio;
    }
    setDercripcion(descripcion) {
        this.#dercripcion = descripcion;
    }
    setStock(stock) {
        this.#stock = stock;
    }
    setLink(link) {
        this.#link = link;
    }
    setLink(etiqueta) {
        this.#etiqueta = etiqueta;
    }
    setModificarStock(cant) {
        this.#stock = parseInt(this.#stock) + parseInt(cant)
    }
};
