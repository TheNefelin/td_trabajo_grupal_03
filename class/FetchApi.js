class API {
    #url;
    
    constructor() {
        this.#url = "https://bsite.net/metalflap";
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
        const url = `${this.getUrl()}/td-producto/idSucursal/${id}`
        const resp = await fetch(url);
        const data = await resp.json();
        return data;
    };

    async postProducto(producto) {
        console.log(JSON.stringify(producto))
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
        console.log(`${this.getUrl()}/td-producto/${id}`)
        const resp = await fetch(`${this.getUrl()}/td-producto/${id}`, {
            method: "DELETE",
            headers: {
                "Accept": "application/json",
            }
        });
        console.log(resp)
        return resp;
    };
};