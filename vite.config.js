import { defineConfig } from 'vite';

export default defineConfig({
    root: './emoconnect',
    base: '/',

    build: {
        outDir: '../dist',
        emptyOutDir: true,
        sourcemap: true,
        target: 'es2015',
        minify: 'terser',
        rollupOptions: {
            input: {
                main: './html/index.html',
                chat: './html/chat.html',
                perfil: './html/perfil.html'
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