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