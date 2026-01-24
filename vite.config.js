import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
    // Load env file based on `mode` in the current working directory.
    const env = loadEnv(mode, process.cwd(), '');

    return {
        plugins: [react()],

        // Path resolution
        resolve: {
            alias: {
                '@': path.resolve(__dirname, './src'),
                '@components': path.resolve(__dirname, './src/components'),
                '@pages': path.resolve(__dirname, './src/pages'),
                '@hooks': path.resolve(__dirname, './src/hooks'),
                '@contexts': path.resolve(__dirname, './src/contexts'),
                '@services': path.resolve(__dirname, './src/services'),
                '@utils': path.resolve(__dirname, './src/utils'),
                '@styles': path.resolve(__dirname, './src/styles'),
                '@assets': path.resolve(__dirname, './src/assets'),
            },
        },

        // Server configuration
        server: {
            port: 5173,
            host: true,
            open: true,
            proxy: {
                '/api': {
                    target: env.VITE_BACKEND_URL || 'http://localhost:8080',
                    changeOrigin: true,
                    secure: false,
                },
            },
        },

        // Build configuration
        build: {
            outDir: 'dist',
            sourcemap: mode === 'development',
            minify: mode === 'production' ? 'terser' : false,
            target: 'esnext',
            rollupOptions: {
                output: {
                    manualChunks: {
                        'react-vendor': ['react', 'react-dom', 'react-router-dom'],
                        'chart-vendor': ['recharts'],
                        'icon-vendor': ['react-icons'],
                    },
                },
            },
            chunkSizeWarningLimit: 1000,
        },

        // Preview configuration
        preview: {
            port: 4173,
            host: true,
        },

        // Optimize dependencies
        optimizeDeps: {
            include: ['react', 'react-dom', 'react-router-dom'],
        },

        // Define global constants
        define: {
            __APP_VERSION__: JSON.stringify(env.VITE_APP_VERSION),
            __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
        },
    };
});
