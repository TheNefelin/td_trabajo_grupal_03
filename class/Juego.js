
export function Juego(id, nombre, precio, dercripcion, stock, link) {
    this._id = id;
    this._nombre = nombre;
    this._precio = precio;
    this._dercripcion = dercripcion;
    this._stock = stock;
    this._link = link;
}

Juego.prototype.getId = function() {
    return this._id;
};

Juego.prototype.getNombre = function() {
    return this._nombre;
};

Juego.prototype.getPrecio = function() {
    return this._precio;
}

Juego.prototype.getDercripcion = function() {
    return this._dercripcion;
}

Juego.prototype.getStock = function() {
    return this._stock;
}

Juego.prototype.getLink = function() {
    return this._link;
}
