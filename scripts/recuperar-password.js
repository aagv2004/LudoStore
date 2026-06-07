const formularioRecuperar = document.getElementById("formRecuperarPassword");
const panelCorreo = document.getElementById("panelCorreo");
const panelCodigo = document.getElementById("panelCodigo");
const panelNuevaClave = document.getElementById("panelNuevaClave");
const estadoVerificacion = document.getElementById("estadoVerificacion");
const resumenRecuperacion = document.getElementById("resumenRecuperacion");
const resumenCodigo = document.getElementById("resumenCodigo");
const resumenNuevaClave = document.getElementById("resumenNuevaClave");
const codigoTemporal = document.getElementById("codigoTemporal");
const btnVerificarCorreo = document.getElementById("btnVerificarCorreo");
const btnVerificarCodigo = document.getElementById("btnVerificarCodigo");
const modalClaveActualizada = document.getElementById("modalClaveActualizada");

const camposRecuperacion = {
  correo: document.getElementById("correoRecuperacion"),
  codigo: document.getElementById("codigoRecuperacion"),
  password: document.getElementById("nuevaPasswordRecuperacion"),
  repetirPassword: document.getElementById("repetirPasswordRecuperacion"),
};

let usuarioRecuperacion = null;
let codigoActual = "";

function generarCodigoRecuperacion() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

function mostrarPanel(panelActivo) {
  [panelCorreo, panelCodigo, panelNuevaClave].forEach((panel) => {
    panel.classList.remove("activo");
  });

  panelActivo.classList.add("activo");
}

function actualizarPasoRecuperacion(pasoActivo) {
  document.querySelectorAll(".paso-recuperacion").forEach((paso) => {
    const numeroPaso = Number(paso.dataset.paso);

    paso.classList.toggle("activo", numeroPaso === pasoActivo);
    paso.classList.toggle("completado", numeroPaso < pasoActivo);
  });
}

function validarCorreoRecuperacion() {
  const correo = camposRecuperacion.correo.value;

  if (campoVacio(correo)) {
    mostrarError(camposRecuperacion.correo, "El correo electronico es obligatorio.");
    return false;
  }

  if (!correoValido(correo)) {
    mostrarError(camposRecuperacion.correo, "Ingresa un correo electronico valido.");
    return false;
  }

  mostrarCorrecto(camposRecuperacion.correo);
  return true;
}

function mostrarEstadoVerificacion() {
  estadoVerificacion.classList.add("activo");
  btnVerificarCorreo.disabled = true;
}

function ocultarEstadoVerificacion() {
  estadoVerificacion.classList.remove("activo");
  btnVerificarCorreo.disabled = false;
}

function continuarACodigo() {
  codigoActual = generarCodigoRecuperacion();
  codigoTemporal.textContent = codigoActual;
  camposRecuperacion.codigo.value = "";
  limpiarEstado(camposRecuperacion.codigo);
  actualizarResumen(
    resumenCodigo,
    "Confirma el codigo para proteger tu cuenta.",
    "",
  );
  actualizarPasoRecuperacion(2);
  mostrarPanel(panelCodigo);
}

function verificarCorreo() {
  if (!validarCorreoRecuperacion()) {
    actualizarResumen(
      resumenRecuperacion,
      "Revisa el correo antes de continuar.",
      "error",
    );
    return;
  }

  mostrarEstadoVerificacion();
  actualizarResumen(resumenRecuperacion, "Verificando tu cuenta...", "");

  setTimeout(() => {
    usuarioRecuperacion = buscarUsuarioPorCorreo(camposRecuperacion.correo.value);
    ocultarEstadoVerificacion();

    if (!usuarioRecuperacion) {
      mostrarError(camposRecuperacion.correo, "No encontramos una cuenta con ese correo.");
      actualizarResumen(
        resumenRecuperacion,
        "No encontramos una cuenta asociada a ese correo.",
        "error",
      );
      return;
    }

    continuarACodigo();
  }, 850);
}

function verificarCodigo() {
  const codigoIngresado = camposRecuperacion.codigo.value.trim();

  if (campoVacio(codigoIngresado)) {
    mostrarError(
      camposRecuperacion.codigo,
      "El codigo de seguridad es obligatorio.",
    );
    actualizarResumen(resumenCodigo, "Ingresa el codigo para continuar.", "error");
    return;
  }

  if (!/^\d{6}$/.test(codigoIngresado)) {
    mostrarError(camposRecuperacion.codigo, "El codigo debe tener 6 numeros.");
    actualizarResumen(resumenCodigo, "Revisa el formato del codigo.", "error");
    return;
  }

  if (codigoIngresado !== codigoActual) {
    mostrarError(camposRecuperacion.codigo, "El codigo ingresado no coincide.");
    actualizarResumen(resumenCodigo, "Revisa el codigo e intentalo nuevamente.", "error");
    return;
  }

  mostrarCorrecto(camposRecuperacion.codigo);
  actualizarPasoRecuperacion(3);
  mostrarPanel(panelNuevaClave);
  camposRecuperacion.password.focus();
}

function validarNuevaClave() {
  let formularioValido = true;
  const password = camposRecuperacion.password.value;
  const repetirPassword = camposRecuperacion.repetirPassword.value;

  if (campoVacio(password)) {
    mostrarError(camposRecuperacion.password, "La nueva clave es obligatoria.");
    formularioValido = false;
  } else if (!passwordSegura(password)) {
    mostrarError(camposRecuperacion.password, mensajePassword(password));
    formularioValido = false;
  } else {
    mostrarCorrecto(camposRecuperacion.password);
  }

  if (campoVacio(repetirPassword)) {
    mostrarError(camposRecuperacion.repetirPassword, "Debes repetir la nueva clave.");
    formularioValido = false;
  } else if (password !== repetirPassword) {
    mostrarError(camposRecuperacion.repetirPassword, "Las claves no coinciden.");
    formularioValido = false;
  } else {
    mostrarCorrecto(camposRecuperacion.repetirPassword);
  }

  return formularioValido;
}

function validarCampoRecuperacion(input) {
  const id = input.id;
  const valor = input.value;

  switch (id) {
    case "correoRecuperacion":
      if (campoVacio(valor))
        mostrarError(input, "El correo electronico es obligatorio.");
      else if (!correoValido(valor))
        mostrarError(input, "Ingresa un correo electronico valido.");
      else mostrarCorrecto(input);
      break;
    case "codigoRecuperacion":
      if (campoVacio(valor))
        mostrarError(input, "El codigo de seguridad es obligatorio.");
      else if (!/^\d{6}$/.test(valor.trim()))
        mostrarError(input, "El codigo debe tener 6 numeros.");
      else mostrarCorrecto(input);
      break;
    case "nuevaPasswordRecuperacion":
      if (campoVacio(valor))
        mostrarError(input, "La nueva clave es obligatoria.");
      else if (!passwordSegura(valor))
        mostrarError(input, mensajePassword(valor));
      else mostrarCorrecto(input);
      break;
    case "repetirPasswordRecuperacion":
      if (campoVacio(valor))
        mostrarError(input, "Debes repetir la nueva clave.");
      else if (valor !== camposRecuperacion.password.value)
        mostrarError(input, "Las claves no coinciden.");
      else mostrarCorrecto(input);
      break;
    default:
      break;
  }
}

function mostrarModalClaveActualizada() {
  if (!modalClaveActualizada || !window.bootstrap) return;

  const modal = new bootstrap.Modal(modalClaveActualizada);
  modal.show();
}

btnVerificarCorreo.addEventListener("click", verificarCorreo);
btnVerificarCodigo.addEventListener("click", verificarCodigo);

Object.values(camposRecuperacion).forEach((campo) => {
  campo.addEventListener("input", () => {
    if (document.activeElement === campo) {
      validarCampoRecuperacion(campo);
    }
  });

  campo.addEventListener("blur", () => {
    validarCampoRecuperacion(campo);
  });
});

formularioRecuperar.addEventListener("submit", (evento) => {
  evento.preventDefault();

  if (!validarNuevaClave()) {
    actualizarResumen(
      resumenNuevaClave,
      "Revisa los campos marcados antes de actualizar la clave.",
      "error",
    );
    return;
  }

  const resultado = actualizarUsuario(usuarioRecuperacion.id, {
    password: camposRecuperacion.password.value,
  });

  if (!resultado.ok) {
    actualizarResumen(resumenNuevaClave, resultado.mensaje, "error");
    return;
  }

  actualizarResumen(resumenNuevaClave, "Clave actualizada correctamente.", "correcto");
  mostrarModalClaveActualizada();
});
