import axios from 'axios';

const SERVICE_UNAVAILABLE_PATH = '/service-unavailable';

// Known backend base URLs or API prefixes to identify backend-destined requests
const BACKEND_BASE = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';


export function isBackendUrl(url) {
  if (!url) return false;
  if (typeof url !== 'string') {
    if (url.href) url = url.href;
    else return false;
  }

  // Check matching backend base URL
  if (url.includes(BACKEND_BASE)) return true;
  if (url.includes('localhost:8000') || url.includes('127.0.0.1:8000')) return true;

  // Relative paths commonly hitting FastAPI backend
  const backendPrefixes = [
    '/api/',
    '/auth/',
    '/artists/',
    '/feed/',
    '/savework/',
    '/collections/',
    '/commissions/',
    '/cart/'
  ];

  return backendPrefixes.some((prefix) => url.startsWith(prefix));
}

/**
 * Redirects user to the Service Unavailable page if not already there
 */
export function triggerServiceUnavailable() {
  if (typeof window !== 'undefined') {
    if (window.location.pathname !== SERVICE_UNAVAILABLE_PATH && window.location.pathname !== '/maintenance') {
      console.warn('[SoliasArt] Backend service unavailable or connection failed. Redirecting to maintenance page.');
      window.location.href = SERVICE_UNAVAILABLE_PATH;
    }
  }
}

export function isBackendUnavailableError(error) {
  if (!error) return false;

  // HTTP 503 Service Unavailable
  if (error.response?.status === 503) {
    return true;
  }

  // Network connection failure (CORS/Network error when server is down, ECONNREFUSED)
  if (
    error.code === 'ERR_NETWORK' ||
    error.code === 'ECONNREFUSED' ||
    error.message === 'Network Error' ||
    (!error.response && Boolean(error.request))
  ) {
    return true;
  }

  return false;
}


export function attachAxiosInterceptor(axiosInstance) {
  if (!axiosInstance || !axiosInstance.interceptors) return;

  axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (isBackendUnavailableError(error)) {
        triggerServiceUnavailable();
      }
      return Promise.reject(error);
    }
  );
}


let fetchInterceptorInstalled = false;

export function setupGlobalFetchInterceptor() {
  if (typeof window === 'undefined' || fetchInterceptorInstalled) return;

  const originalFetch = window.fetch;
  window.fetch = async function (...args) {
    const [resource] = args;
    const url = typeof resource === 'string' ? resource : (resource?.url || '');

    const isBackend = isBackendUrl(url);

    try {
      const response = await originalFetch.apply(this, args);
      if (isBackend && response.status === 503) {
        triggerServiceUnavailable();
      }
      return response;
    } catch (err) {
      // TypeError indicates network failure / connection refused in fetch API
      if (isBackend) {
        triggerServiceUnavailable();
      }
      throw err;
    }
  };

  fetchInterceptorInstalled = true;
}

/**
 * One-stop initialization for all network interception
 */
export function setupNetworkInterceptors() {
  // Global axios default interceptor
  attachAxiosInterceptor(axios);

  // Global fetch interceptor
  setupGlobalFetchInterceptor();
}
