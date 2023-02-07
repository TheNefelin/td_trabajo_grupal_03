// -- Inicializar Sitio ------------------------------------------------------------
// ---------------------------------------------------------------------------------
window.onload = () => {
    cargarComponente(1);
    console.log("Sitio iniciado");
}

// -- Manejo de Navegacion ---------------------------------------------------------
// ---------------------------------------------------------------------------------
function cargarComponente(id) {
    switch (id) {
        case 1:
            $('.contenedor').load("./componente/tienda.html", () => {
                getProductos();
                $(".carrito-lista").load("./componente/checkout.html");
            });
            break;
        case 2:
            $(".contenedor").load("./componente/encuesta.html .encuesta");
            break;
        case 3:
            $('.contenedor').load("./componente/links.html", () => {
                getLinks();
            });
            break;
        case 4:
            $(".contenedor").load("./componente/contacto.html .contacto");
            break;
    }

    // -- Despues de click al Link, el Menu se Ocultara
    if (!navBarBtn_click) {
        btnMenu()
    }
};

// -- Carga Productios en Tienda - Render Tarjetas ---------------------------------
// ---------------------------------------------------------------------------------
function getProductos() {
    var listaProductos = document.querySelector(".tarjetaContenedor");
    var newElement = "";

    dataProductos.map((d, index) => {
        newElement = newElement + `
        <div key=${index} class="tarjeta">
            <img src="${d.link}" loading="lazy" alt="">
            <div class="tarjetaTextos">
                <h3><strong>${d.nombre}</strong></h3>
                <p>Descripcion</p>
                <p><strong>$ ${d.precio}</strong></p>
                <div class="tarjeta-modificar">
                    <button onclick="setProductoCant(1, ${d.id})">+</button>
                    <p id="cant_${d.id}">1</p>
                    <button onclick="setProductoCant(-1, ${d.id})">-</button>
                    </div>
                        <button class="btnX" onclick="addProductoDesdeTienda_click(${d.id})">Agregar</button>
                    </div>
                </div>
            </div>
        </div>`;
    });

    listaProductos.innerHTML = newElement;
};

// actualiza la cantidad en la tarjeta
function setProductoCant(n, id) {
    let cant = document.querySelector(`#cant_${id}`);
    cant.textContent = cant.textContent * 1 + n

    cant.textContent > 0 ? cant.textContent : cant.textContent = 1;
}

// Agrega Productos a la Canasta
let dataCanasta = [];

function addProductoDesdeTienda_click(id) {
    let cant = document.querySelector(`#cant_${id}`).textContent * 1;
    addProductoCanasta_click(cant, id);
}

function addProductoCanasta_click(cant, id) {
    let producto = dataProductos.find(d => d.id == id);
    let nuevoProducto = dataCanasta.find(d => d.id == id);

    if (nuevoProducto) {
        nuevoProducto.cant = nuevoProducto.cant + cant;
    } else {
        dataCanasta.push({ cant, ...producto });
    }

    renderCanasta();
}

function removeProductoCanasta_click(cant, id) {
    let lgCant = document.querySelector(`#lg-cant_${id}`).textContent * 1;
    let canasta = dataCanasta.find(d => d.id == id);

    canasta.cant = canasta.cant + cant;

    if (canasta.cant < 1) {
        canasta.cant = 1;
    }

    lgCant = canasta.cant;
    renderCanasta();
}

function removeItemCanasta_click(id) {
    let index = dataCanasta.findIndex(d => d.id == id);

    dataCanasta.splice(index, 1);
    renderCanasta();
}

function renderCanasta() {
    let newElement = "";
    let suma = 0;

    dataCanasta.map(d => {
        suma = suma + d.precio * d.cant;
        newElement = newElement + `
        <li class="list-group-item d-flex justify-content-between lh-sm">
            <div>
                <h6 class="my-0">${d.nombre}</h6>
                <small class="text-muted">$${d.precio}</small>
                <img onclick="removeProductoCanasta_click(-1, ${d.id})" src="../img/circulo-menos.svg">
                <span id="lg-cant_${d.id}" class="text-muted">${d.cant}</span>
                <img onclick="addProductoCanasta_click(1, ${d.id})" src="../img/circulo-mas.svg">
            </div>
            <div>
                <span class="text-muted">$${d.precio * d.cant}</span>
                <img onclick="removeItemCanasta_click(${d.id})" src="../img/trash-fill.svg">
            </div>
        </li>`;
    });

    let totales = costosTotales();

    newElement = newElement + `
        <li class="list-group-item d-flex justify-content-between bg-light">
            <div class="text-success"><h6 class="my-0">Total Neto</h6></div>
            <span class="text-success">$${totales.neto}</span>
        </li>
        <li class="list-group-item d-flex justify-content-between bg-light">
            <div class="text-success"><h6 class="my-0">IVA</h6></div>
            <span class="text-success">$${totales.iva}</span>
        </li>
        <li class="list-group-item d-flex justify-content-between bg-light">
            <div class="text-success"><h6 class="my-0">Sub Total</h6></div>
            <span class="text-success">$${totales.subTotal}</span>
        </li>
        <li class="list-group-item d-flex justify-content-between bg-light">
            <div class="text-success"><h6 class="my-0">Costo de Envío</h6></div>
            <span class="text-success">$${totales.envio}</span>
        </li>           
        <li class="list-group-item d-flex justify-content-between">
            <span>Total (CLP)</span>
            <strong>$${totales.total}</strong>
        </li>`;

    $("#checkout-ul").html(newElement);
    $(".carrito-cont").text(dataCanasta.length);
}

function costosTotales() {
    let subTotal = 0;

    dataCanasta.forEach(d => {
        subTotal = subTotal + (d.precio * d.cant);
    })

    let pIva = 0.19;
    let pEnvio = 0.05;
    let neto = Math.round(subTotal / (1 + pIva));
    let iva = Math.round(subTotal - neto);
    let envio = subTotal < 100000 ? Math.round(subTotal * pEnvio) : 0;
    let total = envio + subTotal;

    return { neto, iva, subTotal, envio, total };
}

function canasta_click() {
    let canasta = document.querySelector(".carrito-lista");
    canasta.classList.add("carrito-lista_noOcultar");
};

function canastaSalir_click() {
    let canasta = document.querySelector(".carrito-lista");
    canasta.classList.remove("carrito-lista_noOcultar");
};

// -- Manejo de Navegacion - Render Links (Paltas) ---------------------------------
// ---------------------------------------------------------------------------------
function getLinks() {
    var listaLinks = document.querySelector(".links");
    var newElement = "";

    dataLinks.map((d, index) => {
        newElement = newElement + `<a key=${index} href='${d.url}' target="_blank" class="list-group-item list-group-item-action">${d.nombre}</a>`;
    });

    listaLinks.innerHTML = newElement;
};

// -- Manejo btn Menu Hamburguesa --------------------------------------------------
// ---------------------------------------------------------------------------------
let navBarBtn_click = true;

function btnMenu() {
    var navBarBtn = document.querySelector(".navBar-btn").children;
    var navBarMenu = document.querySelector(".navBar-menu");

    if (navBarBtn_click) {
        for (i = 0; i < navBarBtn.length; i++) {
            navBarBtn[i].classList.add("navBar-btn_div_accion");
        }
        navBarMenu.classList.add("navBar-menu_accion");
        navBarBtn_click = false;
    } else {
        for (i = 0; i < navBarBtn.length; i++) {
            navBarBtn[i].classList.remove("navBar-btn_div_accion");
        }
        navBarMenu.classList.remove("navBar-menu_accion");
        navBarBtn_click = true;
    }
};

// -- Manejo de Mensajeria ---------------------------------------------------------
// ---------------------------------------------------------------------------------
function msge(btn_clic) {
    let modal = document.querySelector(".modal-body");
    let msg = "";

    if (btn_clic.id == "btnEncuesta") {
        msg = msge_Encuesta();
    } else if (btn_clic.id == "btnContacto") {
        msg = msge_Contacto();
    }

    modal.innerHTML = msg;
};

function msge_Encuesta() {
    let txtEncuesta = document.querySelector("#txtEncuesta");
    let txt = "";

    $(txtEncuesta).css('border-color', 'black');

    if (isNaN(txtEncuesta.value) || txtEncuesta.value == '') {
        txt = "Debe Ingresar una Valor Numérico";
        $(txtEncuesta).css('border-color', 'red');
    } else {
        if (txtEncuesta.value > 10) {
            txt = "El Valor Debe ser Entre 0 y 10";
            $(txtEncuesta).css('border-color', 'red');
        } else {
            txt = "Gracias por Darnos tu Opinión";
            txtEncuesta.value = "";
        }
    }

    return txt
};

function msge_Contacto() {
    let txtEmail = document.querySelector("#txtContactoEmail");
    let txtNombre = document.querySelector("#txtContactoNombre");
    let txt = "";

    $(txtEmail).css('border-color', 'black');
    $(txtNombre).css('border-color', 'black');

    if (txtEmail.value == "") {
        txt = "Debe Ingresar un EMail";
        $(txtEmail).css('border-color', 'red');
    } else {
        if (txtNombre.value == "") {
            txt = "Debe Ingresar su Nombre";
            $(txtNombre).css('border-color', 'red');
        } else {
            txt = "Gracias por Contactarnos!!!";
            txtEmail.value = "";
            txtNombre.value = "";
        }
    }

    return txt;
};

// -- Ocultar NavBar y Pie ---------------------------------------------------------
// ---------------------------------------------------------------------------------
let scrY = window.scrollY;

window.addEventListener("scroll", () => {
    let navBar = document.querySelector(".navBar");
    let pie = document.querySelector(".pie");
    let carrito = document.querySelector(".carrito");

    if (scrY < window.scrollY) {
        navBar.classList.add("navBar_ocultar");
        pie.classList.add("pie_ocultar");
        carrito.classList.add("carrito_ocultar");
    } else {
        navBar.classList.remove("navBar_ocultar");
        pie.classList.remove("pie_ocultar");
        carrito.classList.remove("carrito_ocultar");
    }

    scrY = window.scrollY;

    if (!navBarBtn_click) {
        btnMenu()
    }
});

// -- Reloj ------------------------------------------------------------------------
// ---------------------------------------------------------------------------------
function fechaT() {
    var dt = new Date;
    let anio = dt.getFullYear();
    let mes = dt.getMonth() + 1;
    let dia = dt.getDate();
    let hr = dt.getHours();
    let min = dt.getMinutes();
    let sec = dt.getSeconds();
    let mili = dt.getMilliseconds();

    return { anio, mes, dia, hr, min, sec, mili };
}

function reloj() {
    var addHora = document.querySelector(".reloj");
    var dt = fechaT();

    dt.hr = dt.hr.toString().length == 1 ? "0" + dt.hr : dt.hr;
    dt.min = dt.min.toString().length == 1 ? "0" + dt.min : dt.min;
    dt.sec = dt.sec.toString().length == 1 ? "0" + dt.sec : dt.sec;

    var txtHora = dt.hr + " h · " + dt.min + " m · " + dt.sec + " s";

    if (txtHora != null) {
        addHora.innerHTML = '<strong>' + txtHora + '</strong>';
    };
};

setInterval(() => {
    reloj();
}, 1000);

// -- Pagar Pedido -----------------------------------------------------------------
// ---------------------------------------------------------------------------------

function btnPagar_click() {
    let dt = fechaT();
    let cliente = datosCliente();
    let totales = costosTotales();
    let salida = { ...dt, ...cliente, ...totales, dataCanasta }

    if (dataCanasta.length > 0 && validarForm()) {
        // compilar datos para crear comprobante, pdf, guardata en localStorage y enviar correo        

        const promesa = new Promise((resolve, reject) => {
            cargarComprobanteDespacho(salida);

            setTimeout(() => {
                resolve();
            }, 500);
        });
    
        promesa.then(() => {
            pdfComprobanteDespacho();
            enviarCorreo()
            guardarDatos(salida)
        });

        canastaSalir_click();
    }else{
        console.log("Canasta Sin Items o No ha completado el Formulario de Pago");
    }
    
    // window.localStorage.clear();
    // let arr = JSON.parse(window.localStorage.getItem("salidas"));
    // console.log(arr);
};

function cargarComprobanteDespacho(salida) {
    $(".contenedor").load("./componente/comprobante.html", () => {
        let compra = ""

        dataCanasta.forEach(d => {
            compra = compra + `${d.nombre} - Precio: (${d.precio}) x Cantidad: (${d.cant}) - TOTAL: ${d.precio * d.cant} <br>`;
        });

        $("#frm-nombre").val(salida.nombre);
        $("#frm-apellido").val(salida.apellido);
        $("#frm-direccion").val(salida.direccion);
        $("#frm-zip").val(salida.zip);
        $("#frm-neto").val(salida.neto);
        $("#frm-iva").val(salida.iva);
        $("#frm-subTotal").val(salida.subTotal);
        $("#frm-envio").val(salida.envio);
        $("#frm-total").val(salida.total);
        $("#frm-email").val(salida.email);
        $("#frm-message").val(compra);
    });
};

function pdfComprobanteDespacho() {
    const toPdf = document.querySelector("#frm-comprobane"); // <-- Aquí puedes elegir cualquier elemento del DOM

    html2pdf()
        .set({
            margin: 1,
            filename: 'comprobante.pdf',
            image: {
                type: 'jpeg',
                quality: 0.98
            },
            html2canvas: {
                scale: 2, // A mayor escala, mejores gráficos, pero más peso
                // letterRendering: true,
            },
            jsPDF: {
                unit: "in",
                format: "letter",
                orientation: 'portrait' // landscape o portrait
            }
        })
        .from(toPdf)
        .save()
        .catch(err => console.log(err));
};

function enviarCorreo() {
    emailjs.init('mcUZL8ByE16H1TmgQ');
    const frm = document.querySelector('#frm-correo');

    const serviceID = 'default_service';
    const templateID = 'template_zv565be';

    emailjs.sendForm(serviceID, templateID, frm)
        .then(() => {
            console.log('Correo Enviado!!!');
        }, (err) => {
            console.log(err);
        });
}

function guardarDatos(salida) {
    if (window.localStorage.getItem("salidas")) {
        let arrSalida = JSON.parse(window.localStorage.getItem("salidas"));
        arrSalida.push(salida);
        window.localStorage.setItem("salidas", JSON.stringify(arrSalida));
    }else{
        window.localStorage.setItem("salidas", JSON.stringify([salida]));
    }
}

function validarForm() {
    const forms = document.querySelectorAll('.needs-validation');
    let estado;

    forms.forEach(d => {
        estado = d.checkValidity() ? true : false;

        d.classList.add('was-validated');
    });

    return estado;
};

function datosCliente() {
    let cliente = {
        nombre: $("#f-nombre").val(),
        apellido: $("#f-apellido").val(),
        usuario: $("#f-usuario").val(),
        email: $("#f-email").val(),
        direccion: $("#f-direccion").val(),
        direccion2: $("#f-direccion2").val(),
        pais: $("#f-pais").val(),
        comuna: $("#f-comuna").val(),
        zip: $("#f-zip").val(),
        envioB: $("#f-envioB").val(),
        guardar: $("#f-guardar").val(),
        fPago: $("#f-fPago").val(),
        tNombre: $("#f-tNombreT").val(),
        tNumero: $("#f-tNumero").val(),
        tFecha: $("#f-tFecha").val(),
        tCVV: $("#f-tCVV").val(),
    };

    return cliente;
}

// ---------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------