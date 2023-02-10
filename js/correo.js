export function correo(frm) {
    let msge = "";
    emailjs.init('GlmSGpqHCTxbwmfS3');

    emailjs.sendForm('service_jnf9tgi', 'template_c4ohe36', frm)
    .then(function() {
        msge ='Coreo Enviado!';
    }, function(error) {
        msge = 'ERROR:', error;
    });

    return msge;
}