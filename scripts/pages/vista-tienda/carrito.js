// Se rescatan los elementos principales del carrito.
const carritoVacio = document.getElementById("carritoVacio");
const carritoContenido = document.getElementById("carritoContenido");
const listaCarrito = document.getElementById("listaCarrito");
const totalProductosCarrito = document.getElementById("totalProductosCarrito");
const totalCarrito = document.getElementById("totalCarrito");
const btnVaciarCarrito = document.getElementById("btnVaciarCarrito");
const btnFinalizarCompra = document.getElementById("btnFinalizarCompra");
const mensajeCarrito = document.getElementById("mensajeCarrito");
const modalCheckout = document.getElementById("modalCheckout");
const checkoutFormulario = document.getElementById("checkoutFormulario");
const checkoutExito = document.getElementById("checkoutExito");
const formCheckout = document.getElementById("formCheckout");
const checkoutTotal = document.getElementById("checkoutTotal");

// Se rescatan los campos que componen el checkout.
const camposCheckout = {
  nombre: document.getElementById("checkoutNombre"),
  telefono: document.getElementById("checkoutTelefono"),
  direccion: document.getElementById("checkoutDireccion"),
  entrega: document.getElementById("checkoutEntrega"),
  pago: document.getElementById("checkoutPago"),
};

// VARIABLES INICIALIZADORAS.
const CLAVE_COMPRAS = "ludostore_compras";

// Funcion que formatea valores numericos a moneda CLP.
function formatearPrecio(valor) {
  return valor.toLocaleString("es-CL", {
    style: "currency",
    currency: "CLP",
  });
}

// Funcion que adapta rutas de imagen para paginas internas.
function obtenerRutaImagen(rutaImagen) {
  return `../${rutaImagen}`;
}

// Funcion que busca los datos actuales de un producto del carrito.
function obtenerProductoActualParaCarrito(item) {
  return buscarProductoPorId(item.id);
}

// Funcion que obtiene el precio actualizado de un item del carrito.
function obtenerPrecioActualItem(item) {
  const productoActual = obtenerProductoActualParaCarrito(item);

  return productoActual ? productoActual.precio : item.precio;
}

// Funcion que renderiza el carrito, totales y estado vacio.
function renderizarCarrito() {
  const carrito = obtenerCarrito();

  actualizarContadorCarrito();

  if (carrito.length === 0) {
    carritoVacio.style.display = "block";
    carritoContenido.style.display = "none";
    mensajeCarrito.textContent = "";
    return;
  }

  carritoVacio.style.display = "none";
  carritoContenido.style.display = "grid";

  listaCarrito.innerHTML = carrito
    .map((item) => {
      const productoActual = obtenerProductoActualParaCarrito(item);
      const nombreItem = productoActual ? productoActual.nombre : item.nombre;
      const imagenItem = productoActual ? productoActual.imagen : item.imagen;
      const precioItem = obtenerPrecioActualItem(item);
      const subtotal = precioItem * item.cantidad;

      return `
            <article class="carrito-item">
                <img src="${obtenerRutaImagen(imagenItem)}" alt="Juego ${nombreItem}"
            />
            
            <div class="carrito-item-info">
                <h2>${nombreItem}</h2>
                <p>Precio unitario: ${formatearPrecio(precioItem)}</p>
                <p>Subtotal: <strong>${formatearPrecio(subtotal)}</strong></p>
            </div>

            <div class="carrito-controles">
                <button
                    type="button"
                    class="btn-cantidad"
                    data-accion="disminuir"
                    data-id="${item.id}"
                    aria-label="Disminuir cantidad de ${nombreItem}"
                >
                    -
                </button>

                <span>${item.cantidad}</span>

                <button
                    type="button"
                    class="btn-cantidad"
                    data-accion="aumentar"
                    data-id="${item.id}"
                    aria-label="Aumentar cantidad de ${nombreItem}"
                >
                    +
                </button>
            </div>

            <button
                type="button"
                class="btn-eliminar"
                data-id="${item.id}"
            >
                Eliminar
            </button>
        </article>
        `;
    })
    .join("");

  const cantidadProductos = carrito.reduce((total, item) => {
    return total + item.cantidad;
  }, 0);

  const total = carrito.reduce((acumulador, item) => {
    return acumulador + obtenerPrecioActualItem(item) * item.cantidad;
  }, 0);

  totalProductosCarrito.textContent = cantidadProductos;
  totalCarrito.textContent = formatearPrecio(total);
}

// Funcion que aumenta o disminuye unidades respetando stock.
function cambiarCantidad(idProducto, accion) {
  const carrito = obtenerCarrito();

  const productoCarrito = carrito.find((item) => item.id === idProducto);
  const productoOriginal = buscarProductoPorId(idProducto);

  if (!productoCarrito || !productoOriginal) return;

  if (accion === "aumentar") {
    if (productoCarrito.cantidad >= productoOriginal.stock) {
      mensajeCarrito.textContent = "No puedes superar el stock disponible.";
      mensajeCarrito.style.color = "#b00020";
      return;
    }

    productoCarrito.cantidad++;
  }

  if (accion === "disminuir") {
    productoCarrito.cantidad--;

    if (productoCarrito.cantidad <= 0) {
      const indice = carrito.findIndex((item) => item.id === idProducto);
      carrito.splice(indice, 1);
    }
  }

  guardarCarrito(carrito);
  mensajeCarrito.textContent = "";
  renderizarCarrito();
}

// Funcion que elimina un producto especifico del carrito.
function eliminarProducto(idProducto) {
  const carrito = obtenerCarrito().filter((item) => item.id !== idProducto);

  guardarCarrito(carrito);
  mensajeCarrito.textContent = "Producto eliminado del carrito.";
  mensajeCarrito.style.color = "#8b5e34";
  renderizarCarrito();
}

// Funcion que vacia el carrito despues de confirmar con el usuario.
function vaciarCarrito() {
  const carrito = obtenerCarrito();

  if (carrito.length === 0) return;

  const confirmar = confirm("¿Seguro que quieres vaciar el carrito?");

  if (!confirmar) return;

  vaciarCarritoGuardado();

  mensajeCarrito.textContent = "";
  renderizarCarrito();
}

// Funcion que obtiene las compras guardadas en localStorage.
function obtenerComprasGuardadas() {
  return JSON.parse(localStorage.getItem(CLAVE_COMPRAS)) || [];
}

// Funcion que registra una compra asociada a la sesion activa.
function guardarCompra(carrito, sesion) {
  const compras = obtenerComprasGuardadas();
  const total = carrito.reduce((acumulador, item) => {
    return acumulador + obtenerPrecioActualItem(item) * item.cantidad;
  }, 0);

  compras.push({
    id: `PED-${Date.now()}`,
    idUsuario: sesion.id,
    fecha: new Date().toISOString(),
    productos: carrito.map((item) => {
      const productoActual = obtenerProductoActualParaCarrito(item);

      return {
        id: item.id,
        nombre: productoActual ? productoActual.nombre : item.nombre,
        precio: obtenerPrecioActualItem(item),
        cantidad: item.cantidad,
      };
    }),
    total,
    despacho: {
      nombre: camposCheckout.nombre.value.trim(),
      telefono: camposCheckout.telefono.value.trim(),
      direccion: camposCheckout.direccion.value.trim(),
      entrega: camposCheckout.entrega.value,
      pago: camposCheckout.pago.value,
    },
  });

  localStorage.setItem(CLAVE_COMPRAS, JSON.stringify(compras));
}

// Funcion que calcula el total usando precios actualizados.
function obtenerTotalCarrito(carrito) {
  return carrito.reduce((acumulador, item) => {
    return acumulador + obtenerPrecioActualItem(item) * item.cantidad;
  }, 0);
}

// Funcion que valida disponibilidad de stock antes de comprar.
function validarStockCarrito(carrito) {
  for (const item of carrito) {
    const productoActual = buscarProductoPorId(item.id);

    if (!productoActual) {
      return {
        ok: false,
        mensaje: `${item.nombre} ya no esta disponible en el catalogo.`,
      };
    }

    if (item.cantidad > productoActual.stock) {
      return {
        ok: false,
        mensaje: `Stock insuficiente para ${item.nombre}. Disponible: ${productoActual.stock}.`,
      };
    }
  }

  return {
    ok: true,
    mensaje: "Stock disponible.",
  };
}

// Funcion que muestra errores del checkout reutilizando validaciones.
function mostrarErrorCheckout(campo, mensaje) {
  mostrarError(campo, mensaje);
}

// Funcion que limpia espacios y simbolos del telefono.
function normalizarTelefono(telefono) {
  return telefono.replace(/[\s().-]/g, "");
}

// Funcion que valida telefonos moviles chilenos.
function telefonoValido(telefono) {
  const telefonoNormalizado = normalizarTelefono(telefono);

  return /^(\+?56)?9\d{8}$/.test(telefonoNormalizado);
}

// Funcion que valida una direccion minima para despacho.
function direccionValida(direccion) {
  const direccionLimpia = direccion.trim();

  return direccionLimpia.length >= 8 && direccionLimpia.includes(" ");
}

// Funcion que detecta si el metodo elegido requiere direccion.
function requiereDireccionDespacho() {
  return camposCheckout.entrega.value === "Despacho a domicilio";
}

// Funcion que ajusta el campo direccion segun tipo de entrega.
function actualizarEstadoDireccionCheckout() {
  const direccion = camposCheckout.direccion;

  if (requiereDireccionDespacho()) {
    direccion.placeholder = "Calle, numero si aplica, comuna y region";
    return;
  }

  direccion.placeholder = "Opcional si retiraras en tienda";

  if (campoVacio(direccion.value)) {
    limpiarEstado(direccion);
  }
}

// Funcion que valida un campo especifico del checkout.
function validarCampoCheckout(campo) {
  const valor = campo.value;

  switch (campo.id) {
    case "checkoutNombre":
      if (campoVacio(valor)) {
        mostrarErrorCheckout(campo, "Ingresa un nombre de contacto.");
        return false;
      }

      if (valor.trim().length < 3) {
        mostrarErrorCheckout(campo, "El nombre debe tener al menos 3 caracteres.");
        return false;
      }

      mostrarCorrecto(campo);
      return true;
    case "checkoutTelefono":
      if (campoVacio(valor)) {
        mostrarErrorCheckout(campo, "Ingresa un telefono de contacto.");
        return false;
      }

      if (!telefonoValido(valor)) {
        mostrarErrorCheckout(campo, "Usa un formato valido, por ejemplo +56 9 1234 5678.");
        return false;
      }

      mostrarCorrecto(campo);
      return true;
    case "checkoutDireccion":
      if (!requiereDireccionDespacho() && campoVacio(valor)) {
        limpiarEstado(campo);
        return true;
      }

      if (campoVacio(valor)) {
        mostrarErrorCheckout(campo, "Ingresa una direccion de despacho.");
        return false;
      }

      if (!direccionValida(valor)) {
        mostrarErrorCheckout(campo, "Ingresa una direccion mas completa.");
        return false;
      }

      mostrarCorrecto(campo);
      return true;
    case "checkoutEntrega":
      if (campoVacio(valor)) {
        mostrarErrorCheckout(campo, "Selecciona un metodo de entrega.");
        return false;
      }

      mostrarCorrecto(campo);
      actualizarEstadoDireccionCheckout();
      validarCampoCheckout(camposCheckout.direccion);
      return true;
    case "checkoutPago":
      if (campoVacio(valor)) {
        mostrarErrorCheckout(campo, "Selecciona un metodo de pago.");
        return false;
      }

      mostrarCorrecto(campo);
      return true;
    default:
      return true;
  }
}

// Funcion que valida el formulario completo del checkout.
function validarCheckout() {
  let checkoutValido = true;

  Object.values(camposCheckout).forEach((campo) => {
    if (!validarCampoCheckout(campo)) {
      checkoutValido = false;
    }
  });

  return checkoutValido;
}

// Funcion que limpia estados visuales del checkout.
function limpiarCheckout() {
  Object.values(camposCheckout).forEach((campo) => {
    limpiarEstado(campo);
  });
}

// Funcion que precarga datos del usuario en el checkout.
function precargarDatosCheckout(sesion) {
  const usuario = buscarUsuarioPorId(sesion.id);

  camposCheckout.nombre.value = usuario?.nombreCompleto || sesion.nombreCompleto || "";
  camposCheckout.telefono.value = usuario?.telefono || "";
  camposCheckout.direccion.value = usuario?.direccion || "";
}

// Funcion que abre el modal de checkout si existe stock y sesion.
function abrirCheckout() {
  const carrito = obtenerCarrito();

  if (carrito.length === 0) return;

  const stockDisponible = validarStockCarrito(carrito);

  if (!stockDisponible.ok) {
    mensajeCarrito.textContent = stockDisponible.mensaje;
    mensajeCarrito.style.color = "#b00020";
    renderizarCarrito();
    return;
  }

  const sesion = obtenerSesionActiva();

  if (!sesion) {
    mensajeCarrito.textContent = "Inicia sesion para finalizar tu compra.";
    mensajeCarrito.style.color = "#b00020";

    setTimeout(() => {
      window.location.href = "login.html";
    }, 900);
    return;
  }

  limpiarCheckout();
  checkoutFormulario.style.display = "flex";
  checkoutExito.classList.remove("activo");
  checkoutTotal.textContent = formatearPrecio(obtenerTotalCarrito(carrito));
  precargarDatosCheckout(sesion);
  actualizarEstadoDireccionCheckout();

  const modal = new bootstrap.Modal(modalCheckout);
  modal.show();
}

// Funcion que muestra la confirmacion visual del checkout.
function mostrarConfirmacionCheckout() {
  checkoutFormulario.style.display = "none";
  checkoutExito.classList.add("activo");
}

// Funcion que confirma compra, descuenta stock y guarda pedido.
function confirmarCheckout(evento) {
  evento.preventDefault();

  const carrito = obtenerCarrito();
  const sesion = obtenerSesionActiva();

  if (carrito.length === 0 || !sesion) return;
  if (!validarCheckout()) return;

  const stockDisponible = validarStockCarrito(carrito);

  if (!stockDisponible.ok) {
    mensajeCarrito.textContent = stockDisponible.mensaje;
    mensajeCarrito.style.color = "#b00020";
    return;
  }

  const stockActualizado = descontarStockProductos(carrito);

  if (!stockActualizado.ok) {
    mensajeCarrito.textContent = stockActualizado.mensaje;
    mensajeCarrito.style.color = "#b00020";
    return;
  }

  guardarCompra(carrito, sesion);
  vaciarCarritoGuardado();
  renderizarCarrito();
  mostrarConfirmacionCheckout();

  setTimeout(() => {
    window.location.href = "mis-compras.html";
  }, 1800);
}

// Evento que controla botones de cantidad y eliminacion del carrito.
listaCarrito.addEventListener("click", (event) => {
  const botonCantidad = event.target.closest(".btn-cantidad");
  const botonEliminar = event.target.closest(".btn-eliminar");

  if (botonCantidad) {
    const idProducto = botonCantidad.dataset.id;
    const accion = botonCantidad.dataset.accion;

    cambiarCantidad(idProducto, accion);
  }

  if (botonEliminar) {
    const idProducto = botonEliminar.dataset.id;

    eliminarProducto(idProducto);
  }
});

// Se conectan botones principales del carrito y checkout.
btnVaciarCarrito.addEventListener("click", vaciarCarrito);
btnFinalizarCompra.addEventListener("click", abrirCheckout);
formCheckout.addEventListener("submit", confirmarCheckout);

// Se agregan validaciones en tiempo real a los campos del checkout.
Object.values(camposCheckout).forEach((campo) => {
  campo.addEventListener("input", () => {
    if (document.activeElement === campo) {
      validarCampoCheckout(campo);
    }
  });

  campo.addEventListener("blur", () => {
    validarCampoCheckout(campo);
  });
});

// Se actualiza direccion cuando cambia el metodo de entrega.
camposCheckout.entrega.addEventListener("change", actualizarEstadoDireccionCheckout);

// Se renderiza el carrito al cargar la pagina.
renderizarCarrito();
