/* --- Inicializar Sitio --------------------------------------- */
/* ------------------------------------------------------------- */
import { Categoria } from "../class/Categoria.js";
import { Sucursal } from "../class/Sucursal.js"
import { Producto } from "../class/Producto.js"
import { Carrito } from "../class/Carrito.js";
import { correoCliente } from "../js/correo.js"

import { SucursalApi,  CategoriaApi, ProductoApi} from "../class/FetchApi.js";

window.onload = () => {
    inicializar();
}

function inicializar() {
    const objSucursal = new SucursalApi();

    Promise.all([
        objSucursal.getSucursal().then(data => data),
    ])
    .then(res => {
        const listaSucursales = document.querySelector(".listaSucursales")
        listaSucursales.innerHTML = ""

        let bodegas = [];
        res[0].forEach(sucursal => {
            bodegas.push(new Sucursal(sucursal.id, sucursal.nombre))
            let obj = document.createElement("option")
            obj.value = sucursal.id;
            obj.innerText = sucursal.nombre;
            listaSucursales.appendChild(obj)
        });

        listaSucursales.addEventListener("change", () => {
            inicializarApi(listaSucursales.options[listaSucursales.selectedIndex].value, listaSucursales.options[listaSucursales.selectedIndex].innerText)
        });

        inicializarApi(listaSucursales.options[listaSucursales.selectedIndex].value, listaSucursales.options[listaSucursales.selectedIndex].innerText)
    })
    .then(() => {
        iniCarrito();
        getTempLocalStorage();
    })
    .catch(err => {
        inicializarTiendaLocal();
        iniCarrito();
        getTempLocalStorage();
    });
};

function inicializarApi(idSucursal, nomSucursal) {
    let objSucursal = new Sucursal(idSucursal, nomSucursal);
    const objProducto = new ProductoApi();
    const objCategoria = new CategoriaApi();

    if (idSucursal) {
        Promise.all([
            objProducto.getProductoByIdSucursal(idSucursal).then(data => data),
            objCategoria.getCategoria().then(data => data)
        ])
        .then((arr) => {
            deleteBodegaLocalStorage();

            //filtro la variedad de idCategoria de los productos
            const arrIdCategoria = [... new Set(arr[0].map(e => e.idCategoria))];
 
            
            arrIdCategoria.forEach(IdCategoria => {
                const categ = arr[1].find(e => e.id == IdCategoria);
                objSucursal.setCategoria(new Categoria(categ.id, categ.nombre))
            });

            //faltaria agregar los Productos por categorias asociadas a la sucursal
            objSucursal.getCategorias().forEach(categ => {
                arr[0].forEach(producto => {
                    if (producto.idCategoria == categ.getId()) {
                        let imagen = objSucursal.getId() == 1 ? producto.link : "";
                        categ.setProducto(new Producto(producto.id, producto.nombre, producto.precio, imagen, parseInt(producto.stock),  producto.etiqueta, producto.descripcion, producto.idCategoria, idSucursal))
                    }
                });
            })
            
            iniBodegaLocalStorage(objSucursal);
            renderInventario()
        })
        .then(() => {
            renderProductos();
        })
        .catch(err => {
            inicializarTiendaLocal();
        });
    };
};

function inicializarTiendaLocal() {
    fetch("../data/data.json")
    .then(resp => resp.json())
    .then(data => {
        let objSucursal = new Sucursal(0, data.negocio.nombre);

        data.negocio.categorias.map(categ => {
            let newCategoria = new Categoria(categ.id, categ.nombre);

            categ.producto.map(producto => {
                newCategoria.setProducto(new Producto(producto.id, producto.nombre, producto.precio, producto.link, producto.stock,  producto.etiqueta, producto.descripcion, categ.id, 0));
            });

            objSucursal.setCategoria(newCategoria);
        });

        iniBodegaLocalStorage(objSucursal);
    })
    .then(() => {
        renderProductos();
    })
    .catch((err) => console.log(`Error Fetch: ${err}`))
};

function iniCarrito() {
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
    deleteTempLocalStorage();
    inicializar();
    cerrarMenu();
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
            carrito.setProducto(e.idCateg, e.idProducto, e.cant);
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
        bodega = new Sucursal(localS._id, localS._nombre);

        localS._categorias.map(categ => {
            let newCategoria = new Categoria(categ._id, categ._nombre);

            categ._productos.map(prod => {
                newCategoria.setProducto(new Producto(prod._id, prod._nombre, prod._precio, prod._link, prod._stock,  prod._etiqueta, prod._dercripcion, categ._id, localS._id));
            });

            bodega.setCategoria(newCategoria);
        });
    }

    return bodega;
}

function deleteBodegaLocalStorage() {
    window.localStorage.removeItem("bodega");
}

const inputs = document.querySelectorAll("input");
inputs.forEach(e => {
    e.addEventListener("keyup", () => {
        setTempLocalStorage(e)
    });
});

let arrInputs = [];
function setTempLocalStorage(obj) {
    if (obj.id) {
        if (arrInputs) {
            let index = arrInputs.findIndex(e => e.id == obj.id)
            if (index > -1) {
                arrInputs.find(e => e.id == obj.id ? e.value = obj.value : false);
            } else {
                arrInputs.push({id: obj.id, value: obj.value});
            };
        } else {
            arrInputs.push({id: obj.id, value: obj.value});
        };

        window.localStorage.setItem("temp", JSON.stringify(arrInputs));
    };
};

function getTempLocalStorage() {
    let localS = JSON.parse(window.localStorage.getItem("temp"));

    if (localS) {
        localS.forEach(e => {
            let input = document.getElementById(`${e.id}`);
            input.value = e.value;
        });
    };
}

function deleteTempLocalStorage() {
    window.localStorage.removeItem("temp")
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
function renderCategorias(id) {
    const bodega = getBodegaLocalStorage();
    const select = document.querySelector(id);

    bodega.getCategorias().map(categ => {
        let obj = document.createElement("option");
        obj.value = categ.getId();
        obj.innerText = categ.getNombre();
        select.appendChild(obj);
    });
}


const tienda = document.querySelector("#tienda");

function renderProductos() {
    let obj, precioMin, precioMax;
    precioMin = 0;
    precioMax = 0;
    tienda.innerHTML = "";

    const bodega = getBodegaLocalStorage();

    const filtroCategoria = document.querySelector("#filtroCategoria");
    obj = document.createElement("option");
    obj.value = 0;
    obj.innerText = "Todos";
    filtroCategoria.innerHTML = "";
    filtroCategoria.appendChild(obj);
    renderCategorias("#filtroCategoria");

    bodega.getCategorias().map((categ) => {
        categ.getProductos().map((Producto) => {
            const divCart = document.createElement("div");
            divCart.classList.add("card");

            if (Producto.getStock() > 0) {
                Producto.getPrecio() < precioMin || precioMin == 0 ? precioMin = Producto.getPrecio() : false;
                Producto.getPrecio() > precioMax ? precioMax = Producto.getPrecio() : false;
            };

            // -- Hijos --
            obj = document.createElement("img");
            obj.src = Producto.getLink();
            divCart.appendChild(obj);

            obj = document.createElement("h1");
            obj.value = Producto.getEtiqueta();
            obj.innerText = Producto.getNombre();
            divCart.appendChild(obj);

            // ------------------------------------------
            const divContenedorStock = document.createElement("h4");
            divContenedorStock.value = categ.getId();
            divContenedorStock.innerText = `Categ: ${categ.getNombre()} - Stock: `

            // -- Nieto --
            obj = document.createElement("span");
            obj.id = `stock_${Producto.getId()}`;
            obj.innerText = Producto.getStock();
            divContenedorStock.appendChild(obj);

            divCart.appendChild(divContenedorStock);

            // ------------------------------------------
            obj = document.createElement("p");
            obj.value = Producto.getPrecio();
            obj.innerText = formatoCL.format(Producto.getPrecio());
            obj.classList.add("price");
            divCart.appendChild(obj);

            // -------------------------------------------
            const divContenedorBtn = document.createElement("div");
            divContenedorBtn.classList.add("btnMasMenos");

            // -- Nietos --
            obj = document.createElement("img");
            obj.classList.add("btnMenos");
            obj.src = "./img/menos.svg";
            obj.id = Producto.getId();
            divContenedorBtn.appendChild(obj);

            obj = document.createElement("h3");
            obj.id = `cant_${Producto.getId()}`;
            obj.value = categ.getId();
            obj.innerText = 1;
            divContenedorBtn.appendChild(obj);

            obj = document.createElement("img");
            obj.classList.add("btnMas");
            obj.src = "./img/mas.svg";
            obj.id = Producto.getId();
            divContenedorBtn.appendChild(obj);

            divCart.appendChild(divContenedorBtn)

            // -------------------------------------------
            const divContenedorAgregar = document.createElement("div");

            // -- Nieto --
            obj = document.createElement("button");
            obj.id = `btnAgregar_${Producto.getId()}`
            obj.value = Producto.getId();
            obj.innerText = "Agregar";
            obj.classList.add("cardBtn");
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
            const idProducto = obj.value;
            const cantTarjeta = document.querySelector(`#cant_${idProducto}`);
            const idCateg = cantTarjeta.value;
            const cant = cantTarjeta.textContent;
            cantTarjeta.textContent = 1;

            modificarCarrito(idCateg, parseInt(idProducto), parseInt(cant));
        });

        validarStock(obj.value);
    });

    // -- Inicializa el filtro con los precio mayores y menores ----------
    rangeBuscar.min = precioMin;
    rangeBuscar.max = precioMax;
    rangeBuscar.value = precioMax;

    let txtRangeBuscar =  document.querySelector("#txtRangeBuscar");
    txtRangeBuscar.textContent = formatoCL.format(precioMax);
    // -- Footer ---------------------------------------------------------
    const footer = document.querySelector("footer");
    footer.hidden = false
    // -------------------------------------------------------------------
}

function renderCarrito() {
    let carrito = getCarritoLocalStorage()
    const cantCarrito = document.querySelector("#cantCarrito");
    cantCarrito.textContent = carrito.getCantProductos();

    renerDetaCarrito();
}

function renerDetaCarrito() {
    let padre, hijo, cant, subtotal, envio;
    cant = 0;
    subtotal = 0;
    envio = 0;
    const carrito = getCarritoLocalStorage();
    const bodega = getBodegaLocalStorage();

    let detaCarritoContenedor = document.querySelector("#detaCarritoContenedor");

    detaCarritoContenedor.innerHTML = "";

    carrito.getProductos().forEach(e => {
        const producto = bodega.getCategorias().find(categ => categ.getId() == e.idCateg).getProductos().find(Producto => Producto.getId() == e.idProducto);

        cant += e.cant;
        subtotal += (e.cant * producto.getPrecio())
        envio = 5500;

        let objContenedor = document.createElement("div");
        objContenedor.classList.add("itemCarrito");
        objContenedor.id = e.idProducto;
        objContenedor.value = e.cant;

        // ------------------------------------
        padre = document.createElement("div");
        hijo = document.createElement("img");
        hijo.classList.add("btnMasCarrito");
        hijo.id = e.idCateg;
        hijo.value = e.idProducto;
        hijo.src="./img/mas.svg";
        padre.appendChild(hijo);

        hijo = document.createElement("img");
        hijo.classList.add("btnMenosCarrito");
        hijo.id = e.idCateg;
        hijo.value = e.idProducto;
        hijo.src="./img/menos.svg";
        padre.appendChild(hijo);
        objContenedor.appendChild(padre);
        // ------------------------------------
        padre = document.createElement("div");
        padre.classList.add("detaCarrito");

        hijo = document.createElement("div");
        hijo.innerText = `Item: ${producto.getNombre()}`;
        padre.appendChild(hijo);

        hijo = document.createElement("hr");
        padre.appendChild(hijo);
        // -----
        hijo = document.createElement("div");
        hijo.innerText = `Stock: ${producto.getStock()} - Cant: ${e.cant} - Precio: ${formatoCL.format(producto.getPrecio())} - Total: ${formatoCL.format(e.cant * producto.getPrecio())}`;

        padre.appendChild(hijo);
        // -----
        objContenedor.appendChild(padre);
        // ------------------------------------
        padre = document.createElement("img");
        padre.classList.add("btnDeleteCarrito");
        padre.id = e.idCateg;
        padre.value = e.idProducto;
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
    let padre, hijo, nieto;
    let cantSinStock = 0;
    let cantPocoStock = 0;
    let cantConStock = 0;
    let inventario = getBodegaLocalStorage()
    let verInventario = document.querySelector(".verInventario");
    let cardInventContenedor = document.querySelector(".cardInventContenedor");
    cardInventContenedor.innerHTML = ""

    inventario.getCategorias().forEach(categ => {
        categ.getProductos().map(Producto => {
            if (Producto.getStock() == 0) {
                cantSinStock += 1;
            } else if (Producto.getStock() <= 5) {
                cantPocoStock += 1;
            } else {
                cantConStock += 1
            }

            let getInventStock = document.createElement("div");
            getInventStock.value = Producto.getStock();
            getInventStock.id = "getInventStock"

            // -- Card img ------------------------------
            padre = document.createElement("div");
            padre.value = Producto.getEtiqueta();
            padre.classList.add("cardInventario");

            hijo = document.createElement("img");
            hijo.id = categ.getId();
            hijo.value = Producto.getId();
            hijo.classList.add("cardInventImg");
            hijo.src = Producto.getLink();
            padre.appendChild(hijo);
            // -- Card Txt ------------------------------
            hijo = document.createElement("div");
            hijo.classList.add("cardinventTxt");

            nieto = document.createElement("label");
            nieto.innerText = `Nombre: ${Producto.getNombre()}`;
            hijo.appendChild(nieto);

            nieto = document.createElement("label");
            nieto.innerText = `Categ: ${categ.getNombre()}`;
            hijo.appendChild(nieto);

            let obj = document.createElement("span");
            obj.id = "cardInventStock";
            obj.innerText = Producto.getStock();

            nieto = document.createElement("label");
            nieto.innerText = `Stock: `;
            nieto.appendChild(obj);
            hijo.appendChild(nieto);

            nieto = document.createElement("label");
            nieto.innerText = `Precio: ${formatoCL.format(Producto.getPrecio())}`;
            hijo.appendChild(nieto);

            padre.appendChild(hijo);
            getInventStock.appendChild(padre)
            // -- Card descripcion ----------------------
            padre = document.createElement("button");
            padre.classList.add("accordion");
            padre.innerText = "Descripción";

            getInventStock.appendChild(padre)

            padre = document.createElement("div");
            padre.classList.add("panel");

            hijo = document.createElement("p");
            hijo.innerText = Producto.getDercripcion();
            padre.appendChild(hijo);

            getInventStock.appendChild(padre)
            cardInventContenedor.appendChild(getInventStock);
            // ------------------------------------------
        });
    });

    verInventario.appendChild(cardInventContenedor);

    // -- Filtro inventario -----------------------
    padre = document.querySelector("#selectInventario");
    padre.innerHTML = "";

    hijo = document.createElement("option");
    hijo.value = 0;
    hijo.innerText = "Todos los Productos";
    padre.appendChild(hijo);

    hijo = document.createElement("option");
    hijo.value = 1;
    hijo.innerText = `Sin Stock (${cantSinStock})`;
    padre.appendChild(hijo);

    hijo = document.createElement("option");
    hijo.value = 2;
    hijo.innerText = `Poco Stock (${cantPocoStock})`;
    padre.appendChild(hijo);

    hijo = document.createElement("option");
    hijo.value = 3;
    hijo.innerText = `Con Stock (${cantConStock})`;
    padre.appendChild(hijo);

    // -- add function filtrar Stock --------------
    padre.addEventListener("change", () => {
        filtrarInventario(padre.value);
    });
    // --------------------------------------------

    const accordion = document.querySelectorAll(".accordion");
    accordion.forEach(e => {
        e.addEventListener("click", () => {
            e.classList.toggle("active");
            let p = e.nextElementSibling;

            if(p.style.maxHeight){
                p.style.maxHeight = null;
            } else {
                p.style.maxHeight = p.scrollHeight + "px";
            };
        });
    });

    const cardInventario = document.querySelectorAll(".cardInventario");
    cardInventario.forEach(e => {
        e.addEventListener("click", () => {
            handleNuevoProdEntrar();
            prepararNuevoProducto(e.children[0].id, e.children[0].value, "Modificar")
        });
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
function setStockBodega(idCateg, idProducto, cant) {
    let bodega = getBodegaLocalStorage()
    bodega.getCategorias().find(categ => categ.getId() == idCateg).getProductos().find(Producto => Producto.getId() == idProducto).setModificarStock(cant);
    setBodegaLocalStorage(bodega);
}

function getStockBodega(idCateg, idProducto) {
    const bodega = getBodegaLocalStorage()
    const stock = bodega.getCategorias().find(categ => categ.getId() == idCateg).getProductos().find(Producto => Producto.getId() == idProducto).getStock();
    return stock
}

function deleteElementoCarrito(idCateg, idProducto) {
    const carrito = getCarritoLocalStorage();
    const cant = carrito.getProductosById(idProducto).cant;
    modificarCarrito(idCateg, idProducto, cant * -1)
}

function modificarCarrito(idCateg, idProducto, cant) {
    let estado = false;
    let carrito = getCarritoLocalStorage();
    const index = carrito.getProductos().findIndex(d => d.idProducto == idProducto)
    // si el producto no existe en la canasta
    if (index == -1) {
        carrito.setProducto(idCateg, idProducto, cant);
        estado = true;
    };
    // si el producto existe en la canasta se hace esto
    if (index > -1) {
        const stockBodega = getStockBodega(idCateg, idProducto);
        const cantProdCarrito = carrito.getProductosById(idProducto).cant;
        // se suma o se restan productos de la canasta
        if (!(cant > 0 && stockBodega == 0) && !(cant < 0 && cantProdCarrito == 0)) {
            carrito.getProductosById(idProducto).cant += cant;
            estado = true
        }
        // si el prodiucto de la canasta llega 0 se elimina
        if (carrito.getProductosById(idProducto).cant == 0) {
            carrito.deleteProductosById(idProducto)
        }
    };

    if (estado) {
        setStockBodega(idCateg, idProducto, cant * (-1));
        setCarritoLocalStorage(carrito);
    }

    renderCarrito();
    renderProductos()
    validarStock(idProducto)
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

const inputDespachoCarrito = document.querySelectorAll(".despachoCarrito > input")
inputDespachoCarrito.forEach(obj => {
    obj.addEventListener("keyup", () => {
        obj.classList.remove("despachoCarritoInput_no");
    });
});

const btnPagar = document.querySelector(".btnPagar");
btnPagar.addEventListener("click", pagarCarrito)

function pagarCarrito() {
    let estado = true;
    inputDespachoCarrito.forEach(obj => {
        if (!obj.value) {
            estado = false;
            obj.classList.add("despachoCarritoInput_no");
        };
    });

    if (true) {
        estado = true;
        const arrProducto = [];
        const arrCorreo = [];
        const itemCarrito = document.querySelectorAll(".itemCarrito");
        const apiProducto = new ProductoApi();
        const bodegaApi = apiProducto.getProductoByIdSucursal(1)

        const datoDespacho = {
            nombre: document.querySelector("#frm_nombre").value,
            apellido: document.querySelector("#frm_apellido").value,
            direccion1: document.querySelector("#frm_direccion1").value,
            direccion2: document.querySelector("#frm_direccion2").value,
            fono: document.querySelector("#frm_fono").value,
            email: document.querySelector("#frm_email").value,
        }

        bodegaApi.then(data => {
            itemCarrito.forEach(item => {
                item.classList.remove("itemCarrito_no")
                let itemEnApi = data.find(e => e.id == item.id)
                let newStock = parseInt(itemEnApi.stock) - parseInt(item.value);

                arrProducto.push({
                    id: parseInt(itemEnApi.id),
                    nombre: itemEnApi.nombre,
                    precio: parseInt(itemEnApi.precio),
                    link: itemEnApi.link,
                    stock: newStock,
                    etiqueta: itemEnApi.etiqueta,
                    descripcion: itemEnApi.descripcion,
                    idCategoria: parseInt(itemEnApi.idCategoria),
                    idSucursal: parseInt(itemEnApi.idSucursal)
                });

                arrCorreo.push({
                    id: parseInt(itemEnApi.id),
                    nombre: itemEnApi.nombre,
                    precio: parseInt(itemEnApi.precio),
                    cant: parseInt(item.value)
                });
                
                if (newStock < 0) {
                    estado = false;
                    item.classList.add("itemCarrito_no")
                }
            });

            if (estado) {
                const apiProducto = new ProductoApi(); 
                
                arrProducto.forEach(e => {
                    apiProducto.putProducto(e)
                });

                correoCliente(arrCorreo, datoDespacho);
                // inicializar();
                // handleNuevoProdSalir();
                // deleteCarritoLocalStorage();
                // ocultarCarrito();
            } else {
                alert("Hay Productos que exceden el Stock")
            }
        });
    };
};

/* --- Inventario ---------------------------------------------- */
/* ------------------------------------------------------------- */
const verInventario = document.querySelector(".verInventario");
const linkInventario = document.querySelector("#linkInventario");

linkInventario.addEventListener("click", () => {
    verInventario.classList.add("verInventario_si");
    renderInventario();
    cerrarMenu();
    tienda.innerHTML = "";
    const footer = document.querySelector("footer");
    footer.hidden = true
});

const btnSalirInventario = document.querySelector(".btnSalirInventario");
btnSalirInventario.addEventListener("click", () => {
    verInventario.classList.remove("verInventario_si");
    handleNuevoProdSalir();
    renderProductos();
});

function filtrarInventario(id) {
    const getInventStock = document.querySelectorAll("#getInventStock");

    if (id == 0) {
        getInventStock.forEach(e => {
            e.style.display = "";
        });
    } else if (id == 1) {
        getInventStock.forEach(e => {
            e.style.display = "none";

            if (e.value == 0) {
                e.style.display = "";
            };
        });
    } else if (id == 2) {
        getInventStock.forEach(e => {
            e.style.display = "none";

            if (e.value <= 5 && e.value > 0) {
                e.style.display = "";
            };
        });
    } else if (id == 3) {
        getInventStock.forEach(e => {
            e.style.display = "none";

            if (e.value > 5) {
                e.style.display = "";
            };
        });
    };
}

const buscarPorEtiqueta = document.querySelector("#filtrarInventarioEti");
buscarPorEtiqueta.addEventListener("keyup", () => filtrarInventarioEti(buscarPorEtiqueta.value));

function filtrarInventarioEti(txt) {
    const cardInventario = document.querySelectorAll(".cardInventario")
    cardInventario.forEach(e => {
        e.parentNode.style.display = "none";

        if (e.value.toUpperCase().indexOf(txt.toUpperCase()) > -1) {
            e.parentNode.style.display = "";
        };
    });
}

const nuevoProd = document.querySelector(".nuevoProd");
const btnNuevoProd = document.querySelector("#btnNuevoProd");
btnNuevoProd.addEventListener("click", () => {
    handleNuevoProdEntrar();
    prepararNuevoProducto(null, null, "Crear Nuevo")
});

function prepararNuevoProducto(idCateg, idProducto, msge) {
    const btnEliminarProdSalir = document.querySelector("#btnEliminarProdSalir");
    btnEliminarProdSalir.value = idProducto;
    const categoriasNuevoProd = document.querySelector("#categoriasNuevoProd");
    categoriasNuevoProd.innerHTML = "";
    renderCategorias("#categoriasNuevoProd");

    const bodega = getBodegaLocalStorage();
    const idProdNoM = document.querySelector("#idProdNoM");
    const idProdDeta = document.querySelector(".idProdDeta");
    const nuevoProdNombre = document.querySelector("#nuevoProdNombre");
    const nuevoProdPrecio = document.querySelector("#nuevoProdPrecio");
    const nuevoProdStock = document.querySelector("#nuevoProdStock");
    const nuevoProdEtiqueta = document.querySelector("#nuevoProdEtiqueta");
    const nuevoProdLink = document.querySelector("#nuevoProdLink");
    const nuevoProdDesc = document.querySelector("#nuevoProdDesc");
    const btn = document.querySelector(".btnNuevoModificarPrdo");

    btnNuevoModificarPrdo.innerText = msge;
    nuevoProdNombre.value = "";
    nuevoProdPrecio.value = "";
    nuevoProdStock.value = "";
    nuevoProdLink.value = "";
    nuevoProdDesc.value = "";

    if (msge == "Crear Nuevo"){
        idProdNoM.innerText = "NUEVO PRODUCTO";
        idProdDeta.innerText = "(idCateg = na, idProd = na)";
    } else if(msge == "Modificar") {
        let producto = bodega.getCategorias().find(categ => categ.getId() == idCateg).getProductos().find(Producto => Producto.getId() == idProducto)

        if (producto) {
            idProdNoM.innerText = "MODIFICAR PRODUCTO";
            idProdDeta.innerText = `(idCateg = ${idCateg}, idProd = ${idProducto})`;
            btnNuevoModificarPrdo.innerText = msge;
            nuevoProdNombre.value = producto.getNombre();
            nuevoProdPrecio.value = producto.getPrecio();
            nuevoProdStock.value = producto.getStock();
            nuevoProdEtiqueta.value = producto.getEtiqueta();
            nuevoProdLink.value = producto.getLink();
            nuevoProdDesc.value = producto.getDercripcion();
            btn.id = idCateg;
            btn.value = idProducto;
            categoriasNuevoProd.value = idCateg;
        };
    };
};

const btnNuevoProdSalir = document.querySelector("#btnNuevoProdSalir");
btnNuevoProdSalir.addEventListener("click", () => {
    handleNuevoProdSalir()
});

function handleNuevoProdEntrar() {
    nuevoProd.classList.add("nuevoProd_si");
}

function handleNuevoProdSalir() {
    nuevoProd.classList.remove("nuevoProd_si");
}

const btnNuevoModificarPrdo = document.querySelector(".btnNuevoModificarPrdo");
btnNuevoModificarPrdo.addEventListener("click", () => {
    const idProd = btnNuevoModificarPrdo.value;
    const nombreProd = document.querySelector("#nuevoProdNombre").value;
    const precioProd = document.querySelector("#nuevoProdPrecio").value;
    const linkProd = document.querySelector("#nuevoProdLink").value;
    const stockProd = document.querySelector("#nuevoProdStock").value;
    const etiquetaProd = document.querySelector("#nuevoProdEtiqueta").value;
    const descripcionProd = document.querySelector("#nuevoProdDesc").value; 
    const idCategoriaProd = btnNuevoModificarPrdo.id;
    const idSucursalProd = getBodegaLocalStorage().getId();

    const producto = {
        id: parseInt(idProd) ? parseInt(idProd) : 0,
        nombre: nombreProd,
        precio: parseInt(precioProd),
        link: linkProd,
        stock: parseInt(stockProd),
        etiqueta: etiquetaProd,
        descripcion: descripcionProd,
        idCategoria: parseInt(idCategoriaProd),
        idSucursal: parseInt(idSucursalProd)
    };

    const apiProducto = new ProductoApi()

    if (btnNuevoModificarPrdo.innerText == "Crear Nuevo") {
        // -- FALTA LA ETIQUETA ----------------
        if (validarNuevoProducto) {       
            const res = apiProducto.postProducto(producto)
            res
            .then(() => {
                inicializar()
                handleNuevoProdSalir();
            })
            .catch(err => console.log(`ERROR: ${err}`));
        } else {
            alert("DEBE COMPLETAR TODOS LOS DATOS")
        };
    } else if (btnNuevoModificarPrdo.innerText == "Modificar") {
        // -- FALTA LA ETIQUETA ----------------
        if (validarNuevoProducto) {       
            const res = apiProducto.putProducto(producto);
            res
            .then(() => {
                inicializar();
                handleNuevoProdSalir();
            })
            .catch(err => console.log(`ERROR: ${err}`));
        } else {
            alert("DEBE COMPLETAR TODOS LOS DATOS")
        };
    };
});

function validarNuevoProducto() {
    let estado = true;
    const nuevoProdNombre = document.querySelector("#nuevoProdNombre");
    const nuevoProdPrecio = document.querySelector("#nuevoProdPrecio");
    const nuevoProdStock = document.querySelector("#nuevoProdStock");
    const nuevoProdLink = document.querySelector("#nuevoProdLink");
    const nuevoProdDesc = document.querySelector("#nuevoProdDesc");

    if (nuevoProdNombre.value = "") {
        estado = false;
    };

    if (nuevoProdPrecio.value = "") {
        estado = false;
    };

    if (nuevoProdStock.value = "") {
        estado = false;
    };

    if (nuevoProdLink.value = "") {
        estado = false;
    };

    if (nuevoProdDesc.value = "") {
        estado = false;
    };

    return estado;
}

const btnEliminarProdSalir = document.querySelector("#btnEliminarProdSalir");
btnEliminarProdSalir.addEventListener("click", () => {
    if (btnEliminarProdSalir.value) {
        const id = parseInt(btnEliminarProdSalir.value);
        const apiProducto = new ProductoApi();
        apiProducto.deleteProductoById(id);
        inicializar();
        handleNuevoProdSalir();
    };
});

/* ------------------------------------------------------------- */
/* ------------------------------------------------------------- */
