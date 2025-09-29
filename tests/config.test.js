import { describe, it, expect, beforeEach, vi } from 'vitest';
import { config, logger, analytics } from '../emoconnect_chat_corrigido/js/config.js';

describe('ConfigManager', () => {
    beforeEach(() => {
        // Reset localStorage
        localStorage.clear();
    });

    it('should detect development environment correctly', () => {
        // Mock window.location
        Object.defineProperty(window, 'location', {
            value: { hostname: 'localhost' },
            writable: true
        });

        expect(config.environment).toBe('development');
    });

    it('should return correct API URL', () => {
        const apiUrl = config.getApiUrl('/test');
        expect(apiUrl).toContain('/api/v1/test');
    });

    it('should have valid Firebase configuration', () => {
        const firebaseConfig = config.getFirebaseConfig();
        expect(firebaseConfig).toHaveProperty('apiKey');
        expect(firebaseConfig).toHaveProperty('projectId');
    });
});

describe('Logger', () => {
    it('should log debug messages in development', () => {
        const consoleSpy = vi.spyOn(console, 'debug').mockImplementation();

        logger.debug('Test message');

        expect(consoleSpy).toHaveBeenCalledWith('[DEBUG]', 'Test message');
        consoleSpy.mockRestore();
    });

    it('should not log debug messages in production', () => {
        // Temporarily change environment
        const originalEnv = config.environment;
        config.environment = 'production';
        config.config = config.loadConfig();

        const consoleSpy = vi.spyOn(console, 'debug').mockImplementation();

        logger.debug('Test message');

        expect(consoleSpy).not.toHaveBeenCalled();

        // Restore
        config.environment = originalEnv;
        config.config = config.loadConfig();
        consoleSpy.mockRestore();
    });
});

describe('Analytics', () => {
    beforeEach(() => {
        // Mock fetch
        global.fetch = vi.fn();
    });

    it('should track events when enabled', () => {
        analytics.enabled = true;

        analytics.track('test_event', { data: 'test' });

        expect(fetch).toHaveBeenCalledWith(
            expect.stringContaining('/analytics/event'),
            expect.objectContaining({
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
            })
        );
    });

    it('should not track events when disabled', () => {
        analytics.enabled = false;

        analytics.track('test_event', { data: 'test' });

        expect(fetch).not.toHaveBeenCalled();
    });

    it('should generate session ID', () => {
        const sessionId = analytics.getSessionId();
        expect(sessionId).toMatch(/^session_\d+_[a-z0-9]{9}$/);

        // Should return same ID on second call
        const sessionId2 = analytics.getSessionId();
        expect(sessionId).toBe(sessionId2);
    });
});