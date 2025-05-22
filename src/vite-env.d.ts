/// <reference types="vite/client" />

interface ImportMeta {
  readonly env: {
    readonly VITE_GEMINI_API_KEY?: string;
    readonly [key: string]: string | undefined;
  };
}