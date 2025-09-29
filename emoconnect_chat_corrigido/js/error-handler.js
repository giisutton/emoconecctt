/**
 * EmoConnect Error Handler
 * Sistema centralizado de tratamento de erros
 */

import { logger } from './config.js';

class ErrorHandler {
    constructor() {
        this.setupGlobalErrorHandling();
    }

    setupGlobalErrorHandling() {
        // Handle unhandled promise rejections
        window.addEventListener('unhandledrejection', (event) => {
            logger.error('Unhandled promise rejection:', event.reason);
            this.handleError(event.reason, 'promise_rejection');
            event.preventDefault();
        });

        // Handle uncaught errors
        window.addEventListener('error', (event) => {
            logger.error('Uncaught error:', event.error);
            this.handleError(event.error, 'uncaught_error');
        });
    }

    handleError(error, type = 'general', context = {}) {
        const errorInfo = {
            message: error.message || error,
            stack: error.stack,
            type,
            context,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            url: window.location.href
        };

        logger.error('Error handled:', errorInfo);

        // Show user-friendly message
        this.showUserMessage(this.getUserMessage(type), 'error');

        // Send to error tracking service
        this.reportError(errorInfo);
    }

    getUserMessage(errorType) {
        const messages = {
            network: 'Problemas de conexão. Verifique sua internet.',
            validation: 'Dados inválidos. Verifique os campos.',
            permission: 'Permissão negada para esta ação.',
            firebase: 'Erro no servidor. Tente novamente em alguns minutos.',
            gemini_api: 'IA temporariamente indisponível. Tente novamente.',
            general: 'Algo deu errado. Nossa equipe foi notificada.',
            promise_rejection: 'Erro interno. Página pode precisar ser recarregada.',
            uncaught_error: 'Erro inesperado. Recarregue a página se necessário.'
        };

        return messages[errorType] || messages.general;
    }

    async reportError(errorInfo) {
        try {
            await fetch('/api/v1/errors', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(errorInfo)
            });
        } catch (reportError) {
            logger.error('Failed to report error:', reportError);
        }
    }

    showUserMessage(message, type = 'info') {
        // Remove existing notifications
        const existing = document.querySelectorAll('.emo-notification');
        existing.forEach(el => el.remove());

        // Create notification element
        const notification = document.createElement('div');
        notification.className = `emo-notification emo-notification--${type}`;
        notification.innerHTML = `
      <div class="emo-notification__content">
        <span class="emo-notification__message">${message}</span>
        <button class="emo-notification__close" aria-label="Fechar">×</button>
      </div>
    `;

        // Add styles if not already present
        if (!document.getElementById('emo-notification-styles')) {
            const styles = document.createElement('style');
            styles.id = 'emo-notification-styles';
            styles.textContent = `
        .emo-notification {
          position: fixed;
          top: 20px;
          right: 20px;
          max-width: 400px;
          padding: 16px;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          z-index: 9999;
          animation: slideIn 0.3s ease-out;
        }
        
        .emo-notification--info {
          background: #e3f2fd;
          border-left: 4px solid #2196f3;
          color: #0d47a1;
        }
        
        .emo-notification--success {
          background: #e8f5e8;
          border-left: 4px solid #4caf50;
          color: #1b5e20;
        }
        
        .emo-notification--warning {
          background: #fff3e0;
          border-left: 4px solid #ff9800;
          color: #e65100;
        }
        
        .emo-notification--error {
          background: #ffebee;
          border-left: 4px solid #f44336;
          color: #b71c1c;
        }
        
        .emo-notification__content {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        
        .emo-notification__close {
          background: none;
          border: none;
          font-size: 20px;
          cursor: pointer;
          padding: 0;
          margin-left: 12px;
          opacity: 0.7;
        }
        
        .emo-notification__close:hover {
          opacity: 1;
        }
        
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `;
            document.head.appendChild(styles);
        }

        // Add to DOM
        document.body.appendChild(notification);

        // Handle close button
        const closeBtn = notification.querySelector('.emo-notification__close');
        closeBtn.addEventListener('click', () => {
            notification.style.animation = 'slideIn 0.3s ease-out reverse';
            setTimeout(() => notification.remove(), 300);
        });

        // Auto remove after 5 seconds (except errors)
        if (type !== 'error') {
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.style.animation = 'slideIn 0.3s ease-out reverse';
                    setTimeout(() => notification.remove(), 300);
                }
            }, 5000);
        }
    }

    // Utility methods for common operations
    async withErrorHandling(asyncFn, errorType = 'general', context = {}) {
        try {
            return await asyncFn();
        } catch (error) {
            this.handleError(error, errorType, context);
            throw error; // Re-throw for caller to handle if needed
        }
    }

    validateRequired(fields, data) {
        const missing = fields.filter(field => !data[field] || data[field].trim() === '');
        if (missing.length > 0) {
            throw new Error(`Campos obrigatórios: ${missing.join(', ')}`);
        }
    }

    validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            throw new Error('Email inválido');
        }
    }
}

// Create global instance
const errorHandler = new ErrorHandler();

// Export for use in other modules
window.EmoError = errorHandler;

export default errorHandler;