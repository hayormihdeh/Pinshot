import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@src': '/src',
      '@pages': '/src/pages',
      '@components': '/src/components',
      '@config': '/src/config',
      '@hooks': '/src/hooks',
      '@utils': '/src/utils',
      '@services': '/src/services',
      '@layouts': '/src/layouts',
      '@assets': '/src/assets',
      '@routes': '/src/routes',
    },
  },
});
