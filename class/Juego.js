
export class Juego {
    constructor(id, nombre, precio, dercripcion, stock, link) {
        this._id = id;
        this._nombre = nombre;
        this._precio = precio;
        this._dercripcion = dercripcion;
        this._stock = stock;
        this._link = link;
    }
    getId() {
        return this._id;
    }
    getNombre() {
        return this._nombre;
    }
    getPrecio() {
        return this._precio;
    }
    getDercripcion() {
        return this._dercripcion;
    }
    getStock() {
        return this._stock;
    }
    getLink() {
        return this._link;
    }
    setModificarStock(cant) {
        this._stock = parseInt(this._stock) + parseInt(cant)
    }
}







