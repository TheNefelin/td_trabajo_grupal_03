
export function Categoria(nombre) {
    this._nombre = nombre;
    this._juegos = [];
}

Categoria.prototype.getNombre = function() {
    return this._nombre;
};

Categoria.prototype.getJuegos = function() {
    return this._juegos;
};

Categoria.prototype.setJuego = function(juego) {
    this._juegos.push(juego);
};