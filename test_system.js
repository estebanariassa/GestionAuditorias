// Test script para verificar la funcionalidad completa
console.log('🚀 Iniciando pruebas del sistema...');

// Test 1: Verificar disponibilidad del API
async function testAPIConnection() {
    try {
        const response = await fetch('http://localhost:5000/api/audits');
        const data = await response.json();
        console.log('✅ API Connection Test:', data.success ? 'SUCCESS' : 'FAILED');
        return data.success;
    } catch (error) {
        console.log('❌ API Connection Test: FAILED -', error.message);
        return false;
    }
}

// Test 2: Verificar login
async function testLogin() {
    try {
        const response = await fetch('http://localhost:5000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: 'admin', password: '1234' })
        });
        const data = await response.json();
        console.log('✅ Login Test:', data.success ? 'SUCCESS' : 'FAILED');
        return data;
    } catch (error) {
        console.log('❌ Login Test: FAILED -', error.message);
        return null;
    }
}

// Test 3: Verificar carga de auditorías
async function testLoadAudits() {
    try {
        const response = await fetch('http://localhost:5000/api/audits');
        const data = await response.json();
        console.log('✅ Load Audits Test:', data.success ? `SUCCESS (${data.data.length} auditorías)` : 'FAILED');
        return data;
    } catch (error) {
        console.log('❌ Load Audits Test: FAILED -', error.message);
        return null;
    }
}

// Ejecutar todas las pruebas
async function runAllTests() {
    console.log('\n=== EJECUTANDO PRUEBAS ===\n');
    
    const apiTest = await testAPIConnection();
    const loginTest = await testLogin();
    const auditsTest = await testLoadAudits();
    
    console.log('\n=== RESUMEN ===');
    console.log('API Connection:', apiTest ? '✅' : '❌');
    console.log('Login:', loginTest?.success ? '✅' : '❌');
    console.log('Load Audits:', auditsTest?.success ? '✅' : '❌');
    
    if (apiTest && loginTest?.success && auditsTest?.success) {
        console.log('\n🎉 ¡Todas las pruebas pasaron! El sistema está funcionando correctamente.');
    } else {
        console.log('\n⚠️ Algunas pruebas fallaron. Revisar configuración.');
    }
}

runAllTests();
