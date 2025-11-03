import { defineConfig } from 'vite'
import { resolve } from 'path'
import dts from 'vite-plugin-dts'

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
        }
      }
    },
    sourcemap: true,
    // 清空输出目录
    emptyOutDir: true
  },
  plugins: [
    dts({
      include: [
        'index.ts',
        'type.d.ts',
        'lib/**/*',
        'components/**/*',
        'strategy/**/*'
      ],
      exclude: ['**/*.test.ts', '**/*.spec.ts', 'node_modules'],
      rollupTypes: true
    })
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, './')
    }
  }
})
