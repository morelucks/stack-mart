/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_REOWN_PROJECT_ID?: string;
  readonly VITE_WALLETKIT_PROJECT_ID?: string;
  readonly VITE_HIRO_API_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
