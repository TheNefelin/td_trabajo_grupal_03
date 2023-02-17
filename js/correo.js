import { ProductoApi } from "../class/FetchApi.js";

export function correoCliente(carrito) {
    emailjs.init('GlmSGpqHCTxbwmfS3');

    const apiProducto =  new ProductoApi()
    carrito.getProductos().forEach(e => {
        const item =  apiProducto.getProductoById(e.idJuego);
        item.then(data => {
            console.log(data.nombre)
        });
    });

    // emailjs.sendForm('service_jnf9tgi', 'template_c4ohe36', frm)
    // .then(function() {
    //     msge ='Coreo Enviado!';
    // }, function(error) {
    //     msge = 'ERROR:', error;
    // });
}