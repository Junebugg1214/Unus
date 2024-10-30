/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_API_TIMEOUT: string;
  readonly VITE_TOKEN_EXPIRY_DAYS: string;
  readonly MODE: string;  // Available by default in Vite

  // Add any other environment variables here
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
