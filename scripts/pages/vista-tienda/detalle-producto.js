// Se declaran las rutas de retorno segun categoria del producto.
const rutasCategorias = {
  Cartas: "categorias/cartas.html",
  Cooperativos: "categorias/cooperativos.html",
  Estrategia: "categorias/estrategias.html",
  Familiares: "categorias/familiares.html",
};

// Se rescatan parametros de URL y el producto seleccionado.
const botonVolverCatalogo = document.getElementById("btnVolverCatalogo");
const parametros = new URLSearchParams(window.location.search);
const idProducto = parametros.get("id") || "exploding-kittens";

const producto = buscarProductoPorId(idProducto) || obtenerProductos()[0];

// Se rescatan los elementos visuales del detalle de producto.
const imagen = document.getElementById("productoImagen");
const categoria = document.getElementById("productoCategoria");
const nombre = document.getElementById("productoNombre");
const descripcion = document.getElementById("productoDescripcion");
const jugadores = document.getElementById("productoJugadores");
const edad = document.getElementById("productoEdad");
const duracion = document.getElementById("productoDuracion");
const precio = document.getElementById("productoPrecio");
const descuento = document.getElementById("productoDescuento");
const stock = document.getElementById("productoStock");
const cantidad = document.getElementById("cantidadProducto");
const botonAgregar = document.getElementById("btnAgregarCarrito");
const mensaje = document.getElementById("mensajeProducto");

// Funcion que formatea valores numericos a moneda CLP.
function formatearPrecio(valor) {
  return valor.toLocaleString("es-CL", {
    style: "currency",
    currency: "CLP",
  });
}

// Funcion que adapta la ruta de imagen para paginas internas.
function obtenerRutaImagenDetalle(rutaImagen) {
  return `../${rutaImagen}`;
}

// Funcion que carga en pantalla los datos del producto elegido.
function cargarDetalleProducto() {
  document.title = `${producto.nombre} | LudoStore`;

  imagen.src = obtenerRutaImagenDetalle(producto.imagen);
  imagen.alt = `Juego ${producto.nombre}`;
  categoria.textContent = producto.categoria;
  nombre.textContent = producto.nombre;
  descripcion.textContent = producto.descripcion;
  jugadores.textContent = producto.jugadores;
  edad.textContent = producto.edad;
  duracion.textContent = producto.duracion;
  precio.textContent = formatearPrecio(producto.precio);
  descuento.textContent = `Descuento: ${producto.descuento}`;
  stock.textContent = `Stock disponible: ${producto.stock}`;
  cantidad.max = producto.stock;
  botonAgregar.disabled = producto.stock <= 0;
  botonAgregar.textContent = producto.stock <= 0 ? "Sin stock" : "Agregar al carrito";

  botonVolverCatalogo.href =
    rutasCategorias[producto.categoria] || "categorias/cartas.html";
}

// Funcion que agrega al carrito la cantidad seleccionada.
function agregarAlCarrito() {
  const cantidadSeleccionada = Number(cantidad.value);

  if (cantidadSeleccionada < 1 || cantidadSeleccionada > producto.stock) {
    mensaje.textContent = "Selecciona una cantidad valida segun el stock.";
    mensaje.style.color = "#b00020";
    return;
  }

  const resultado = agregarProductoAlCarrito(producto, cantidadSeleccionada);

  mensaje.textContent = resultado.mensaje;
  mensaje.style.color = resultado.ok ? "#2e7d32" : "#b00020";

  if (resultado.ok) {
    actualizarContadorCarrito();
  }
}

// Se inicializa el detalle y el boton de agregar al carrito.
cargarDetalleProducto();
botonAgregar.addEventListener("click", agregarAlCarrito);
