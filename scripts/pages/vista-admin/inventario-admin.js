// MODULO ADMINISTRADOR DE INVENTARIO.
const InventarioAdmin = (() => {
  // Se rescata el listado donde se renderiza el inventario.
  const listaInventarioAdmin = document.getElementById("listaInventarioAdmin");

  // Funcion que renderiza inventario ordenado por menor stock.
  function renderizar() {
    const productosOrdenados = obtenerProductos().sort((productoA, productoB) => {
      return productoA.stock - productoB.stock;
    });

    listaInventarioAdmin.innerHTML = productosOrdenados
      .map((producto) => {
        const estado =
          producto.stock === 0
            ? "Sin stock"
            : producto.stock <= STOCK_BAJO
              ? "Bajo"
              : "Disponible";

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
    listaInventarioAdmin.addEventListener("click", guardarStock);
  }

  return {
    inicializar,
    renderizar,
  };
})();
