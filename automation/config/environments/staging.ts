const defaultStagingBaseUrl = 'https://veterenary-production.up.railway.app';

export const stagingEnvironment = {
  name: 'staging',
  webBaseUrl: process.env.STAGING_WEB_BASE_URL ?? defaultStagingBaseUrl,
  apiBaseUrl: process.env.STAGING_API_BASE_URL ?? `${defaultStagingBaseUrl}/api/v1`,
} as const;
