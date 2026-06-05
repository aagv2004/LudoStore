const contadorCarritoNav = document.getElementById("contadorCarritoNav");

function actualizarContadorCarritoNav() {
  if (!contadorCarritoNav) return;

  const carrito = JSON.parse(localStorage.getItem("ludostore_carrito")) || [];

  const cantidadTotal = carrito.reduce((total, item) => {
    return total + item.cantidad;
  }, 0);

  contadorCarritoNav.textContent = cantidadTotal;
}

actualizarContadorCarritoNav();
