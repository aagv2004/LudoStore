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
const camposCheckout = {
  nombre: document.getElementById("checkoutNombre"),
  telefono: document.getElementById("checkoutTelefono"),
  direccion: document.getElementById("checkoutDireccion"),
  entrega: document.getElementById("checkoutEntrega"),
  pago: document.getElementById("checkoutPago"),
};
const CLAVE_COMPRAS = "ludostore_compras";

function formatearPrecio(valor) {
  return valor.toLocaleString("es-CL", {
    style: "currency",
    currency: "CLP",
  });
}

function obtenerRutaImagen(rutaImagen) {
  return `../${rutaImagen}`;
}

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
      const subtotal = item.precio * item.cantidad;

      return `
            <article class="carrito-item">
                <img src="${obtenerRutaImagen(item.imagen)}" alt="Juego ${item.nombre}"
            />
            
            <div class="carrito-item-info">
                <h2>${item.nombre}</h2>
                <p>Precio unitario: ${formatearPrecio(item.precio)}</p>
                <p>Subtotal: <strong>${formatearPrecio(subtotal)}</strong></p>
            </div>

            <div class="carrito-controles">
                <button
                    type="button"
                    class="btn-cantidad"
                    data-accion="disminuir"
                    data-id="${item.id}"
                    aria-label="Disminuir cantidad de ${item.nombre}"
                >
                    -
                </button>

                <span>${item.cantidad}</span>

                <button
                    type="button"
                    class="btn-cantidad"
                    data-accion="aumentar"
                    data-id="${item.id}"
                    aria-label="Aumentar cantidad de ${item.nombre}"
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
    return acumulador + item.precio * item.cantidad;
  }, 0);

  totalProductosCarrito.textContent = cantidadProductos;
  totalCarrito.textContent = formatearPrecio(total);
}

function cambiarCantidad(idProducto, accion) {
  const carrito = obtenerCarrito();

  const productoCarrito = carrito.find((item) => item.id === idProducto);
  const productoOriginal = productos.find((item) => item.id === idProducto);

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

function eliminarProducto(idProducto) {
  const carrito = obtenerCarrito().filter((item) => item.id !== idProducto);

  guardarCarrito(carrito);
  mensajeCarrito.textContent = "Producto eliminado del carrito.";
  mensajeCarrito.style.color = "#8b5e34";
  renderizarCarrito();
}

function vaciarCarrito() {
  const carrito = obtenerCarrito();

  if (carrito.length === 0) return;

  const confirmar = confirm("¿Seguro que quieres vaciar el carrito?");

  if (!confirmar) return;

  vaciarCarritoGuardado();

  mensajeCarrito.textContent = "";
  renderizarCarrito();
}

function obtenerComprasGuardadas() {
  return JSON.parse(localStorage.getItem(CLAVE_COMPRAS)) || [];
}

function guardarCompra(carrito, sesion) {
  const compras = obtenerComprasGuardadas();
  const total = carrito.reduce((acumulador, item) => {
    return acumulador + item.precio * item.cantidad;
  }, 0);

  compras.push({
    id: `PED-${Date.now()}`,
    idUsuario: sesion.id,
    fecha: new Date().toISOString(),
    productos: carrito.map((item) => {
      return {
        id: item.id,
        nombre: item.nombre,
        precio: item.precio,
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

function obtenerTotalCarrito(carrito) {
  return carrito.reduce((acumulador, item) => {
    return acumulador + item.precio * item.cantidad;
  }, 0);
}

function mostrarErrorCheckout(campo, mensaje) {
  mostrarError(campo, mensaje);
}

function normalizarTelefono(telefono) {
  return telefono.replace(/[\s().-]/g, "");
}

function telefonoValido(telefono) {
  const telefonoNormalizado = normalizarTelefono(telefono);

  return /^(\+?56)?9\d{8}$/.test(telefonoNormalizado);
}

function direccionValida(direccion) {
  const direccionLimpia = direccion.trim();

  return direccionLimpia.length >= 8 && direccionLimpia.includes(" ");
}

function requiereDireccionDespacho() {
  return camposCheckout.entrega.value === "Despacho a domicilio";
}

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

function validarCheckout() {
  let checkoutValido = true;

  Object.values(camposCheckout).forEach((campo) => {
    if (!validarCampoCheckout(campo)) {
      checkoutValido = false;
    }
  });

  return checkoutValido;
}

function limpiarCheckout() {
  Object.values(camposCheckout).forEach((campo) => {
    limpiarEstado(campo);
  });
}

function precargarDatosCheckout(sesion) {
  const usuario = buscarUsuarioPorId(sesion.id);

  camposCheckout.nombre.value = usuario?.nombreCompleto || sesion.nombreCompleto || "";
  camposCheckout.telefono.value = usuario?.telefono || "";
  camposCheckout.direccion.value = usuario?.direccion || "";
}

function abrirCheckout() {
  const carrito = obtenerCarrito();

  if (carrito.length === 0) return;

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

function mostrarConfirmacionCheckout() {
  checkoutFormulario.style.display = "none";
  checkoutExito.classList.add("activo");
}

function confirmarCheckout(evento) {
  evento.preventDefault();

  const carrito = obtenerCarrito();
  const sesion = obtenerSesionActiva();

  if (carrito.length === 0 || !sesion) return;
  if (!validarCheckout()) return;

  guardarCompra(carrito, sesion);
  vaciarCarritoGuardado();
  renderizarCarrito();
  mostrarConfirmacionCheckout();

  setTimeout(() => {
    window.location.href = "mis-compras.html";
  }, 1800);
}

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

btnVaciarCarrito.addEventListener("click", vaciarCarrito);
btnFinalizarCompra.addEventListener("click", abrirCheckout);
formCheckout.addEventListener("submit", confirmarCheckout);

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

camposCheckout.entrega.addEventListener("change", actualizarEstadoDireccionCheckout);

renderizarCarrito();
