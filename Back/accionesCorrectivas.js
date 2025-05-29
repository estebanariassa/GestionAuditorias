let contador = 1;

function mostrarFormulario() {
  document.getElementById('formulario').classList.remove('hidden');
}

function ocultarFormulario() {
  document.getElementById('formulario').classList.add('hidden');
}

function agregarAccion() {
  const descripcion = document.getElementById('descripcion').value.trim();
  const responsable = document.getElementById('responsable').value.trim();
  const fechaLimite = document.getElementById('fechaLimite').value;

  if (!descripcion || !responsable || !fechaLimite) {
    alert('Por favor, completa todos los campos.');
    return;
  }

  const tabla = document.getElementById('cuerpoTabla');

  // Eliminar fila de "No hay acciones..."
  const filaVacia = document.getElementById('filaVacia');
  if (filaVacia) {
    filaVacia.remove();
  }

  // Crear nueva fila
  const nuevaFila = document.createElement('tr');
  nuevaFila.innerHTML = `
    <td>${contador++}</td>
    <td>${descripcion}</td>
    <td>${responsable}</td>
    <td>${fechaLimite}</td>
  `;

  tabla.appendChild(nuevaFila);

  // Limpiar el formulario
  document.getElementById('descripcion').value = '';
  document.getElementById('responsable').value = '';
  document.getElementById('fechaLimite').value = '';
  ocultarFormulario();
}

