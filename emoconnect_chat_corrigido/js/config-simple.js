/**
 * EmoConnect Configuration Manager - Versão Simplificada Funcional
 */

// Simple config object
const config = {
  version: '1.0.0',
  apiVersion: 'v1',
  environment: 'development',
  
  getApiUrl(endpoint = '') {
    const baseUrl = window.location.hostname === 'localhost' ? 
      'http://localhost:3000/api' : '/api';
    return `${baseUrl}/${this.apiVersion}${endpoint}`;
  },
  
  getFirebaseConfig() {
    return {
      apiKey: 'AIzaSyAhlJmnNLFlTR9rG-xjQHjs9N3BQJGn8To',
      authDomain: 'emoconnect-67e58.firebaseapp.com',
      databaseURL: 'https://emoconnect-67e58-default-rtdb.firebaseio.com',
      projectId: 'emoconnect-67e58',
      storageBucket: 'emoconnect-67e58.appspot.com',
      messagingSenderId: '584511384312',
      appId: '1:584511384312:web:56fba5d6a5e6b0b690e90d'
    };
  }
};

// Simple logger
const logger = {
  debug: (...args) => console.debug('[DEBUG]', ...args),
  info: (...args) => console.info('[INFO]', ...args),
  warn: (...args) => console.warn('[WARN]', ...args),
  error: (...args) => console.error('[ERROR]', ...args)
};

// Simple analytics
const analytics = {
  track: (event, data = {}) => {
    logger.debug('Analytics:', event, data);
    // In development, just log. In production, send to server
  }
};

// Export for compatibility
export { config, logger, analytics };