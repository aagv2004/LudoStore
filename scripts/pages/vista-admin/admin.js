// VARIABLES INICIALIZADORAS.
const CLAVE_COMPRAS_ADMIN = "ludostore_compras";
const STOCK_BAJO = 3;

// Se rescatan los elementos que componen el resumen de admin.
const resumenAdmin = {
  productos: document.getElementById("adminTotalProductos"),
  bajoStock: document.getElementById("adminBajoStock"),
  usuarios: document.getElementById("adminTotalUsuarios"),
  compras: document.getElementById("adminTotalCompras"),
};

// Se rescatan los elementos que componen el panel de admin.
const panelesAdmin = {
  productos: document.getElementById("panelProductos"),
  inventario: document.getElementById("panelInventario"),
  usuarios: document.getElementById("panelUsuarios"),
  compras: document.getElementById("panelCompras"),
};

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

// Se rescatan los elementos que componen los campos de un usuario.
const camposUsuario = {
  nombreCompleto: document.getElementById("adminUsuarioNombre"),
  usuario: document.getElementById("adminUsuarioAlias"),
  correo: document.getElementById("adminUsuarioCorreo"),
  telefono: document.getElementById("adminUsuarioTelefono"),
  rol: document.getElementById("adminUsuarioRol"),
  direccion: document.getElementById("adminUsuarioDireccion"),
};

// Se rescatan los elementos de formularios para productos y admin.
const formProductoAdmin = document.getElementById("formProductoAdmin");
const formUsuarioAdmin = document.getElementById("formUsuarioAdmin");

// Se rescatan los elementos correspondientes a los titulos de formularios.
const tituloFormularioProducto = document.getElementById(
  "tituloFormularioProducto",
);
const tituloFormularioUsuario = document.getElementById(
  "tituloFormularioUsuario",
);

// Se rescatan elementos correspondientes a
// el resumen de productos y de usuarios para el admin.
const resumenProductoAdmin = document.getElementById("resumenProductoAdmin");
const resumenUsuarioAdmin = document.getElementById("resumenUsuarioAdmin");

// Se rescatan elementos correspondientes a la listas para el administrador.
const listaProductosAdmin = document.getElementById("listaProductosAdmin");
const listaInventarioAdmin = document.getElementById("listaInventarioAdmin");
const listaUsuariosAdmin = document.getElementById("listaUsuariosAdmin");
const listaComprasAdmin = document.getElementById("listaComprasAdmin");

// Se rescata elemento correspondiente a un buscador de productos.
const buscadorProductosAdmin = document.getElementById(
  "buscadorProductosAdmin",
);

// Se rescatan elementos correspondientes a filtros.
const filtroCategoriaAdmin = document.getElementById("filtroCategoriaAdmin");
const filtroStockAdmin = document.getElementById("filtroStockAdmin");

// Se rescatan elementos correspondientes a buscadores.
const buscadorUsuariosAdmin = document.getElementById("buscadorUsuariosAdmin");
const buscadorComprasAdmin = document.getElementById("buscadorComprasAdmin");

// Se rescata un campo de fecha de compras.
const fechaComprasAdmin = document.getElementById("fechaComprasAdmin");

// Se rescatan elementos para botones.
const btnNuevoProducto = document.getElementById("btnNuevoProducto");
const btnCancelarProducto = document.getElementById("btnCancelarProducto");
const btnCancelarUsuario = document.getElementById("btnCancelarUsuario");

// Se inicializa en null estado de edición de productos y usuarios.
let productoEditandoId = null;
let usuarioEditandoId = null;

// Función que evalúa si la persona que intenta acceder a la página
// "admin.html" tiene o no el rol de "admin".
function validarAccesoAdmin() {
  const sesion = obtenerSesionActiva();

  if (!sesion) {
    window.location.href = "login.html";
    return false;
  }

  if (!usuarioTieneRol("admin")) {
    window.location.href = "../index.html";
    return false;
  }

  return true;
}

// Función que permite acceder al localStorage para traer las
// compras de los usuarios al panel de admin.
function obtenerComprasAdmin() {
  return JSON.parse(localStorage.getItem(CLAVE_COMPRAS_ADMIN)) || [];
}

// Función que permite formatear los valores númericos
// a valores de moneda CLP.
function formatearPrecioAdmin(valor) {
  return valor.toLocaleString("es-CL", {
    style: "currency",
    currency: "CLP",
  });
}

// Función que permite formatear las fechas para mostrarlas
// en formato chileno.
function formatearFechaAdmin(fecha) {
  return new Date(fecha).toLocaleDateString("es-CL", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

// Función que permite obtener rutas de imágenes
// para garantizar páginas dinámicas.
function obtenerRutaImagenAdmin(rutaImagen) {
  if (rutaImagen.startsWith("../") || rutaImagen.startsWith("http")) {
    return rutaImagen;
  }

  return `../${rutaImagen}`;
}

// Función que cuenta la cantidad de usuarios
// con el rol "admin" en el sistema.
function contarAdmins() {
  return obtenerUsuarios().filter((usuario) => usuario.rol === "admin").length;
}

// Función que devuelve si el usuario loggeado tiene el id
// correspondiente a los administradores.
function esAdminInicial(usuario) {
  return usuario.id === "USR-ADMIN";
}

// Función que renderiza la información del resumen en el panel
// de administradores.
function actualizarResumenAdmin() {
  const productosActuales = obtenerProductos();
  const usuarios = obtenerUsuarios();
  const compras = obtenerComprasAdmin();

  resumenAdmin.productos.textContent = productosActuales.length;
  resumenAdmin.bajoStock.textContent = productosActuales.filter((producto) => {
    return producto.stock <= STOCK_BAJO;
  }).length;
  resumenAdmin.usuarios.textContent = usuarios.length;
  resumenAdmin.compras.textContent = compras.length;
}

// Funcion que cambia entre paneles del administrador.
function cambiarPanel(nombrePanel) {
  document.querySelectorAll(".admin-tab").forEach((tab) => {
    tab.classList.toggle("activo", tab.dataset.panel === nombrePanel);
  });

  Object.entries(panelesAdmin).forEach(([nombre, panel]) => {
    panel.classList.toggle("activo", nombre === nombrePanel);
  });
}

// Funcion que limpia el formulario y vuelve al modo crear producto.
function limpiarFormularioProducto(
  mensaje = "Completa los datos para guardar un producto.",
  tipo = "",
) {
  productoEditandoId = null;
  formProductoAdmin.reset();
  camposProducto.descuento.value = "Sin descuento";
  tituloFormularioProducto.textContent = "Nuevo producto";

  Object.values(camposProducto).forEach((campo) => limpiarEstado(campo));
  actualizarResumen(resumenProductoAdmin, mensaje, tipo);
}

// Funcion que arma el objeto con datos del formulario de producto.
function obtenerDatosProductoAdmin() {
  return {
    nombre: camposProducto.nombre.value,
    categoria: camposProducto.categoria.value,
    imagen: camposProducto.imagen.value,
    descripcion: camposProducto.descripcion.value,
    precio: camposProducto.precio.value,
    descuento: camposProducto.descuento.value,
    stock: camposProducto.stock.value,
    jugadores: camposProducto.jugadores.value,
    edad: camposProducto.edad.value,
    duracion: camposProducto.duracion.value,
  };
}

// Funcion que valida los campos antes de guardar un producto.
function validarProductoAdmin() {
  let valido = true;

  Object.entries(camposProducto).forEach(([nombreCampo, campo]) => {
    const valor = campo.value;

    if (campoVacio(valor) && nombreCampo !== "descuento") {
      mostrarError(campo, "Este campo es obligatorio.");
      valido = false;
      return;
    }

    if (nombreCampo === "precio" && Number(valor) <= 0) {
      mostrarError(campo, "El precio debe ser mayor a 0.");
      valido = false;
      return;
    }

    if (nombreCampo === "stock" && Number(valor) < 0) {
      mostrarError(campo, "El stock no puede ser negativo.");
      valido = false;
      return;
    }

    mostrarCorrecto(campo);
  });

  return valido;
}

// Funcion que carga un producto existente para editarlo.
function cargarProductoEnFormulario(idProducto) {
  const producto = buscarProductoPorId(idProducto);

  if (!producto) return;

  productoEditandoId = producto.id;
  tituloFormularioProducto.textContent = `Editando ${producto.nombre}`;

  camposProducto.nombre.value = producto.nombre;
  camposProducto.categoria.value = producto.categoria;
  camposProducto.imagen.value = producto.imagen;
  camposProducto.descripcion.value = producto.descripcion;
  camposProducto.precio.value = producto.precio;
  camposProducto.descuento.value = producto.descuento;
  camposProducto.stock.value = producto.stock;
  camposProducto.jugadores.value = producto.jugadores;
  camposProducto.edad.value = producto.edad;
  camposProducto.duracion.value = producto.duracion;

  Object.values(camposProducto).forEach((campo) => limpiarEstado(campo));
  actualizarResumen(
    resumenProductoAdmin,
    "Edita los datos y guarda los cambios.",
    "",
  );
}

// Funcion que filtra productos por busqueda, categoria y stock.
function obtenerProductosFiltradosAdmin() {
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
function renderizarProductosAdmin() {
  const productosFiltrados = obtenerProductosFiltradosAdmin();

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

// Funcion que renderiza inventario ordenado por menor stock.
function renderizarInventarioAdmin() {
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

// Funcion que limpia y bloquea el formulario de usuario.
function limpiarFormularioUsuario() {
  usuarioEditandoId = null;
  formUsuarioAdmin.reset();
  tituloFormularioUsuario.textContent = "Selecciona un usuario";

  Object.values(camposUsuario).forEach((campo) => {
    campo.disabled = true;
    limpiarEstado(campo);
  });

  actualizarResumen(
    resumenUsuarioAdmin,
    "Elige un usuario del listado para editarlo.",
    "",
  );
}

// Funcion que carga un usuario existente para editarlo.
function cargarUsuarioEnFormulario(idUsuario) {
  const usuario = buscarUsuarioPorId(idUsuario);

  if (!usuario) return;

  usuarioEditandoId = usuario.id;
  tituloFormularioUsuario.textContent = `Editando ${usuario.nombreCompleto}`;

  camposUsuario.nombreCompleto.value = usuario.nombreCompleto || "";
  camposUsuario.usuario.value = usuario.usuario || "";
  camposUsuario.correo.value = usuario.correo || "";
  camposUsuario.telefono.value = usuario.telefono || "";
  camposUsuario.rol.value = usuario.rol || "usuario";
  camposUsuario.direccion.value = usuario.direccion || "";

  Object.values(camposUsuario).forEach((campo) => {
    campo.disabled = false;
    limpiarEstado(campo);
  });

  if (esAdminInicial(usuario)) {
    camposUsuario.rol.disabled = true;
  }

  actualizarResumen(
    resumenUsuarioAdmin,
    "Edita los datos y guarda los cambios.",
    "",
  );
}

// Funcion que valida los datos editables de usuario.
function validarUsuarioAdmin() {
  let valido = true;

  if (campoVacio(camposUsuario.nombreCompleto.value)) {
    mostrarError(camposUsuario.nombreCompleto, "El nombre es obligatorio.");
    valido = false;
  } else {
    mostrarCorrecto(camposUsuario.nombreCompleto);
  }

  if (campoVacio(camposUsuario.usuario.value)) {
    mostrarError(camposUsuario.usuario, "El usuario es obligatorio.");
    valido = false;
  } else {
    mostrarCorrecto(camposUsuario.usuario);
  }

  if (
    campoVacio(camposUsuario.correo.value) ||
    !correoValido(camposUsuario.correo.value)
  ) {
    mostrarError(camposUsuario.correo, "Ingresa un correo valido.");
    valido = false;
  } else if (
    !correoDisponibleParaUsuario(camposUsuario.correo.value, usuarioEditandoId)
  ) {
    mostrarError(camposUsuario.correo, "Este correo ya esta en uso.");
    valido = false;
  } else {
    mostrarCorrecto(camposUsuario.correo);
  }

  return valido;
}

// Funcion que arma el objeto con datos del formulario de usuario.
function obtenerDatosUsuarioAdmin() {
  return {
    nombreCompleto: camposUsuario.nombreCompleto.value.trim(),
    usuario: camposUsuario.usuario.value.trim(),
    correo: camposUsuario.correo.value.trim().toLowerCase(),
    telefono: camposUsuario.telefono.value.trim(),
    direccion: camposUsuario.direccion.value.trim(),
    rol: camposUsuario.rol.value,
  };
}

// Funcion que guarda cambios de usuario protegiendo reglas de admin.
function guardarUsuarioAdmin() {
  const usuarioActual = buscarUsuarioPorId(usuarioEditandoId);
  const datosUsuario = obtenerDatosUsuarioAdmin();

  if (!usuarioActual) {
    return {
      ok: false,
      mensaje: "No se encontro el usuario.",
    };
  }

  if (esAdminInicial(usuarioActual)) {
    datosUsuario.rol = "admin";
  }

  if (
    usuarioActual.rol === "admin" &&
    datosUsuario.rol !== "admin" &&
    contarAdmins() <= 1
  ) {
    return {
      ok: false,
      mensaje: "Debe existir al menos un administrador.",
    };
  }

  const usuarios = obtenerUsuarios();
  const indiceUsuario = usuarios.findIndex(
    (usuario) => usuario.id === usuarioEditandoId,
  );

  usuarios[indiceUsuario] = {
    ...usuarios[indiceUsuario],
    ...datosUsuario,
    id: usuarios[indiceUsuario].id,
    password: usuarios[indiceUsuario].password,
    fechaNacimiento: usuarios[indiceUsuario].fechaNacimiento,
  };

  guardarUsuarios(usuarios);

  const sesion = obtenerSesionActiva();

  if (sesion && sesion.id === usuarioEditandoId) {
    localStorage.setItem(
      CLAVE_SESION,
      JSON.stringify({
        id: usuarios[indiceUsuario].id,
        nombreCompleto: usuarios[indiceUsuario].nombreCompleto,
        correo: usuarios[indiceUsuario].correo,
        rol: usuarios[indiceUsuario].rol,
      }),
    );
  }

  return {
    ok: true,
    mensaje: "Usuario actualizado correctamente.",
  };
}

// Funcion que elimina usuarios sin romper los administradores.
function eliminarUsuarioAdmin(idUsuario) {
  const usuario = buscarUsuarioPorId(idUsuario);

  if (!usuario) return;

  if (esAdminInicial(usuario)) {
    alert("El admin inicial no se puede eliminar.");
    return;
  }

  if (usuario.rol === "admin" && contarAdmins() <= 1) {
    alert("Debe existir al menos un administrador.");
    return;
  }

  const confirmar = confirm(
    `Seguro que quieres eliminar a ${usuario.nombreCompleto}?`,
  );

  if (!confirmar) return;

  guardarUsuarios(
    obtenerUsuarios().filter((usuarioActual) => usuarioActual.id !== idUsuario),
  );

  if (usuarioEditandoId === idUsuario) {
    limpiarFormularioUsuario();
  }

  renderizarTodoAdmin();
}

// Funcion que renderiza usuarios aplicando busqueda.
function renderizarUsuariosAdmin() {
  const busqueda = buscadorUsuariosAdmin.value.trim().toLowerCase();
  const usuariosFiltrados = obtenerUsuarios().filter((usuario) => {
    return (
      usuario.nombreCompleto.toLowerCase().includes(busqueda) ||
      usuario.correo.toLowerCase().includes(busqueda) ||
      usuario.usuario.toLowerCase().includes(busqueda)
    );
  });

  listaUsuariosAdmin.innerHTML = usuariosFiltrados
    .map((usuario) => {
      return `
        <article class="admin-item">
          <div>
            <span>${usuario.rol}</span>
            <h3>${usuario.nombreCompleto}</h3>
            <p>${usuario.correo}</p>
          </div>
          <div class="admin-item-acciones">
            <button class="btn-admin-secundario" data-accion="editar-usuario" data-id="${usuario.id}" type="button">
              Editar
            </button>
            <button class="btn-admin-peligro" data-accion="eliminar-usuario" data-id="${usuario.id}" type="button">
              Eliminar
            </button>
          </div>
        </article>
      `;
    })
    .join("");
}

// Funcion que filtra compras por busqueda y fecha.
function obtenerComprasFiltradasAdmin() {
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
function renderizarComprasAdmin() {
  const comprasFiltradas = obtenerComprasFiltradasAdmin();

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

// Funcion que actualiza todos los bloques visibles del admin.
function renderizarTodoAdmin() {
  actualizarResumenAdmin();
  renderizarProductosAdmin();
  renderizarInventarioAdmin();
  renderizarUsuariosAdmin();
  renderizarComprasAdmin();
}

// Se conectan los tabs principales del panel admin.
document.querySelectorAll(".admin-tab").forEach((tab) => {
  tab.addEventListener("click", () => cambiarPanel(tab.dataset.panel));
});

// Se conectan filtros de productos con el render del listado.
[buscadorProductosAdmin, filtroCategoriaAdmin, filtroStockAdmin].forEach(
  (control) => {
    control.addEventListener("input", renderizarProductosAdmin);
    control.addEventListener("change", renderizarProductosAdmin);
  },
);

// Se conectan filtros de usuarios y compras.
buscadorUsuariosAdmin.addEventListener("input", renderizarUsuariosAdmin);
buscadorComprasAdmin.addEventListener("input", renderizarComprasAdmin);
fechaComprasAdmin.addEventListener("change", renderizarComprasAdmin);

// Se conectan botones para limpiar formularios.
btnNuevoProducto.addEventListener("click", limpiarFormularioProducto);
btnCancelarProducto.addEventListener("click", limpiarFormularioProducto);
btnCancelarUsuario.addEventListener("click", limpiarFormularioUsuario);

// Evento que crea o actualiza productos desde el formulario.
formProductoAdmin.addEventListener("submit", (evento) => {
  evento.preventDefault();

  if (!validarProductoAdmin()) {
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
      obtenerDatosProductoAdmin(),
    );
    limpiarFormularioProducto(
      resultado.mensaje,
      resultado.ok ? "correcto" : "error",
    );
    renderizarTodoAdmin();
    return;
  } else {
    crearProducto(obtenerDatosProductoAdmin());
    limpiarFormularioProducto("Producto creado correctamente.", "correcto");
  }

  renderizarTodoAdmin();
});

// Evento que actualiza usuarios desde el formulario admin.
formUsuarioAdmin.addEventListener("submit", (evento) => {
  evento.preventDefault();

  if (!usuarioEditandoId) return;

  if (!validarUsuarioAdmin()) {
    actualizarResumen(
      resumenUsuarioAdmin,
      "Revisa los campos marcados.",
      "error",
    );
    return;
  }

  const resultado = guardarUsuarioAdmin();

  actualizarResumen(
    resumenUsuarioAdmin,
    resultado.mensaje,
    resultado.ok ? "correcto" : "error",
  );

  if (resultado.ok) {
    renderizarTodoAdmin();
  }
});

// Evento que controla acciones de editar y eliminar productos.
listaProductosAdmin.addEventListener("click", (evento) => {
  const boton = evento.target.closest("button[data-accion]");

  if (!boton) return;

  const { accion, id } = boton.dataset;

  if (accion === "editar-producto") {
    cargarProductoEnFormulario(id);
  }

  if (accion === "eliminar-producto") {
    const producto = buscarProductoPorId(id);
    const confirmar = confirm(
      `Seguro que quieres eliminar ${producto.nombre}?`,
    );

    if (!confirmar) return;

    eliminarProducto(id);
    limpiarFormularioProducto();
    renderizarTodoAdmin();
  }
});

// Evento que guarda ajustes directos de stock en inventario.
listaInventarioAdmin.addEventListener("click", (evento) => {
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

  renderizarTodoAdmin();
});

// Evento que controla acciones de editar y eliminar usuarios.
listaUsuariosAdmin.addEventListener("click", (evento) => {
  const boton = evento.target.closest("button[data-accion]");

  if (!boton) return;

  const { accion, id } = boton.dataset;

  if (accion === "editar-usuario") {
    cargarUsuarioEnFormulario(id);
  }

  if (accion === "eliminar-usuario") {
    eliminarUsuarioAdmin(id);
  }
});

// Se inicializa el panel solo si el usuario tiene acceso admin.
if (validarAccesoAdmin()) {
  limpiarFormularioProducto();
  limpiarFormularioUsuario();
  renderizarTodoAdmin();
}
