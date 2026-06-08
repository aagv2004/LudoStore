// VARIABLES INICIALIZADORAS.
const CLAVE_COMPRAS = "ludostore_compras";

// Se rescatan los elementos de resumen y listado de compras.
const comprasResumen = document.getElementById("comprasResumen");
const totalComprasUsuario = document.getElementById("totalComprasUsuario");
const totalGastadoUsuario = document.getElementById("totalGastadoUsuario");
const comprasVacio = document.getElementById("comprasVacio");
const comprasLista = document.getElementById("comprasLista");

// Funcion que obtiene todas las compras guardadas en localStorage.
function obtenerCompras() {
  return JSON.parse(localStorage.getItem(CLAVE_COMPRAS)) || [];
}

// Funcion que formatea valores numericos a moneda CLP.
function formatearPrecioCompra(valor) {
  return valor.toLocaleString("es-CL", {
    style: "currency",
    currency: "CLP",
  });
}

// Funcion que formatea fechas de compra en formato chileno.
function formatearFechaCompra(fecha) {
  return new Date(fecha).toLocaleDateString("es-CL", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

// Funcion que filtra compras pertenecientes a un usuario.
function obtenerComprasUsuario(idUsuario) {
  return obtenerCompras()
    .filter((compra) => compra.idUsuario === idUsuario)
    .sort((compraA, compraB) => {
      return new Date(compraB.fecha) - new Date(compraA.fecha);
    });
}

// Funcion que muestra el estado cuando no existen compras.
function renderizarEstadoVacio() {
  comprasResumen.style.display = "none";
  comprasVacio.style.display = "block";
  comprasLista.innerHTML = "";
}

// Funcion que renderiza las compras del usuario en pantalla.
function renderizarCompras(compras) {
  comprasResumen.style.display = "grid";
  comprasVacio.style.display = "none";

  const totalGastado = compras.reduce((total, compra) => {
    return total + compra.total;
  }, 0);

  totalComprasUsuario.textContent = compras.length;
  totalGastadoUsuario.textContent = formatearPrecioCompra(totalGastado);

  comprasLista.innerHTML = compras
    .map((compra) => {
      const productos = compra.productos
        .map((producto) => {
          return `
            <li>
              <span>${producto.nombre}</span>
              <strong>${producto.cantidad} x ${formatearPrecioCompra(producto.precio)}</strong>
            </li>
          `;
        })
        .join("");

      return `
        <article class="compra-card">
          <div class="compra-card-encabezado">
            <div>
              <span>Pedido ${compra.id}</span>
              <h2>${formatearFechaCompra(compra.fecha)}</h2>
            </div>
            <strong>${formatearPrecioCompra(compra.total)}</strong>
          </div>

          <ul class="compra-productos">
            ${productos}
          </ul>
        </article>
      `;
    })
    .join("");
}

// Funcion que valida sesion y carga las compras del usuario.
function inicializarMisCompras() {
  const sesion = obtenerSesionActiva();

  if (!sesion) {
    window.location.href = "login.html";
    return;
  }

  const comprasUsuario = obtenerComprasUsuario(sesion.id);

  if (comprasUsuario.length === 0) {
    renderizarEstadoVacio();
    return;
  }

  renderizarCompras(comprasUsuario);
}

// Se inicializa la vista de compras al cargar la pagina.
inicializarMisCompras();
