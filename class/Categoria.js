
export class Categoria {
    constructor(id, nombre) {
        this._id = id;
        this._nombre = nombre;
        this._juegos = [];
    }
    getId() {
        return this._id;
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



