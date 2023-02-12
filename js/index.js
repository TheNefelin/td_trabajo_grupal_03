/* --- Inicializar Sitio --------------------------------------- */
/* ------------------------------------------------------------- */
import { Categoria } from "../class/Categoria.js";
import { Tienda } from "../class/Tienda.js"
import { Juego } from "../class/Juego.js"
import { Carrito } from "../class/Carrito.js";
import { correo } from "../js/correo.js"
 
window.onload = () => {
    inicializar()
}

function inicializar() {
    inicializarTienda();
    inicializarTemps()
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
        renderInventario()
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
    inicializar();
    cerrarMenu();
    console.log("Sitio Reseteado");
}

const linkLogo = document.querySelector(".navBar01-logo");
linkLogo.addEventListener("click", () => {
    inicializar();
    cerrarMenu();
});

function cerrarMenu() {
    navBar01Btn.classList.remove("navBar01-btn_click");
    navBar01Links.classList.remove("navBar01-links_noOcultar");
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
const navBar01Links = document.querySelector(".navBar01-links"); 

navBar01Btn.addEventListener("click", () => {
    navBar01Btn.classList.toggle("navBar01-btn_click");
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

/* --- Buscador ------------------------------------------------ */
/* ------------------------------------------------------------- */
const txtBuscar = document.querySelector("#txtBuscar")
txtBuscar.addEventListener("keyup", () => {
    buscarTarjeta(txtBuscar.value.toUpperCase(), rangeBuscar.value, filtroCategoria.value);
});

const rangeBuscar = document.querySelector("#rangeBuscar");
rangeBuscar.addEventListener("input", () => {
    buscarTarjeta(txtBuscar.value.toUpperCase(), rangeBuscar.value, filtroCategoria.value);
});

const filtroCategoria = document.querySelector("#filtroCategoria");
filtroCategoria.addEventListener("change", () => {
    buscarTarjeta(txtBuscar.value.toUpperCase(), rangeBuscar.value, filtroCategoria.value);
});

function buscarTarjeta(txtFilter, precioFilter, categoriaFilter) {
    //Setea el precion sobre la barra del filtro por precio
    let txtRangeBuscar = document.querySelector("#txtRangeBuscar");
    txtRangeBuscar.textContent = formatoCL.format(precioFilter);

    let card = document.querySelectorAll(".card");

    card.forEach(e => {
        e.style.display = "none";
        let valueH1 = e.querySelector("h1").value   //Referencia para filtrar por texto
        let valueP = e.querySelector("p").value     //Referencia para filtrar por precio
        let valueH4 = e.querySelector("h4").value   //Referencia para filtrar por categoria

        if ((valueH1.toUpperCase().indexOf(txtFilter) > -1) && (precioFilter >= parseInt(valueP)) && ((categoriaFilter == valueH4) || categoriaFilter == 0)) {
            e.style.display = "";
        }
    });
}

/* --- Render Sitio -------------------------------------------- */
/* ------------------------------------------------------------- */
function renderProductos() {
    let obj, precioMin, precioMax;
    precioMin = 0; 
    precioMax = 0;
    const tienda = document.querySelector("#tienda");
    tienda.innerHTML = "";

    const bodega = getBodegaLocalStorage();

    const filtroCategoria = document.querySelector("#filtroCategoria");
    obj = document.createElement("option");
    obj.value = 0;
    obj.innerText = "Todos";
    filtroCategoria.innerHTML = "";
    filtroCategoria.appendChild(obj);

    bodega.getCategorias().map((categ) => {
        categ.getJuegos().map((juego) => {
            const divCart = document.createElement("div");
            divCart.classList.add("card");

            if (juego.getStock() > 0) {
                juego.getPrecio() < precioMin || precioMin == 0 ? precioMin = juego.getPrecio() : false;
                juego.getPrecio() > precioMax ? precioMax = juego.getPrecio() : false;
            };

            // -- Hijos --
            obj = document.createElement("img");
            obj.src = juego.getLink();
            divCart.appendChild(obj);

            obj = document.createElement("h1");
            obj.value = juego.getEtiqueta();
            obj.innerText = juego.getNombre();
            divCart.appendChild(obj);

            // ------------------------------------------
            const divContenedorStock = document.createElement("h4");
            divContenedorStock.value = categ.getId();
            divContenedorStock.innerText = `Categ: ${categ.getNombre()} - Stock: `

            // -- Nieto --
            obj = document.createElement("span");
            obj.id = `stock_${juego.getId()}`;
            obj.innerText = juego.getStock();
            divContenedorStock.appendChild(obj);

            divCart.appendChild(divContenedorStock);

            // ------------------------------------------
            obj = document.createElement("p");
            obj.value = juego.getPrecio();
            obj.innerText = formatoCL.format(juego.getPrecio());
            obj.classList.add("price");
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

            obj = document.createElement("h3");
            obj.id = `cant_${juego.getId()}`;
            obj.value = categ.getId();
            obj.innerText = 1;
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
            obj = document.createElement("button");
            obj.id = `btnAgregar_${juego.getId()}`
            obj.value = juego.getId();
            obj.innerText = "Agregar";
            obj.classList.add("cardBtn");
            divContenedorAgregar.appendChild(obj);

            divCart.appendChild(divContenedorAgregar);
            // -------------------------------------------

            tienda.appendChild(divCart);
        })

        // -- Inicializa el filtro de categoria -----------------------
        obj = document.createElement("option");
        obj.value = categ.getId();
        obj.innerText = categ.getNombre();
        filtroCategoria.appendChild(obj);
        // ------------------------------------------------------------
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

    // -- Inicializa el filtro con los precio mayores y menores ----------
    rangeBuscar.min = precioMin;
    rangeBuscar.max = precioMax;
    rangeBuscar.value = precioMax;

    let txtRangeBuscar =  document.querySelector("#txtRangeBuscar");
    txtRangeBuscar.textContent = formatoCL.format(precioMax);
    // -------------------------------------------------------------------
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

        hijo = document.createElement("div");
        hijo.innerText = `Item: ${juego.getNombre()}`;
        padre.appendChild(hijo);

        hijo = document.createElement("hr");
        padre.appendChild(hijo);
        // -----
        hijo = document.createElement("div");
        hijo.innerText = `Stock: ${juego.getStock()} - Cant: ${e.cant} - Precio: ${formatoCL.format(juego.getPrecio())} - Total: ${formatoCL.format(e.cant * juego.getPrecio())}`;
        // nieto = document.createElement("span");
        // nieto.innerText = `Stock: ${juego.getStock()} - `
        // hijo.appendChild(nieto);

        // nieto = document.createElement("span");
        // nieto.innerText = `Cant: ${e.cant} - `
        // hijo.appendChild(nieto);

        // nieto = document.createElement("span");
        // nieto.innerText = `Precio: ${formatoCL.format(juego.getPrecio())} - `
        // hijo.appendChild(nieto);

        // nieto = document.createElement("span");
        // nieto.innerText = `Total: ${formatoCL.format(e.cant * juego.getPrecio())}`;
        // hijo.appendChild(nieto);

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

    // -- Resumen de cantidad de productos ---
    div = document.createElement("div");
    padre = document.createElement("p");
    padre.innerText = "· Cant Productos:";
    div.appendChild(padre);

    padre = document.createElement("p");
    padre.innerText = cant;
    div.appendChild(padre);
    totalCarrito.appendChild(div);

    hr = document.createElement("hr");
    totalCarrito.appendChild(hr);

    // -- Resumen sub total ------------------
    div = document.createElement("div");
    padre = document.createElement("p");
    padre.innerText = "· Sub Total:";
    div.appendChild(padre);

    padre = document.createElement("p")
    padre.innerText = formatoCL.format(subtotal);
    div.appendChild(padre);
    totalCarrito.appendChild(div);

    hr = document.createElement("hr");
    totalCarrito.appendChild(hr);

    // -- Costo de envio ---------------------
    div = document.createElement("div");
    padre = document.createElement("p");
    padre.innerText = "· Consto Envio:";
    div.appendChild(padre);

    padre = document.createElement("p")
    padre.innerText = formatoCL.format(envio);
    div.appendChild(padre);
    totalCarrito.appendChild(div);

    hr = document.createElement("hr");
    totalCarrito.appendChild(hr);

    // -- Resumen Total ----------------------
    div = document.createElement("div");
    padre = document.createElement("p");
    padre.innerText = "· TOTAL:";
    div.appendChild(padre);

    padre = document.createElement("p");
    padre.innerText = formatoCL.format(subtotal + envio);
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
        });
    });

    const btnMenosCarrito = document.querySelectorAll(".btnMenosCarrito")
    btnMenosCarrito.forEach(obj => {
        obj.addEventListener("click", () => {
            modificarCarrito(obj.id, obj.value, -1)
        });
    });

    const btnDeleteCarrito = document.querySelectorAll(".btnDeleteCarrito")
    btnDeleteCarrito.forEach(obj => {
        obj.addEventListener("click", () => {
            deleteElementoCarrito(obj.id, obj.value);
        });
    });
};

function renderInventario() {
    const buscadorInventario = document.querySelector(".buscadorInventario");
    const filtroTextContenedor = document.querySelector("#filtroTextContenedor");

    // buscadorInventario.appendChild(filtroTextContenedor);
    console.log("YA")
}

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
    cerrarMenu();
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
    });
});

function pagarCarrito() {
    let estado = true;
    inputDespachoCarrito.forEach(obj => {
        if (!obj.value) {
            estado = false;
            obj.classList.add("despachoCarritoInput_no");
        };
    });

    if (estado) {

        enviarCorreo();

        inputDespachoCarrito.forEach(obj => {
            obj.value = "";
            obj.classList.remove("despachoCarritoInput_no");
        });

        console.log("Pago Exitoso");
    };
};

function enviarCorreo() {
    const despachoCarrito = document.querySelector(".despachoCarrito");
    const newCorreo = correo(despachoCarrito);
};

/* --- Inventario ---------------------------------------------- */
/* ------------------------------------------------------------- */
const verInventario = document.querySelector(".verInventario");
const linkInventario = document.querySelector("#linkInventario");

linkInventario.addEventListener("click", () => {
    verInventario.classList.add("verInventario_si");
    cerrarMenu();
});

const btnSalirInventario = document.querySelector(".btnSalirInventario");

btnSalirInventario.addEventListener("click", () => {
    verInventario.classList.remove("verInventario_si");
});

var acc = document.getElementsByClassName("accordion");
var i;

for (i = 0; i < acc.length; i++) {
  acc[i].addEventListener("click", function() {
    this.classList.toggle("active");
    var panel = this.nextElementSibling;
    if (panel.style.display === "block") {
      panel.style.display = "none";
    } else {
      panel.style.display = "block";
    }
  });
}

/* ------------------------------------------------------------- */
/* ------------------------------------------------------------- */
