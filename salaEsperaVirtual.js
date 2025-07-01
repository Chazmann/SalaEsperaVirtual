 const input = document.getElementById('dni');

  input.addEventListener('input', function (e) {
    // Eliminar todo lo que no sea un número
    let value = this.value.replace(/\D/g, '').substring(0, 8); 

    // Si el valor es mayor a 8 caracteres, truncarlo
    if (value.length >= 6) {
        // Formatear con un punto cada millón
      value = value.replace(/^(\d{2})(\d{3})(\d{3})$/, '$1.$2.$3');
    } else if (value.length >= 3) {
        // Formatear con un punto cada mil
      value = value.replace(/^(\d{1,3})(\d{3})$/, '$1.$2');
    }

    this.value = value;
  });



  function consultarAPI() {

      let dni = document.getElementById("dni").value.trim();

       dni = dni.replace(/\./g, "");
       
       alert(dni);
      if (!/^\d{8}$/.test(dni)) {
       badgeAlerta.classList.remove("hidden");
       badgeAlerta.classList.add("dflex");
       alerta.innerText = ("Ingresá un DNI válido de 8 dígitos.");
        return;
      }
      const masked = dni.slice(0,2) + "XXXX" + dni.slice(6);

      fetch("proxypac.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          aplicacion: "SalaEspera",
          operacion: "obtenerPacientesEspera",
          apiKey: "0dedb690-9ed4-407f-b95b-b945373de84d",
          filtro: { persNroDocumento: dni }
        })
      })
      .then(r => r.json())
      .then(body => {
         alerta.innerText = "No encontrado";
        if (Array.isArray(body) && body[0]?.paciCantidad != null) {
          text = `${body[0].paciCantidad} pacientes delante tuyo`;
        }
      })
      .catch(e => alert("Error de red: " + e));
    }

    function borrarInput() {
      badgeAlerta.classList.remove("dflex");
      badgeAlerta.classList.add("hidden");
      alerta.innerText = "";   
      dni.value = "";
    }