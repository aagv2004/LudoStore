// Evento que inicializa el navbar cuando el DOM esta listo.
document.addEventListener("DOMContentLoaded", () => {
  // Se rescatan los elementos principales del navbar.
  const navbar = document.querySelector(".navbar");
  const menu = document.querySelector(".navbar-menu");

  document.body.classList.add("pagina-cargada");

  // VARIABLES INICIALIZADORAS.
  const CLAVE_SESION_NAVBAR = "ludostore_sesion";

  // Funcion que calcula el prefijo de ruta segun la pagina actual.
  function obtenerPrefijoRuta() {
    const ruta = window.location.pathname.replaceAll("\\", "/");

    if (ruta.includes("/pages/categorias/")) return "../../";
    if (ruta.includes("/pages/")) return "../";

    return "";
  }

  // Funcion que obtiene la sesion activa para renderizar el navbar.
  function obtenerSesionNavbar() {
    return JSON.parse(localStorage.getItem(CLAVE_SESION_NAVBAR));
  }

  // Funcion que crea enlaces correctos desde cualquier carpeta.
  function crearHref(pagina) {
    const prefijo = obtenerPrefijoRuta();

    return `${prefijo}${pagina}`;
  }

  // Funcion que retorna el icono SVG del carrito.
  function crearSvgCarrito() {
    return `
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        fill="currentColor"
        class="bi bi-cart"
        viewBox="0 0 16 16">
        <path
          d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5M3.102 4l1.313 7h8.17l1.313-7zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4m7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4m-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2m7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2" />
      </svg>
    `;
  }

  // Funcion que retorna el icono SVG de usuario.
  function crearSvgUsuario() {
    return `
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        fill="currentColor"
        viewBox="0 0 16 16"
        aria-hidden="true">
        <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6" />
        <path
          d="M14 14s-1-4-6-4-6 4-6 4 1 1 6 1 6-1 6-1" />
      </svg>
    `;
  }

  // Funcion que retorna el icono SVG de cerrar sesion.
  function crearSvgLogout() {
    return `
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
        fill="currentColor"
        viewBox="0 0 16 16"
        aria-hidden="true">
        <path
          fill-rule="evenodd"
          d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0z" />
        <path
          fill-rule="evenodd"
          d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708z" />
      </svg>
    `;
  }

  // Funcion que crea el submenu dinamico de categorias.
  function crearSubmenuCategorias() {
    return `
      <div class="submenu">
        <button class="submenu-boton" type="button">Categorias</button>

        <div class="submenu-contenido">
          <a href="${crearHref("pages/categorias/familiares.html")}">Familiares</a>
          <a href="${crearHref("pages/categorias/estrategias.html")}">Estrategia</a>
          <a href="${crearHref("pages/categorias/cartas.html")}">Cartas</a>
          <a href="${crearHref("pages/categorias/cooperativos.html")}">Cooperativos</a>
        </div>
      </div>
    `;
  }

  // Funcion que crea el enlace del carrito con su contador.
  function crearLinkCarrito() {
    return `
      <div class="carrito-container">
        <a href="${crearHref("pages/carrito.html")}" class="link-carrito" aria-label="Ver carrito">
          ${crearSvgCarrito()}
          <span class="carrito-etiqueta">Carrito</span>
          <span class="contador-carrito-nav" id="contadorCarritoNav">0</span>
        </a>
      </div>
    `;
  }

  // Funcion que prepara el boton hamburguesa para menu movil.
  function prepararMenuMovil() {
    if (!navbar || !menu) return null;

    let botonMenu = document.getElementById("btnMenuMovil");

    if (!botonMenu) {
      botonMenu = document.createElement("button");
      botonMenu.className = "navbar-toggle";
      botonMenu.id = "btnMenuMovil";
      botonMenu.type = "button";
      botonMenu.setAttribute("aria-label", "Abrir menu de navegacion");
      botonMenu.setAttribute("aria-controls", "menuPrincipal");
      botonMenu.setAttribute("aria-expanded", "false");
      botonMenu.innerHTML = `
        <span></span>
        <span></span>
        <span></span>
      `;

      navbar.insertBefore(botonMenu, menu);
    }

    menu.id = "menuPrincipal";

    return botonMenu;
  }

  // Funcion que crea el menu de usuario segun exista sesion.
  function crearMenuUsuario(sesion) {
    const opcionesSinSesion = `
      <a href="${crearHref("pages/login.html")}">Iniciar sesion</a>
      <a href="${crearHref("pages/registro-usuario.html")}">Crear cuenta</a>
      <a href="${crearHref("pages/registro-membresia.html")}">Membresia</a>
    `;
    const opcionAdmin =
      sesion && sesion.rol === "admin"
        ? `<a href="${crearHref("pages/admin.html")}">Admin</a>`
        : "";
    const opcionesConSesion = `
      ${opcionAdmin}
      <a href="${crearHref("pages/perfil.html")}">Mi perfil</a>
      <a href="${crearHref("pages/mis-compras.html")}">Mis compras</a>
      <a href="${crearHref("pages/registro-membresia.html")}">Membresia</a>
      <button
        class="usuario-menu-logout"
        id="btnCerrarSesionNav"
        type="button">
        ${crearSvgLogout()}
        <span>Cerrar sesion</span>
      </button>
    `;

    return `
      <div class="usuario-menu">
        <button
          class="usuario-menu-boton"
          type="button"
          aria-label="Opciones de usuario"
          title="Opciones de usuario">
          ${crearSvgUsuario()}
        </button>

        <div class="usuario-menu-contenido">
          ${sesion ? opcionesConSesion : opcionesSinSesion}
        </div>
      </div>
    `;
  }

  // Funcion que renderiza el navbar completo segun sesion actual.
  function renderizarNavbar() {
    if (!menu) return;

    const sesion = obtenerSesionNavbar();
    const linkInicio = `<a href="${crearHref("index.html")}">Inicio</a>`;
    const linkCatalogo = `<a href="${crearHref("index.html")}#catalogo">Catalogo</a>`;

    if (!sesion) {
      menu.innerHTML = `
        ${linkInicio}
        ${crearSubmenuCategorias()}
        ${linkCatalogo}
        ${crearMenuUsuario(sesion)}
        ${crearLinkCarrito()}
      `;
      return;
    }

    menu.innerHTML = `
      ${linkInicio}
      ${crearSubmenuCategorias()}
      ${linkCatalogo}
      ${crearMenuUsuario(sesion)}
      ${crearLinkCarrito()}
    `;
  }

  renderizarNavbar();
  const botonMenuMovil = prepararMenuMovil();

  // Se rescatan elementos creados dinamicamente por el navbar.
  const submenu = document.querySelector(".submenu");
  const botonSubmenu = document.querySelector(".submenu-boton");
  const menuUsuario = document.querySelector(".usuario-menu");
  const botonMenuUsuario = document.querySelector(".usuario-menu-boton");
  const botonCerrarSesion = document.getElementById("btnCerrarSesionNav");
  const enlacesInternos = document.querySelectorAll("a[href]");

  // Funcion que cambia el estilo del navbar al hacer scroll.
  function cambiarNavbarAlScroll() {
    if (window.scrollY > 80) {
      navbar.classList.add("nav-scroll");
    } else {
      navbar.classList.remove("nav-scroll");
    }
  }

  // Funcion que abre o cierra el submenu de categorias.
  function activarDesactivarSubMenu() {
    if (!submenu) return;

    submenu.classList.toggle("activo");
  }

  // Funcion que cierra el submenu de categorias.
  function cerrarSubMenu() {
    if (!submenu) return;

    submenu.classList.remove("activo");
  }

  // Funcion que abre o cierra el menu de usuario.
  function activarDesactivarMenuUsuario() {
    if (!menuUsuario) return;

    menuUsuario.classList.toggle("activo");
  }

  // Funcion que cierra el menu de usuario.
  function cerrarMenuUsuario() {
    if (!menuUsuario) return;

    menuUsuario.classList.remove("activo");
  }

  // Funcion que detecta si el menu movil esta abierto.
  function menuMovilAbierto() {
    return navbar && navbar.classList.contains("menu-abierto");
  }

  // Funcion que cierra menu movil y submenus asociados.
  function cerrarMenuMovil() {
    if (!navbar || !botonMenuMovil) return;

    navbar.classList.remove("menu-abierto");
    botonMenuMovil.setAttribute("aria-expanded", "false");
    botonMenuMovil.setAttribute("aria-label", "Abrir menu de navegacion");
    cerrarSubMenu();
    cerrarMenuUsuario();
  }

  // Funcion que alterna el estado del menu movil.
  function alternarMenuMovil() {
    if (!navbar || !botonMenuMovil) return;

    const estaAbierto = menuMovilAbierto();

    navbar.classList.toggle("menu-abierto", !estaAbierto);
    botonMenuMovil.setAttribute("aria-expanded", String(!estaAbierto));
    botonMenuMovil.setAttribute(
      "aria-label",
      estaAbierto ? "Abrir menu de navegacion" : "Cerrar menu de navegacion",
    );

    if (estaAbierto) {
      cerrarSubMenu();
      cerrarMenuUsuario();
    }
  }

  // Funcion que cierra menus cuando se hace click fuera del navbar.
  function cerrarMenusAlHacerClickFuera(evento) {
    if (navbar && !navbar.contains(evento.target)) {
      cerrarMenuMovil();
    }

    if (submenu && !submenu.contains(evento.target)) {
      cerrarSubMenu();
    }

    if (menuUsuario && !menuUsuario.contains(evento.target)) {
      cerrarMenuUsuario();
    }
  }

  // Funcion que cierra sesion desde el navbar.
  function cerrarSesionNavbar() {
    localStorage.removeItem(CLAVE_SESION_NAVBAR);
    window.location.href = crearHref("index.html");
  }

  cambiarNavbarAlScroll();

  // Se conectan eventos principales del navbar.
  window.addEventListener("scroll", cambiarNavbarAlScroll);

  if (botonMenuMovil) {
    botonMenuMovil.addEventListener("click", (evento) => {
      evento.stopPropagation();
      alternarMenuMovil();
    });
  }

  if (botonSubmenu) {
    botonSubmenu.addEventListener("click", (evento) => {
      evento.stopPropagation();
      activarDesactivarSubMenu();
      cerrarMenuUsuario();
    });
  }

  if (botonCerrarSesion) {
    botonCerrarSesion.addEventListener("click", cerrarSesionNavbar);
  }

  if (botonMenuUsuario) {
    botonMenuUsuario.addEventListener("click", (evento) => {
      evento.stopPropagation();
      activarDesactivarMenuUsuario();
      cerrarSubMenu();
    });
  }

  document.addEventListener("click", cerrarMenusAlHacerClickFuera);

  // Se agrega transicion de salida a enlaces internos.
  enlacesInternos.forEach((enlace) => {
    enlace.addEventListener("click", (evento) => {
      const urlDestino = new URL(enlace.href, window.location.href);
      const esMismaPagina =
        urlDestino.pathname === window.location.pathname &&
        urlDestino.search === window.location.search;
      const esAnclaMismaPagina = esMismaPagina && urlDestino.hash;
      const esNuevaPestana = enlace.target === "_blank";
      const esDescarga = enlace.hasAttribute("download");

      if (
        urlDestino.origin !== window.location.origin ||
        esAnclaMismaPagina ||
        esNuevaPestana ||
        esDescarga
      ) {
        return;
      }

      evento.preventDefault();
      cerrarMenuMovil();
      document.body.classList.add("pagina-saliendo");

      setTimeout(() => {
        window.location.href = urlDestino.href;
      }, 220);
    });
  });
});

// Evento que restaura clases visuales al volver desde historial.
window.addEventListener("pageshow", () => {
  document.body.classList.remove("pagina-saliendo");
  document.body.classList.add("pagina-cargada");
});
