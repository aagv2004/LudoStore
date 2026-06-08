const formularioRegistroUsuario = document.getElementById(
  "formRegistroUsuario",
);
const resumenRegistroUsuario = document.getElementById(
  "resumenRegistroUsuario",
);
const modalCuentaCreada = document.getElementById("modalCuentaCreada");

const camposRegistroUsuario = {
  nombreCompleto: document.getElementById("nombreCompletoUsuario"),
  usuario: document.getElementById("nombreUsuario"),
  correo: document.getElementById("correoUsuario"),
  password: document.getElementById("passwordUsuario"),
  repetirPassword: document.getElementById("repetirPasswordUsuario"),
  fechaNacimiento: document.getElementById("fechaNacimientoUsuario"),
  direccion: document.getElementById("direccionUsuario"),
};

function validarRegistroUsuario() {
  let formularioValido = true;

  const nombreCompleto = camposRegistroUsuario.nombreCompleto.value;
  const usuario = camposRegistroUsuario.usuario.value;
  const correo = camposRegistroUsuario.correo.value;
  const password = camposRegistroUsuario.password.value;
  const repetirPassword = camposRegistroUsuario.repetirPassword.value;
  const fechaNacimiento = camposRegistroUsuario.fechaNacimiento.value;

  if (campoVacio(nombreCompleto)) {
    mostrarError(
      camposRegistroUsuario.nombreCompleto,
      "El nombre completo es obligatorio.",
    );
    formularioValido = false;
  } else if (nombreCompleto.trim().length < 3) {
    mostrarError(
      camposRegistroUsuario.nombreCompleto,
      "El nombre debe tener al menos 3 caracteres.",
    );
    formularioValido = false;
  } else {
    mostrarCorrecto(camposRegistroUsuario.nombreCompleto);
  }

  if (campoVacio(usuario)) {
    mostrarError(
      camposRegistroUsuario.usuario,
      "El nombre de usuario es obligatorio.",
    );
    formularioValido = false;
  } else if (usuario.trim().length < 3) {
    mostrarError(
      camposRegistroUsuario.usuario,
      "El usuario debe tener al menos 3 caracteres.",
    );
    formularioValido = false;
  } else {
    mostrarCorrecto(camposRegistroUsuario.usuario);
  }

  if (campoVacio(correo)) {
    mostrarError(
      camposRegistroUsuario.correo,
      "El correo electronico es obligatorio.",
    );
    formularioValido = false;
  } else if (!correoValido(correo)) {
    mostrarError(
      camposRegistroUsuario.correo,
      "Ingresa un correo electronico valido.",
    );
    formularioValido = false;
  } else {
    mostrarCorrecto(camposRegistroUsuario.correo);
  }

  if (campoVacio(password)) {
    mostrarError(
      camposRegistroUsuario.password,
      "La clave es obligatoria.",
    );
    formularioValido = false;
  } else if (!passwordSegura(password)) {
    mostrarError(
      camposRegistroUsuario.password,
      mensajePassword(password),
    );
    formularioValido = false;
  } else {
    mostrarCorrecto(camposRegistroUsuario.password);
  }

  if (campoVacio(repetirPassword)) {
    mostrarError(
      camposRegistroUsuario.repetirPassword,
      "Debes repetir la clave.",
    );
    formularioValido = false;
  } else if (password !== repetirPassword) {
    mostrarError(
      camposRegistroUsuario.repetirPassword,
      "Las claves no coinciden.",
    );
    formularioValido = false;
  } else {
    mostrarCorrecto(camposRegistroUsuario.repetirPassword);
  }

  if (campoVacio(fechaNacimiento)) {
    mostrarError(
      camposRegistroUsuario.fechaNacimiento,
      "La fecha de nacimiento es obligatoria.",
    );
    formularioValido = false;
  } else if (calcularEdad(fechaNacimiento) < 13) {
    mostrarError(
      camposRegistroUsuario.fechaNacimiento,
      "Debes tener al menos 13 anos para crear una cuenta.",
    );
    formularioValido = false;
  } else {
    mostrarCorrecto(camposRegistroUsuario.fechaNacimiento);
  }

  limpiarEstado(camposRegistroUsuario.direccion);

  return formularioValido;
}

function obtenerDatosRegistroUsuario() {
  return {
    nombreCompleto: camposRegistroUsuario.nombreCompleto.value,
    usuario: camposRegistroUsuario.usuario.value,
    correo: camposRegistroUsuario.correo.value,
    password: camposRegistroUsuario.password.value,
    fechaNacimiento: camposRegistroUsuario.fechaNacimiento.value,
    direccion: camposRegistroUsuario.direccion.value,
  };
}

function mostrarModalCuentaCreada() {
  if (!modalCuentaCreada || !window.bootstrap) return;

  const modal = new bootstrap.Modal(modalCuentaCreada);
  modal.show();
}

function validarCampoRegistroUsuario(input) {
  const id = input.id;
  const valor = input.value;

  switch (id) {
    case "nombreCompletoUsuario":
      if (campoVacio(valor))
        mostrarError(input, "El nombre completo es obligatorio.");
      else if (valor.length < 3)
        mostrarError(
          input,
          "El nombre completo debe tener al menos 3 caracteres.",
        );
      else mostrarCorrecto(input);
      break;
    case "nombreUsuario":
      if (campoVacio(valor))
        mostrarError(input, "El nombre de usuario es obligatorio.");
      else if (valor.length < 3)
        mostrarError(
          input,
          "El nombre de usuario debe tener al menos 3 caracteres.",
        );
      else mostrarCorrecto(input);
      break;
    case "correoUsuario":
      if (campoVacio(valor))
        mostrarError(input, "El correo electronico es obligatorio.");
      else if (!correoValido(valor))
        mostrarError(input, "Ingresa un correo electronico valido.");
      else mostrarCorrecto(input);
      break;
    case "passwordUsuario":
      if (campoVacio(valor)) mostrarError(input, "La clave es obligatoria.");
      else if (!passwordSegura(valor))
        mostrarError(input, mensajePassword(valor));
      else mostrarCorrecto(input);
      break;
    case "repetirPasswordUsuario":
      if (campoVacio(valor)) mostrarError(input, "Debes repetir la clave.");
      else if (valor !== camposRegistroUsuario.password.value)
        mostrarError(input, "Las claves no coinciden.");
      else mostrarCorrecto(input);
      break;
    case "fechaNacimientoUsuario":
      if (campoVacio(valor))
        mostrarError(input, "La fecha de nacimiento es obligatoria.");
      else if (calcularEdad(valor) < 13)
        mostrarError(
          input,
          "Debes tener al menos 13 anos para crear una cuenta.",
        );
      else mostrarCorrecto(input);
      break;
    case "direccionUsuario":
      limpiarEstado(input);
      break;
    default:
      break;
  }
}

formularioRegistroUsuario.addEventListener("submit", (evento) => {
  evento.preventDefault();

  const esValido = validarRegistroUsuario();

  if (!esValido) {
    actualizarResumen(
      resumenRegistroUsuario,
      "Revisa los campos marcados antes de crear la cuenta.",
      "error",
    );
    return;
  }

  const resultado = registrarUsuario(obtenerDatosRegistroUsuario());

  if (!resultado.ok) {
    mostrarError(camposRegistroUsuario.correo, resultado.mensaje);
    actualizarResumen(resumenRegistroUsuario, resultado.mensaje, "error");
    return;
  }

  formularioRegistroUsuario.reset();
  Object.values(camposRegistroUsuario).forEach((campo) => {
    limpiarEstado(campo);
  });

  actualizarResumen(
    resumenRegistroUsuario,
    "Cuenta creada correctamente. Ya puedes iniciar sesion.",
    "correcto",
  );

  mostrarModalCuentaCreada();
});

formularioRegistroUsuario.addEventListener("reset", () => {
  setTimeout(() => {
    Object.values(camposRegistroUsuario).forEach((campo) => {
      limpiarEstado(campo);
    });

    actualizarResumen(
      resumenRegistroUsuario,
      "Completa el formulario para crear tu cuenta.",
      "",
    );
  }, 0);
});

Object.values(camposRegistroUsuario).forEach((campo) => {
  campo.addEventListener("input", () => {
    if (document.activeElement === campo) {
      validarCampoRegistroUsuario(campo);
    }
  });

  campo.addEventListener("blur", () => {
    validarCampoRegistroUsuario(campo);
  });
});
