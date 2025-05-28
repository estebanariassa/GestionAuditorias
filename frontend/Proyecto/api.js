// API Configuration
// Cambia el puerto aquí si el backend está en otro puerto
const API_BASE_URL = 'http://localhost:3000';

// Utility function to get user from localStorage
function getCurrentUser() {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
}

// Utility function to check if user is logged in
function isLoggedIn() {
  return getCurrentUser() !== null;
}

// API Functions

// Authentication API
const authAPI = {
  async login(username, password) {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password })
    });
    return await response.json();
  },

  async logout() {
    localStorage.removeItem('user');
    const response = await fetch(`${API_BASE_URL}/api/auth/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    return await response.json();
  }
};

// Audits API
const auditsAPI = {
  async getAll(params = {}) {
    const queryParams = new URLSearchParams(params);
    const response = await fetch(`${API_BASE_URL}/api/audits?${queryParams}`);
    return await response.json();
  },

  async getById(id) {
    const response = await fetch(`${API_BASE_URL}/api/audits/${id}`);
    return await response.json();
  },

  async create(auditData) {
    const response = await fetch(`${API_BASE_URL}/api/audits`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(auditData)
    });
    return await response.json();
  },

  async update(id, auditData) {
    const response = await fetch(`${API_BASE_URL}/api/audits/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(auditData)
    });
    return await response.json();
  },

  async delete(id) {
    const response = await fetch(`${API_BASE_URL}/api/audits/${id}`, {
      method: 'DELETE'
    });
    return await response.json();
  },

  async getStats() {
    const response = await fetch(`${API_BASE_URL}/api/audits/stats/summary`);
    return await response.json();
  }
};

// Users API
const usersAPI = {
  async getAll(params = {}) {
    const queryParams = new URLSearchParams(params);
    const response = await fetch(`${API_BASE_URL}/api/users?${queryParams}`);
    return await response.json();
  },

  async getAuditors() {
    const response = await fetch(`${API_BASE_URL}/api/users/auditors/available`);
    return await response.json();
  }
};

// Dashboard API
const dashboardAPI = {
  async getOverview() {
    const response = await fetch(`${API_BASE_URL}/api/dashboard/overview`);
    return await response.json();
  },

  async getIndicators(params = {}) {
    const queryParams = new URLSearchParams(params);
    const response = await fetch(`${API_BASE_URL}/api/dashboard/indicators?${queryParams}`);
    return await response.json();
  },

  async createIndicator(indicatorData) {
    const response = await fetch(`${API_BASE_URL}/api/dashboard/indicators`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(indicatorData)
    });
    return await response.json();
  },

  async getPerformance(period = 'monthly') {
    const response = await fetch(`${API_BASE_URL}/api/dashboard/performance?period=${period}`);
    return await response.json();
  }
};

// Utility functions for common operations

// Format date for display
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
}

// Format date for input fields
function formatDateForInput(dateString) {
  const date = new Date(dateString);
  return date.toISOString().split('T')[0];
}

// Show loading state
function showLoading(element) {
  if (element) {
    element.innerHTML = '<div class="loading">Cargando...</div>';
  }
}

// Hide loading state
function hideLoading() {
  const loadingElements = document.querySelectorAll('.loading');
  loadingElements.forEach(el => el.remove());
}

// Show error message
function showError(message, container = null) {
  const errorDiv = document.createElement('div');
  errorDiv.className = 'error-message';
  errorDiv.innerHTML = `
    <div style="background: #f8d7da; color: #721c24; padding: 10px; border-radius: 5px; margin: 10px 0;">
      ⚠️ ${message}
    </div>
  `;
  
  if (container) {
    container.appendChild(errorDiv);
  } else {
    document.body.appendChild(errorDiv);
  }
  
  // Auto remove after 5 seconds
  setTimeout(() => {
    errorDiv.remove();
  }, 5000);
}

// Show success message
function showSuccess(message, container = null) {
  const successDiv = document.createElement('div');
  successDiv.className = 'success-message';
  successDiv.innerHTML = `
    <div style="background: #d1ecf1; color: #155724; padding: 10px; border-radius: 5px; margin: 10px 0;">
      ✅ ${message}
    </div>
  `;
  
  if (container) {
    container.appendChild(successDiv);
  } else {
    document.body.appendChild(successDiv);
  }
  
  // Auto remove after 3 seconds
  setTimeout(() => {
    successDiv.remove();
  }, 3000);
}

// Redirect to login if not authenticated
function requireAuth() {
  if (!isLoggedIn()) {
    alert('Debe iniciar sesión para acceder a esta página.');
    window.location.href = 'Index.html';
    return false;
  }
  return true;
}

// Logout function
function logout() {
  authAPI.logout().then(() => {
    localStorage.removeItem('user');
    window.location.href = 'Index.html';
  }).catch(error => {
    console.error('Error during logout:', error);
    // Force logout even if API call fails
    localStorage.removeItem('user');
    window.location.href = 'Index.html';
  });
}
