const rutasCategorias = {
  Cartas: "categorias/cartas.html",
  Cooperativos: "categorias/cooperativos.html",
  Estrategia: "categorias/estrategias.html",
  Familiares: "categorias/familiares.html",
};

const botonVolverCatalogo = document.getElementById("btnVolverCatalogo");
const parametros = new URLSearchParams(window.location.search);
const idProducto = parametros.get("id") || "exploding-kittens";

const producto =
  productos.find((item) => item.id === idProducto) || productos[0];

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

function formatearPrecio(valor) {
  return valor.toLocaleString("es-CL", {
    style: "currency",
    currency: "CLP",
  });
}

function obtenerRutaImagenDetalle(rutaImagen) {
  return `../${rutaImagen}`;
}

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

  botonVolverCatalogo.href =
    rutasCategorias[producto.categoria] || "categorias/cartas.html";
}

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

cargarDetalleProducto();
botonAgregar.addEventListener("click", agregarAlCarrito);
