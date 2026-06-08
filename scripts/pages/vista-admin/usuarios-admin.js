// MODULO ADMINISTRADOR DE USUARIOS.
const UsuariosAdmin = (() => {
  // Se rescatan los elementos que componen los campos de un usuario.
  const camposUsuario = {
    nombreCompleto: document.getElementById("adminUsuarioNombre"),
    usuario: document.getElementById("adminUsuarioAlias"),
    correo: document.getElementById("adminUsuarioCorreo"),
    telefono: document.getElementById("adminUsuarioTelefono"),
    rol: document.getElementById("adminUsuarioRol"),
    direccion: document.getElementById("adminUsuarioDireccion"),
  };

  // Se rescatan los elementos principales del mantenedor de usuarios.
  const formUsuarioAdmin = document.getElementById("formUsuarioAdmin");
  const tituloFormularioUsuario = document.getElementById(
    "tituloFormularioUsuario",
  );
  const resumenUsuarioAdmin = document.getElementById("resumenUsuarioAdmin");
  const listaUsuariosAdmin = document.getElementById("listaUsuariosAdmin");
  const buscadorUsuariosAdmin = document.getElementById("buscadorUsuariosAdmin");
  const btnCancelarUsuario = document.getElementById("btnCancelarUsuario");

  // Se inicializa en null el usuario que se esta editando.
  let usuarioEditandoId = null;

  // Funcion que cuenta la cantidad de usuarios con rol admin.
  function contarAdmins() {
    return obtenerUsuarios().filter((usuario) => usuario.rol === "admin").length;
  }

  // Funcion que identifica al administrador base del sistema.
  function esAdminInicial(usuario) {
    return usuario.id === "USR-ADMIN";
  }

  // Funcion que limpia y bloquea el formulario de usuario.
  function limpiarFormulario() {
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
  function cargarEnFormulario(idUsuario) {
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
  function validarFormulario() {
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
  function obtenerDatosFormulario() {
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
  function guardarUsuario() {
    const usuarioActual = buscarUsuarioPorId(usuarioEditandoId);
    const datosUsuario = obtenerDatosFormulario();

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
      limpiarFormulario();
    }

    Admin.renderizarTodo();
  }

  // Funcion que renderiza usuarios aplicando busqueda.
  function renderizar() {
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

  // Evento que actualiza usuarios desde el formulario admin.
  function procesarFormulario(evento) {
    evento.preventDefault();

    if (!usuarioEditandoId) return;

    if (!validarFormulario()) {
      actualizarResumen(
        resumenUsuarioAdmin,
        "Revisa los campos marcados.",
        "error",
      );
      return;
    }

    const resultado = guardarUsuario();

    actualizarResumen(
      resumenUsuarioAdmin,
      resultado.mensaje,
      resultado.ok ? "correcto" : "error",
    );

    if (resultado.ok) {
      Admin.renderizarTodo();
    }
  }

  // Evento que controla acciones de editar y eliminar usuarios.
  function procesarAccionListado(evento) {
    const boton = evento.target.closest("button[data-accion]");

    if (!boton) return;

    const { accion, id } = boton.dataset;

    if (accion === "editar-usuario") {
      cargarEnFormulario(id);
    }

    if (accion === "eliminar-usuario") {
      eliminarUsuarioAdmin(id);
    }
  }

  // Funcion que conecta eventos del modulo de usuarios.
  function inicializar() {
    limpiarFormulario();
    buscadorUsuariosAdmin.addEventListener("input", renderizar);
    btnCancelarUsuario.addEventListener("click", limpiarFormulario);
    formUsuarioAdmin.addEventListener("submit", procesarFormulario);
    listaUsuariosAdmin.addEventListener("click", procesarAccionListado);
  }

  return {
    inicializar,
    renderizar,
  };
})();
