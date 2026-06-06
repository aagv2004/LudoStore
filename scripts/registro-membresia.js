const formulario = document.getElementById("formRegistro");
const resumenValidacion = document.getElementById("resumenValidacion");

const campos = {
  nombreCompleto: document.getElementById("nombreCompleto"),
  usuario: document.getElementById("usuario"),
  correo: document.getElementById("correo"),
  password: document.getElementById("password"),
  repetirPassword: document.getElementById("repetirPassword"),
  fechaNacimiento: document.getElementById("fechaNacimiento"),
  direccion: document.getElementById("direccion"),
};

function mostrarError(input, mensaje) {
  const grupo = input.closest(".grupo-formulario");
  const mensajeError = grupo.querySelector(".mensaje-error");

  grupo.classList.remove("correcto");
  grupo.classList.add("error");
  mensajeError.textContent = mensaje;
}

function mostrarCorrecto(input) {
  const grupo = input.closest(".grupo-formulario");
  const mensajeError = grupo.querySelector(".mensaje-error");

  grupo.classList.remove("error");
  grupo.classList.add("correcto");
  mensajeError.textContent = "";
}

function limpiarEstado(input) {
  const grupo = input.closest(".grupo-formulario");
  const mensajeError = grupo.querySelector(".mensaje-error");

  grupo.classList.remove("error", "correcto");
  mensajeError.textContent = "";
}

function campoVacio(valor) {
  return valor.trim() === "";
}

function correoValido(correo) {
  const expresionCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return expresionCorreo.test(correo);
}

function passwordValida(password) {
  return obtenerErroresPassword(password).length === 0;
}

function obtenerErroresPassword(password) {
  const errores = [];

  if (password.length < 6) {
    errores.push("minimo 6 caracteres");
  } else if (password.length > 18) {
    errores.push("maximo 18 caracteres");
  }

  if (!/[A-Z]/.test(password)) {
    errores.push("una mayuscula");
  }

  if (!/[0-9]/.test(password)) {
    errores.push("un numero");
  }

  if (!/[!@#$%^&*(),.?":{}|<>_\-+=/\\[\]`;~]/.test(password)) {
    errores.push("un caracter especial");
  }

  return errores;
}

function mensajePassword(password) {
  const errores = obtenerErroresPassword(password);

  if (errores.length === 1) {
    return `Debe incluir ${errores[0]}.`;
  }

  return `Debe incluir ${errores.slice(0, -1).join(", ")} y ${
    errores[errores.length - 1]
  }.`;
}

function calcularEdad(fechaNacimiento) {
  const nacimiento = new Date(fechaNacimiento);
  const hoy = new Date();

  let edad = hoy.getFullYear() - nacimiento.getFullYear();
  const mes = hoy.getMonth() - nacimiento.getMonth();
  const dia = hoy.getDate() - nacimiento.getDate();

  if (mes < 0 || (mes === 0 && dia < 0)) {
    edad--;
  }

  return edad;
}

function actualizarResumen(mensaje, tipo) {
  resumenValidacion.textContent = mensaje;
  resumenValidacion.classList.remove("correcto", "error");

  if (tipo) {
    resumenValidacion.classList.add(tipo);
  }
}

function validarFormulario() {
  let formularioValido = true;

  const nombre = campos.nombreCompleto.value;
  const usuario = campos.usuario.value;
  const correo = campos.correo.value;
  const password = campos.password.value;
  const repetirPassword = campos.repetirPassword.value;
  const fechaNacimiento = campos.fechaNacimiento.value;

  if (campoVacio(nombre)) {
    mostrarError(campos.nombreCompleto, "El nombre completo es obligatorio.");
    formularioValido = false;
  } else {
    mostrarCorrecto(campos.nombreCompleto);
  }

  if (campoVacio(usuario)) {
    mostrarError(campos.usuario, "El nombre de usuario es obligatorio.");
    formularioValido = false;
  } else {
    mostrarCorrecto(campos.usuario);
  }

  if (campoVacio(correo)) {
    mostrarError(campos.correo, "El correo electrónico es obligatorio.");
    formularioValido = false;
  } else if (!correoValido(correo)) {
    mostrarError(campos.correo, "Ingresa un correo electrónico válido.");
    formularioValido = false;
  } else {
    mostrarCorrecto(campos.correo);
  }

  if (campoVacio(password)) {
    mostrarError(campos.password, "La clave es obligatoria.");
    formularioValido = false;
  } else if (!passwordValida(password)) {
    mostrarError(campos.password, mensajePassword(password));
    formularioValido = false;
  } else {
    mostrarCorrecto(campos.password);
  }

  if (campoVacio(repetirPassword)) {
    mostrarError(campos.repetirPassword, "Debes repetir la clave.");
    formularioValido = false;
  } else if (password !== repetirPassword) {
    mostrarError(campos.repetirPassword, "Las claves no coinciden.");
    formularioValido = false;
  } else {
    mostrarCorrecto(campos.repetirPassword);
  }

  if (campoVacio(fechaNacimiento)) {
    mostrarError(
      campos.fechaNacimiento,
      "La fecha de nacimiento es obligatoria.",
    );
    formularioValido = false;
  } else if (calcularEdad(fechaNacimiento) < 13) {
    mostrarError(
      campos.fechaNacimiento,
      "Debes tener al menos 13 años para registrarte.",
    );
    formularioValido = false;
  } else {
    mostrarCorrecto(campos.fechaNacimiento);
  }

  limpiarEstado(campos.direccion);

  return formularioValido;
}

function validarCampo(input) {
  const id = input.id;
  const valor = input.value;

  switch (id) {
    case "nombreCompleto":
      if (campoVacio(valor))
        mostrarError(input, "El nombre completo es obligatorio.");
      else if (valor.length < 3)
        mostrarError(
          input,
          "El nombre completo debe tener al menos 3 caracteres.",
        );
      else mostrarCorrecto(input);
      break;
    case "usuario":
      if (campoVacio(valor))
        mostrarError(input, "El nombre de usuario es obligatorio.");
      else if (valor.length < 3)
        mostrarError(
          input,
          "El nombre de usuario debe tener al menos 3 caracteres.",
        );
      else mostrarCorrecto(input);
      break;
    case "correo":
      if (campoVacio(valor))
        mostrarError(input, "El correo electrónico es obligatorio.");
      else if (!correoValido(valor))
        mostrarError(input, "Ingresa un correo electrónico válido.");
      else mostrarCorrecto(input);
      break;
    case "password":
      if (campoVacio(valor)) mostrarError(input, "La clave es obligatoria.");
      else if (!passwordValida(valor))
        mostrarError(input, mensajePassword(valor));
      else mostrarCorrecto(input);
      break;
    case "repetirPassword":
      if (campoVacio(valor)) mostrarError(input, "Debes repetir la clave.");
      else if (valor !== campos.password.value)
        mostrarError(input, "Las claves no coinciden.");
      else mostrarCorrecto(input);
      break;
    case "fechaNacimiento":
      if (campoVacio(valor))
        mostrarError(input, "La fecha de nacimiento es obligatoria.");
      else if (calcularEdad(valor) < 13)
        mostrarError(input, "Debes tener al menos 13 años para registrarte.");
      else mostrarCorrecto(input);
      break;
    case "direccion":
      limpiarEstado(input);
      break;
    default:
      break;
  }
}

formulario.addEventListener("submit", function (evento) {
  evento.preventDefault();

  const esValido = validarFormulario();

  if (esValido) {
    actualizarResumen(
      "Registro enviado correctamente. El comprador ya puede ser considerado para futuras recompensas.",
      "correcto",
    );

    formulario.classList.add("formulario-enviado");

    setTimeout(() => {
      formulario.classList.remove("formulario-enviado");
    }, 700);
  } else {
    actualizarResumen(
      "Revisa los campos marcados antes de enviar el formulario.",
      "error",
    );
  }
});

formulario.addEventListener("reset", function () {
  setTimeout(() => {
    Object.values(campos).forEach((campo) => limpiarEstado(campo));
    actualizarResumen("Completa el formulario para activar el registro.", "");
  }, 0);
});

Object.values(campos).forEach((campo) => {
  campo.addEventListener("input", function (e) {
    if (document.activeElement === campo) {
      validarCampo(campo);
    }
  });

  campo.addEventListener("blur", function () {
    validarCampo(campo);
  });
});
