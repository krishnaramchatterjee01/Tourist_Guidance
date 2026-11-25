import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';

const legacyHtmlFiles = [
  'explore.html',
  'states.html',
  'top-places.html',
  'west-bengal.html',
  'district.html',
  'coming-soon.html'
];

function spaRoutingPlugin() {
  return {
    name: 'spa-routing-plugin',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const parsedUrl = req.url.split('?')[0];
        const query = req.url.includes('?') ? req.url.substring(req.url.indexOf('?')) : '';

        // If requesting a legacy html file directly in dev server, route to /index.html
        if (legacyHtmlFiles.map(f => `/${f}`).includes(parsedUrl)) {
          req.url = '/index.html' + query;
        }
        next();
      });
    },
    closeBundle() {
      // Create static html fallbacks in dist for direct static hosting compatibility
      const distDir = path.resolve(__dirname, 'dist');
      const distIndex = path.join(distDir, 'index.html');

      if (fs.existsSync(distIndex)) {
        const indexHtmlContent = fs.readFileSync(distIndex, 'utf8');

        // Copy index.html to each legacy route name and 404.html
        for (const file of [...legacyHtmlFiles, '404.html']) {
          fs.writeFileSync(path.join(distDir, file), indexHtmlContent);
        }
      }
    }
  };
}

export default defineConfig({
  plugins: [react(), spaRoutingPlugin()],
  server: {
    port: 3000,
    open: true,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true
      }
    }
  },
  preview: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true
      }
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'gsap-vendor': ['gsap']
        }
      }
    },
    chunkSizeWarningLimit: 1200
  }
});
