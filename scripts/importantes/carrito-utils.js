// VARIABLES INICIALIZADORAS.
const CLAVE_CARRITO = "ludostore_carrito";

// Funcion que obtiene el carrito guardado en localStorage.
function obtenerCarrito() {
  return JSON.parse(localStorage.getItem(CLAVE_CARRITO)) || [];
}

// Funcion que guarda el carrito actualizado en localStorage.
function guardarCarrito(carrito) {
  localStorage.setItem(CLAVE_CARRITO, JSON.stringify(carrito));
}

// Funcion que agrega productos al carrito respetando el stock.
function agregarProductoAlCarrito(producto, cantidad = 1) {
  const carrito = obtenerCarrito();
  const productoEnCarrito = carrito.find((item) => item.id === producto.id);

  if (cantidad > producto.stock || producto.stock <= 0) {
    return {
      ok: false,
      mensaje: "No puedes superar el stock disponible.",
    };
  }

  if (productoEnCarrito) {
    const nuevaCantidad = productoEnCarrito.cantidad + cantidad;

    if (nuevaCantidad > producto.stock) {
      return {
        ok: false,
        mensaje: "No puedes superar el stock disponible.",
      };
    }

    productoEnCarrito.cantidad = nuevaCantidad;
  } else {
    carrito.push({
      id: producto.id,
      nombre: producto.nombre,
      precio: producto.precio,
      imagen: producto.imagen,
      cantidad,
    });
  }

  guardarCarrito(carrito);

  return {
    ok: true,
    mensaje: "Producto agregado al carrito.",
  };
}

// Funcion que actualiza el contador visual del carrito en el navbar.
function actualizarContadorCarrito() {
  const contador = document.getElementById("contadorCarritoNav");

  if (!contador) return;

  const carrito = obtenerCarrito();

  const cantidadTotal = carrito.reduce((total, item) => {
    return total + item.cantidad;
  }, 0);

  contador.textContent = cantidadTotal;
}

// Funcion que elimina el carrito guardado despues de vaciar o comprar.
function vaciarCarritoGuardado() {
  localStorage.removeItem(CLAVE_CARRITO);
}

// Se actualiza el contador al cargar cualquier pagina que use carrito.
actualizarContadorCarrito();
