import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  base: './',

  build: {
    outDir: 'dist',
    assetsInlineLimit: 0, // 禁用小图片内联
    rollupOptions: {
      input: {
        main: resolve(import.meta.dirname, 'index.html'),
        gallery: resolve(import.meta.dirname, 'gallery.html'),
        costumes: resolve(import.meta.dirname, 'costumes.html'),
        music: resolve(import.meta.dirname, 'music.html'),
        about: resolve(import.meta.dirname, 'about.html'),
        changelog: resolve(import.meta.dirname, 'changelog.html'),
        relationship: resolve(import.meta.dirname, 'relationship-interactive.html'),
        architecture: resolve(import.meta.dirname, 'architecture-interactive.html')
      },
      output: {
        entryFileNames: 'js/[name].[hash:8].js',
        chunkFileNames: 'js/[name].[hash:8].js',
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split('.');
          const ext = info[info.length - 1];

          if (/png|jpe?g|gif|webp|svg/i.test(ext)) {
            return 'assets/images/[name].[hash:8][extname]';
          }
          if (/css/i.test(ext)) {
            return 'css/[name].[hash:8][extname]';
          }
          return 'assets/[name].[hash:8][extname]';
        }
      }
    }
  },

  // 开发服务器配置
  server: {
    port: 8000,
    open: true
  },

  // 预览服务器配置
  preview: {
    port: 8000
  }
});
