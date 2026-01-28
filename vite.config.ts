import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { copyFileSync, existsSync, readFileSync, writeFileSync } from 'fs';

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'post-build-copy',
      writeBundle() {
        const dist = resolve(__dirname, 'dist');
        
        // Copy popup HTML to root
        const popupSrc = resolve(dist, 'src/popup/index.html');
        const popupDest = resolve(dist, 'popup.html');
        if (existsSync(popupSrc)) {
          copyFileSync(popupSrc, popupDest);
          console.log('✓ Copied popup.html');
          
          // Fix script paths in popup.html
          let popupContent = readFileSync(popupDest, 'utf-8');
          popupContent = popupContent.replace(/src\/popup\/assets/g, 'assets');
          popupContent = popupContent.replace(/\/src\/popup\/assets/g, '/assets');
          writeFileSync(popupDest, popupContent);
        }
        
        // Copy panel HTML to root
        const panelSrc = resolve(dist, 'src/panel/index.html');
        const panelDest = resolve(dist, 'panel.html');
        if (existsSync(panelSrc)) {
          copyFileSync(panelSrc, panelDest);
          console.log('✓ Copied panel.html');
          
          // Fix script paths in panel.html
          let panelContent = readFileSync(panelDest, 'utf-8');
          panelContent = panelContent.replace(/src\/panel\/assets/g, 'assets');
          panelContent = panelContent.replace(/\/src\/panel\/assets/g, '/assets');
          writeFileSync(panelDest, panelContent);
        }

        console.log('✓ Build complete!');
      }
    }
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    minify: false, // Disable minification to avoid inline scripts
    rollupOptions: {
      input: {
        popup: resolve(__dirname, 'src/popup/index.html'),
        panel: resolve(__dirname, 'src/panel/index.html'),
        'service-worker': resolve(__dirname, 'src/service-worker.ts'),
        'content-script': resolve(__dirname, 'src/content-script.ts'),
      },
      output: {
        entryFileNames: (chunkInfo) => {
          if (chunkInfo.name === 'service-worker' || chunkInfo.name === 'content-script') {
            return '[name].js';
          }
          return 'assets/[name]-[hash].js';
        },
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash][extname]',
        inlineDynamicImports: false, // Force separate files
        manualChunks: undefined,
      },
    },
  },
  publicDir: 'public',
});