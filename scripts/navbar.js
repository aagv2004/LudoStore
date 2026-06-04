document.addEventListener("DOMContentLoaded", () => {
  const navbar = document.querySelector(".navbar");
  const submenu = document.querySelector(".submenu");
  const botonSubmenu = document.querySelector(".submenu-boton");
  const enlacesInternos = document.querySelectorAll("a[href]");

  document.body.classList.add("pagina-cargada");

  function cambiarNavbarAlScroll() {
    if (window.scrollY > 80) {
      navbar.classList.add("nav-scroll");
    } else {
      navbar.classList.remove("nav-scroll");
    }
  }

  function activarDesactivarSubMenu() {
    if (!submenu) return;

    submenu.classList.toggle("activo");
  }

  function cerrarSubMenu() {
    if (!submenu) return;

    submenu.classList.remove("activo");
  }

  function cerrarSubMenuAlHacerClickFuera(evento) {
    if (!submenu) return;

    if (!submenu.contains(evento.target)) {
      cerrarSubMenu();
    }
  }

  cambiarNavbarAlScroll();

  window.addEventListener("scroll", cambiarNavbarAlScroll);

  if (botonSubmenu) {
    botonSubmenu.addEventListener("click", (evento) => {
      evento.stopPropagation();
      activarDesactivarSubMenu();
    });
  }

  document.addEventListener("click", cerrarSubMenuAlHacerClickFuera);

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
      document.body.classList.add("pagina-saliendo");

      setTimeout(() => {
        window.location.href = urlDestino.href;
      }, 220);
    });
  });
});

window.addEventListener("pageshow", () => {
  document.body.classList.remove("pagina-saliendo");
  document.body.classList.add("pagina-cargada");
});
