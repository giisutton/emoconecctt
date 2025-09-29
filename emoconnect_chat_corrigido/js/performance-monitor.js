/**
 * Performance Monitor
 * Sistema de monitoramento de performance da aplicação
 */

import { logger, analytics } from './config.js';

class PerformanceMonitor {
    constructor() {
        this.metrics = new Map();
        this.observers = new Map();
        this.init();
    }

    init() {
        this.setupPerformanceObserver();
        this.setupResourceObserver();
        this.setupLongTaskObserver();
        this.trackPageLoad();
    }

    setupPerformanceObserver() {
        if ('PerformanceObserver' in window) {
            try {
                // Navigation timing
                const navigationObserver = new PerformanceObserver((list) => {
                    for (const entry of list.getEntries()) {
                        this.recordNavigation(entry);
                    }
                });
                navigationObserver.observe({ entryTypes: ['navigation'] });

                // Measure timing
                const measureObserver = new PerformanceObserver((list) => {
                    for (const entry of list.getEntries()) {
                        this.recordCustomMeasure(entry);
                    }
                });
                measureObserver.observe({ entryTypes: ['measure'] });

                this.observers.set('navigation', navigationObserver);
                this.observers.set('measure', measureObserver);
            } catch (e) {
                logger.warn('Performance Observer not fully supported:', e);
            }
        }
    }

    setupResourceObserver() {
        if ('PerformanceObserver' in window) {
            try {
                const resourceObserver = new PerformanceObserver((list) => {
                    for (const entry of list.getEntries()) {
                        this.recordResource(entry);
                    }
                });
                resourceObserver.observe({ entryTypes: ['resource'] });
                this.observers.set('resource', resourceObserver);
            } catch (e) {
                logger.warn('Resource Observer not supported:', e);
            }
        }
    }

    setupLongTaskObserver() {
        if ('PerformanceObserver' in window) {
            try {
                const longTaskObserver = new PerformanceObserver((list) => {
                    for (const entry of list.getEntries()) {
                        this.recordLongTask(entry);
                    }
                });
                longTaskObserver.observe({ entryTypes: ['longtask'] });
                this.observers.set('longtask', longTaskObserver);
            } catch (e) {
                logger.warn('Long Task Observer not supported:', e);
            }
        }
    }

    trackPageLoad() {
        window.addEventListener('load', () => {
            setTimeout(() => {
                this.recordCoreWebVitals();
            }, 0);
        });
    }

    recordNavigation(entry) {
        const metrics = {
            dns_lookup: entry.domainLookupEnd - entry.domainLookupStart,
            tcp_connect: entry.connectEnd - entry.connectStart,
            tls_handshake: entry.secureConnectionStart > 0 ? entry.connectEnd - entry.secureConnectionStart : 0,
            request_response: entry.responseEnd - entry.requestStart,
            dom_processing: entry.domComplete - entry.domLoading,
            page_load: entry.loadEventEnd - entry.navigationStart
        };

        this.metrics.set('navigation', metrics);
        logger.debug('Navigation metrics:', metrics);

        analytics.track('performance_navigation', metrics);

        // Alert on slow page loads
        if (metrics.page_load > 5000) {
            logger.warn('Slow page load detected:', metrics.page_load);
        }
    }

    recordCustomMeasure(entry) {
        const metric = {
            name: entry.name,
            duration: entry.duration,
            start: entry.startTime
        };

        logger.debug('Custom measure:', metric);
        analytics.track('performance_measure', metric);
    }

    recordResource(entry) {
        // Only track critical resources
        if (!this.isCriticalResource(entry.name)) return;

        const metric = {
            name: entry.name,
            type: entry.initiatorType,
            duration: entry.duration,
            size: entry.transferSize || 0,
            cached: entry.transferSize === 0 && entry.decodedBodySize > 0
        };

        logger.debug('Resource metric:', metric);

        // Alert on slow resources
        if (metric.duration > 3000) {
            logger.warn('Slow resource loading:', metric);
            analytics.track('performance_slow_resource', metric);
        }
    }

    recordLongTask(entry) {
        const metric = {
            duration: entry.duration,
            start: entry.startTime
        };

        logger.warn('Long task detected:', metric);
        analytics.track('performance_long_task', metric);
    }

    recordCoreWebVitals() {
        // Largest Contentful Paint (LCP)
        if ('PerformanceObserver' in window) {
            try {
                const lcpObserver = new PerformanceObserver((list) => {
                    const entries = list.getEntries();
                    const lastEntry = entries[entries.length - 1];
                    const lcp = lastEntry.startTime;

                    this.metrics.set('lcp', lcp);
                    analytics.track('performance_lcp', { value: lcp });

                    if (lcp > 2500) {
                        logger.warn('Poor LCP detected:', lcp);
                    }
                });
                lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
            } catch (e) {
                logger.warn('LCP Observer not supported:', e);
            }
        }

        // First Input Delay (FID) - simulated
        this.trackFirstInputDelay();

        // Cumulative Layout Shift (CLS)
        if ('PerformanceObserver' in window) {
            try {
                let clsValue = 0;
                const clsObserver = new PerformanceObserver((list) => {
                    for (const entry of list.getEntries()) {
                        if (!entry.hadRecentInput) {
                            clsValue += entry.value;
                        }
                    }

                    this.metrics.set('cls', clsValue);
                    analytics.track('performance_cls', { value: clsValue });

                    if (clsValue > 0.1) {
                        logger.warn('Poor CLS detected:', clsValue);
                    }
                });
                clsObserver.observe({ entryTypes: ['layout-shift'] });
            } catch (e) {
                logger.warn('CLS Observer not supported:', e);
            }
        }
    }

    trackFirstInputDelay() {
        let firstInputProcessed = false;

        const processFirstInput = (event) => {
            if (firstInputProcessed) return;
            firstInputProcessed = true;

            const start = performance.now();

            // Simulate processing delay
            requestAnimationFrame(() => {
                const fid = performance.now() - start;
                this.metrics.set('fid', fid);
                analytics.track('performance_fid', { value: fid });

                if (fid > 100) {
                    logger.warn('Poor FID detected:', fid);
                }
            });
        };

        ['click', 'touchstart', 'keydown'].forEach(type => {
            document.addEventListener(type, processFirstInput, { once: true, passive: true });
        });
    }

    isCriticalResource(url) {
        const criticalPatterns = [
            /\.js$/,
            /\.css$/,
            /firebase/,
            /gemini/,
            /googleapis/
        ];

        return criticalPatterns.some(pattern => pattern.test(url));
    }

    // Manual performance marking
    mark(name) {
        if ('performance' in window && performance.mark) {
            performance.mark(name);
            logger.debug('Performance mark:', name);
        }
    }

    // Manual performance measurement
    measure(name, startMark, endMark) {
        if ('performance' in window && performance.measure) {
            try {
                performance.measure(name, startMark, endMark);
                const measure = performance.getEntriesByName(name, 'measure')[0];
                return measure ? measure.duration : null;
            } catch (e) {
                logger.warn('Failed to measure performance:', e);
                return null;
            }
        }
        return null;
    }

    // Get current metrics summary
    getMetricsSummary() {
        const summary = {
            timestamp: new Date().toISOString(),
            metrics: Object.fromEntries(this.metrics),
            connection: this.getConnectionInfo(),
            memory: this.getMemoryInfo()
        };

        return summary;
    }

    getConnectionInfo() {
        if ('connection' in navigator) {
            return {
                effectiveType: navigator.connection.effectiveType,
                downlink: navigator.connection.downlink,
                rtt: navigator.connection.rtt
            };
        }
        return null;
    }

    getMemoryInfo() {
        if ('memory' in performance) {
            return {
                usedJSHeapSize: performance.memory.usedJSHeapSize,
                totalJSHeapSize: performance.memory.totalJSHeapSize,
                jsHeapSizeLimit: performance.memory.jsHeapSizeLimit
            };
        }
        return null;
    }

    // Report performance issues
    reportPerformanceIssue(type, data) {
        const report = {
            type,
            data,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            url: window.location.href,
            metrics: this.getMetricsSummary()
        };

        logger.warn('Performance issue reported:', report);
        analytics.track('performance_issue', report);
    }

    // Cleanup observers
    disconnect() {
        this.observers.forEach(observer => {
            try {
                observer.disconnect();
            } catch (e) {
                logger.warn('Failed to disconnect observer:', e);
            }
        });
        this.observers.clear();
    }
}

// Create global instance
const performanceMonitor = new PerformanceMonitor();

// Export for use in other modules
window.EmoPerformance = performanceMonitor;

export default performanceMonitor;