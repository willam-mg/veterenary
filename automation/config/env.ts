import { productionEnvironment } from './environments/production';
import { qaEnvironment } from './environments/qa';
import { stagingEnvironment } from './environments/staging';

const readEnv = (key: string, fallback: string): string => process.env[key] ?? fallback;
const isCiExecution = process.env.CI === 'true' || process.env.GITHUB_ACTIONS === 'true';
const isLocalUrl = (value: string): boolean =>
  /^(https?:\/\/)?(localhost|127\.0\.0\.1)(:\d+)?(\/|$)/i.test(value);

const environmentCatalog = {
  qa: qaEnvironment,
  staging: stagingEnvironment,
  production: productionEnvironment,
} as const;

export type TestEnvironmentName = keyof typeof environmentCatalog;

const resolveEnvironmentName = (): TestEnvironmentName => {
  const fallbackEnvironment = isCiExecution ? 'staging' : 'qa';
  const candidate = (process.env.TEST_ENV ?? process.env.TARGET_ENVIRONMENT ?? fallbackEnvironment).toLowerCase();

  if (candidate === 'staging' || candidate === 'production') {
    return candidate;
  }

  return 'qa';
};

const selectedEnvironmentName = resolveEnvironmentName();
const selectedEnvironment = environmentCatalog[selectedEnvironmentName];

const resolvedWebBaseUrl = readEnv('WEB_BASE_URL', selectedEnvironment.webBaseUrl);
const resolvedApiBaseUrl = readEnv('API_BASE_URL', selectedEnvironment.apiBaseUrl);

if (isCiExecution && isLocalUrl(resolvedApiBaseUrl)) {
  throw new Error(
    `Invalid CI environment configuration. Resolved API_BASE_URL="${resolvedApiBaseUrl}" points to localhost. ` +
      'Set TEST_ENV=staging|production or provide an explicit non-local API_BASE_URL value.'
  );
}

export const env = {
  targetEnvironment: selectedEnvironmentName,
  webBaseUrl: resolvedWebBaseUrl,
  apiBaseUrl: resolvedApiBaseUrl,
  demoUserEmail: readEnv('DEMO_USER_EMAIL', 'admin@vetdemo.test'),
  demoUserPassword: readEnv('DEMO_USER_PASSWORD', 'password'),
};

const shouldLogResolvedEnvironment =
  process.env.LOG_TEST_ENVIRONMENT !== 'false' &&
  (isCiExecution || process.env.LOG_TEST_ENVIRONMENT === 'true');

if (shouldLogResolvedEnvironment) {
  console.log(
    `[automation:env] target=${env.targetEnvironment} web=${env.webBaseUrl} api=${env.apiBaseUrl}`
  );
}
