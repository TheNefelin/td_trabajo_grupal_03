
export class Sucursal {
    constructor(id, nombre) {
        this._id = id;
        this._nombre = nombre;
        this._categorias = [];
    }
    getId() {
        return this._id;
    }
    getNombre() {
        return this._nombre;
    }
    getCategorias() {
        return this._categorias;
    }
    setCategoria(categoria) {
        this._categorias.push(categoria);
    }
};
