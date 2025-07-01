const input = document.getElementById("dni");

input.addEventListener("input", function (e) {
  // Eliminar todo lo que no sea un número
  let value = this.value.replace(/\D/g, "").substring(0, 8);

  // Si el valor es mayor a 8 caracteres, truncarlo
  if (value.length >= 6) {
    // Formatear con un punto cada millón
    value = value.replace(/^(\d{2})(\d{3})(\d{3})$/, "$1.$2.$3");
  } else if (value.length >= 3) {
    // Formatear con un punto cada mil
    value = value.replace(/^(\d{1,3})(\d{3})$/, "$1.$2");
  }

  this.value = value;
});

function consultarAPI() {
  let dni = document.getElementById("dni").value.trim();

  dni = dni.replace(/\./g, "");

  if (!/^\d{8}$/.test(dni)) {
    badgeAlerta.classList.remove("hidden");
    badgeAlerta.classList.add("dflex");
    alerta.innerText = "Ingresá un DNI válido de 8 dígitos.";
    return;
  }
  const masked = dni.slice(0, 2) + "XXXX" + dni.slice(6);
  dniPaciente.innerText = masked;
  fetch("proxypac.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    bodyPaciCantidad: JSON.stringify({
      aplicacion: "SalaEspera",
      operacion: "obtenerPacientesEspera",
      apiKey: "0dedb690-9ed4-407f-b95b-b945373de84d",
      filtro: { persNroDocumento: dni },
    }),
  })
    .then((r) => r.json())
    .then((bodyPaciCantidad) => {
      alerta.innerText = "No encontrado";
      if (
        Array.isArray(bodyPaciCantidad) &&
        bodyPaciCantidad[0]?.paciCantidad != null
      ) {
        solicitarDNI.classList.add("hidden");
        containerResultado.classList.remove("hidden");
        dniPaciente.innerText = `Hola ${masked}, estás en la sala de espera virtual.`;
        let valorEspera = document.getElementById("valorEspera");
        valorEspera.innerText = `${bodyPaciCantidad[0].paciCantidad} pacientes delante tuyo`;
      }
    })
    .catch((e) => alert("Error de red: " + e));
}

function borrarInput() {
  badgeAlerta.classList.remove("dflex");
  badgeAlerta.classList.add("hidden");
  alerta.innerText = "";
  dni.value = "";
}

function verEspera() {
  solicitarDNI.classList.add("hidden");
  containerResultado.classList.remove("hidden");
  dniPaciente.innerText = "Hola, estás en la sala de espera virtual.";
  let valorEspera = document.getElementById("valorEspera");
  valorEspera.value = "Cargando...";
}

function nuevaConsulta() {
  solicitarDNI.classList.remove("hidden");
  containerResultado.classList.add("hidden");
  dni.value = "";
  dniPaciente.innerText = "";
  valorEspera.value = "XX";
  badgeAlerta.classList.remove("dflex");
  badgeAlerta.classList.add("hidden");
  alerta.innerText = "";
}