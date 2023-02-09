
export class Carrito {
    constructor() {
        this._productos = [];
        this._cant = 0;
    }
    getProductos() {
        return this._productos;
    }
    getProductosById(idJuego) {
        return this._productos.find(e => e.id == idJuego);
    }
    deleteProductosById(idJuego) {
        let index = this._productos.findIndex(e => e.id == idJuego);
        this._productos.splice(index, 1);
    }
    getCantProductos() {
        this._productos.forEach(e => {
            this._cant = parseInt(this._cant) + parseInt(e.cant);
        })
        return this._cant;
    }
    setProducto(id, cant, idCateg) {
        this._productos.push({id, cant, idCateg});
    }
}
