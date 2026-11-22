/* =========================================================
   cafes.js — datos y funciones compartidas de Café Aroma
   ========================================================= */

var nombreCafe = 'Café Aroma';
var menu = ['Espresso', 'Cappuccino', 'Caffè Latte', 'Americano', 'Cortado / Macchiato', 'Flat White', 'Café Moka', 'Cold Brew', 'Café Irlandés', 'Frappuccino / Frappé', 'Affogato', 'Café con leche', 'Espresso Martini', 'Caramel Macchiato', 'Café Turco'];
var paginas = ['espresso.html', 'capuchino.html', 'latte.html', 'americano.html', 'macchiato.html', 'flat-white.html', 'mocca.html', 'cold-brew.html', 'irlandes.html', 'frappe.html', 'affogato.html', 'cafe-con-leche.html', 'espresso-martini.html', 'caramel-macchiato.html', 'turco.html'];
var descripciones = ['Corto y concentrado, con su clásica capa de crema.', 'El balance icónico: espresso, leche y espuma en partes iguales.', 'Suave y lácteo, con una capa fina de microespuma.', 'Espresso estirado con agua caliente en una taza grande.', 'Espresso «cortado» con la leche justa para quitar acidez.', 'Doble espresso cubierto de leche aterciopelada.', 'Espresso con chocolate y leche vaporizada.', 'Café frío extraído lentamente: suave y sin amargor.', 'Café, whisky irlandés y nata flotante (contiene alcohol).', 'Granizado de café con hielo y crema.', 'Helado de vainilla ahogado en espresso caliente.', 'El clásico casero: mitad café y mitad leche.', 'Cóctel de vodka, licor de café y espresso (contiene alcohol).', 'Leche, espresso e hilos de caramelo.', 'Infusión densa, sin filtrar, hecha en cezve.'];
var precios = [6, 8, 9, 7, 9, 10, 10, 11, 18, 12, 12, 7, 20, 12, 8];            // precio en soles
var ventasAlMes = [900, 1200, 1050, 750, 450, 500, 600, 400, 150, 550, 300, 650, 200, 480, 120];   // tazas al mes (aproximado)
var nombresMes = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
                  'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];

/* ---------- NUEVO: etiquetas de cada café (mismo orden que "menu") ----------
   Palabras posibles: caliente, frio, leche, alcohol.
   Sirven para los filtros de la carta. */
var etiquetas = [
    'caliente',            // Espresso
    'caliente leche',      // Cappuccino
    'caliente leche',      // Caffè Latte
    'caliente',            // Americano
    'caliente leche',      // Cortado / Macchiato
    'caliente leche',      // Flat White
    'caliente leche',      // Café Moka
    'frio',                // Cold Brew
    'caliente alcohol',    // Café Irlandés
    'frio leche',          // Frappuccino / Frappé
    'caliente frio leche', // Affogato (helado frío + espresso caliente)
    'caliente leche',      // Café con leche
    'frio alcohol',        // Espresso Martini
    'caliente leche',      // Caramel Macchiato
    'caliente'             // Café Turco
];

/* ¿El café número "i" tiene esa etiqueta? Ej.: tieneEtiqueta(8, 'alcohol') */
function tieneEtiqueta(i, palabra) {
    return (' ' + etiquetas[i] + ' ').indexOf(' ' + palabra + ' ') !== -1;
}


/* ---------- Calendario (sin cambios) ---------- */

function diasDelMes(anio, mes) {
    var dias = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    var esBisiesto = (anio % 4 === 0 && anio % 100 !== 0) || anio % 400 === 0;

    if (mes === 1 && esBisiesto) {
        return 29;
    }
    return dias[mes];
}


function elegirCafesDelDia(anio, mes, dia) {
    var numero = anio * 372 + mes * 31 + dia;
    var elegidos = [];
    var cantidad = 0;


    for (var paso = 0; paso < 3; paso++) {
        numero = (numero * 1103 + 12345) % 65521;
    }

    while (cantidad < 3) {
        numero = (numero * 1103 + 12345) % 65521;
        var posicion = numero % menu.length;


        var repetida = false;
        for (var i = 0; i < cantidad; i++) {
            if (elegidos[i] === posicion) {
                repetida = true;
            }
        }

        if (repetida === false) {
            elegidos[cantidad] = posicion;
            cantidad = cantidad + 1;
        }
    }

    return elegidos;
}


/* ---------- NUEVO: carrito de pedido (se guarda con localStorage) ----------
   El carrito es una lista con una cantidad por café, en el mismo orden
   que "menu". Ej.: [0, 2, 0, 1, ...] = 2 cappuccinos y 1 americano. */

var CLAVE_CARRITO = 'cafeAromaCarrito';
var MAX_POR_CAFE = 20;

function leerCarrito() {
    var guardado = null;
    var datos = [];

    try {
        guardado = localStorage.getItem(CLAVE_CARRITO);
        if (guardado) {
            datos = JSON.parse(guardado);
        }
    } catch (error) {
        datos = [];
    }

    // Aseguramos una cantidad válida (0 a MAX_POR_CAFE) por cada café
    var carrito = [];
    for (var i = 0; i < menu.length; i++) {
        var cantidad = parseInt(datos[i], 10);
        if (!(cantidad > 0)) {
            cantidad = 0;
        }
        if (cantidad > MAX_POR_CAFE) {
            cantidad = MAX_POR_CAFE;
        }
        carrito[i] = cantidad;
    }
    return carrito;
}

function guardarCarrito(carrito) {
    try {
        localStorage.setItem(CLAVE_CARRITO, JSON.stringify(carrito));
    } catch (error) {
        // si el navegador no deja guardar, el carrito sigue funcionando en esta página
    }
}

function productosEnCarrito(carrito) {
    var suma = 0;
    for (var i = 0; i < carrito.length; i++) {
        suma = suma + carrito[i];
    }
    return suma;
}

function totalCarrito(carrito) {
    var total = 0;
    for (var i = 0; i < carrito.length; i++) {
        total = total + carrito[i] * precios[i];
    }
    return total;
}
