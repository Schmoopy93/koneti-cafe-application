const getApiUrl = () => {
  try {
    const url = process.env.NEXT_PUBLIC_API_URL;
    if (!url || url === 'undefined') {
      console.warn('NEXT_PUBLIC_API_URL not set, using localhost');
      return "http://localhost:5000/api";
    }
    return url;
  } catch (error) {
    console.error('Error getting API URL:', error);
    return "http://localhost:5000/api";
  }
};



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
    const apiUrl = getApiUrl();
    if (!apiUrl) return null;
    const response = await fetch(`${apiUrl}/admin/csrf-token`, {
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
  const maxRetries = 3;
  let retryCount = 0;
  
  const makeRequest = async (): Promise<Response> => {
    try {
      const { useToken = true, requireCSRF = false, ...fetchOptions } = options;
      
      const apiUrl = getApiUrl();
      if (!apiUrl || apiUrl === 'undefined' || apiUrl === 'null') {
        console.error('API URL is not properly configured:', apiUrl);
        throw new Error('API URL is not configured');
      }
      

    
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
      // Prvo pokušaj da učitaš iz cookies, zatim iz localStorage
      const { getCookie } = await import('./cookies');
      let token = getCookie('adminToken');
      if (!token) {
        token = localStorage.getItem('adminToken');
      }
      
      if (token) {
        requestOptions.headers = {
          ...requestOptions.headers,
          'Authorization': `Bearer ${token}`,
        };
      }
    }

    // Dodaj CSRF token za POST/PUT/DELETE zahteve (samo u produkciji)
    if (requireCSRF && ['POST', 'PUT', 'DELETE', 'PATCH'].includes(fetchOptions.method || 'GET')) {
      const csrf = await getCSRFToken();
      if (csrf) {
        requestOptions.headers = {
          ...requestOptions.headers,
          'X-CSRF-Token': csrf,
        };
      }
    }

      const fullUrl = `${apiUrl}${endpoint}`;      
      // Add timeout to prevent hanging requests
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
      
      const response = await fetch(fullUrl, {
        ...requestOptions,
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
    
    // Ukloni nevaži token ako je 401
    if (response.status === 401 && typeof window !== 'undefined') {
      const { deleteCookie } = await import('./cookies');
      deleteCookie('adminToken');
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
        return fetch(`${apiUrl}${endpoint}`, requestOptions);
      }
    }
    
      return response;
    } catch (error) {
      // Handle different types of errors
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          console.warn(`Request timeout for ${endpoint}`);
        } else if (error.message.includes('fetch') || error.message.includes('Failed to fetch')) {
          console.warn(`Network error for ${endpoint}:`, error.message);
        } else {
          console.error(`API request failed for ${endpoint}:`, error.message);
        }
      }
      
      // Retry logic for network errors (but not for health checks)
      if (retryCount < maxRetries && 
          !endpoint.includes('/health') &&
          (error instanceof TypeError || 
           (error instanceof Error && (error.name === 'AbortError' || error.message.includes('fetch'))))) {
        retryCount++;
        await new Promise(resolve => setTimeout(resolve, 1000 * retryCount));
        return makeRequest();
      }
      
      throw error;
    }
  };
  
  return makeRequest();
};

export const API_URL = getApiUrl();