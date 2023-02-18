export function correoCliente(carrito, despacho) {
    const formatoCL = new Intl.NumberFormat('es-CL', {
        style: "currency",
        currency: "CLP",
    });
    
    emailjs.init('GlmSGpqHCTxbwmfS3');

    const frm = document.createElement("form");

    const email = document.createElement("input");
    email.id = "frm-mail";
    email.name = "frm-mail";
    email.value = despacho.email;
    frm.appendChild(email)

    const nombre = document.createElement("input");
    nombre.id = "frm-nombre";
    nombre.name = "frm-nombre";
    nombre.value = despacho.nombre;
    frm.appendChild(nombre)

    const apellido = document.createElement("input");
    apellido.id = "frm-apellido";
    apellido.name = "frm-apellido";
    apellido.value = despacho.apellido;
    frm.appendChild(apellido)

    const direccion1 = document.createElement("input");
    direccion1.id = "frm-direccion1";
    direccion1.name = "frm-direccion1";
    direccion1.value = despacho.direccion1;
    frm.appendChild(direccion1)

    const direccion2 = document.createElement("input");
    direccion2.id = "frm-direccion2";
    direccion2.name = "frm-direccion2";
    direccion2.value = despacho.direccion2;
    frm.appendChild(direccion2)

    const lista = document.createElement("input");
    lista.id = "frm-lista";
    lista.name = "frm-lista";

    let prodLista = "";
    let total = 0;
    carrito.forEach(e => {
        total += (parseInt(e.precio) *  parseInt(e.cant))
        prodLista = prodLista + `Producto: ${e.nombre} Precio: ${formatoCL.format(e.precio)} Cant: ${e.cant} TOTAL: ${formatoCL.format(parseInt(e.precio) *  parseInt(e.cant))} <BR> `;
    });

    prodLista += ` <BR> TOTAL: ${formatoCL.format(total)} <BR> `
    prodLista += `ENVÍO: ${formatoCL.format(5500)} <BR> `
    prodLista += `TOTAL COMPRA: ${formatoCL.format(total + 5500)}`

    lista.value = prodLista;
    frm.appendChild(lista);

    emailjs.sendForm('service_jnf9tgi', 'template_c4ohe36', frm)
    .then(() => {
        console.log('Coreo Enviado!');
    })
    .catch((err) => {
        console.log('ERROR:', err);
    });
}