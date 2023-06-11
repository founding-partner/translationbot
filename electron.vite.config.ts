import { resolve } from 'path'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import react from '@vitejs/plugin-react'
import vpme from 'vite-plugin-monaco-editor'

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
      react(),
      monacoEditorPlugin({
        languageWorkers: ['editorWorkerService', 'css', 'html', 'json', 'typescript']
      })
    ]
  }
})
