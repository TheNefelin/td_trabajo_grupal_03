/* --- Inicializar Sitio --------------------------------------- */
/* ------------------------------------------------------------- */
import { Categoria } from "../class/Categoria.js";
import { Tienda } from "../class/Tienda.js"
import { Juego } from "../class/Juego.js"
import { Carrito } from "../class/Carrito.js";

window.onload = () => {
    // deleteCarritoLocalStorage();
    // deleteBodegaLocalStorage();
    inicializarTienda();
    inisializarTemps()
    console.log("Sitio Iniciado")
}

function inicializarTienda() {
    fetch("../data/data.json")
        .then(resp => resp.json())
        .then(data => {
            let objTienda = new Tienda(data.negocio.nombre);

            data.negocio.categorias.map(categ => {
                let newCategoria = new Categoria(categ.id, categ.nombre);

                categ.juegos.map(juego => {
                    newCategoria.setJuego(new Juego(juego.id, juego.nombre, juego.precio, juego.dercripcion, juego.stock, juego.link));
                });

                objTienda.setCategria(newCategoria);
            });

            iniBodegaLocalStorage(objTienda);
        })
        .then(() => {
            renderProductos();
            console.log("Datos Cargados Correctamente")
        })
        .catch((err) => console.log(`Error Fetch: ${err}`))
};

function inisializarTemps() {
    const iniCarrito = getCarritoLocalStorage();

    if (iniCarrito) {
        renderCarrito()
    }
}

const linkResetSitio = document.querySelector("#resetSitio");
linkResetSitio.addEventListener("click", () => {
    resetSitio();
})

function resetSitio() {
    deleteCarritoLocalStorage();
    deleteBodegaLocalStorage();
}

/* --- Local Storage ------------------------------------------- */
/* ------------------------------------------------------------- */
function setCarritoLocalStorage(carrito) {
    window.localStorage.setItem("carrito", JSON.stringify(carrito));
}

function getCarritoLocalStorage() {
    let localS = JSON.parse(window.localStorage.getItem("carrito"));
    let carrito = new Carrito;

    if (localS) {
        localS._productos.forEach(e => {
            carrito.setProducto(e.id, e.cant, e.idCateg);
        });
    };

    return carrito;
}

function deleteCarritoLocalStorage() {
    window.localStorage.removeItem("carrito");
}

function iniBodegaLocalStorage(bodega) {
    const localS = JSON.parse(window.localStorage.getItem("bodega"));
    if (!localS) {
        setBodegaLocalStorage(bodega);
    };
}

function setBodegaLocalStorage(bodega) {
    window.localStorage.setItem("bodega", JSON.stringify(bodega));
}

function getBodegaLocalStorage() {
    let localS = JSON.parse(window.localStorage.getItem("bodega"));
    let bodega

    if (localS) {
        bodega = new Tienda(localS._nombre);

        localS._categorias.map(categ => {
            let newCategoria = new Categoria(categ._id, categ._nombre);

            categ._juegos.map(juego => {
                newCategoria.setJuego(new Juego(juego._id, juego._nombre, juego._precio, juego._dercripcion, juego._stock, juego._link));
            });

            bodega.setCategria(newCategoria);
        });
    }

    return bodega;
}

function deleteBodegaLocalStorage() {
    window.localStorage.removeItem("bodega");
}

/* --- Paltas -------------------------------------------------- */
/* ------------------------------------------------------------- */
const formatoCL = new Intl.NumberFormat('es-CL', {
    style: "currency",
    currency: "CLP",
});

/* --- NavBar -------------------------------------------------- */
/* ------------------------------------------------------------- */
const navBar01Btn = document.querySelector(".navBar01-btn");

navBar01Btn.addEventListener("click", () => {
    navBar01Btn.classList.toggle("navBar01-btn_click");

    const navBar01Links = document.querySelector(".navBar01-links");
    navBar01Links.classList.toggle("navBar01-links_noOcultar");
});

/* --- Carrusel ------------------------------------------------ */
/* ------------------------------------------------------------- */
let slideIndex = 0;
showSlides();

function showSlides() {
    let i;
    let slides = document.getElementsByClassName("mySlides");

    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }

    slideIndex++;
    if (slideIndex > slides.length) { slideIndex = 1 }

    slides[slideIndex - 1].style.display = "block";
    setTimeout(showSlides, 4000);
}

/* --- Render Sitio -------------------------------------------- */
/* ------------------------------------------------------------- */
function renderProductos() {
    const tienda = document.querySelector("#tienda");
    tienda.innerHTML = "";

    const bodega = getBodegaLocalStorage();

    bodega.getCategorias().map((categ) => {
        categ.getJuegos().map((juego) => {
            let texto;
            let obj;
            const divCart = document.createElement("div");
            divCart.classList.add("card");

            // -- Hijos --
            obj = document.createElement("img");
            obj.src = juego.getLink();
            divCart.appendChild(obj);

            texto = document.createTextNode(juego.getNombre());
            obj = document.createElement("h1");
            obj.appendChild(texto);
            divCart.appendChild(obj);

            // ------------------------------------------
            texto = document.createTextNode(`Categ: ${categ.getNombre()} - Stock: `);
            const divContenedorStock = document.createElement("h4");
            divContenedorStock.appendChild(texto);

            // -- Nieto --
            texto = document.createTextNode(juego.getStock());
            obj = document.createElement("span");
            obj.id = `stock_${juego.getId()}`;
            obj.appendChild(texto);
            divContenedorStock.appendChild(obj);

            divCart.appendChild(divContenedorStock);

            // ------------------------------------------
            texto = document.createTextNode(formatoCL.format(juego.getPrecio()));
            obj = document.createElement("p");
            obj.classList.add("price");
            obj.appendChild(texto);
            divCart.appendChild(obj);

            // -------------------------------------------
            const divContenedorBtn = document.createElement("div");
            divContenedorBtn.classList.add("btnMasMenos");

            // -- Nietos --
            obj = document.createElement("img");
            obj.classList.add("btnMenos");
            obj.src = "./img/menos.svg";
            obj.id = juego.getId();
            divContenedorBtn.appendChild(obj);

            texto = document.createTextNode("1");
            obj = document.createElement("h3");
            obj.appendChild(texto);
            obj.id = `cant_${juego.getId()}`;
            obj.value = categ.getId();
            divContenedorBtn.appendChild(obj);

            obj = document.createElement("img");
            obj.classList.add("btnMas");
            obj.src = "./img/mas.svg";
            obj.id = juego.getId();
            divContenedorBtn.appendChild(obj);

            divCart.appendChild(divContenedorBtn)

            // -------------------------------------------
            const divContenedorAgregar = document.createElement("div");

            // -- Nieto --
            texto = document.createTextNode("Agregar");
            obj = document.createElement("button");
            obj.id = `btnAgregar_${juego.getId()}`
            obj.value = juego.getId();
            obj.classList.add("cardBtn");
            obj.appendChild(texto);
            divContenedorAgregar.appendChild(obj);

            divCart.appendChild(divContenedorAgregar);
            // -------------------------------------------

            tienda.appendChild(divCart);

            // Era lo anterior o Esto --------------------------------------------------
            //--------------------------------------------------------------------------
            // html += `
            // <div class="card">
            //     <img src="${juego.getLink()}">
            //     <h1>${juego.getNombre()}</h1>
            //     <h4>Categ: ${categ.getNombre()} - Stock: (${juego.getStock()})</h4>
            //     <p class="price">${formatoCL.format(juego.getPrecio())}</p>
            //     <div class="btnMasMenos">
            //         <img id=${juego.getId()} class="btnMenos" src="./img/menos.svg"></class=>
            //         <h3 id="cant_${juego.getId()}">0</h3>
            //         <img id=${juego.getId()} class="btnMas" src="./img/mas.svg">
            //     </div>
            //     <div><button>Agregar</button></div>
            // </div>`
        })
    })

    const btnMenos = document.querySelectorAll(".btnMenos");
    btnMenos.forEach(obj => {
        obj.addEventListener("click", () => {
            sumarEnTarjeta(obj.id, -1)
        });
    });

    const btnMas = document.querySelectorAll(".btnMas");
    btnMas.forEach(obj => {
        obj.addEventListener("click", () => {
            sumarEnTarjeta(obj.id, 1)
        });
    });

    const btnAgregar = document.querySelectorAll(".cardBtn");
    btnAgregar.forEach(obj => {
        obj.addEventListener("click", () => {
            agregarACarrito(obj.value);
        });

        validarStock(obj.value);
    });
}

function renderCarrito() {
    const cantCarrito = document.querySelector("#cantCarrito");

    let canasta = getCarritoLocalStorage()
    cantCarrito.textContent = canasta.getCantProductos();

    renerDetaCarrito();
}

function renerDetaCarrito() {
    let padre, hijo, nieto, texto;
    const carrito = getCarritoLocalStorage();
    const bodega = getBodegaLocalStorage();

    let detaCarritoContenedor = document.querySelector("#detaCarritoContenedor");
    detaCarritoContenedor.innerHTML = "";

    carrito.getProductos().forEach(e => {
        const juego = bodega.getCategorias().find(categ => categ.getId() == e.idCateg).getJuegos().find(juego => juego.getId() == e.id);

        let objContenedor = document.createElement("div");
        objContenedor.classList.add("itemCarrito");

        // ------------------------------------
        padre = document.createElement("div");
        hijo = document.createElement("img");
        hijo.src = "./img/mas.svg";
        padre.appendChild(hijo);

        hijo = document.createElement("img");
        hijo.src = "./img/menos.svg";
        padre.appendChild(hijo);
        objContenedor.appendChild(padre);
        // ------------------------------------
        padre = document.createElement("div");
        padre.classList.add("detaCarrito");

        texto = document.createTextNode(`Item: ${juego.getNombre()}`);
        hijo = document.createElement("div");
        hijo.appendChild(texto);
        padre.appendChild(hijo);

        texto = document.createTextNode(`Desc: ${"Prueba"}`);
        hijo = document.createElement("div");
        hijo.appendChild(texto);
        padre.appendChild(hijo);

        hijo = document.createElement("hr");
        padre.appendChild(hijo);
        // -----
        hijo = document.createElement("div");

        texto = document.createTextNode(`Stock: ${juego.getStock()} - `);
        nieto = document.createElement("span");
        nieto.appendChild(texto);
        hijo.appendChild(nieto);

        texto = document.createTextNode(`Cant: ${e.cant} - `);
        nieto = document.createElement("span");
        nieto.appendChild(texto);
        hijo.appendChild(nieto);

        texto = document.createTextNode(`Precio: ${juego.getPrecio()} - `);
        nieto = document.createElement("span");
        nieto.appendChild(texto);
        hijo.appendChild(nieto);

        texto = document.createTextNode(`Total: ${e.cant * juego.getPrecio()}`);
        nieto = document.createElement("span");
        nieto.appendChild(texto);
        hijo.appendChild(nieto);

        padre.appendChild(hijo);
        // -----
        objContenedor.appendChild(padre);
        // ------------------------------------
        padre = document.createElement("img");
        padre.src = "./img/basura.svg";

        objContenedor.appendChild(padre);
        // ------------------------------------

        detaCarritoContenedor.appendChild(objContenedor);
    });
};

/* --- Tarjeta ------------------------------------------------- */
/* ------------------------------------------------------------- */
function sumarEnTarjeta(id, n) {
    let cantTarjeta = document.querySelector(`#cant_${id}`);
    let cant = parseInt(cantTarjeta.textContent);
    let stockTarjeta = document.querySelector(`#stock_${id}`);
    const stock = parseInt(stockTarjeta.textContent);

    if (validarStock(id)) {
        cant += n

        if (cant <= 1) {
            cant = 1;
        } else if (cant > stock) {
            cant = stock;
        }
    }

    cantTarjeta.textContent = cant;
}

function validarStock(id) {
    let btnAgregar = document.querySelector(`#btnAgregar_${id}`);
    let stockTarjeta = document.querySelector(`#stock_${id}`);

    if (parseInt(stockTarjeta.textContent) == 0) {
        btnAgregar.disabled = true
        btnAgregar.classList.add("cardBtn_noDisplay");
        btnAgregar.textContent = "Sin Stock"
        return false;
    } else {
        btnAgregar.disabled = false
        btnAgregar.classList.remove("cardBtn_noDisplay");
        btnAgregar.textContent = "Agregar"
        return true
    }
}

/* --- Carrito ------------------------------------------------- */
/* ------------------------------------------------------------- */
function getProductoBy(idCateg, idJuego) {
    let bodega = getBodegaLocalStorage()
    console.log(bodega.getCategorias().find(categ => categ.getId() == idCateg).getJuegos().find(juego => juego.getId() == idJuego));
}

function reducirStock(idCateg, idJuego, cant) {
    let bodega = getBodegaLocalStorage()
    bodega.getCategorias().find(categ => categ.getId() == idCateg).getJuegos().find(juego => juego.getId() == idJuego).setReducirStock(cant);
    setBodegaLocalStorage(bodega);
}

function aumentarStock(idCateg, idJuego, cant) {
    let bodega = getBodegaLocalStorage()
    bodega.getCategorias().find(categ => categ.getId() == idCateg).getJuegos().find(juego => juego.getId() == idJuego).setAumentarStock(cant);
    setBodegaLocalStorage(bodega);
}

function agregarACarrito(id) {
    const cantTarjeta = document.querySelector(`#cant_${id}`);
    const idCateg = cantTarjeta.value;

    let carrito = getCarritoLocalStorage();
    const index = carrito.getProductos().findIndex(d => d.id == id)
    const cant = parseInt(cantTarjeta.textContent);

    if (index >= 0) {
        carrito.getProductos().forEach(e => {
            if (e.id == id) {
                e.cant = parseInt(e.cant) + cant;
            }
        })
    } else {
        carrito.setProducto(id, cant, idCateg)
    }

    cantTarjeta.textContent = 1
    reducirStock(idCateg, id, cant);
    setCarritoLocalStorage(carrito);

    renderCarrito();
    renderProductos()
}

const carritoContenedor = document.querySelector(".carrito-contenedor");
carritoContenedor.addEventListener("click", () => {
    verCarrito();
});

function verCarrito() {
    const cantCarrito = document.querySelector("#cantCarrito");
    if (cantCarrito.textContent > 0) {
        let elCarrito = document.querySelector(".verCarrito");
        elCarrito.classList.add("verCarrito_si");
    };
};

const salirDetaCarrito = document.querySelector(".salirDetaCarrito");
salirDetaCarrito.addEventListener("click", () => {
    ocultarCarrito();
});

function ocultarCarrito() {
    let elCarrito = document.querySelector(".verCarrito");
    elCarrito.classList.remove("verCarrito_si");
};






const myInput=document.getElementById("myInput")
myInput.addEventListener("keyup", () => {
    myFunction()

});
function myFunction() {
    var input = document.getElementById("myInput");
    var filter = input.value.toUpperCase();
    var ul= document.getElementById("tienda");
    var li= ul.getElementsByClassName('card');
    
        for (let i = 0; i < li.length; i++) {
           var name =li[i].getElementsByTagName("h1")[0];
           console.log(name);
        //    var txtValue = name.textContent || name.innerText;
        //    if (txtValue.toUpperCase().indexOf(filter) > -1) {
        //        li[i].style.display = "";
        //    } else {
        //        li[i].style.display = "none";
        //    }

       }
}



