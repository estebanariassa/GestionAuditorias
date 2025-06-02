// Funcionalidad para el menú de usuario
document.addEventListener('DOMContentLoaded', function() {
    // Obtener el nombre de usuario del localStorage
    const usuarioActual = localStorage.getItem('usuarioActual') || 'Usuario';
    const iniciales = obtenerIniciales(usuarioActual);
    
    // Actualizar las iniciales en el icono de usuario
    const userIconElement = document.querySelector('.user-icon');
    if (userIconElement) {
        userIconElement.textContent = iniciales;
    }
    
    // Manejar clic en el icono de usuario para mostrar/ocultar el menú desplegable
    document.addEventListener('click', function(e) {
        const userIcon = document.querySelector('.user-icon');
        const userDropdown = document.querySelector('.user-dropdown');
        
        if (!userIcon || !userDropdown) return;
        
        if (userIcon.contains(e.target)) {
            // Si se hace clic en el icono de usuario, alternar el menú
            userDropdown.classList.toggle('active');
        } else if (!userDropdown.contains(e.target)) {
            // Si se hace clic fuera del menú, cerrarlo
            userDropdown.classList.remove('active');
        }
    });
    
    // Manejar clic en el botón de cerrar sesión
    const logoutButton = document.querySelector('.user-dropdown-item.logout');
    if (logoutButton) {
        logoutButton.addEventListener('click', function(e) {
            e.preventDefault();
            // Redirigir a la página de inicio de sesión
            window.location.href = 'Index.html';
        });
    }
});

// Función para obtener las iniciales del nombre de usuario
function obtenerIniciales(nombre) {
    if (!nombre || typeof nombre !== 'string') return 'U';
    
    const palabras = nombre.trim().split(' ');
    if (palabras.length === 1) {
        return palabras[0].charAt(0).toUpperCase();
    } else {
        return (palabras[0].charAt(0) + palabras[palabras.length - 1].charAt(0)).toUpperCase();
    }
}
