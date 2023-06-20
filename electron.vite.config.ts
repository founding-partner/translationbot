import { resolve } from 'path'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import react from '@vitejs/plugin-react'
import vpme from 'vite-plugin-monaco-editor'
import { nodePolyfills } from 'vite-plugin-node-polyfills'

const { default: monacoEditorPlugin } = vpme

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()]
  },
  preload: {
    plugins: [externalizeDepsPlugin()]
  },
  renderer: {
    resolve: {
      alias: {
        '@renderer': resolve('src/renderer/src')
      }
    },
    plugins: [
      nodePolyfills({
        // Specific modules that should not be polyfilled.
        exclude: ['fs'],
        // Whether to polyfill specific globals.
        globals: {
          Buffer: true, // can also be 'build', 'dev', or false
          global: true,
          process: true
        },
        // Whether to polyfill `node:` protocol imports.
        protocolImports: true
      }),
      react(),
      monacoEditorPlugin({
        languageWorkers: ['editorWorkerService', 'css', 'html', 'json', 'typescript']
      })
    ]
  }
})
