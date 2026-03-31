import { stagingEnvironment } from './staging';

export const productionEnvironment = {
  name: 'production',
  webBaseUrl: process.env.PRODUCTION_WEB_BASE_URL ?? stagingEnvironment.webBaseUrl,
  apiBaseUrl: process.env.PRODUCTION_API_BASE_URL ?? stagingEnvironment.apiBaseUrl,
} as const;
