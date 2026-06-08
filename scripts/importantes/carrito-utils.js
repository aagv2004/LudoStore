const CLAVE_CARRITO = "ludostore_carrito";

function obtenerCarrito() {
  return JSON.parse(localStorage.getItem(CLAVE_CARRITO)) || [];
}

function guardarCarrito(carrito) {
  localStorage.setItem(CLAVE_CARRITO, JSON.stringify(carrito));
}

function agregarProductoAlCarrito(producto, cantidad = 1) {
  const carrito = obtenerCarrito();
  const productoEnCarrito = carrito.find((item) => item.id === producto.id);

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

function actualizarContadorCarrito() {
  const contador = document.getElementById("contadorCarritoNav");

  if (!contador) return;

  const carrito = obtenerCarrito();

  const cantidadTotal = carrito.reduce((total, item) => {
    return total + item.cantidad;
  }, 0);

  contador.textContent = cantidadTotal;
}

function vaciarCarritoGuardado() {
  localStorage.removeItem(CLAVE_CARRITO);
}

actualizarContadorCarrito();
