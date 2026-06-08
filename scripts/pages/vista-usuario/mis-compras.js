const CLAVE_COMPRAS = "ludostore_compras";

const comprasResumen = document.getElementById("comprasResumen");
const totalComprasUsuario = document.getElementById("totalComprasUsuario");
const totalGastadoUsuario = document.getElementById("totalGastadoUsuario");
const comprasVacio = document.getElementById("comprasVacio");
const comprasLista = document.getElementById("comprasLista");

function obtenerCompras() {
  return JSON.parse(localStorage.getItem(CLAVE_COMPRAS)) || [];
}

function formatearPrecioCompra(valor) {
  return valor.toLocaleString("es-CL", {
    style: "currency",
    currency: "CLP",
  });
}

function formatearFechaCompra(fecha) {
  return new Date(fecha).toLocaleDateString("es-CL", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function obtenerComprasUsuario(idUsuario) {
  return obtenerCompras()
    .filter((compra) => compra.idUsuario === idUsuario)
    .sort((compraA, compraB) => {
      return new Date(compraB.fecha) - new Date(compraA.fecha);
    });
}

function renderizarEstadoVacio() {
  comprasResumen.style.display = "none";
  comprasVacio.style.display = "block";
  comprasLista.innerHTML = "";
}

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

inicializarMisCompras();
