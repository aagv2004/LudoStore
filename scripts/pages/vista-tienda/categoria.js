// Se relaciona cada archivo HTML con su categoria de productos.
const categoriaPorArchivo = {
  "cartas.html": "Cartas",
  "cooperativos.html": "Cooperativos",
  "estrategias.html": "Estrategia",
  "familiares.html": "Familiares",
};

// Se rescatan la lista de productos y la categoria actual.
const listadoCategoria = document.querySelector(".listado-juegos");
const archivoCategoria = window.location.pathname.split("/").pop();
const categoriaActual = categoriaPorArchivo[archivoCategoria];

// Funcion que formatea precios de productos por categoria.
function formatearPrecioCategoria(valor) {
  return valor.toLocaleString("es-CL", {
    style: "currency",
    currency: "CLP",
  });
}

// Funcion que crea la tarjeta HTML de un producto de categoria.
function crearCardCategoria(producto) {
  const descuentoTexto =
    producto.descuento === "Sin descuento"
      ? "Sin descuento"
      : `Descuento: ${producto.descuento}`;
  const sinStock = producto.stock <= 0;

  return `
    <article class="juego-card">
      <img src="../../${producto.imagen}" alt="Juego ${producto.nombre}" />
      <div class="juego-info">
        <h3>${producto.nombre}</h3>
        <p>${producto.descripcion}</p>
        <p class="precio">${formatearPrecioCategoria(producto.precio)}</p>
        <p class="descuento">${descuentoTexto}</p>
      </div>
      <div class="card-producto-acciones">
        <a
          class="btn-outline-ludostore btn-detalle-producto"
          href="../detalle-producto.html?id=${producto.id}">
          Ver detalle
        </a>
        <button
          class="btn-ludostore btn-categoria-agregar"
          data-id="${producto.id}"
          type="button"
          ${sinStock ? "disabled" : ""}>
          ${sinStock ? "Sin stock" : "Agregar al carrito"}
        </button>
      </div>
    </article>
  `;
}

// Funcion que renderiza productos segun la categoria actual.
function renderizarCategoria() {
  if (!listadoCategoria || !categoriaActual) return;

  const productosCategoria = obtenerProductos().filter((producto) => {
    return producto.categoria === categoriaActual;
  });

  if (productosCategoria.length === 0) {
    listadoCategoria.innerHTML = `
      <div class="catalogo-vacio">
        <h3>No hay productos en esta categoria</h3>
        <p>Revisa el catalogo general o vuelve mas tarde.</p>
      </div>
    `;
    return;
  }

  listadoCategoria.innerHTML = productosCategoria.map(crearCardCategoria).join("");
}

// Evento que agrega productos al carrito desde paginas de categoria.
document.addEventListener("click", (evento) => {
  const botonAgregar = evento.target.closest(".btn-categoria-agregar");

  if (!botonAgregar) return;

  const producto = buscarProductoPorId(botonAgregar.dataset.id);

  if (!producto) return;

  const resultado = agregarProductoAlCarrito(producto, 1);

  actualizarContadorCarrito();

  botonAgregar.textContent = resultado.ok ? "Agregado" : "Sin stock";
  botonAgregar.classList.add(resultado.ok ? "agregado" : "sin-stock");

  setTimeout(() => {
    botonAgregar.textContent = producto.stock <= 0 ? "Sin stock" : "Agregar al carrito";
    botonAgregar.classList.remove("agregado", "sin-stock");
  }, 1600);
});

// Se renderiza la categoria al cargar la pagina.
renderizarCategoria();
