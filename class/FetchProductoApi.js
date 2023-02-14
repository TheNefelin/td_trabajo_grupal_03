export class FetchProductoApi{
    constructor(){}

    async getProducto() {
        const resp = await fetch("https://bsite.net/metalflap/td-producto");
        const productos = await resp.json();
        return productos;
    };

    async setPrdocuto(producto) {
        const resp = await fetch("https://bsite.net/metalflap/td-producto", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(producto)
        });
    };
};

