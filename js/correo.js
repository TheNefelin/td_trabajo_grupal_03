import { ProductoApi } from "../class/FetchApi.js";

export function correoCliente(carrito, aarItem) {
    emailjs.init('GlmSGpqHCTxbwmfS3');

    // console.log(carrito)

    const apiProducto =  new ProductoApi
    carrito.map(e => {

    });

    // emailjs.sendForm('service_jnf9tgi', 'template_c4ohe36', frm)
    // .then(function() {
    //     msge ='Coreo Enviado!';
    // }, function(error) {
    //     msge = 'ERROR:', error;
    // });
}