
export function Tienda(nombre) {
    this._nombre = nombre;
    this._categorias = [];
};

Tienda.prototype.getNombre = function() {
    return this._nombre;
};

Tienda.prototype.getCategorias = function() {
    return this._categorias;
};

Tienda.prototype.setCategria = function(categoria) {
    this._categorias.push(categoria);
};