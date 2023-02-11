/* --- Inicializar Sitio --------------------------------------- */
/* ------------------------------------------------------------- */
import { Categoria } from "../class/Categoria.js";
import { Tienda } from "../class/Tienda.js"
import { Juego } from "../class/Juego.js"
import { Carrito } from "../class/Carrito.js";
import { correo } from "../js/correo.js"
 
window.onload = () => {
    inicializarTienda();
    inicializarTemps()
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
                newCategoria.setJuego( new Juego(juego.id, juego.nombre, juego.precio, juego.dercripcion, juego.stock, juego.link, juego.etiqueta));
            });

            objTienda.setCategoria(newCategoria);
        });

        iniBodegaLocalStorage(objTienda);
    })
    .then(() => {
        renderProductos();
        console.log("Datos Cargados Correctamente")
    })
    .catch((err) => console.log(`Error Fetch: ${err}`))
};

function inicializarTemps() {
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
            carrito.setProducto(e.idCateg, e.idJuego, e.cant);
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
                newCategoria.setJuego(new Juego(juego._id, juego._nombre, juego._precio, juego._dercripcion, juego._stock, juego._link, juego._etiqueta));
            });

            bodega.setCategoria(newCategoria);
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
            obj.value = juego.getEtiqueta();
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
            const idJuego = obj.value;
            const cantTarjeta = document.querySelector(`#cant_${idJuego}`);
            const idCateg = cantTarjeta.value;
            const cant = cantTarjeta.textContent;
            cantTarjeta.textContent = 1;

            modificarCarrito(idCateg, parseInt(idJuego), parseInt(cant));
        });

        validarStock(obj.value);
    });
}

function renderCarrito() {
    let canasta = getCarritoLocalStorage()
    const cantCarrito = document.querySelector("#cantCarrito");
    cantCarrito.textContent = canasta.getCantProductos();

    renerDetaCarrito();
}

function renerDetaCarrito() {
    let padre, hijo, nieto, texto, cant, subtotal, envio;
    cant = 0; 
    subtotal = 0; 
    envio = 0;
    const carrito = getCarritoLocalStorage();
    const bodega = getBodegaLocalStorage();

    let detaCarritoContenedor = document.querySelector("#detaCarritoContenedor");
    
    detaCarritoContenedor.innerHTML = "";

    carrito.getProductos().forEach(e => {
        const juego = bodega.getCategorias().find(categ => categ.getId() == e.idCateg).getJuegos().find(juego => juego.getId() == e.idJuego);

        cant += e.cant;
        subtotal += (e.cant * juego.getPrecio())
        envio = 5500;
        
        let objContenedor = document.createElement("div");
        objContenedor.classList.add("itemCarrito");

        // ------------------------------------
        padre = document.createElement("div");
        hijo = document.createElement("img");
        hijo.classList.add("btnMasCarrito");
        hijo.id = e.idCateg;
        hijo.value = e.idJuego;
        hijo.src="./img/mas.svg";
        padre.appendChild(hijo);

        hijo = document.createElement("img");
        hijo.classList.add("btnMenosCarrito");
        hijo.id = e.idCateg;
        hijo.value = e.idJuego;
        hijo.src="./img/menos.svg";
        padre.appendChild(hijo);
        objContenedor.appendChild(padre);
        // ------------------------------------
        padre = document.createElement("div");
        padre.classList.add("detaCarrito");

        texto = document.createTextNode(`Item: ${juego.getNombre()}`);
        hijo = document.createElement("div");
        hijo.appendChild(texto);
        padre.appendChild(hijo);

        // texto = document.createTextNode(`Desc: ${"Prueba"}`);
        // hijo = document.createElement("div");
        // hijo.appendChild(texto);
        // padre.appendChild(hijo);

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

        texto = document.createTextNode(`Precio: ${formatoCL.format(juego.getPrecio())} - `);
        nieto = document.createElement("span");
        nieto.appendChild(texto);
        hijo.appendChild(nieto);

        texto = document.createTextNode(`Total: ${formatoCL.format(e.cant * juego.getPrecio())}`);
        nieto = document.createElement("span");
        nieto.appendChild(texto);
        hijo.appendChild(nieto);

        padre.appendChild(hijo);
        // -----
        objContenedor.appendChild(padre);
        // ------------------------------------
        padre = document.createElement("img");
        padre.classList.add("btnDeleteCarrito");
        padre.id = e.idCateg;
        padre.value = e.idJuego;
        padre.src="./img/basura.svg";

        objContenedor.appendChild(padre);
        // ------------------------------------

        detaCarritoContenedor.appendChild(objContenedor);
    });

    // Totales Final --------------------------
    // -- generales --
    let hr
    let div; 
    let totalCarrito = document.createElement("div");
    totalCarrito.classList.add("totalCarrito");
    
    hr = document.createElement("hr");
    totalCarrito.appendChild(hr);

    div = document.createElement("div");
    texto = document.createTextNode("· Cant Productos:");
    padre = document.createElement("p")
    padre.appendChild(texto);
    div.appendChild(padre);
    texto = document.createTextNode(cant);
    padre = document.createElement("p")
    padre.appendChild(texto);
    div.appendChild(padre);
    totalCarrito.appendChild(div);

    hr = document.createElement("hr");
    totalCarrito.appendChild(hr);
    
    div = document.createElement("div");
    texto = document.createTextNode("· Sub Total:");
    padre = document.createElement("p")
    padre.appendChild(texto);
    div.appendChild(padre);
    texto = document.createTextNode(formatoCL.format(subtotal));
    padre = document.createElement("p")
    padre.appendChild(texto);
    div.appendChild(padre);
    totalCarrito.appendChild(div);

    hr = document.createElement("hr");
    totalCarrito.appendChild(hr);

    div = document.createElement("div");
    texto = document.createTextNode("· Consto Envio:");
    padre = document.createElement("p")
    padre.appendChild(texto);
    div.appendChild(padre);
    texto = document.createTextNode(formatoCL.format(envio));
    padre = document.createElement("p")
    padre.appendChild(texto);
    div.appendChild(padre);
    totalCarrito.appendChild(div);

    hr = document.createElement("hr");
    totalCarrito.appendChild(hr);

    div = document.createElement("div");
    texto = document.createTextNode("· TOTAL:");
    padre = document.createElement("p")
    padre.appendChild(texto);
    div.appendChild(padre);
    texto = document.createTextNode(formatoCL.format(subtotal + envio));
    padre = document.createElement("p")
    padre.appendChild(texto);
    div.appendChild(padre);
    totalCarrito.appendChild(div);

    hr = document.createElement("hr");
    totalCarrito.appendChild(hr);

    detaCarritoContenedor.appendChild(totalCarrito);
    // ---------------------------------------

    const btnMasCarrito = document.querySelectorAll(".btnMasCarrito")
    btnMasCarrito.forEach(obj => {
        obj.addEventListener("click", () => {
            modificarCarrito(obj.id, obj.value, 1)
        })
    })

    const btnMenosCarrito = document.querySelectorAll(".btnMenosCarrito")
    btnMenosCarrito.forEach(obj => {
        obj.addEventListener("click", () => {
            modificarCarrito(obj.id, obj.value, -1)
        })
    })

    const btnDeleteCarrito = document.querySelectorAll(".btnDeleteCarrito")
    btnDeleteCarrito.forEach(obj => {
        obj.addEventListener("click", () => {
            deleteElementoCarrito(obj.id, obj.value);
        })
    })
};

/* --- Tarjeta ------------------------------------------------- */
/* ------------------------------------------------------------- */
const txtBuscar = document.querySelector("#txtBuscar")
txtBuscar.addEventListener("keyup", () => buscarTarjeta());

function buscarTarjeta() {
    const filter = document.querySelector("#txtBuscar").value.toUpperCase()
    let card = document.querySelectorAll(".card");

    card.forEach(e => {
        e.style.display = "none";
        let txtValue = e.querySelector("h1").value

        if (txtValue.toUpperCase().indexOf(filter) > -1) {
            e.style.display = "";
        }
    });
}

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
function setStockBodega(idCateg, idJuego, cant) {
    let bodega = getBodegaLocalStorage()
    bodega.getCategorias().find(categ => categ.getId() == idCateg).getJuegos().find(juego => juego.getId() == idJuego).setModificarStock(cant);
    setBodegaLocalStorage(bodega);
}

function getStockBodega(idCateg, idJuego) {
    const bodega = getBodegaLocalStorage()
    const stock = bodega.getCategorias().find(categ => categ.getId() == idCateg).getJuegos().find(juego => juego.getId() == idJuego).getStock();
    return stock
}

function deleteElementoCarrito(idCateg, idJuego) {
    const carrito = getCarritoLocalStorage();
    const cant = carrito.getProductosById(idJuego).cant;
    modificarCarrito(idCateg, idJuego, cant * -1)
}

function modificarCarrito(idCateg, idJuego, cant) {
    let estado = false;
    let carrito = getCarritoLocalStorage();
    const index = carrito.getProductos().findIndex(d => d.idJuego == idJuego)
    // si el producto no existe en la canasta
    if (index == -1) {
        carrito.setProducto(idCateg, idJuego, cant);
        estado = true;
    };
    // si el producto existe en la canasta se hace esto
    if (index > -1) {
        const stockBodega = getStockBodega(idCateg, idJuego);
        const cantProdCarrito = carrito.getProductosById(idJuego).cant;
        // se suma o se restan productos de la canasta
        if (!(cant > 0 && stockBodega == 0) && !(cant < 0 && cantProdCarrito == 0)) {
            carrito.getProductosById(idJuego).cant += cant;
            estado = true
        }
        // si el prodiucto de la canasta llega 0 se elimina
        if (carrito.getProductosById(idJuego).cant == 0) {
            carrito.deleteProductosById(idJuego) 
        }
    };
    
    if (estado) {
        setStockBodega(idCateg, idJuego, cant * (-1));
        setCarritoLocalStorage(carrito);
    }

    renderCarrito();
    renderProductos()        
    validarStock(idJuego)
};

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

const btnPagar = document.querySelector(".btnPagar");
btnPagar.addEventListener("click", pagarCarrito)

const inputDespachoCarrito = document.querySelectorAll(".despachoCarrito > input")
inputDespachoCarrito.forEach(obj => {
    obj.addEventListener("keyup", () => {
        obj.classList.remove("despachoCarritoInput_no");
    })
});

function pagarCarrito() {
    let estado = true;
    inputDespachoCarrito.forEach(obj => {
        if (!obj.value) {
            estado = false;
            obj.classList.add("despachoCarritoInput_no");
        }
    });

    if (estado) {

        enviarCorreo();

        inputDespachoCarrito.forEach(obj => {
            obj.value = "";
            obj.classList.remove("despachoCarritoInput_no");
        });

        console.log("Pago Exitoso");
    }
};

function enviarCorreo() {
    const despachoCarrito = document.querySelector(".despachoCarrito");
    const newCorreo = correo(despachoCarrito);
    console.log(newCorreo);
    
}