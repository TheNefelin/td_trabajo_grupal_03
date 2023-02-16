
export class Producto {
    constructor(id, nombre, precio, link, stock, etiqueta, dercripcion, idCategoria, idSucursal) {
        this._id = id;
        this._nombre = nombre;
        this._precio = precio;
        this._link = link;
        this._stock = stock;
        this._etiqueta = etiqueta;
        this._dercripcion = dercripcion;
        this._idCategoria = idCategoria
        this._idSucursal = idSucursal
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
    getLink() {
        return this._link;
    }
    getStock() {
        return this._stock;
    }
    getEtiqueta() {
        return this._etiqueta;
    }
    getDercripcion() {
        return this._dercripcion;
    }
    getCategoria() {
        return this._idCategoria;
    }
    getSucursal() {
        return this._idSucursal;
    }
    setNombre(nombre) {
        this._nombre = nombre;
    }
    setPrecio(precio) {
        this._precio = precio;
    }
    setDercripcion(descripcion) {
        this._dercripcion = descripcion;
    }
    setStock(stock) {
        this._stock = stock;
    }
    setLink(link) {
        this._link = link;
    }
    setEtiqueta(etiqueta) {
        this._etiqueta = etiqueta;
    }
    setModificarStock(cant) {
        this._stock = parseInt(this._stock) + parseInt(cant)
    }
};







