/**
 * EmoConnect Configuration Manager
 * Gerencia configurações de ambiente e compatibilidade de versão
 */

class ConfigManager {
    constructor() {
        this.version = '1.0.0';
        this.apiVersion = 'v1';
        this.environment = this.detectEnvironment();
        this.config = this.loadConfig();
    }

    detectEnvironment() {
        if (typeof window !== 'undefined') {
            if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
                return 'development';
            }
            if (window.location.hostname.includes('staging')) {
                return 'staging';
            }
        }
        return 'production';
    }

    loadConfig() {
        const baseConfig = {
            development: {
                apiBaseUrl: 'http://localhost:3000/api',
                firebase: {
                    apiKey: 'AIzaSyAhlJmnNLFlTR9rG-xjQHjs9N3BQJGn8To',
                    authDomain: 'emoconnect-67e58.firebaseapp.com',
                    databaseURL: 'https://emoconnect-67e58-default-rtdb.firebaseio.com',
                    projectId: 'emoconnect-67e58',
                    storageBucket: 'emoconnect-67e58.appspot.com',
                    messagingSenderId: '584511384312',
                    appId: '1:584511384312:web:56fba5d6a5e6b0b690e90d'
                },
                logging: {
                    level: 'debug',
                    enableConsole: true
                },
                features: {
                    analytics: false,
                    errorTracking: false
                }
            },
            staging: {
                apiBaseUrl: 'https://staging.emoconnect.app/api',
                firebase: {
                    // Staging Firebase config
                },
                logging: {
                    level: 'info',
                    enableConsole: true
                },
                features: {
                    analytics: true,
                    errorTracking: true
                }
            },
            production: {
                apiBaseUrl: 'https://api.emoconnect.app/api',
                firebase: {
                    // Production Firebase config
                },
                logging: {
                    level: 'error',
                    enableConsole: false
                },
                features: {
                    analytics: true,
                    errorTracking: true
                }
            }
        };

        return baseConfig[this.environment];
    }

    getApiUrl(endpoint = '') {
        return `${this.config.apiBaseUrl}/${this.apiVersion}${endpoint}`;
    }

    getFirebaseConfig() {
        return this.config.firebase;
    }

    isFeatureEnabled(feature) {
        return this.config.features[feature] || false;
    }

    shouldLog(level) {
        const levels = ['debug', 'info', 'warn', 'error'];
        const currentLevel = levels.indexOf(this.config.logging.level);
        const requestedLevel = levels.indexOf(level);
        return requestedLevel >= currentLevel;
    }

    // Version compatibility check
    async checkCompatibility() {
        try {
            const response = await fetch(this.getApiUrl('/health'));
            const serverInfo = await response.json();

            if (this.isVersionCompatible(serverInfo.version)) {
                return { compatible: true, version: serverInfo.version };
            }

            return {
                compatible: false,
                version: serverInfo.version,
                message: 'Versão do cliente incompatível com o servidor'
            };
        } catch (error) {
            console.warn('Não foi possível verificar compatibilidade:', error);
            return { compatible: true, warning: 'Verificação de compatibilidade falhou' };
        }
    }

    isVersionCompatible(serverVersion) {
        const [clientMajor, clientMinor] = this.version.split('.').map(Number);
        const [serverMajor, serverMinor] = serverVersion.split('.').map(Number);

        // Major version must match, minor can be different
        return clientMajor === serverMajor && Math.abs(clientMinor - serverMinor) <= 1;
    }
}

// Logger singleton
class Logger {
    constructor(config) {
        this.config = config;
    }

    debug(...args) {
        if (this.config.shouldLog('debug') && this.config.config.logging.enableConsole) {
            console.debug('[DEBUG]', ...args);
        }
    }

    info(...args) {
        if (this.config.shouldLog('info') && this.config.config.logging.enableConsole) {
            console.info('[INFO]', ...args);
        }
    }

    warn(...args) {
        if (this.config.shouldLog('warn') && this.config.config.logging.enableConsole) {
            console.warn('[WARN]', ...args);
        }
    }

    error(...args) {
        if (this.config.shouldLog('error') && this.config.config.logging.enableConsole) {
            console.error('[ERROR]', ...args);
        }

        // Send to error tracking service if enabled
        if (this.config.isFeatureEnabled('errorTracking')) {
            this.sendErrorToService(args);
        }
    }

    sendErrorToService(errorData) {
        // Implementation for error tracking service
        fetch(this.config.getApiUrl('/analytics/error'), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                error: errorData,
                timestamp: new Date().toISOString(),
                userAgent: navigator.userAgent,
                url: window.location.href
            })
        }).catch(err => console.warn('Failed to send error to tracking service:', err));
    }
}

// Analytics helper
class Analytics {
    constructor(config, logger) {
        this.config = config;
        this.logger = logger;
        this.enabled = config.isFeatureEnabled('analytics');
    }

    track(event, data = {}) {
        if (!this.enabled) return;

        const eventData = {
            event,
            data,
            timestamp: new Date().toISOString(),
            session: this.getSessionId(),
            user: this.getUserId()
        };

        this.logger.debug('Analytics event:', eventData);

        fetch(this.config.getApiUrl('/analytics/event'), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(eventData)
        }).catch(err => this.logger.warn('Failed to send analytics event:', err));
    }

    getSessionId() {
        let sessionId = localStorage.getItem('emo_session_id');
        if (!sessionId) {
            sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            localStorage.setItem('emo_session_id', sessionId);
        }
        return sessionId;
    }

    getUserId() {
        return localStorage.getItem('emo_user_id') || 'anonymous';
    }
}

// Initialize global instances
const config = new ConfigManager();
const logger = new Logger(config);
const analytics = new Analytics(config, logger);

// Compatibility check on load
config.checkCompatibility().then(result => {
    if (!result.compatible) {
        logger.warn('Version compatibility issue:', result.message);
        // Show user notification about updating
    }
});

// Export for use in other modules
window.EmoConfig = {
    config,
    logger,
    analytics,
    version: config.version
};

export { config, logger, analytics };