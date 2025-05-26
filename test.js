import fetch from 'node-fetch';

async function testCRUD() {
  const baseUrl = 'http://localhost:4000/api/auditorias';
  
  try {
    // CREATE - Crear una nueva auditoría
    console.log('Creando nueva auditoría...');
    const createResponse = await fetch(baseUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        proceso: 'Gestión de Calidad',
        numero: 2024001,
        ciclo: 1,
        proposito: 'Verificar cumplimiento',
        alcance: 'Todos los procesos',
        fecha_creacion: '2024-03-20',
        fecha_apertura: '2024-03-25',
        hora_inicio: '09:00',
        lugar_reunion: 'Sala 1',
        fecha_cierre: '2024-03-26',
        hora_cierre: '17:00',
        lugar_cierre: 'Sala 1'
      })
    });
    const createResult = await createResponse.json();
    console.log('Resultado CREATE:', createResult);

    // READ - Obtener todas las auditorías
    console.log('\nObteniendo todas las auditorías...');
    const readResponse = await fetch(baseUrl);
    const readResult = await readResponse.json();
    console.log('Resultado READ:', readResult);
  } catch (error) {
    console.error('Error:', error.message);
  }
}

testCRUD(); 