
export class Categoria {
    constructor(nombre) {
        this._nombre = nombre;
        this._juegos = [];
    }
    getNombre() {
        return this._nombre;
    }
    getJuegos() {
        return this._juegos;
    }
    setJuego(juego) {
        this._juegos.push(juego);
    }
}



