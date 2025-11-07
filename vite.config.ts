import { defineConfig } from 'vite'
import { resolve } from 'path'
import dts from 'vite-plugin-dts'
import { visualizer } from 'rollup-plugin-visualizer'
import viteCompression from 'vite-plugin-compression'

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'index.ts'),
      name: 'ProColumns',
      formats: ['es', 'cjs'],
      fileName: (format) => `pro-columns.${format === 'es' ? 'mjs' : 'cjs'}`
    },
    rollupOptions: {
      // 确保外部化处理那些你不想打包进库的依赖
      external: ['react', 'react-dom', '@ant-design/pro-components', 'antd'],
      output: {
        // 在 UMD 构建模式下为这些外部化的依赖提供一个全局变量
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          '@ant-design/pro-components': 'ProComponents',
          antd: 'antd'
        },
        // 代码分割优化
        manualChunks: undefined,
      }
    },
    sourcemap: true,
    // 清空输出目录
    emptyOutDir: true,
    // 代码压缩优化
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: false,
        drop_debugger: true,
        pure_funcs: ['console.log'],
      },
      format: {
        comments: false,
      },
    },
  },
  plugins: [
    dts({
      include: [
        'index.ts',
        'type.d.ts',
        'lib/**/*',
        'components/**/*',
        'strategy/**/*',
        'presets/**/*'
      ],
      exclude: ['**/*.test.ts', '**/*.spec.ts', 'node_modules'],
      rollupTypes: true
    }),
    // 打包分析
    visualizer({
      open: false,
      gzipSize: true,
      brotliSize: true,
      filename: 'dist/stats.html',
    }),
    // Gzip 压缩
    viteCompression({
      algorithm: 'gzip',
      ext: '.gz',
    }),
    // Brotli 压缩
    viteCompression({
      algorithm: 'brotliCompress',
      ext: '.br',
    }),
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, './')
    }
  }
})
