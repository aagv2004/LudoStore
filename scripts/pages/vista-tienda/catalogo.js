// Se rescatan los elementos principales del catalogo.
const contenedorCatalogo = document.getElementById("catalogoProductos");
const filtroCategoria = document.getElementById("filtroCategoria");
const filtroPrecio = document.getElementById("filtroPrecio");
const filtroDescuento = document.getElementById("filtroDescuento");
const buscadorCatalogo = document.getElementById("buscadorCatalogo");
const contadorCatalogo = document.getElementById("contadorCatalogo");
const contenedorFiltros = document.querySelector(".catalogo-filtros");
const botonFiltrosCatalogo = document.getElementById("botonFiltrosCatalogo");

// Funcion que formatea valores numericos a moneda CLP.
function formatearPrecio(valor) {
  return valor.toLocaleString("es-CL", {
    style: "currency",
    currency: "CLP",
  });
}

// Funcion que evalua si un producto cumple el filtro de precio.
function productoCumplePrecio(producto, filtro) {
  if (filtro === "menor-15000") return producto.precio < 15000;
  if (filtro === "15000-25000")
    return producto.precio >= 15000 && producto.precio <= 25000;
  if (filtro === "mayor-25000") return producto.precio > 25000;

  return true;
}

// Funcion que evalua si un producto cumple el filtro de descuento.
function productoCumpleDescuento(producto, filtro) {
  if (filtro === "con-descuento") return producto.descuento !== "Sin descuento";
  if (filtro === "sin-descuento") return producto.descuento === "Sin descuento";

  return true;
}

// Funcion que crea la tarjeta HTML de un producto del catalogo.
function crearCardProducto(producto) {
  const descuentoTexto =
    producto.descuento === "Sin descuento"
      ? "Sin descuento"
      : `Descuento: ${producto.descuento}`;
  const sinStock = producto.stock <= 0;

  return `
    <article class="juego-card">
      <img src="${producto.imagen}" alt="Juego ${producto.nombre}" />
      <div class="juego-info">
        <p class="catalogo-etiqueta">${producto.categoria}</p>
        <h3>${producto.nombre}</h3>
        <p>${producto.descripcion}</p>
        <p class="precio">${formatearPrecio(producto.precio)}</p>
        <p class="descuento">${descuentoTexto}</p>
        <div class="card-producto-acciones">
          <a
            class="btn-outline-ludostore btn-detalle-producto"
            href="pages/detalle-producto.html?id=${producto.id}">
            Ver detalle
          </a>

          <button 
            type="button"
            class="btn-agregar-carrito-card"
            data-id="${producto.id}"
            ${sinStock ? "disabled" : ""}
          >
            ${sinStock ? "Sin stock" : "Agregar"}
          </button>
        </div>
      </div>
    </article>
  `;
}

// Funcion que obtiene productos aplicando filtros y busqueda.
function obtenerProductosFiltrados() {
  const categoriaSeleccionada = filtroCategoria.value;
  const precioSeleccionado = filtroPrecio.value;
  const descuentoSeleccionado = filtroDescuento.value;
  const busqueda = buscadorCatalogo.value.trim().toLowerCase();

  return obtenerProductos().filter((producto) => {
    const coincideCategoria =
      categoriaSeleccionada === "todos" ||
      producto.categoria === categoriaSeleccionada;
    const coincidePrecio = productoCumplePrecio(producto, precioSeleccionado);
    const coincideDescuento = productoCumpleDescuento(
      producto,
      descuentoSeleccionado,
    );
    const coincideBusqueda =
      producto.nombre.toLowerCase().includes(busqueda) ||
      producto.descripcion.toLowerCase().includes(busqueda);

    return (
      coincideCategoria &&
      coincidePrecio &&
      coincideDescuento &&
      coincideBusqueda
    );
  });
}

// Funcion que renderiza el catalogo y su contador de resultados.
function renderizarCatalogo() {
  const productosFiltrados = obtenerProductosFiltrados();

  contadorCatalogo.textContent = `${productosFiltrados.length} producto(s) encontrados`;

  if (productosFiltrados.length === 0) {
    contenedorCatalogo.innerHTML = `
      <div class="catalogo-vacio">
        <h3>No encontramos productos</h3>
        <p>Prueba cambiando los filtros o limpiando la busqueda.</p>
      </div>
    `;
    return;
  }

  contenedorCatalogo.innerHTML = productosFiltrados
    .map((producto) => crearCardProducto(producto))
    .join("");
}

// Se conectan los controles de filtro con el render del catalogo.
[filtroCategoria, filtroPrecio, filtroDescuento, buscadorCatalogo].forEach(
  (control) => {
    control.addEventListener("input", renderizarCatalogo);
    control.addEventListener("change", renderizarCatalogo);
  },
);

// Se conecta el boton que muestra u oculta filtros en pantallas pequenas.
if (contenedorFiltros && botonFiltrosCatalogo) {
  botonFiltrosCatalogo.addEventListener("click", () => {
    const estaCerrado = contenedorFiltros.classList.toggle("filtros-cerrados");

    botonFiltrosCatalogo.setAttribute("aria-expanded", String(!estaCerrado));
    botonFiltrosCatalogo.textContent = estaCerrado
      ? "Ver filtros"
      : "Ocultar filtros";
  });
}

// Evento que agrega productos al carrito desde las tarjetas.
document.addEventListener("click", (event) => {
  const botonAgregar = event.target.closest(".btn-agregar-carrito-card");

  if (!botonAgregar) return;

  const idProducto = botonAgregar.dataset.id;
  const producto = buscarProductoPorId(idProducto);

  if (!producto) return;

  const resultado = agregarProductoAlCarrito(producto, 1);

  actualizarContadorCarrito();

  botonAgregar.textContent = resultado.ok ? "Agregado" : "Sin stock";
  botonAgregar.classList.add(resultado.ok ? "agregado" : "sin-stock");

  setTimeout(() => {
    botonAgregar.textContent = "Agregar";
    botonAgregar.classList.remove("agregado", "sin-stock");
  }, 1600);
});

// Se renderiza el catalogo al cargar la pagina.
renderizarCatalogo();
