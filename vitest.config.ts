import { defineConfig } from 'vitest/config'
import { resolve } from 'path'

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: [],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      exclude: [
        'node_modules/',
        'dist/',
        'examples/',
        '.storybook/',
        'stories/',
        'scripts/',
        'storybook-static/',
        '**/*.config.ts',
        '**/*.config.js',
        '**/*.d.ts',
        '**/*.test.ts',
        '**/*.test.tsx',
        '**/*.spec.ts',
        '.eslintrc.cjs',
        'USAGE_EXAMPLE.tsx'
      ],
      include: [
        'src/**/*.ts',
        'src/**/*.tsx',
        'lib/**/*.ts',
        'adapter/**/*.ts',
        'strategy/**/*.ts',
        'components/**/*.tsx',
        'presets/**/*.ts'
      ],
      all: true,
      lines: 80,
      functions: 80,
      branches: 80,
      statements: 80
    }
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './')
    }
  }
})
