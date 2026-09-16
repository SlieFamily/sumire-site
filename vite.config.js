import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  base: './',

  build: {
    outDir: 'dist',
    assetsInlineLimit: 0, // 禁用小图片内联
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        gallery: resolve(__dirname, 'gallery.html'),
        costumes: resolve(__dirname, 'costumes.html')
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
