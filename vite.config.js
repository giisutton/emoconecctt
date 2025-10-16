import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
    root: './emoconnect/html',
    base: '/',
    publicDir: '../',

    build: {
        outDir: '../../dist',
        emptyOutDir: true,
        sourcemap: true,
        target: 'es2015',
        minify: 'terser',
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'emoconnect/html/index.html'),
                chat: resolve(__dirname, 'emoconnect/html/chat.html'),
                perfil: resolve(__dirname, 'emoconnect/html/perfil.html')
            }
        }
    },

    server: {
        port: 5173,
        host: true,
        proxy: {
            '/api': {
                target: 'http://localhost:3000',
                changeOrigin: true
            }
        }
    }
});