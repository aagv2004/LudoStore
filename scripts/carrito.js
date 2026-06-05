const CLAVE_CARRITO = "ludostore_carrito";

const carritoVacio = document.getElementById("carritoVacio");
const carritoContenido = document.getElementById("carritoContenido");
const listaCarrito = document.getElementById("listaCarrito");
const totalProductosCarrito = document.getElementById("totalProductosCarrito");
const totalCarrito = document.getElementById("totalCarrito");
const btnVaciarCarrito = document.getElementById("btnVaciarCarrito");
const btnFinalizarCompra = document.getElementById("btnFinalizarCompra");
const mensajeCarrito = document.getElementById("mensajeCarrito");
const contadorCarritoNavCarrito = document.getElementById("contadorCarritoNav");

function formatearPrecio(valor) {
  return valor.toLocaleString("es-CL", {
    style: "currency",
    currency: "CLP",
  });
}

function obtenerCarrito() {
  return JSON.parse(localStorage.getItem(CLAVE_CARRITO)) || [];
}

function guardarCarrito(carrito) {
  localStorage.setItem(CLAVE_CARRITO, JSON.stringify(carrito));
}

function obtenerRutaImagen(rutaImagen) {
  return `../${rutaImagen}`;
}

function actualizarContadorNav(carrito) {
  if (!contadorCarritoNavCarrito) return;

  const cantidadTotal = carrito.reduce((total, item) => {
    return total + item.cantidad;
  }, 0);

  contadorCarritoNavCarrito.textContent = cantidadTotal;
}

function renderizarCarrito() {
  const carrito = obtenerCarrito();

  actualizarContadorNav(carrito);

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

  localStorage.removeItem(CLAVE_CARRITO);

  mensajeCarrito.textContent = "";
  renderizarCarrito();
}

function finalizarCompra() {
  const carrito = obtenerCarrito();

  if (carrito.length === 0) return;

  alert("Compra simulada correctamente. Gracias por comprar en LudoStore.");

  localStorage.removeItem(CLAVE_CARRITO);
  renderizarCarrito();
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
btnFinalizarCompra.addEventListener("click", finalizarCompra);

renderizarCarrito();
