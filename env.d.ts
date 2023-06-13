/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly MAIN_VITE_GITHUB_CLIENT_ID: string
  readonly MAIN_VITE_GITHUB_CLIENT_SECRET: string
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
