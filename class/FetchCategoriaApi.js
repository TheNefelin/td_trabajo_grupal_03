export class FetchCategoriaApi{
    #url
    
    constructor(){
        this.#url = "https://bsite.net/metalflap/td-categoria"
    }

    async getCategoria() {
        const resp = await fetch(this.#url);
        const categorias = await resp.json();
        return categorias;
    };
};

