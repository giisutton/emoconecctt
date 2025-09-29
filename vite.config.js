import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';
import path from 'path';

export default defineConfig({
    root: 'emoconnect_chat_corrigido',
    base: '/',

    build: {
        outDir: '../dist',
        emptyOutDir: true,
        sourcemap: true,
        target: 'es2015',
        minify: 'terser',
        rollupOptions: {
            input: {
                main: path.resolve(__dirname, 'emoconnect_chat_corrigido/html/index.html'),
                chat: path.resolve(__dirname, 'emoconnect_chat_corrigido/html/chat.html'),
                perfil: path.resolve(__dirname, 'emoconnect_chat_corrigido/html/perfil.html')
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
    },

    plugins: [
        VitePWA({
            registerType: 'autoUpdate',
            workbox: {
                globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
                skipWaiting: true,
                clientsClaim: true
            },
            manifest: {
                name: 'EmoConnect - Apoio Emocional',
                short_name: 'EmoConnect',
                description: 'Plataforma de apoio emocional e saúde mental',
                theme_color: '#6a5acd',
                background_color: '#fdfbfb',
                display: 'standalone',
                start_url: '/',
                scope: '/',
                icons: [
                    {
                        src: 'https://via.placeholder.com/192x192/6a5acd/white?text=EC',
                        sizes: '192x192',
                        type: 'image/png'
                    },
                    {
                        src: 'https://via.placeholder.com/512x512/6a5acd/white?text=EC',
                        sizes: '512x512',
                        type: 'image/png'
                    }
                ]
            }
        })
    ]
});