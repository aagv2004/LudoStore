// Se rescatan los elementos principales de la pagina de perfil.
const formularioPerfil = document.getElementById("formPerfil");
const resumenPerfil = document.getElementById("resumenPerfil");
const perfilRol = document.getElementById("perfilRol");
const btnSolicitarCambioPassword = document.getElementById(
  "btnSolicitarCambioPassword",
);
const btnConfirmarCambioPassword = document.getElementById(
  "btnConfirmarCambioPassword",
);
const modalConfirmarPassword = document.getElementById("modalConfirmarPassword");
const camposPasswordPerfil = document.querySelectorAll(".perfil-password-campo");

// Se rescatan los campos editables del perfil de usuario.
const camposPerfil = {
  nombreCompleto: document.getElementById("perfilNombreCompleto"),
  usuario: document.getElementById("perfilUsuario"),
  correo: document.getElementById("perfilCorreo"),
  telefono: document.getElementById("perfilTelefono"),
  direccion: document.getElementById("perfilDireccion"),
  password: document.getElementById("perfilPassword"),
  repetirPassword: document.getElementById("perfilRepetirPassword"),
};
const botonesEditarPerfil = document.querySelectorAll(".btn-editar-campo");

// Se inicializa el usuario actual y sus valores originales.
let usuarioActual = null;

const valoresOriginalesPerfil = {};

// Funcion que redirige al login cuando no hay sesion valida.
function redirigirALogin() {
  window.location.href = "login.html";
}

// Funcion que carga los datos del usuario en el formulario.
function cargarPerfil() {
  const sesion = obtenerSesionActiva();

  if (!sesion) {
    redirigirALogin();
    return;
  }

  usuarioActual = buscarUsuarioPorId(sesion.id);

  if (!usuarioActual) {
    cerrarSesion();
    redirigirALogin();
    return;
  }

  camposPerfil.nombreCompleto.value = usuarioActual.nombreCompleto || "";
  camposPerfil.usuario.value = usuarioActual.usuario || "";
  camposPerfil.correo.value = usuarioActual.correo || "";
  camposPerfil.telefono.value = usuarioActual.telefono || "";
  camposPerfil.direccion.value = usuarioActual.direccion || "";
  perfilRol.textContent = usuarioActual.rol === "admin" ? "Admin" : "Usuario";

  guardarValoresOriginalesPerfil();
}

// Funcion que guarda una copia de los datos antes de editar.
function guardarValoresOriginalesPerfil() {
  valoresOriginalesPerfil.nombreCompleto = camposPerfil.nombreCompleto.value;
  valoresOriginalesPerfil.usuario = camposPerfil.usuario.value;
  valoresOriginalesPerfil.correo = camposPerfil.correo.value;
  valoresOriginalesPerfil.telefono = camposPerfil.telefono.value;
  valoresOriginalesPerfil.direccion = camposPerfil.direccion.value;
}

// Funcion que habilita un campo especifico del perfil.
function habilitarCampoPerfil(nombreCampo) {
  const campo = camposPerfil[nombreCampo];

  if (!campo) return;

  campo.disabled = false;
  campo.focus();
}

// Funcion que cambia el boton de editar a estado activo.
function marcarBotonComoActivo(boton) {
  if (!boton.dataset.textoOriginal) {
    boton.dataset.textoOriginal = boton.textContent.trim();
  }

  boton.textContent = "Cancelar";
  boton.classList.add("activo");
}

// Funcion que devuelve el boton de editar a estado normal.
function marcarBotonComoInactivo(boton) {
  boton.textContent = boton.dataset.textoOriginal || "Editar";
  boton.classList.remove("activo");
}

// Funcion que restaura el valor original de un campo.
function restaurarCampoPerfil(nombreCampo) {
  const campo = camposPerfil[nombreCampo];

  if (!campo) return;

  campo.value = valoresOriginalesPerfil[nombreCampo] || "";
  campo.disabled = true;
  limpiarEstado(campo);
}

// Funcion que alterna entre editar y cancelar un campo.
function alternarEdicionCampo(boton) {
  const nombreCampo = boton.dataset.campo;
  const estaActivo = boton.classList.contains("activo");

  if (estaActivo) {
    restaurarCampoPerfil(nombreCampo);
    marcarBotonComoInactivo(boton);
    return;
  }

  habilitarCampoPerfil(nombreCampo);
  marcarBotonComoActivo(boton);
}

// Funcion que deshabilita todos los campos despues de guardar.
function deshabilitarCamposPerfil() {
  Object.values(camposPerfil).forEach((campo) => {
    campo.disabled = true;
  });

  botonesEditarPerfil.forEach((boton) => {
    boton.textContent = boton.dataset.textoOriginal || "Editar";
    boton.classList.remove("activo");
  });
}

// Funcion que muestra los campos para cambiar contrasena.
function mostrarCamposPassword() {
  camposPasswordPerfil.forEach((campo) => {
    campo.classList.add("visible");
  });

  camposPerfil.password.disabled = false;
  camposPerfil.repetirPassword.disabled = false;
  camposPerfil.password.focus();
}

// Funcion que oculta y limpia los campos de contrasena.
function ocultarCamposPassword() {
  camposPasswordPerfil.forEach((campo) => {
    campo.classList.remove("visible");
  });

  camposPerfil.password.value = "";
  camposPerfil.repetirPassword.value = "";
  camposPerfil.password.disabled = true;
  camposPerfil.repetirPassword.disabled = true;
  limpiarEstado(camposPerfil.password);
  limpiarEstado(camposPerfil.repetirPassword);
}

// Funcion que valida si el cambio de contrasena esta activo.
function cambioPasswordActivo() {
  return !camposPerfil.password.disabled || !camposPerfil.repetirPassword.disabled;
}

// Funcion que abre el modal antes de mostrar campos de contrasena.
function abrirModalConfirmarPassword() {
  if (!modalConfirmarPassword || !window.bootstrap) {
    mostrarCamposPassword();
    return;
  }

  const modal = new bootstrap.Modal(modalConfirmarPassword);
  modal.show();
}

// Funcion que valida los datos del perfil antes de guardar.
function validarPerfil() {
  let formularioValido = true;

  const nombreCompleto = camposPerfil.nombreCompleto.value;
  const usuario = camposPerfil.usuario.value;
  const correo = camposPerfil.correo.value;
  const password = camposPerfil.password.value;
  const repetirPassword = camposPerfil.repetirPassword.value;

  if (campoVacio(nombreCompleto)) {
    mostrarError(camposPerfil.nombreCompleto, "El nombre completo es obligatorio.");
    formularioValido = false;
  } else if (nombreCompleto.trim().length < 3) {
    mostrarError(
      camposPerfil.nombreCompleto,
      "El nombre completo debe tener al menos 3 caracteres.",
    );
    formularioValido = false;
  } else {
    mostrarCorrecto(camposPerfil.nombreCompleto);
  }

  if (campoVacio(usuario)) {
    mostrarError(camposPerfil.usuario, "El nombre de usuario es obligatorio.");
    formularioValido = false;
  } else if (usuario.trim().length < 3) {
    mostrarError(
      camposPerfil.usuario,
      "El nombre de usuario debe tener al menos 3 caracteres.",
    );
    formularioValido = false;
  } else {
    mostrarCorrecto(camposPerfil.usuario);
  }

  if (campoVacio(correo)) {
    mostrarError(camposPerfil.correo, "El correo electronico es obligatorio.");
    formularioValido = false;
  } else if (!correoValido(correo)) {
    mostrarError(camposPerfil.correo, "Ingresa un correo electronico valido.");
    formularioValido = false;
  } else if (!correoDisponibleParaUsuario(correo, usuarioActual.id)) {
    mostrarError(camposPerfil.correo, "Este correo ya esta en uso.");
    formularioValido = false;
  } else {
    mostrarCorrecto(camposPerfil.correo);
  }

  limpiarEstado(camposPerfil.telefono);
  limpiarEstado(camposPerfil.direccion);

  if (cambioPasswordActivo()) {
    if (campoVacio(password)) {
      mostrarError(camposPerfil.password, "La nueva clave es obligatoria.");
      formularioValido = false;
    } else if (!passwordSegura(password)) {
      mostrarError(camposPerfil.password, mensajePassword(password));
      formularioValido = false;
    } else {
      mostrarCorrecto(camposPerfil.password);
    }

    if (campoVacio(repetirPassword)) {
      mostrarError(camposPerfil.repetirPassword, "Debes repetir la nueva clave.");
      formularioValido = false;
    } else if (password !== repetirPassword) {
      mostrarError(camposPerfil.repetirPassword, "Las claves no coinciden.");
      formularioValido = false;
    } else {
      mostrarCorrecto(camposPerfil.repetirPassword);
    }
  } else {
    limpiarEstado(camposPerfil.password);
    limpiarEstado(camposPerfil.repetirPassword);
  }

  return formularioValido;
}

// Funcion que arma el objeto con datos actualizados del perfil.
function obtenerDatosPerfil() {
  const datos = {
    nombreCompleto: camposPerfil.nombreCompleto.value.trim(),
    usuario: camposPerfil.usuario.value.trim(),
    correo: camposPerfil.correo.value.trim().toLowerCase(),
    telefono: camposPerfil.telefono.value.trim(),
    direccion: camposPerfil.direccion.value.trim(),
  };

  if (!campoVacio(camposPerfil.password.value)) {
    datos.password = camposPerfil.password.value;
  }

  return datos;
}

// Evento que procesa el guardado de cambios del perfil.
formularioPerfil.addEventListener("submit", (evento) => {
  evento.preventDefault();

  if (!validarPerfil()) {
    actualizarResumen(
      resumenPerfil,
      "Revisa los campos marcados antes de guardar.",
      "error",
    );
    return;
  }

  const resultado = actualizarUsuario(usuarioActual.id, obtenerDatosPerfil());

  if (!resultado.ok) {
    actualizarResumen(resumenPerfil, resultado.mensaje, "error");
    return;
  }

  usuarioActual = resultado.usuario;
  guardarValoresOriginalesPerfil();
  ocultarCamposPassword();
  deshabilitarCamposPerfil();

  actualizarResumen(resumenPerfil, "Perfil actualizado correctamente.", "correcto");
});

// Se conectan los botones para editar campos individuales.
botonesEditarPerfil.forEach((boton) => {
  boton.addEventListener("click", () => {
    alternarEdicionCampo(boton);
  });
});

// Se conecta el boton que solicita cambiar contrasena.
if (btnSolicitarCambioPassword) {
  btnSolicitarCambioPassword.addEventListener(
    "click",
    abrirModalConfirmarPassword,
  );
}

// Se conecta la confirmacion del modal de cambio de contrasena.
if (btnConfirmarCambioPassword) {
  btnConfirmarCambioPassword.addEventListener("click", mostrarCamposPassword);
}

// Se carga el perfil al abrir la pagina.
cargarPerfil();
