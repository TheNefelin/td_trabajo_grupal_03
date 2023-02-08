/* --- Inicializar Sitio --------------------------------------- */
/* ------------------------------------------------------------- */
import { Categoria } from "../class/Categoria.js";
import { Tienda } from "../class/Tienda.js"
import { Juego } from "../class/Juego.js"

let objTienda;

window.onload = () => {
    inicializarObjetos();
    console.log("Sitio Iniciado")
}

function inicializarObjetos() {
    fetch("../data/data.json")
    .then(resp => resp.json())
    .then(data => {
        let newCategoria;
        objTienda = new Tienda(data.negocio.nombre);

        data.negocio.categorias.map(categ => {
            newCategoria = new Categoria(categ.nombre);
            
            categ.juegos.map(juego => {
                newCategoria.setJuego( new Juego(juego.id, juego.nombre, juego.precio, juego.dercripcion, juego.stock, juego.link));
            });

            objTienda.setCategria(newCategoria);
        })
    })
    .then(() => {
        renderProductos();
        console.log("Datos Cargados Correctamente")
    })
    .catch((err) => console.log(err))
};

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

/* --- Agregar a Carrito --------------------------------------- */
/* ------------------------------------------------------------- */


/* --- Render Sitio -------------------------------------------- */
/* ------------------------------------------------------------- */
function renderProductos() {
    let html = "";
    const tienda = document.querySelector("#tienda");

    objTienda.getCategorias().map((categ) => {
        categ.getJuegos().map((juego) => {
            html += `
            <div class="card">
                <img src="${juego.getLink()}" style="width:100%">
                <h1>${juego.getNombre()}</h1>
                <h4>Categ: ${categ.getNombre()} - Stock: (${juego.getStock()})</h4>
                <p class="price">${formatoCL.format(juego.getPrecio())}</p>
                <div class="btnMasMenos">
                    <img id=${juego.getId()} class="btnMenos" src="./img/menos.svg"></class=>
                    <h3 id="cant_${juego.getId()}">0</h3>
                    <img id=${juego.getId()} class="btnMas" src="./img/mas.svg">
                </div>
                <div><button>Agregar</button></div>
            </div>`
        })
    })
 
    tienda.innerHTML = html;

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
}

function sumarEnTarjeta(id, n) {
    let cantTarjeta = document.querySelector(`#cant_${id}`);
    let cant = parseInt(cantTarjeta.textContent);

    cant += n;

    console.log(cant)
    if (cant < 0) {
        cantTarjeta.textContent = 0;
    } else {
        cantTarjeta.textContent = cant;
    }


}