class API {
    #url;
    
    constructor() {
        this.#url = "https://slifer.bsite.net"
    };

    getUrl() { 
        return this.#url; 
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
        const resp = await fetch(`${this.getUrl()}/td-producto/${id}`);
        const data = await resp.json();
        return data;
    };

    async getProductoByIdSucursal(id) {
        const resp = await fetch(`${this.getUrl()}/td-producto/idSucursal/${id}`);
        const data = await resp.json();
        return data;
    };

    async postProducto(producto) {
        const resp = await fetch(`${this.getUrl()}/td-producto`, {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(producto)
        })
        return resp;
    };

    async putProducto(producto) {
        const resp = await fetch(`${this.getUrl()}/td-producto`, {
            method: "PUT",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(producto)
        });
        return resp;
    };

    async deleteProductoById(id) {
        await fetch(`${this.getUrl()}/td-producto/${id}`, {
            method: "DELETE",
            headers: {
                "Accept": "application/json",
            },
            body: JSON.stringify(id)
        });
    };
};
