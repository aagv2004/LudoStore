const CLAVE_USUARIOS = "ludostore_usuarios";
const CLAVE_SESION = "ludostore_sesion";

const ADMIN_INICIAL = {
  id: "USR-ADMIN",
  nombreCompleto: "Administrador LudoStore",
  usuario: "admin",
  correo: "admin@ludostore.cl",
  password: "Admin123!",
  fechaNacimiento: "1990-01-01",
  direccion: "",
  rol: "admin",
};

function obtenerUsuarios() {
  return JSON.parse(localStorage.getItem(CLAVE_USUARIOS)) || [];
}

function guardarUsuarios(usuarios) {
  localStorage.setItem(CLAVE_USUARIOS, JSON.stringify(usuarios));
}

function crearIdUsuario() {
  return `USR-${Date.now()}`;
}

function inicializarUsuariosBase() {
  const usuarios = obtenerUsuarios();
  const existeAdmin = usuarios.some((usuario) => usuario.rol === "admin");

  if (existeAdmin) return;

  usuarios.push(ADMIN_INICIAL);
  guardarUsuarios(usuarios);
}

function buscarUsuarioPorCorreo(correo) {
  const correoNormalizado = correo.trim().toLowerCase();

  return obtenerUsuarios().find((usuario) => {
    return usuario.correo.toLowerCase() === correoNormalizado;
  });
}

function buscarUsuarioPorId(idUsuario) {
  return obtenerUsuarios().find((usuario) => {
    return usuario.id === idUsuario;
  });
}

function correoDisponibleParaUsuario(correo, idUsuario) {
  const usuario = buscarUsuarioPorCorreo(correo);

  return !usuario || usuario.id === idUsuario;
}

function registrarUsuario(datosUsuario) {
  const usuarios = obtenerUsuarios();
  const correoRegistrado = buscarUsuarioPorCorreo(datosUsuario.correo);

  if (correoRegistrado) {
    return {
      ok: false,
      mensaje: "El correo ya esta registrado.",
    };
  }

  const nuevoUsuario = {
    id: crearIdUsuario(),
    nombreCompleto: datosUsuario.nombreCompleto.trim(),
    usuario: datosUsuario.usuario.trim(),
    correo: datosUsuario.correo.trim().toLowerCase(),
    password: datosUsuario.password,
    fechaNacimiento: datosUsuario.fechaNacimiento,
    direccion: datosUsuario.direccion.trim(),
    rol: "usuario",
  };

  usuarios.push(nuevoUsuario);
  guardarUsuarios(usuarios);

  return {
    ok: true,
    mensaje: "Usuario registrado correctamente.",
    usuario: nuevoUsuario,
  };
}

function iniciarSesion(correo, password) {
  const usuario = buscarUsuarioPorCorreo(correo);

  if (!usuario || usuario.password !== password) {
    return {
      ok: false,
      mensaje: "Correo o clave incorrectos.",
    };
  }

  const sesion = {
    id: usuario.id,
    nombreCompleto: usuario.nombreCompleto,
    correo: usuario.correo,
    rol: usuario.rol,
  };

  localStorage.setItem(CLAVE_SESION, JSON.stringify(sesion));

  return {
    ok: true,
    mensaje: "Sesion iniciada correctamente.",
    usuario: sesion,
  };
}

function obtenerSesionActiva() {
  return JSON.parse(localStorage.getItem(CLAVE_SESION));
}

function cerrarSesion() {
  localStorage.removeItem(CLAVE_SESION);
}

function usuarioTieneRol(rol) {
  const sesion = obtenerSesionActiva();

  return sesion && sesion.rol === rol;
}

function actualizarUsuario(idUsuario, nuevosDatos) {
  const usuarios = obtenerUsuarios();
  const indiceUsuario = usuarios.findIndex((usuario) => {
    return usuario.id === idUsuario;
  });

  if (indiceUsuario === -1) {
    return {
      ok: false,
      mensaje: "No se encontro el usuario.",
    };
  }

  usuarios[indiceUsuario] = {
    ...usuarios[indiceUsuario],
    ...nuevosDatos,
    id: usuarios[indiceUsuario].id,
    rol: usuarios[indiceUsuario].rol,
  };

  guardarUsuarios(usuarios);

  const sesion = obtenerSesionActiva();

  if (sesion && sesion.id === idUsuario) {
    const sesionActualizada = {
      id: usuarios[indiceUsuario].id,
      nombreCompleto: usuarios[indiceUsuario].nombreCompleto,
      correo: usuarios[indiceUsuario].correo,
      rol: usuarios[indiceUsuario].rol,
    };

    localStorage.setItem(CLAVE_SESION, JSON.stringify(sesionActualizada));
  }

  return {
    ok: true,
    mensaje: "Usuario actualizado correctamente.",
    usuario: usuarios[indiceUsuario],
  };
}

inicializarUsuariosBase();
