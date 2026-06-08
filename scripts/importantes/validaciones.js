// Funcion que muestra un mensaje de error en un grupo de formulario.
function mostrarError(input, mensaje) {
  const grupo = input.closest(".grupo-formulario");
  const mensajeError = grupo.querySelector(".mensaje-error");

  grupo.classList.remove("correcto");
  grupo.classList.add("error");
  mensajeError.textContent = mensaje;
}

// Funcion que marca un campo como correcto y limpia su error.
function mostrarCorrecto(input) {
  const grupo = input.closest(".grupo-formulario");
  const mensajeError = grupo.querySelector(".mensaje-error");

  grupo.classList.remove("error");
  grupo.classList.add("correcto");
  mensajeError.textContent = "";
}

// Funcion que limpia los estados visuales de validacion de un campo.
function limpiarEstado(input) {
  const grupo = input.closest(".grupo-formulario");
  const mensajeError = grupo.querySelector(".mensaje-error");

  grupo.classList.remove("error", "correcto");
  mensajeError.textContent = "";
}

// Funcion que actualiza mensajes generales de formularios.
function actualizarResumen(elementoResumen, mensaje, tipo) {
  elementoResumen.textContent = mensaje;
  elementoResumen.classList.remove("correcto", "error");

  if (tipo) {
    elementoResumen.classList.add(tipo);
  }
}

// Funcion que valida si un texto esta vacio o solo tiene espacios.
function campoVacio(valor) {
  return valor.trim() === "";
}

// Funcion que valida el formato basico de un correo electronico.
function correoValido(correo) {
  const expresionCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return expresionCorreo.test(correo);
}

// Funcion que calcula la edad desde una fecha de nacimiento.
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

// Funcion que obtiene las reglas faltantes de una contrasena.
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

// Funcion que valida si una contrasena cumple todas las reglas.
function passwordSegura(password) {
  return obtenerErroresPassword(password).length === 0;
}

// Funcion que valida si una contrasena cumple el minimo de largo.
function passwordMinima(password) {
  return password.length >= 6;
}

// Funcion que arma el mensaje de ayuda para una contrasena invalida.
function mensajePassword(password) {
  const errores = obtenerErroresPassword(password);

  if (errores.length === 0) {
    return "";
  }

  if (errores.length === 1) {
    return `Debe incluir ${errores[0]}.`;
  }

  return `Debe incluir ${errores.slice(0, -1).join(", ")} y ${
    errores[errores.length - 1]
  }.`;
}
