class API {
    #URL;
    
    constructor() {
        this.#URL = "https://bsite.net/metalflap";
    };

    getUrl() { 
        return this.#URL; 
    };
};

export class SucursalApi extends API {
    constructor() {
        super();
    }

    async getSucursal() {
        const resp = await fetch(`${this.getUrl()}/td-sucursal`);
        const data = await resp.json();
        return data;
    };
};

export class CategoriaApi extends API {
    constructor() {
        super();
    }

    async getCategoria() {
        const resp = await fetch(`${this.getUrl()}/td-categoria`);
        const data = await resp.json();
        return data;
    };
};

export class ProductoApi extends API {
    constructor() {
        super();
    }

    async getProducto() {
        const resp = await fetch(`${this.getUrl()}/td-producto`);
        const data = await resp.json();
        return data;
    };

    async getProductoById(id) {
        const url = `${this.getUrl()}/td-producto/idSucursal/${id}`
        const resp = await fetch(url);
        const data = await resp.json();
        return data;
    };
};