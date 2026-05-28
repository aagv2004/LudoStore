document.addEventListener("DOMContentLoaded", () => {
  console.log("Si carga el archivo");
  const navbar = document.querySelector(".navbar");
  const submenu = document.querySelector(".submenu");
  const botonSubmenu = document.querySelector(".submenu-boton");

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
});
