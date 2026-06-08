// VARIABLES INICIALIZADORAS.
const CLAVE_PRODUCTOS = "ludostore_productos";

// Se declara el catalogo base usado al iniciar localStorage.
const PRODUCTOS_BASE = [
  {
    id: "exploding-kittens",
    nombre: "Exploding Kittens",
    categoria: "Cartas",
    imagen: "images/juegos/explodingkittens.webp",
    descripcion:
      "Juego de cartas divertido y caotico donde los jugadores intentan evitar explotar mientras juegan cartas para sabotear a sus oponentes.",
    precio: 16990,
    descuento: "10%",
    stock: 8,
    jugadores: "2 a 5 jugadores",
    edad: "7+ anos",
    duracion: "20 minutos",
  },
  {
    id: "sushi-go",
    nombre: "Sushi Go!",
    categoria: "Cartas",
    imagen: "images/juegos/sushigo.webp",
    descripcion:
      "Juego de seleccion de cartas donde los jugadores forman combinaciones de sushi para conseguir la mayor cantidad de puntos.",
    precio: 14990,
    descuento: "15%",
    stock: 6,
    jugadores: "2 a 5 jugadores",
    edad: "8+ anos",
    duracion: "15 min",
  },
  {
    id: "virus",
    nombre: "Virus!",
    categoria: "Cartas",
    imagen: "images/juegos/virus.webp",
    descripcion:
      "Juego competitivo donde cada jugador intenta completar un cuerpo sano mientras usa virus, medicinas y tratamientos contra sus rivales.",
    precio: 13990,
    descuento: "Sin descuento",
    stock: 10,
    jugadores: "2 a 6 jugadores",
    edad: "8+ anos",
    duracion: "20 min",
  },
  {
    id: "pandemic",
    nombre: "Pandemic",
    categoria: "Cooperativos",
    imagen: "images/juegos/pandemic.webp",
    descripcion:
      "Juego cooperativo donde los jugadores forman un equipo de especialistas que debe contener brotes, viajar por el mundo y encontrar curas antes de que las enfermedades se propaguen sin control.",
    precio: 32990,
    descuento: "Sin descuento",
    stock: 5,
    jugadores: "2 a 4 jugadores",
    edad: "8+ anos",
    duracion: "45 min",
  },
  {
    id: "the-crew",
    nombre: "The Crew",
    categoria: "Cooperativos",
    imagen: "images/juegos/thecrew.webp",
    descripcion:
      "Juego cooperativo de bazas donde los jugadores deben completar misiones espaciales comunicandose de forma limitada y jugando sus cartas en el momento correcto.",
    precio: 18990,
    descuento: "10%",
    stock: 7,
    jugadores: "3 a 5 jugadores",
    edad: "10+ anos",
    duracion: "20 min",
  },
  {
    id: "codigo-secreto-duo",
    nombre: "Codigo Secreto Duo",
    categoria: "Cooperativos",
    imagen: "images/juegos/codigosecretoduo.webp",
    descripcion:
      "Version cooperativa de Codigo Secreto donde dos jugadores entregan pistas de una palabra para encontrar agentes ocultos antes de quedarse sin turnos.",
    precio: 19990,
    descuento: "15%",
    stock: 6,
    jugadores: "2+ jugadores",
    edad: "11+ anos",
    duracion: "15 min",
  },
  {
    id: "catan",
    nombre: "Catan",
    categoria: "Estrategia",
    imagen: "images/juegos/catan.webp",
    descripcion:
      "Juego de estrategia y negociacion donde los jugadores recolectan recursos, construyen caminos y poblados, y compiten por desarrollar la isla de Catan.",
    precio: 34990,
    descuento: "10%",
    stock: 4,
    jugadores: "3 a 4 jugadores",
    edad: "10+ anos",
    duracion: "60 min",
  },
  {
    id: "risk",
    nombre: "Risk",
    categoria: "Estrategia",
    imagen: "images/juegos/risk.webp",
    descripcion:
      "Clasico juego de conquista territorial donde los jugadores despliegan ejercitos, atacan regiones rivales y buscan dominar el mapa mediante estrategia y dados.",
    precio: 29990,
    descuento: "Sin descuento",
    stock: 3,
    jugadores: "2 a 6 jugadores",
    edad: "10+ anos",
    duracion: "120 min",
  },
  {
    id: "carcassonne",
    nombre: "Carcassonne",
    categoria: "Estrategia",
    imagen: "images/juegos/carcassone.webp",
    descripcion:
      "Juego de colocacion de losetas donde los jugadores construyen ciudades, caminos y monasterios mientras ubican seguidores para conseguir puntos.",
    precio: 27990,
    descuento: "12%",
    stock: 5,
    jugadores: "2 a 5 jugadores",
    edad: "7+ anos",
    duracion: "35 min",
  },
  {
    id: "uno",
    nombre: "UNO",
    categoria: "Familiares",
    imagen: "images/juegos/uno.webp",
    descripcion:
      "Juego de cartas familiar donde los jugadores deben quedarse sin cartas combinando colores, numeros y cartas especiales para cambiar el ritmo de la partida.",
    precio: 7990,
    descuento: "Sin descuento",
    stock: 12,
    jugadores: "2 a 10 jugadores",
    edad: "7+ anos",
    duracion: "15 min",
  },
  {
    id: "jenga",
    nombre: "Jenga",
    categoria: "Familiares",
    imagen: "images/juegos/jenga.webp",
    descripcion:
      "Juego de habilidad donde los jugadores retiran bloques de una torre y los colocan arriba intentando que la estructura no se derrumbe.",
    precio: 12990,
    descuento: "10%",
    stock: 9,
    jugadores: "1+ jugadores",
    edad: "6+ anos",
    duracion: "20 min",
  },
  {
    id: "dobble",
    nombre: "Dobble",
    categoria: "Familiares",
    imagen: "images/juegos/dobble.webp",
    descripcion:
      "Juego rapido de observacion donde los jugadores deben encontrar simbolos repetidos entre cartas antes que los demas.",
    precio: 14990,
    descuento: "15%",
    stock: 8,
    jugadores: "2 a 8 jugadores",
    edad: "6+ anos",
    duracion: "10 min",
  },
];

// Funcion que obtiene los productos guardados en localStorage.
function obtenerProductosGuardados() {
  return JSON.parse(localStorage.getItem(CLAVE_PRODUCTOS)) || [];
}

// Funcion que sincroniza la variable global de productos.
function sincronizarProductosGlobales() {
  productos = obtenerProductosGuardados();
}

// Funcion que guarda productos y actualiza la variable global.
function guardarProductos(productosActualizados) {
  localStorage.setItem(CLAVE_PRODUCTOS, JSON.stringify(productosActualizados));
  sincronizarProductosGlobales();
}

// Funcion que carga productos base si aun no existen datos.
function inicializarProductosBase() {
  const productosGuardados = obtenerProductosGuardados();

  if (productosGuardados.length > 0) return;

  localStorage.setItem(CLAVE_PRODUCTOS, JSON.stringify(PRODUCTOS_BASE));
}

// Funcion que obtiene la lista publica de productos.
function obtenerProductos() {
  return obtenerProductosGuardados();
}

// Funcion que busca un producto segun su identificador.
function buscarProductoPorId(idProducto) {
  return obtenerProductos().find((producto) => producto.id === idProducto);
}

// Funcion que transforma un nombre en slug para usarlo como id.
function crearSlugProducto(nombre) {
  return nombre
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// Funcion que crea un id unico para productos nuevos.
function crearIdProducto(nombre) {
  const productosActuales = obtenerProductos();
  const slugBase = crearSlugProducto(nombre) || `producto-${Date.now()}`;
  const existeProducto = productosActuales.some((producto) => {
    return producto.id === slugBase;
  });

  if (!existeProducto) return slugBase;

  return `${slugBase}-${Date.now()}`;
}

// Funcion que limpia y normaliza datos antes de guardar producto.
function normalizarProducto(datosProducto, idProducto) {
  return {
    id: idProducto || crearIdProducto(datosProducto.nombre),
    nombre: datosProducto.nombre.trim(),
    categoria: datosProducto.categoria,
    imagen: datosProducto.imagen.trim(),
    descripcion: datosProducto.descripcion.trim(),
    precio: Number(datosProducto.precio),
    descuento: datosProducto.descuento.trim() || "Sin descuento",
    stock: Number(datosProducto.stock),
    jugadores: datosProducto.jugadores.trim(),
    edad: datosProducto.edad.trim(),
    duracion: datosProducto.duracion.trim(),
  };
}

// Funcion que crea un producto nuevo dentro del catalogo.
function crearProducto(datosProducto) {
  const productosActuales = obtenerProductos();
  const nuevoProducto = normalizarProducto(datosProducto);

  productosActuales.push(nuevoProducto);
  guardarProductos(productosActuales);

  return nuevoProducto;
}

// Funcion que actualiza un producto existente por su id.
function actualizarProducto(idProducto, nuevosDatos) {
  const productosActuales = obtenerProductos();
  const indiceProducto = productosActuales.findIndex((producto) => {
    return producto.id === idProducto;
  });

  if (indiceProducto === -1) {
    return {
      ok: false,
      mensaje: "No se encontro el producto.",
    };
  }

  productosActuales[indiceProducto] = normalizarProducto(nuevosDatos, idProducto);
  guardarProductos(productosActuales);

  return {
    ok: true,
    mensaje: "Producto actualizado correctamente.",
    producto: productosActuales[indiceProducto],
  };
}

// Funcion que elimina un producto existente por su id.
function eliminarProducto(idProducto) {
  const productosActuales = obtenerProductos();
  const productosFiltrados = productosActuales.filter((producto) => {
    return producto.id !== idProducto;
  });

  if (productosFiltrados.length === productosActuales.length) {
    return {
      ok: false,
      mensaje: "No se encontro el producto.",
    };
  }

  guardarProductos(productosFiltrados);

  return {
    ok: true,
    mensaje: "Producto eliminado correctamente.",
  };
}

// Funcion que descuenta stock despues de validar toda la compra.
function descontarStockProductos(itemsCompra) {
  const productosActuales = obtenerProductos();

  for (const item of itemsCompra) {
    const producto = productosActuales.find((productoActual) => {
      return productoActual.id === item.id;
    });

    if (!producto || producto.stock < item.cantidad) {
      return {
        ok: false,
        mensaje: `Stock insuficiente para ${item.nombre}.`,
      };
    }
  }

  itemsCompra.forEach((item) => {
    const producto = productosActuales.find((productoActual) => {
      return productoActual.id === item.id;
    });

    producto.stock -= item.cantidad;
  });

  guardarProductos(productosActuales);

  return {
    ok: true,
    mensaje: "Stock actualizado correctamente.",
  };
}

// Se inicializa el catalogo base al cargar el archivo.
inicializarProductosBase();

// Se mantiene una variable global para compatibilidad con paginas antiguas.
let productos = obtenerProductos();
