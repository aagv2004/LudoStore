// MODULO ADMINISTRADOR DE COMPRAS.

const ComprasAdmin = (() => {
  // Se rescatan los elementos principales de compras.
  const listaComprasAdmin = document.getElementById("listaComprasAdmin");
  const buscadorComprasAdmin = document.getElementById("buscadorComprasAdmin");
  const fechaComprasAdmin = document.getElementById("fechaComprasAdmin");

  // Funcion que filtra compras por busqueda y fecha.
  function obtenerFiltradas() {
    const busqueda = buscadorComprasAdmin.value.trim().toLowerCase();
    const fechaSeleccionada = fechaComprasAdmin.value;

    return obtenerComprasAdmin()
      .filter((compra) => {
        const usuario = buscarUsuarioPorId(compra.idUsuario);
        const textoCompra =
          `${compra.id} ${usuario?.nombreCompleto || ""} ${usuario?.correo || ""}`.toLowerCase();
        const coincideBusqueda = textoCompra.includes(busqueda);
        const coincideFecha =
          !fechaSeleccionada || compra.fecha.slice(0, 10) === fechaSeleccionada;

        return coincideBusqueda && coincideFecha;
      })
      .sort(
        (compraA, compraB) => new Date(compraB.fecha) - new Date(compraA.fecha),
      );
  }

  // Funcion que renderiza compras asociadas a usuarios registrados.
  function renderizar() {
    const comprasFiltradas = obtenerFiltradas();

    if (comprasFiltradas.length === 0) {
      listaComprasAdmin.innerHTML = `
        <div class="admin-vacio">
          <h3>No hay compras registradas</h3>
          <p>Cuando los usuarios compren, los pedidos apareceran aqui.</p>
        </div>
      `;
      return;
    }

    listaComprasAdmin.innerHTML = comprasFiltradas
      .map((compra) => {
        const usuario = buscarUsuarioPorId(compra.idUsuario);
        const productosCompra = compra.productos
          .map((producto) => {
            return `<li>${producto.nombre} · ${producto.cantidad} x ${formatearPrecioAdmin(producto.precio)}</li>`;
          })
          .join("");

        return `
          <article class="admin-compra">
            <div class="admin-compra-encabezado">
              <div>
                <span>${compra.id}</span>
                <h3>${usuario?.nombreCompleto || "Usuario eliminado"}</h3>
                <p>${usuario?.correo || "Sin correo disponible"}</p>
              </div>
              <strong>${formatearPrecioAdmin(compra.total)}</strong>
            </div>
            <ul>${productosCompra}</ul>
            <div class="admin-compra-meta">
              <span>${formatearFechaAdmin(compra.fecha)}</span>
              <span>${compra.despacho?.entrega || "Entrega no registrada"}</span>
              <span>${compra.despacho?.pago || "Pago no registrado"}</span>
            </div>
          </article>
        `;
      })
      .join("");
  }

  // Funcion que conecta eventos del modulo de compras.
  function inicializar() {
    buscadorComprasAdmin.addEventListener("input", renderizar);
    fechaComprasAdmin.addEventListener("change", renderizar);
  }

  return {
    inicializar,
    renderizar,
  };
})();
