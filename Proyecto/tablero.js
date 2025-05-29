// Variables globales
let graficoCumplimiento = null;
let graficoRiesgos = null;

// Mostrar formulario del tablero
function mostrarFormularioTablero() {
    document.getElementById('modal-tablero').classList.remove('oculto');
}

// Cerrar modal
function cerrarModal() {
    document.getElementById('modal-tablero').classList.add('oculto');
}

// Cerrar tablero
function cerrarTablero() {
    document.getElementById('dashboard-container').classList.add('oculto');
}

// Generar tablero con los datos
function generarTablero() {
    const puntuacion = document.getElementById('puntuacion-cumplimiento').value;
    const observaciones = document.getElementById('observaciones').value;
    
    // Validaciones
    if (!puntuacion || puntuacion < 0 || puntuacion > 100) {
        alert('Por favor ingrese una puntuación válida (0-100)');
        return;
    }
    
    if (observaciones.length < 10) {
        alert('Las observaciones deben tener al menos 10 caracteres');
        return;
    }
    
    // Cerrar modal y mostrar dashboard
    cerrarModal();
    document.getElementById('dashboard-container').classList.remove('oculto');
    
    // Generar gráficos
    crearGraficos(puntuacion, observaciones);
    
    // Scroll hacia el tablero
    document.getElementById('dashboard-container').scrollIntoView({ 
        behavior: 'smooth' 
    });
}

// Crear gráficos con Chart.js
function crearGraficos(puntuacion, observaciones) {
    // Destruir gráficos existentes
    if (graficoCumplimiento) graficoCumplimiento.destroy();
    if (graficoRiesgos) graficoRiesgos.destroy();
    
    // Gráfico de cumplimiento
    const ctx1 = document.getElementById('grafico-cumplimiento');
    graficoCumplimiento = new Chart(ctx1, {
        type: 'doughnut',
        data: {
            labels: ['Cumplimiento', 'No Cumplimiento'],
            datasets: [{
                data: [puntuacion, 100 - puntuacion],
                backgroundColor: ['#28a745', '#dc3545'],
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
    
    // Gráfico de distribución de riesgos
    const ctx2 = document.getElementById('grafico-riesgos');
    graficoRiesgos = new Chart(ctx2, {
        type: 'bar',
        data: {
            labels: ['Alto', 'Medio', 'Bajo'],
            datasets: [{
                label: 'Nivel de Riesgo',
                data: [15, 35, 50],
                backgroundColor: ['#dc3545', '#ffc107', '#28a745']
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
    
    // Actualizar KPIs
    actualizarKPIs(puntuacion);
}

// Actualizar indicadores clave
function actualizarKPIs(puntuacion) {
    const kpisContainer = document.getElementById('kpis-container');
    
    kpisContainer.innerHTML = `
        <div class="kpi-item">
            <span class="kpi-value">${puntuacion}%</span>
            <span class="kpi-label">Cumplimiento</span>
        </div>
        <div class="kpi-item">
            <span class="kpi-value">${Math.round(puntuacion / 20)}</span>
            <span class="kpi-label">Nivel de Madurez</span>
        </div>
    `;
}
