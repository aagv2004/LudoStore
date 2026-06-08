// MODULO ADMINISTRADOR DE INVENTARIO.
const InventarioAdmin = (() => {
  // Se rescata el listado donde se renderiza el inventario.
  const listaInventarioAdmin = document.getElementById("listaInventarioAdmin");
  const buscadorInventarioAdmin = document.getElementById(
    "buscadorInventarioAdmin",
  );

  // Funcion que obtiene el estado de stock mostrado en inventario.
  function obtenerEstadoStock(producto) {
    if (producto.stock === 0) return "Sin stock";
    if (producto.stock <= STOCK_BAJO) return "Bajo";

    return "Disponible";
  }

  // Funcion que filtra inventario por busqueda general.
  function obtenerProductosInventario() {
    const busqueda = buscadorInventarioAdmin.value.trim().toLowerCase();

    return obtenerProductos()
      .filter((producto) => {
        const estado = obtenerEstadoStock(producto).toLowerCase();
        const textoProducto =
          `${producto.nombre} ${producto.categoria} ${estado}`.toLowerCase();

        return textoProducto.includes(busqueda);
      })
      .sort((productoA, productoB) => {
        return productoA.stock - productoB.stock;
      });
  }

  // Funcion que renderiza inventario ordenado por menor stock.
  function renderizar() {
    const productosOrdenados = obtenerProductosInventario();

    if (productosOrdenados.length === 0) {
      listaInventarioAdmin.innerHTML = `
        <div class="admin-vacio">
          <h3>No hay productos para mostrar</h3>
          <p>Prueba con otro nombre, categoria o estado de stock.</p>
        </div>
      `;
      return;
    }

    listaInventarioAdmin.innerHTML = productosOrdenados
      .map((producto) => {
        const estado = obtenerEstadoStock(producto);

        return `
          <article class="admin-item inventario-item">
            <div>
              <span>${estado}</span>
              <h3>${producto.nombre}</h3>
              <p>${producto.categoria}</p>
            </div>
            <div class="inventario-control">
              <input
                class="form-control"
                type="number"
                min="0"
                value="${producto.stock}"
                data-id="${producto.id}"
                aria-label="Stock de ${producto.nombre}" />
              <button class="btn-admin-secundario" data-accion="guardar-stock" data-id="${producto.id}" type="button">
                Guardar
              </button>
            </div>
          </article>
        `;
      })
      .join("");
  }

  // Evento que guarda ajustes directos de stock en inventario.
  function guardarStock(evento) {
    const boton = evento.target.closest("button[data-accion='guardar-stock']");

    if (!boton) return;

    const inputStock = listaInventarioAdmin.querySelector(
      `input[data-id="${boton.dataset.id}"]`,
    );
    const producto = buscarProductoPorId(boton.dataset.id);

    if (!producto || !inputStock) return;

    actualizarProducto(producto.id, {
      ...producto,
      stock: Number(inputStock.value),
    });

    Admin.renderizarTodo();
  }

  // Funcion que conecta eventos del modulo de inventario.
  function inicializar() {
    buscadorInventarioAdmin.addEventListener("input", renderizar);
    listaInventarioAdmin.addEventListener("click", guardarStock);
  }

  return {
    inicializar,
    renderizar,
  };
})();
