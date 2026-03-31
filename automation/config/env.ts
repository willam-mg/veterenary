import { productionEnvironment } from './environments/production';
import { qaEnvironment } from './environments/qa';
import { stagingEnvironment } from './environments/staging';

const readEnv = (key: string, fallback: string): string => process.env[key] ?? fallback;

const environmentCatalog = {
  qa: qaEnvironment,
  staging: stagingEnvironment,
  production: productionEnvironment,
} as const;

export type TestEnvironmentName = keyof typeof environmentCatalog;

const resolveEnvironmentName = (): TestEnvironmentName => {
  const candidate = (process.env.TEST_ENV ?? process.env.TARGET_ENVIRONMENT ?? 'qa').toLowerCase();

  if (candidate === 'staging' || candidate === 'production') {
    return candidate;
  }

  return 'qa';
};

const selectedEnvironmentName = resolveEnvironmentName();
const selectedEnvironment = environmentCatalog[selectedEnvironmentName];

export const env = {
  targetEnvironment: selectedEnvironmentName,
  webBaseUrl: readEnv('WEB_BASE_URL', selectedEnvironment.webBaseUrl),
  apiBaseUrl: readEnv('API_BASE_URL', selectedEnvironment.apiBaseUrl),
  demoUserEmail: readEnv('DEMO_USER_EMAIL', 'admin@vetdemo.test'),
  demoUserPassword: readEnv('DEMO_USER_PASSWORD', 'password'),
};
