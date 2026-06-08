// Se rescatan los elementos principales del formulario de login.
const formularioLogin = document.getElementById("formLogin");
const resumenLogin = document.getElementById("resumenLogin");

// Se rescatan los campos que componen el login.
const camposLogin = {
  correo: document.getElementById("correoLogin"),
  password: document.getElementById("passwordLogin"),
};

// Funcion que valida el formulario completo antes de iniciar sesion.
function validarLogin() {
  let formularioValido = true;

  const correo = camposLogin.correo.value;
  const password = camposLogin.password.value;

  if (campoVacio(correo)) {
    mostrarError(camposLogin.correo, "El correo electronico es obligatorio.");
    formularioValido = false;
  } else if (!correoValido(correo)) {
    mostrarError(camposLogin.correo, "Ingresa un correo electronico valido.");
    formularioValido = false;
  } else {
    mostrarCorrecto(camposLogin.correo);
  }

  if (campoVacio(password)) {
    mostrarError(camposLogin.password, "La clave es obligatoria.");
    formularioValido = false;
  } else {
    mostrarCorrecto(camposLogin.password);
  }

  return formularioValido;
}

// Funcion que valida un campo especifico mientras el usuario escribe.
function validarCampoLogin(input) {
  const id = input.id;
  const valor = input.value;

  switch (id) {
    case "correoLogin":
      if (campoVacio(valor))
        mostrarError(input, "El correo electronico es obligatorio.");
      else if (!correoValido(valor))
        mostrarError(input, "Ingresa un correo electronico valido.");
      else mostrarCorrecto(input);
      break;
    case "passwordLogin":
      if (campoVacio(valor)) mostrarError(input, "La clave es obligatoria.");
      else mostrarCorrecto(input);
      break;
    default:
      break;
  }
}

// Evento que procesa el envio del formulario de login.
formularioLogin.addEventListener("submit", (evento) => {
  evento.preventDefault();

  if (!validarLogin()) {
    actualizarResumen(
      resumenLogin,
      "Revisa los campos marcados antes de iniciar sesion.",
      "error",
    );
    return;
  }

  const resultado = iniciarSesion(
    camposLogin.correo.value,
    camposLogin.password.value,
  );

  if (!resultado.ok) {
    mostrarError(camposLogin.correo, resultado.mensaje);
    mostrarError(camposLogin.password, resultado.mensaje);
    actualizarResumen(resumenLogin, resultado.mensaje, "error");
    return;
  }

  actualizarResumen(
    resumenLogin,
    "Sesion iniciada correctamente. Redirigiendo...",
    "correcto",
  );

  setTimeout(() => {
    window.location.href = "../index.html";
  }, 700);
});

// Se agregan validaciones en tiempo real a cada campo del login.
Object.values(camposLogin).forEach((campo) => {
  campo.addEventListener("input", () => {
    if (document.activeElement === campo) {
      validarCampoLogin(campo);
    }
  });

  campo.addEventListener("blur", () => {
    validarCampoLogin(campo);
  });
});
