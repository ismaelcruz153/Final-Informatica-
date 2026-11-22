/* =========================================================
   logo.js — el logo de Café Aroma cambia según la hora

   Horario: 8:00 a. m. a 8:00 p. m.
     · 8:00 – 11:59   taza llena y humeante   (abierto)
     · 12:00 – 19:59  taza a la mitad, tibia  (abierto)
     · 20:00 – 7:59   taza vacía              (cerrado)

   Cómo usarlo: en cada página, antes de </body>:
       <script src="logo.js"></script>
   Reemplaza el contenido de todos los elementos con class="logo"
   y, si existe un elemento con id="estado-cafeteria", escribe ahí
   "Abierto ahora" (de 8:00 a. m. a 8:00 p. m.) o "Cerrado".

   Para probar sin esperar: añade ?hora=15 (o ?hora=21:30) al
   final de la dirección de la página.
   ========================================================= */

(function () {

    var HORA_ABRE = 8;      // abre a las 8:00
    var HORA_TARDE = 12;    // desde las 12:00 la taza va a la mitad
    var HORA_CIERRA = 20;   // cierra a las 20:00
    var contadorLogos = 0;

    /* ---------- Hora actual (o la de prueba de la dirección) ---------- */
    function ahoraActual() {
        var ahora = new Date();
        var prueba = /[?&]hora=(\d{1,2})(?::(\d{2}))?/.exec(window.location.search);

        if (prueba) {
            var h = parseInt(prueba[1], 10);
            var m = prueba[2] ? parseInt(prueba[2], 10) : 0;
            if (h >= 0 && h <= 23 && m >= 0 && m <= 59) {
                ahora.setHours(h, m, 0, 0);
            }
        }
        return ahora;
    }

    /* ---------- 135 minutos -> "2 h 15 min" ---------- */
    function duracion(minutos) {
        var h = Math.floor(minutos / 60);
        var m = minutos % 60;

        if (h > 0 && m > 0) {
            return h + ' h ' + m + ' min';
        }
        if (h > 0) {
            return h + ' h';
        }
        return m + ' min';
    }

    /* ---------- Estado de la cafetería ---------- */
    function estadoCafeteria(fecha) {
        var ahora = fecha || ahoraActual();
        var hora = ahora.getHours();
        var minutosDelDia = hora * 60 + ahora.getMinutes();
        var fase, abierto, minutos, texto;

        if (hora >= HORA_ABRE && hora < HORA_CIERRA) {
            abierto = true;
            fase = (hora < HORA_TARDE) ? 'manana' : 'tarde';
            minutos = HORA_CIERRA * 60 - minutosDelDia;
            texto = 'Abierto ahora';
        } else {
            abierto = false;
            fase = 'cerrado';
            if (hora < HORA_ABRE) {
                minutos = HORA_ABRE * 60 - minutosDelDia;                    // abre hoy
            } else {
                minutos = 24 * 60 - minutosDelDia + HORA_ABRE * 60;          // abre mañana
            }
            texto = 'Cerrado';
        }

        return { fase: fase, abierto: abierto, minutos: minutos, texto: texto };
    }

    /* ---------- Dibujo de la taza (SVG) según la fase ---------- */
    function crearLogo(fase) {
        contadorLogos = contadorLogos + 1;
        var id = 'taza-' + contadorLogos;
        var cuerpo = 'M20 32 H56 V46 Q56 60 38 60 Q20 60 20 46 Z';
        var etiqueta, cafe = '', vapor = '';

        if (fase === 'manana') {
            etiqueta = 'Taza de café llena y humeante: la cafetería está abierta';
            cafe = '<g clip-path="url(#' + id + ')"><rect x="18" y="35" width="40" height="27" fill="#3e2723"/></g>' +
                   '<ellipse cx="38" cy="35" rx="17" ry="3" fill="#6b3a17"/>';
            vapor = '<path class="vapor v1" d="M29 25 q-4 -5 0 -10 q4 -5 0 -10"/>' +
                    '<path class="vapor v2" d="M38 25 q-4 -5 0 -10 q4 -5 0 -10"/>' +
                    '<path class="vapor v3" d="M47 25 q-4 -5 0 -10 q4 -5 0 -10"/>';
        } else if (fase === 'tarde') {
            etiqueta = 'Taza de café a la mitad y tibia: la cafetería está abierta';
            cafe = '<g clip-path="url(#' + id + ')"><rect x="18" y="47" width="40" height="15" fill="#3e2723"/></g>' +
                   '<ellipse cx="38" cy="47" rx="16.5" ry="2.6" fill="#7d4a28"/>';
            vapor = '<path class="vapor-suave" d="M38 25 q-3 -4 0 -8 q3 -4 0 -8"/>';
        } else {
            etiqueta = 'Taza vacía: la cafetería está cerrada';
        }

        return '<svg viewBox="0 0 80 80" role="img" aria-label="' + etiqueta + '" xmlns="http://www.w3.org/2000/svg">' +
               '<defs><clipPath id="' + id + '"><path d="' + cuerpo + '"/></clipPath></defs>' +
               '<g transform="translate(-3 0)">' +
                   vapor +
                   '<ellipse cx="38" cy="63" rx="27" ry="4" fill="#e7d5bd"/>' +                                  // plato
                   '<path d="M56 37 Q68 37 66 46 Q64 54 55 53" fill="none" stroke="#fffaf3" stroke-width="4" stroke-linecap="round"/>' +  // asa
                   '<path d="' + cuerpo + '" fill="#fffaf3"/>' +                                                  // taza
                   '<ellipse cx="38" cy="32" rx="18" ry="3.5" fill="#e7d5bd"/>' +                                 // borde interior
                   cafe +
               '</g></svg>';
    }

    /* ---------- Estilos del vapor (se añaden solos a la página) ---------- */
    function ponerEstilos() {
        if (document.getElementById('logo-estilos')) {
            return;
        }
        var estilo = document.createElement('style');
        estilo.id = 'logo-estilos';
        estilo.textContent =
            '.logo svg{width:100%;height:100%;display:block}' +
            '.logo .vapor{fill:none;stroke:#fffaf3;stroke-width:2.5;stroke-linecap:round;animation:logo-vapor 2.8s ease-in-out infinite}' +
            '.logo .v2{animation-delay:.7s}.logo .v3{animation-delay:1.4s}' +
            '.logo .vapor-suave{fill:none;stroke:#fffaf3;stroke-width:2.2;stroke-linecap:round;opacity:.45}' +
            '@keyframes logo-vapor{0%{transform:translateY(3px);opacity:0}35%{opacity:.9}100%{transform:translateY(-4px);opacity:0}}' +
            '@media (prefers-reduced-motion: reduce){.logo .vapor{animation:none;opacity:.7}}';
        document.head.appendChild(estilo);
    }

    /* ---------- Actualiza logos y mensaje de estado ---------- */
    function actualizar() {
        var estado = estadoCafeteria();
        var logos = document.getElementsByClassName('logo');

        for (var i = 0; i < logos.length; i++) {
            // solo se vuelve a dibujar si cambió la fase (así el vapor no se reinicia)
            if (logos[i].getAttribute('data-fase') !== estado.fase) {
                logos[i].innerHTML = crearLogo(estado.fase);
                logos[i].setAttribute('data-fase', estado.fase);
                logos[i].setAttribute('title', estado.abierto ? 'Cafetería abierta' : 'Cafetería cerrada');
            }
        }

        var caja = document.getElementById('estado-cafeteria');
        if (caja) {
            caja.textContent = estado.texto;
            caja.className = 'status ' + (estado.abierto ? 'abierto' : 'cerrado');
        }
    }

    // Lo que otras páginas pueden usar
    window.estadoCafeteria = estadoCafeteria;
    window.actualizarLogos = actualizar;

    ponerEstilos();
    actualizar();
    setInterval(actualizar, 30000);     // revisa la hora cada 30 segundos

})();
