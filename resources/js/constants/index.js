export const CONSTANTS = {
  // UI Constants
  TEXT_TRUNCATE_LENGTH: 150,
  TOAST_DISPLAY_TIME: 4000,
  AUTO_SAVE_DELAY: 2000,
  SEARCH_DEBOUNCE_DELAY: 300,
  
  // API Constants
  API_TIMEOUT: 10000,
  MAX_TITLE_LENGTH: 255,
  MAX_CONTENT_LENGTH: 10000,
  
  // Layout Constants
  MOBILE_BREAKPOINT: 768,
  SIDEBAR_WIDTH: 288, // 72 * 4 = 288px (w-72)
  COLLAPSED_SIDEBAR_WIDTH: 80, // 20 * 4 = 80px (w-20)
  
  // Note States
  NOTE_FILTERS: {
    ALL: 'all',
    FAVORITES: 'favorites',
    ARCHIVED: 'archived',
    IMPORTANT: 'important'
  },
  
  // Sort Options
  SORT_OPTIONS: {
    DATE: 'date',
    TITLE: 'title',
    UPDATED: 'updated'
  },
  
  // HTTP Status Codes
  HTTP_STATUS: {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    UNPROCESSABLE_ENTITY: 422,
    TOO_MANY_REQUESTS: 429,
    SERVER_ERROR: 500
  },
  
  // Keyboard Shortcuts
  SHORTCUTS: {
    NEW_NOTE: 'ctrl+n',
    SEARCH: 'ctrl+f',
    TOGGLE_SIDEBAR: 'ctrl+b',
    SAVE: 'ctrl+s',
    DELETE: 'Delete'
  },
  
  // Toast Types
  TOAST_TYPES: {
    SUCCESS: 'success',
    ERROR: 'error',
    WARNING: 'warning',
    INFO: 'info'
  }
};

export default CONSTANTS;