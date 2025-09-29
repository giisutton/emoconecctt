import { vi } from 'vitest';

// Mock localStorage
const localStorageMock = {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
};
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Mock fetch globally
global.fetch = vi.fn();

// Mock console methods to avoid noise in tests
global.console = {
    ...console,
    log: vi.fn(),
    debug: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
};

// Setup DOM
import { JSDOM } from 'jsdom';
const dom = new JSDOM();
global.document = dom.window.document;
global.window = dom.window;
global.navigator = dom.window.navigator;