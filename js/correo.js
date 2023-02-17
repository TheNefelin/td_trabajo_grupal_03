export function correoCliente(carrito) {
    emailjs.init('GlmSGpqHCTxbwmfS3');

    const frm = document.createElement("form");

    const email = document.createElement("input");
    email.id = "frm-mail";
    email.name = "frm-mail";
    email.value = "sliferhunter8@gmail.com";
    frm.appendChild(email)

    const ul =  document.createElement("ul");
    ul.id = "frm-ul";
    ul.name = "frm-ul";
    ul.value = "frm-ul";

    carrito.forEach(e => {
        const li = document.createElement("li");
        li.innerText = `Producto: ${e.nombre} Precio: ${e.precio} Cant: ${e.cant} TOTAL: ${parseInt(e.precio) *  parseInt(e.cant)}`;
        ul.appendChild(li);
    });

    frm.appendChild(ul)

    console.log(frm)
    console.log(carrito)

    emailjs.sendForm('service_jnf9tgi', 'template_c4ohe36', frm)
    .then(function() {
        console.log('Coreo Enviado!');
    }, function(error) {
        console.log('ERROR:', error);
    });
}