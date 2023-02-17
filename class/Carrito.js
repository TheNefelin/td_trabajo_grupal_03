
export class Carrito {
    constructor() {
        this._productos = [];
        this._cant = 0;
    }
    setProducto(idCateg, idProducto, cant) {
        this._productos.push({idCateg, idProducto, cant});
    }
    getProductos() {
        return this._productos;
    }
    getProductosById(idProducto) {
        return this._productos.find(e => e.idProducto == idProducto);
    }
    deleteProductosById(idProducto) {
        let index = this._productos.findIndex(e => e.idProducto == idProducto);
        this._productos.splice(index, 1);
    }
    getCantProductos() {
        this._productos.forEach(e => {
            this._cant = parseInt(this._cant) + parseInt(e.cant);
        })
        return this._cant;
    }
}
