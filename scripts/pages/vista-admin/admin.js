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

// Funcion que evalua si quien entra a admin.html tiene rol admin.
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

// Funcion que obtiene las compras guardadas para el panel admin.
function obtenerComprasAdmin() {
  return JSON.parse(localStorage.getItem(CLAVE_COMPRAS_ADMIN)) || [];
}

// Funcion que formatea valores numericos a moneda CLP.
function formatearPrecioAdmin(valor) {
  return valor.toLocaleString("es-CL", {
    style: "currency",
    currency: "CLP",
  });
}

// Funcion que formatea fechas para mostrarlas en formato chileno.
function formatearFechaAdmin(fecha) {
  return new Date(fecha).toLocaleDateString("es-CL", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

// Funcion que adapta rutas de imagen para paginas internas.
function obtenerRutaImagenAdmin(rutaImagen) {
  if (rutaImagen.startsWith("../") || rutaImagen.startsWith("http")) {
    return rutaImagen;
  }

  return `../${rutaImagen}`;
}

// Funcion que renderiza la informacion del resumen principal.
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

// Funcion que actualiza todos los modulos visibles del admin.
function renderizarTodoAdmin() {
  actualizarResumenAdmin();
  ProductosAdmin.renderizar();
  InventarioAdmin.renderizar();
  UsuariosAdmin.renderizar();
  ComprasAdmin.renderizar();
}

// Objeto publico usado por los modulos segmentados.
const Admin = {
  renderizarTodo: renderizarTodoAdmin,
};

// Funcion que conecta los tabs principales del panel admin.
function inicializarTabsAdmin() {
  document.querySelectorAll(".admin-tab").forEach((tab) => {
    tab.addEventListener("click", () => cambiarPanel(tab.dataset.panel));
  });
}

// Funcion que inicializa los modulos del panel admin.
function inicializarAdmin() {
  if (!validarAccesoAdmin()) return;

  inicializarTabsAdmin();
  ProductosAdmin.inicializar();
  InventarioAdmin.inicializar();
  UsuariosAdmin.inicializar();
  ComprasAdmin.inicializar();
  renderizarTodoAdmin();
}

// Se inicializa el panel administrativo al cargar el archivo.
inicializarAdmin();
