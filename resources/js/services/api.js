import { CONSTANTS } from '../constants';

class ApiError extends Error {
  constructor(message, status, data = null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

class ApiService {
  constructor() {
    this.baseUrl = '/api';
    this.timeout = CONSTANTS.API_TIMEOUT;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
    
    const defaultHeaders = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };

    if (csrfToken) {
      defaultHeaders['X-CSRF-TOKEN'] = csrfToken;
    }

    const config = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    };

    if (config.body && typeof config.body === 'object') {
      config.body = JSON.stringify(config.body);
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);
      
      const response = await fetch(url, {
        ...config,
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      
      let data;
      const contentType = response.headers.get('Content-Type');
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        data = await response.text();
      }

      if (!response.ok) {
        throw new ApiError(
          data.message || `HTTP Error ${response.status}`,
          response.status,
          data
        );
      }

      return data;
    } catch (error) {
      if (error.name === 'AbortError') {
        throw new ApiError('Request timeout', CONSTANTS.HTTP_STATUS.SERVER_ERROR);
      }
      
      if (error instanceof ApiError) {
        throw error;
      }
      
      throw new ApiError('Network error', CONSTANTS.HTTP_STATUS.SERVER_ERROR, error);
    }
  }

  // Note API methods
  async getNotes(params = {}) {
    const searchParams = new URLSearchParams(params);
    const endpoint = `/notes${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
    return this.request(endpoint);
  }

  async createNote(noteData) {
    return this.request('/notes', {
      method: 'POST',
      body: noteData,
    });
  }

  async getNote(id) {
    return this.request(`/notes/${id}`);
  }

  async updateNote(id, noteData) {
    return this.request(`/notes/${id}`, {
      method: 'PUT',
      body: noteData,
    });
  }

  async deleteNote(id) {
    return this.request(`/notes/${id}`, {
      method: 'DELETE',
    });
  }

  async toggleNoteFavorite(id) {
    return this.request(`/notes/${id}/toggle-favorite`, {
      method: 'POST',
    });
  }

  async toggleNoteArchive(id) {
    return this.request(`/notes/${id}/toggle-archive`, {
      method: 'POST',
    });
  }

  async getNotesStats() {
    return this.request('/notes-stats');
  }

  // Utility methods
  isNetworkError(error) {
    return error instanceof ApiError && error.status >= 500;
  }

  isValidationError(error) {
    return error instanceof ApiError && error.status === CONSTANTS.HTTP_STATUS.UNPROCESSABLE_ENTITY;
  }

  isAuthenticationError(error) {
    return error instanceof ApiError && 
           (error.status === CONSTANTS.HTTP_STATUS.UNAUTHORIZED || 
            error.status === CONSTANTS.HTTP_STATUS.FORBIDDEN);
  }

  isRateLimitError(error) {
    return error instanceof ApiError && error.status === CONSTANTS.HTTP_STATUS.TOO_MANY_REQUESTS;
  }
}

// Create singleton instance
const apiService = new ApiService();

export { ApiService, ApiError };
export default apiService;