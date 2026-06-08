// MODULO ADMINISTRADOR DE PRODUCTOS.
const ProductosAdmin = (() => {
  // Se rescatan los elementos que componen los campos de un producto.
  const camposProducto = {
    nombre: document.getElementById("adminProductoNombre"),
    categoria: document.getElementById("adminProductoCategoria"),
    imagen: document.getElementById("adminProductoImagen"),
    descripcion: document.getElementById("adminProductoDescripcion"),
    precio: document.getElementById("adminProductoPrecio"),
    descuento: document.getElementById("adminProductoDescuento"),
    stock: document.getElementById("adminProductoStock"),
    jugadores: document.getElementById("adminProductoJugadores"),
    edad: document.getElementById("adminProductoEdad"),
    duracion: document.getElementById("adminProductoDuracion"),
  };

  // Se rescatan los elementos principales del CRUD de productos.
  const formProductoAdmin = document.getElementById("formProductoAdmin");
  const tituloFormularioProducto = document.getElementById(
    "tituloFormularioProducto",
  );
  const resumenProductoAdmin = document.getElementById("resumenProductoAdmin");
  const listaProductosAdmin = document.getElementById("listaProductosAdmin");
  const buscadorProductosAdmin = document.getElementById(
    "buscadorProductosAdmin",
  );
  const filtroCategoriaAdmin = document.getElementById("filtroCategoriaAdmin");
  const filtroStockAdmin = document.getElementById("filtroStockAdmin");
  const btnNuevoProducto = document.getElementById("btnNuevoProducto");
  const btnCancelarProducto = document.getElementById("btnCancelarProducto");
  const btnSugerirRutaImagen = document.getElementById("btnSugerirRutaImagen");

  // Se inicializa en null el producto que se esta editando.
  let productoEditandoId = null;

  // Funcion que extrae el primer numero encontrado en un texto.
  function extraerNumero(texto) {
    const coincidencia = String(texto || "").match(/\d+/);

    return coincidencia ? coincidencia[0] : "";
  }

  // Funcion que obtiene solo numeros desde un valor escrito.
  function obtenerDigitos(valor) {
    return String(valor || "").replace(/\D/g, "");
  }

  // Funcion que formatea numeros con separador de miles chileno.
  function formatearMiles(valor) {
    const digitos = obtenerDigitos(valor);

    if (!digitos) return "";

    return Number(digitos).toLocaleString("es-CL");
  }

  // Funcion que normaliza descuento vacio o cero a "Sin descuento".
  function formatearDescuento(valor) {
    const descuento = Number(valor);

    if (!descuento) return "Sin descuento";

    return `${descuento}%`;
  }

  // Funcion que normaliza edad minima en formato legible.
  function formatearEdad(valor) {
    return `${Number(valor)}+ años`;
  }

  // Funcion que normaliza duracion en minutos.
  function formatearDuracion(valor) {
    const minutos = Number(valor);

    return minutos === 1 ? "1 minuto" : `${minutos} minutos`;
  }

  // Funcion que sugiere una ruta de imagen desde el nombre del producto.
  function sugerirRutaImagen() {
    const nombreProducto = camposProducto.nombre.value.trim();

    if (campoVacio(nombreProducto)) {
      mostrarError(
        camposProducto.nombre,
        "Ingresa un nombre para sugerir la ruta.",
      );
      camposProducto.nombre.focus();
      return;
    }

    camposProducto.imagen.value = `images/juegos/${crearSlugProducto(nombreProducto)}.webp`;
    mostrarCorrecto(camposProducto.imagen);
  }

  // Funcion que limpia el formulario y vuelve al modo crear producto.
  function limpiarFormulario(
    mensaje = "Completa los datos para guardar un producto.",
    tipo = "",
  ) {
    productoEditandoId = null;
    formProductoAdmin.reset();
    camposProducto.descuento.value = "";
    tituloFormularioProducto.textContent = "Nuevo producto";

    Object.values(camposProducto).forEach((campo) => limpiarEstado(campo));
    actualizarResumen(resumenProductoAdmin, mensaje, tipo);
  }

  // Funcion que arma el objeto con datos del formulario de producto.
  function obtenerDatosFormulario() {
    return {
      nombre: camposProducto.nombre.value,
      categoria: camposProducto.categoria.value,
      imagen: camposProducto.imagen.value,
      descripcion: camposProducto.descripcion.value,
      precio: obtenerDigitos(camposProducto.precio.value),
      descuento: formatearDescuento(camposProducto.descuento.value),
      stock: camposProducto.stock.value,
      jugadores: camposProducto.jugadores.value,
      edad: formatearEdad(camposProducto.edad.value),
      duracion: formatearDuracion(camposProducto.duracion.value),
    };
  }

  // Funcion que valida los campos antes de guardar un producto.
  function validarFormulario() {
    let valido = true;

    Object.entries(camposProducto).forEach(([nombreCampo, campo]) => {
      const valor = campo.value;

      if (campoVacio(valor) && nombreCampo !== "descuento") {
        mostrarError(campo, "Este campo es obligatorio.");
        valido = false;
        return;
      }

      if (nombreCampo === "precio" && Number(obtenerDigitos(valor)) <= 0) {
        mostrarError(campo, "El precio debe ser mayor a 0.");
        valido = false;
        return;
      }

      if (nombreCampo === "stock" && Number(valor) < 0) {
        mostrarError(campo, "El stock no puede ser negativo.");
        valido = false;
        return;
      }

      if (
        nombreCampo === "descuento" &&
        !campoVacio(valor) &&
        (Number(valor) < 0 || Number(valor) > 100)
      ) {
        mostrarError(campo, "El descuento debe estar entre 0 y 100.");
        valido = false;
        return;
      }

      if (nombreCampo === "edad" && Number(valor) < 0) {
        mostrarError(campo, "La edad no puede ser negativa.");
        valido = false;
        return;
      }

      if (nombreCampo === "duracion" && Number(valor) <= 0) {
        mostrarError(campo, "La duracion debe ser mayor a 0.");
        valido = false;
        return;
      }

      mostrarCorrecto(campo);
    });

    return valido;
  }

  // Funcion que carga un producto existente para editarlo.
  function cargarEnFormulario(idProducto) {
    const producto = buscarProductoPorId(idProducto);

    if (!producto) return;

    productoEditandoId = producto.id;
    tituloFormularioProducto.textContent = `Editando ${producto.nombre}`;

    camposProducto.nombre.value = producto.nombre;
    camposProducto.categoria.value = producto.categoria;
    camposProducto.imagen.value = producto.imagen;
    camposProducto.descripcion.value = producto.descripcion;
    camposProducto.precio.value = formatearMiles(producto.precio);
    camposProducto.descuento.value =
      producto.descuento === "Sin descuento" ? "" : extraerNumero(producto.descuento);
    camposProducto.stock.value = producto.stock;
    camposProducto.jugadores.value = producto.jugadores;
    camposProducto.edad.value = extraerNumero(producto.edad);
    camposProducto.duracion.value = extraerNumero(producto.duracion);

    Object.values(camposProducto).forEach((campo) => limpiarEstado(campo));
    actualizarResumen(
      resumenProductoAdmin,
      "Edita los datos y guarda los cambios.",
      "",
    );
  }

  // Funcion que filtra productos por busqueda, categoria y stock.
  function obtenerFiltrados() {
    const busqueda = buscadorProductosAdmin.value.trim().toLowerCase();
    const categoria = filtroCategoriaAdmin.value;
    const filtroStock = filtroStockAdmin.value;

    return obtenerProductos().filter((producto) => {
      const coincideBusqueda = producto.nombre.toLowerCase().includes(busqueda);
      const coincideCategoria =
        categoria === "todos" || producto.categoria === categoria;
      const coincideStock =
        filtroStock === "todos" ||
        (filtroStock === "bajo" && producto.stock <= STOCK_BAJO) ||
        (filtroStock === "sin-stock" && producto.stock === 0);

      return coincideBusqueda && coincideCategoria && coincideStock;
    });
  }

  // Funcion que renderiza el listado de productos del admin.
  function renderizar() {
    const productosFiltrados = obtenerFiltrados();

    if (productosFiltrados.length === 0) {
      listaProductosAdmin.innerHTML = `
        <div class="admin-vacio">
          <h3>No hay productos</h3>
          <p>Cambia los filtros o crea un producto nuevo.</p>
        </div>
      `;
      return;
    }

    listaProductosAdmin.innerHTML = productosFiltrados
      .map((producto) => {
        return `
          <article class="admin-item">
            <img src="${obtenerRutaImagenAdmin(producto.imagen)}" alt="Juego ${producto.nombre}" />
            <div>
              <span>${producto.categoria}</span>
              <h3>${producto.nombre}</h3>
              <p>${formatearPrecioAdmin(producto.precio)} · Stock ${producto.stock}</p>
            </div>
            <div class="admin-item-acciones">
              <button class="btn-admin-secundario" data-accion="editar-producto" data-id="${producto.id}" type="button">
                Editar
              </button>
              <button class="btn-admin-peligro" data-accion="eliminar-producto" data-id="${producto.id}" type="button">
                Eliminar
              </button>
            </div>
          </article>
        `;
      })
      .join("");
  }

  // Evento que crea o actualiza productos desde el formulario.
  function procesarFormulario(evento) {
    evento.preventDefault();

    if (!validarFormulario()) {
      actualizarResumen(
        resumenProductoAdmin,
        "Revisa los campos marcados.",
        "error",
      );
      return;
    }

    if (productoEditandoId) {
      const resultado = actualizarProducto(
        productoEditandoId,
        obtenerDatosFormulario(),
      );
      limpiarFormulario(resultado.mensaje, resultado.ok ? "correcto" : "error");
      Admin.renderizarTodo();
      return;
    }

    crearProducto(obtenerDatosFormulario());
    limpiarFormulario("Producto creado correctamente.", "correcto");
    Admin.renderizarTodo();
  }

  // Evento que controla acciones de editar y eliminar productos.
  function procesarAccionListado(evento) {
    const boton = evento.target.closest("button[data-accion]");

    if (!boton) return;

    const { accion, id } = boton.dataset;

    if (accion === "editar-producto") {
      cargarEnFormulario(id);
    }

    if (accion === "eliminar-producto") {
      const producto = buscarProductoPorId(id);
      const confirmar = confirm(`Seguro que quieres eliminar ${producto.nombre}?`);

      if (!confirmar) return;

      eliminarProducto(id);
      limpiarFormulario();
      Admin.renderizarTodo();
    }
  }

  // Funcion que formatea el precio mientras el usuario escribe.
  function formatearPrecioEnFormulario() {
    camposProducto.precio.value = formatearMiles(camposProducto.precio.value);
  }

  // Funcion que conecta eventos del modulo de productos.
  function inicializar() {
    limpiarFormulario();

    [buscadorProductosAdmin, filtroCategoriaAdmin, filtroStockAdmin].forEach(
      (control) => {
        control.addEventListener("input", renderizar);
        control.addEventListener("change", renderizar);
      },
    );

    btnNuevoProducto.addEventListener("click", () => limpiarFormulario());
    btnCancelarProducto.addEventListener("click", () => limpiarFormulario());
    btnSugerirRutaImagen.addEventListener("click", sugerirRutaImagen);
    camposProducto.precio.addEventListener("input", formatearPrecioEnFormulario);
    formProductoAdmin.addEventListener("submit", procesarFormulario);
    listaProductosAdmin.addEventListener("click", procesarAccionListado);
  }

  return {
    inicializar,
    renderizar,
  };
})();
