export class FetchSucursalApi {
    #url;

    constructor(){
        this.#url = "https://bsite.net/metalflap/td-sucursal";
    }

    async getSucursal() {
        const resp = await fetch(this.#url);
        const sucursales = await resp.json();
        return sucursales;
    };
};

