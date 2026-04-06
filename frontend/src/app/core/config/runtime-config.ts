declare global {
  interface Window {
    __vetClinicRuntimeConfig?: {
      apiBaseUrl?: string;
    };
  }
}

const fallbackApiBaseUrl = 'http://localhost:8000/api/v1';

export const runtimeConfig = {
  apiBaseUrl: window.__vetClinicRuntimeConfig?.apiBaseUrl ?? fallbackApiBaseUrl,
} as const;

export {};
