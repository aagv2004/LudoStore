const contenedorCatalogo = document.getElementById("catalogoProductos");
const filtroCategoria = document.getElementById("filtroCategoria");
const filtroPrecio = document.getElementById("filtroPrecio");
const filtroDescuento = document.getElementById("filtroDescuento");
const buscadorCatalogo = document.getElementById("buscadorCatalogo");
const contadorCatalogo = document.getElementById("contadorCatalogo");
const contenedorFiltros = document.querySelector(".catalogo-filtros");
const botonFiltrosCatalogo = document.getElementById("botonFiltrosCatalogo");

function formatearPrecio(valor) {
  return valor.toLocaleString("es-CL", {
    style: "currency",
    currency: "CLP",
  });
}

function productoCumplePrecio(producto, filtro) {
  if (filtro === "menor-15000") return producto.precio < 15000;
  if (filtro === "15000-25000")
    return producto.precio >= 15000 && producto.precio <= 25000;
  if (filtro === "mayor-25000") return producto.precio > 25000;

  return true;
}

function productoCumpleDescuento(producto, filtro) {
  if (filtro === "con-descuento") return producto.descuento !== "Sin descuento";
  if (filtro === "sin-descuento") return producto.descuento === "Sin descuento";

  return true;
}

function crearCardProducto(producto) {
  const descuentoTexto =
    producto.descuento === "Sin descuento"
      ? "Sin descuento"
      : `Descuento: ${producto.descuento}`;

  return `
    <article class="juego-card">
      <img src="${producto.imagen}" alt="Juego ${producto.nombre}" />
      <div class="juego-info">
        <p class="catalogo-etiqueta">${producto.categoria}</p>
        <h3>${producto.nombre}</h3>
        <p>${producto.descripcion}</p>
        <p class="precio">${formatearPrecio(producto.precio)}</p>
        <p class="descuento">${descuentoTexto}</p>
        <a
          class="btn-outline-ludostore btn-detalle-producto"
          href="pages/detalle-producto.html?id=${producto.id}">
          Ver detalle
        </a>
      </div>
    </article>
  `;
}

function obtenerProductosFiltrados() {
  const categoriaSeleccionada = filtroCategoria.value;
  const precioSeleccionado = filtroPrecio.value;
  const descuentoSeleccionado = filtroDescuento.value;
  const busqueda = buscadorCatalogo.value.trim().toLowerCase();

  return productos.filter((producto) => {
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

[filtroCategoria, filtroPrecio, filtroDescuento, buscadorCatalogo].forEach(
  (control) => {
    control.addEventListener("input", renderizarCatalogo);
    control.addEventListener("change", renderizarCatalogo);
  },
);

if (contenedorFiltros && botonFiltrosCatalogo) {
  botonFiltrosCatalogo.addEventListener("click", () => {
    const estaCerrado = contenedorFiltros.classList.toggle("filtros-cerrados");

    botonFiltrosCatalogo.setAttribute("aria-expanded", String(!estaCerrado));
    botonFiltrosCatalogo.textContent = estaCerrado
      ? "Ver filtros"
      : "Ocultar filtros";
  });
}

renderizarCatalogo();
