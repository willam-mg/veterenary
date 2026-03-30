const readEnv = (key: string, fallback: string): string => process.env[key] ?? fallback;

export const env = {
  webBaseUrl: readEnv('WEB_BASE_URL', 'http://localhost:4200'),
  apiBaseUrl: readEnv('API_BASE_URL', 'http://localhost:8000/api/v1'),
  demoUserEmail: readEnv('DEMO_USER_EMAIL', 'admin@vetdemo.test'),
  demoUserPassword: readEnv('DEMO_USER_PASSWORD', 'password'),
};
