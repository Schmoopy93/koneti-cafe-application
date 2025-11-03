const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

interface ApiOptions extends RequestInit {
  useToken?: boolean;
  requireCSRF?: boolean;
}

// CSRF token cache
let csrfToken: string | null = null;

// Dobij CSRF token
const getCSRFToken = async (): Promise<string | null> => {
  if (csrfToken) return csrfToken;
  
  try {
    const response = await fetch(`${API_URL}/admin/csrf-token`, {
      credentials: 'include'
    });
    
    if (response.ok) {
      const data = await response.json();
      csrfToken = data.csrfToken;
      return csrfToken;
    }
  } catch (error) {
    console.warn('Nije moguće dobiti CSRF token:', error);
  }
  
  return null;
};

// Očisti CSRF token
export const clearCSRFToken = () => {
  csrfToken = null;
};

export const apiRequest = async (endpoint: string, options: ApiOptions = {}) => {
  const { useToken = true, requireCSRF = false, ...fetchOptions } = options;
  
  // Osnovne opcije
  const requestOptions: RequestInit = {
    credentials: "include",
    ...fetchOptions,
  };

  // Dodaj Content-Type samo ako nije FormData
  if (!(fetchOptions.body instanceof FormData)) {
    requestOptions.headers = {
      "Content-Type": "application/json",
      ...fetchOptions.headers,
    };
  } else {
    requestOptions.headers = {
      ...fetchOptions.headers,
    };
  }

  // Dodaj token ako je potreban i dostupan
  if (useToken && typeof window !== 'undefined') {
    const token = localStorage.getItem('adminToken');
    if (token) {
      requestOptions.headers = {
        ...requestOptions.headers,
        'Authorization': `Bearer ${token}`,
      };
    }
  }

  // Dodaj CSRF token za POST/PUT/DELETE zahteve (samo u produkciji)
  if (requireCSRF && process.env.NODE_ENV === 'production' && ['POST', 'PUT', 'DELETE', 'PATCH'].includes(fetchOptions.method || 'GET')) {
    const csrf = await getCSRFToken();
    if (csrf) {
      requestOptions.headers = {
        ...requestOptions.headers,
        'X-CSRF-Token': csrf,
      };
    }
  }

  try {
    const response = await fetch(`${API_URL}${endpoint}`, requestOptions);
    
    // Ukloni nevaži token ako je 401
    if (response.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('adminToken');
      clearCSRFToken();
    }
    
    // Ako je CSRF token nevaljan, pokušaj ponovo
    if (response.status === 403 && requireCSRF) {
      csrfToken = null; // Resetuj CSRF token
      const newCSRF = await getCSRFToken();
      if (newCSRF) {
        requestOptions.headers = {
          ...requestOptions.headers,
          'X-CSRF-Token': newCSRF,
        };
        return fetch(`${API_URL}${endpoint}`, requestOptions);
      }
    }
    
    return response;
  } catch (error) {
    console.error('API zahtev neuspešan:', error);
    throw error;
  }
};

export { API_URL };