
export class Categoria {
    constructor(id, nombre) {
        this._id = id;
        this._nombre = nombre;
        this._productos = [];
    }
    getId() {
        return this._id;
    }
    getNombre() {
        return this._nombre;
    }
    getProductos() {
        return this._productos;
    }
    setProducto(producto) {
        this._productos.push(producto);
    }
}



